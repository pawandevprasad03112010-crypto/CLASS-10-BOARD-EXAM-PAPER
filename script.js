let appState = {
    currentScreen: 'home', // home, subjects, viewer, uploadLogin, uploadMenu, uploadForm, managePapers
    selectedYear: null,
    selectedSubject: null,
    papersData: {},
    activeImageViewer: null 
};

const subjectsList = [
    "English",
    "Hindi",
    "Mathematics",
    "Information Technology",
    "Science",
    "Social Science"
];

async function fetchPapers() {
    try {
        let res = await fetch('/api/papers');
        appState.papersData = await res.json();
        render();
    } catch (e) {
        console.error("Failed to fetch papers", e);
    }
}

function render() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'app-header';
    header.innerHTML = `
        <h1>📚 Board Exam Papers (Class 10)</h1>
        <button class="upload-btn-icon" onclick="openUploadLogin()">⚙️ Admin</button>
    `;
    app.appendChild(header);

    const body = document.createElement('div');
    body.className = 'content-body';

    if (appState.currentScreen === 'home') {
        renderHomeScreen(body);
    } else if (appState.currentScreen === 'subjects') {
        renderSubjectsScreen(body);
    } else if (appState.currentScreen === 'viewer') {
        renderViewerScreen(body);
    } else if (appState.currentScreen === 'uploadLogin') {
        renderUploadLoginModal(app);
    } else if (appState.currentScreen === 'uploadMenu') {
        renderUploadMenuScreen(body);
    } else if (appState.currentScreen === 'uploadForm') {
        renderUploadFormScreen(body);
    } else if (appState.currentScreen === 'managePapers') {
        renderManagePapersScreen(body);
    }

    app.appendChild(body);

    if (appState.activeImageViewer) {
        renderImageViewerModal(app);
    }
}

