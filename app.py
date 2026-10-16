import json
import os
from flask import Flask, jsonify, request, send_from_directory
import cloudinary
import cloudinary.uploader

app = Flask(__name__, static_folder=".")

# आपके क्लाउडिनरी क्रेडेंशियल्स सीधे यहाँ सेट कर दिए गए हैं
cloudinary.config(
    cloud_name="uq89wywxh",
    api_key="118664333995381",
    api_secret="JUVeYTckPyu6LknKqYQ6PEuNoM0",
)

DB_FILE = "papers_db.json"
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")  # आपका एडमिन पासवर्ड


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


# सभी पेपर और सब्जेक्ट्स की लिस्ट मंगाने के लिए
@app.route("/api/papers", methods=["GET"])
def get_papers():
  return jsonify(load_db())


# नया क्वेश्चन पेपर अपलोड करने के लिए
@app.route("/api/upload", methods=["POST"])
def upload_paper():
  password = request.form.get("password")
  if password != ADMIN_PASSWORD:
    return jsonify({"success": False, "message": "गलत पासवर्ड!"}), 401

  year = request.form.get("year")
  subject = request.form.get("subject")
  files = request.files.getlist("files")

  if not year or not subject or not files:
    return (
        jsonify({
            "success": False,
            "message": "ईयर, सब्जेक्ट और फाइलें जरूरी हैं!",
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
      # Cloudinary पर अपलोड करें
      upload_result = cloudinary.uploader.upload(file)
      url = upload_result.get("secure_url")
      uploaded_urls.append(url)
    except Exception as e:
      return (
          jsonify({
              "success": False,
              "message": f"अपलोड फेल हुआ: {str(e)}",
          }),
          500,
      )

  # पुराने URLs में नए वाले जोड़ दें (मल्टी-पेज सपोर्ट)
  db[year][subject].extend(uploaded_urls)
  save_db(db)

  return jsonify({
      "success": True,
      "message": "पेपर सफलतापूर्वक अपलोड हो गया!",
      "urls": uploaded_urls,
  })


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
