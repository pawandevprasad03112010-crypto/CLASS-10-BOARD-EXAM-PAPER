import json
import os
from flask import Flask, jsonify, request, send_from_directory
import cloudinary
import cloudinary.uploader

app = Flask(__name__, static_folder=".")

# Cloudinary Configuration (Direct Hardcoded Details)
cloudinary.config(
    cloud_name="uq8eywxb",
    api_key="118664333995381",
    api_secret="JUVeYTckPyu6LknKqYQ6PEuNoM0",
)

DB_FILE = "papers_db.json"
ADMIN_PASSWORD = "12300pawandevprasad03112010@gtss"


def load_db():
  if not os.path.exists(DB_FILE):
    return {}
  with open(DB_FILE, "r") as f:
    try:
      return json.load(f)
    except:
      return {}


def save_db(data):
  with open(DB_FILE, "w") as f:
    json.dump(data, f, indent=4)


@app.route("/")
def index():
  return send_from_directory(".", "index.html")


@app.route("/<path:path>")
def static_files(path):
  return send_from_directory(".", path)


@app.route("/api/papers", methods=["GET"])
def get_papers():
  return jsonify(load_db())


@app.route("/api/upload", methods=["POST"])
def upload_paper():
  password = request.form.get("password")
  if password != ADMIN_PASSWORD:
    return jsonify({"success": False, "message": "Incorrect Password!"}), 401

  year = request.form.get("year")
  subject = request.form.get("subject")
  files = request.files.getlist("files")

  if not year or not subject or not files:
    return (
        jsonify({
            "success": False,
            "message": "Year, Subject and Files are required!",
        }),
        400,
    )

  db = load_db()
  if year not in db:
    db[year] = {}
  if subject not in db[year]:
    db[year][subject] = []

  uploaded_urls = []
  for file in files:
    try:
      upload_result = cloudinary.uploader.upload(file)
      url = upload_result.get("secure_url")
      uploaded_urls.append(url)
    except Exception as e:
      return (
          jsonify({
              "success": False,
              "message": f"Upload failed: {str(e)}",
          }),
          500,
      )

  db[year][subject].extend(uploaded_urls)
  save_db(db)

  return jsonify({
      "success": True,
      "message": "Question papers uploaded successfully!",
      "urls": uploaded_urls,
  })


@app.route("/api/delete", methods=["POST"])
def delete_paper():
  data = request.json
  password = data.get("password")
  if password != ADMIN_PASSWORD:
    return jsonify({"success": False, "message": "Incorrect Password!"}), 401

  year = data.get("year")
  subject = data.get("subject")
  img_url = data.get("url")

  db = load_db()
  if year in db and subject in db[year]:
    if img_url in db[year][subject]:
      db[year][subject].remove(img_url)
      save_db(db)
      return jsonify({"success": True, "message": "Paper deleted successfully!"})

  return jsonify({"success": False, "message": "Paper not found!"}), 404


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    