function renderHomeScreen(container) {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
        <label for="yearSelect">Select Exam Year:</label>
        <select id="yearSelect">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
        </select>
        <button class="btn" id="okYearBtn" style="margin-top: 15px;">OK / Proceed</button>
    `;
    container.appendChild(card);

    card.querySelector('#okYearBtn').onclick = () => {
        appState.selectedYear = card.querySelector('#yearSelect').value;
        appState.currentScreen = 'subjects';
        render();
    };
}

function renderSubjectsScreen(container) {
    const title = document.createElement('h3');
    title.style.marginBottom = "15px";
    title.innerText = `Year: ${appState.selectedYear} (Select Subject)`;
    container.appendChild(title);

    subjectsList.forEach(subject => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `<span>📖 ${subject}</span> ➔`;
        item.onclick = () => {
            appState.selectedSubject = subject;
            appState.currentScreen = 'viewer';
            render();
        };
        container.appendChild(item);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.innerText = '⬅ Go Back (Change Year)';
    backBtn.onclick = () => {
        appState.currentScreen = 'home';
        render();
    };
    container.appendChild(backBtn);
}

function renderViewerScreen(container) {
    const title = document.createElement('h3');
    title.style.marginBottom = "15px";
    title.innerText = `${appState.selectedSubject} (${appState.selectedYear})`;
    container.appendChild(title);

    let yearData = appState.papersData[appState.selectedYear];
    let pages = yearData && yearData[appState.selectedSubject] ? yearData[appState.selectedSubject] : [];

    if (pages.length === 0) {
        const noData = document.createElement('div');
        noData.className = 'no-data';
        noData.innerText = 'No question papers uploaded for this year and subject yet.';
        container.appendChild(noData);
    } else {
        pages.forEach((url, index) => {
            const pageBox = document.createElement('div');
            pageBox.className = 'paper-box';

            const img = document.createElement('img');
            img.src = url;
            img.className = 'paper-page-thumb';
            img.alt = `Page ${index + 1}`;
            
            img.onclick = () => {
                appState.activeImageViewer = url;
                render();
            };

            const downloadBtn = document.createElement('a');
            downloadBtn.href = url;
            downloadBtn.target = '_blank';
            downloadBtn.download = `Paper_${appState.selectedYear}_${appState.selectedSubject}_Page_${index+1}.jpg`;
            downloadBtn.className = 'side-download-btn';
            downloadBtn.innerHTML = '📥 Download';

            pageBox.appendChild(img);
            pageBox.appendChild(downloadBtn);
            container.appendChild(pageBox);
        });
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.style.marginTop = "20px";
    backBtn.innerText = '⬅ Back to Subjects List';
    backBtn.onclick = () => {
        appState.currentScreen = 'subjects';
        render();
    };
    container.appendChild(backBtn);
}

function renderImageViewerModal(appContainer) {
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-modal';
    
    overlay.innerHTML = `
        <div class="fullscreen-content">
            <button class="close-modal-btn" onclick="closeImageViewer()">✖ Close</button>
            <img src="${appState.activeImageViewer}" class="fullscreen-img" alt="Zoomed Paper">
            <a href="${appState.activeImageViewer}" target="_blank" download class="btn" style="margin-top: 15px; text-align: center; text-decoration: none; display: block;">📥 Download Image to Gallery</a>
        </div>
    `;
    appContainer.appendChild(overlay);
}

function closeImageViewer() {
    appState.activeImageViewer = null;
    render();
}

function openUploadLogin() {
    appState.currentScreen = 'uploadLogin';
    render();
}

function renderUploadLoginModal(appContainer) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    overlay.innerHTML = `
        <div class="modal-content">
            <h3>🔐 Enter Admin Password</h3>
            <p style="font-size: 0.75rem; color: #64748b; margin: 8px 0 15px 0;">Authentication required</p>
            <input type="password" id="adminPass" placeholder="Enter password...">
            <button class="btn" id="loginSubmit">Login</button>
            <button class="btn btn-secondary" id="loginCancel">Cancel</button>
        </div>
    `;
    appContainer.appendChild(overlay);

    overlay.querySelector('#loginSubmit').onclick = () => {
        let pass = overlay.querySelector('#adminPass').value;
        if (pass === "12300pawandevprasad03112010@gtss") {
            appState.currentScreen = 'uploadMenu';
            render();
        } else {
            alert('Incorrect Password!');
        }
    };

    overlay.querySelector('#loginCancel').onclick = () => {
        appState.currentScreen = 'home';
        render();
    };
}

// एडमिन मेनू: अपलोड करें या मैनेज/डिलीट करें
function renderUploadMenuScreen(container) {
    const title = document.createElement('h3');
    title.style.marginBottom = "20px";
    title.innerText = "⚙️ Admin Dashboard";
    container.appendChild(title);

    const uploadMenuBtn = document.createElement('button');
    uploadMenuBtn.className = 'btn';
    uploadMenuBtn.style.marginBottom = "15px";
    uploadMenuBtn.innerText = "📤 Upload New Papers";
    uploadMenuBtn.onclick = () => {
        appState.currentScreen = 'uploadForm';
        render();
    };
    container.appendChild(uploadMenuBtn);

    const manageBtn = document.createElement('button');
    manageBtn.className = 'btn btn-secondary';
    manageBtn.innerText = "🗑️ Manage / Delete Uploaded Papers";
    manageBtn.onclick = () => {
        appState.currentScreen = 'managePapers';
        render();
    };
    container.appendChild(manageBtn);

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.style.marginTop = "20px";
    backBtn.innerText = '⬅ Back to Home';
    backBtn.onclick = () => {
        appState.currentScreen = 'home';
        render();
    };
    container.appendChild(backBtn);
}

function renderUploadFormScreen(container) {
    const title = document.createElement('h3');
    title.style.marginBottom = "15px";
    title.innerText = "📤 Question Paper Upload Panel";
    container.appendChild(title);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <label>Select Exam Year:</label>
        <select id="upYear">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
        </select>

        <label style="margin-top: 15px;">Select Subject:</label>
        <select id="upSubject">
            ${subjectsList.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>

        <label style="margin-top: 15px;">Select Paper Pages (Multiple images allowed):</label>
        <input type="file" id="upFiles" multiple accept="image/*">

        <button class="btn" id="submitUpload" style="margin-top: 15px;">Upload to Cloudinary</button>
        <button class="btn btn-secondary" id="cancelUpload">Back to Admin Menu</button>
    `;
    container.appendChild(card);

    card.querySelector('#submitUpload').onclick = async () => {
        let year = card.querySelector('#upYear').value;
        let subject = card.querySelector('#upSubject').value;
        let filesInput = card.querySelector('#upFiles');

        if (filesInput.files.length === 0) {
            alert('Please select at least one file!');
            return;
        }

        let formData = new FormData();
        formData.append('password', '12300pawandevprasad03112010@gtss');
        formData.append('year', year);
        formData.append('subject', subject);
        
        for (let i = 0; i < filesInput.files.length; i++) {
            formData.append('files', filesInput.files[i]);
        }

        card.querySelector('#submitUpload').innerText = 'Uploading... Please wait ⏳';
        card.querySelector('#submitUpload').disabled = true;

        try {
            let res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            let data = await res.json();
            if (data.success) {
                alert(data.message);
                appState.currentScreen = 'uploadMenu';
                fetchPapers();
            } else {
                alert('Error: ' + data.message);
                card.querySelector('#submitUpload').innerText = 'Upload to Cloudinary';
                card.querySelector('#submitUpload').disabled = false;
            }
        } catch (e) {
            alert('Upload failed!');
            card.querySelector('#submitUpload').innerText = 'Upload to Cloudinary';
            card.querySelector('#submitUpload').disabled = false;
        }
    };

    card.querySelector('#cancelUpload').onclick = () => {
        appState.currentScreen = 'uploadMenu';
        render();
    };
}

// मैनेज और डिलीट स्क्रीन: सभी अपलोड किए गए पेजेस देखना और डिलीट बटन दबाना
function renderManagePapersScreen(container) {
    const title = document.createElement('h3');
    title.style.marginBottom = "15px";
    title.innerText = "🗑️ Manage & Delete Uploaded Papers";
    container.appendChild(title);

    let hasPapers = false;

    for (let year in appState.papersData) {
        for (let subject in appState.papersData[year]) {
            let pages = appState.papersData[year][subject];
            if (pages && pages.length > 0) {
                hasPapers = true;
                
                let sectionTitle = document.createElement('h4');
                sectionTitle.style.margin = "15px 0 8px 0";
                sectionTitle.style.color = "var(--primary)";
                sectionTitle.innerText = `${subject} (${year})`;
                container.appendChild(sectionTitle);

                pages.forEach((url) => {
                    const pageBox = document.createElement('div');
                    pageBox.className = 'paper-box';

                    const img = document.createElement('img');
                    img.src = url;
                    img.className = 'paper-page-thumb';
                    
                    const actionDiv = document.createElement('div');
                    actionDiv.className = 'action-buttons';

                    const downloadBtn = document.createElement('a');
                    downloadBtn.href = url;
                    downloadBtn.target = '_blank';
                    downloadBtn.className = 'side-download-btn';
                    downloadBtn.innerHTML = '📥 View';

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'side-delete-btn';
                    deleteBtn.innerHTML = '🗑️ Delete';
                    
                    // डिलीट बटन पर क्लिक करते ही इमेज सर्वर से हट जाएगी
                    deleteBtn.onclick = async () => {
                        if (confirm("Are you sure you want to delete this paper page?")) {
                            try {
                                let res = await fetch('/api/delete', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        password: '12300pawandevprasad03112010@gtss',
                                        year: year,
                                        subject: subject,
                                        url: url
                                    })
                                });
                                let data = await res.json();
                                if (data.success) {
                                    alert(data.message);
                                    fetchPapers(); // डेटा रिफ्रेश करें
                                } else {
                                    alert('Error: ' + data.message);
                                }
                            } catch (e) {
                                alert('Delete failed!');
                            }
                        }
                    };

                    actionDiv.appendChild(downloadBtn);
                    actionDiv.appendChild(deleteBtn);

                    pageBox.appendChild(img);
                    pageBox.appendChild(actionDiv);
                    container.appendChild(pageBox);
                });
            }
        }
    }

    if (!hasPapers) {
        const noData = document.createElement('div');
        noData.className = 'no-data';
        noData.innerText = 'No papers found in the database.';
        container.appendChild(noData);
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.style.marginTop = "25px";
    backBtn.innerText = '⬅ Back to Admin Menu';
    backBtn.onclick = () => {
        appState.currentScreen = 'uploadMenu';
        render();
    };
    container.appendChild(backBtn);
}

fetchPapers();
