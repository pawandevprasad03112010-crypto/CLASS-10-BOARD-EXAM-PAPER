let appState = {
    currentScreen: 'home', 
    selectedYear: null,
    selectedSubject: null,
    selectedMathType: null, // 'Basic' या 'Standard' गणित के लिए
    papersData: {},
    activeImageViewer: null,
    showDeveloperModal: false
};

const subjectsList = [
    "English",
    "Hindi",
    "Mathematics",
    "Information Technology",
    "Science",
    "Social Science"
];

const yearsList = [
    "2025-2026",
    "2024-2025",
    "2023-2024",
    "2022-2023",
    "2021-2022",
    "2020-2021"
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
        <div class="header-left">
            <button class="developer-btn-icon" onclick="openDeveloperModal()">👨‍💻 Dev</button>
            <h1>📚 Class 10 Papers</h1>
        </div>
        <button class="upload-btn-icon" onclick="openUploadLogin()">⚙️ Admin</button>
    `;
    app.appendChild(header);

    const body = document.createElement('div');
    body.className = 'content-body';

    if (appState.currentScreen === 'home') {
        renderHomeScreen(body);
    } else if (appState.currentScreen === 'subjects') {
        renderSubjectsScreen(body);
    } else if (appState.currentScreen === 'mathSubtype') {
        renderMathSubtypeScreen(body);
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

    if (appState.showDeveloperModal) {
        renderDeveloperModal(app);
    }
}

function openDeveloperModal() {
    appState.showDeveloperModal = true;
    render();
}

function closeDeveloperModal() {
    appState.showDeveloperModal = false;
    render();
}

function renderDeveloperModal(appContainer) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    overlay.innerHTML = `
        <div class="modal-content">
            <h3 style="color: var(--primary); margin-bottom: 10px;">👨‍💻 App Developer</h3>
            <p style="font-size: 1.05rem; font-weight: bold; color: var(--text-main); margin: 15px 0; line-height: 1.5;">
                Developed by<br>
                <span style="color: #4f46e5; font-size: 1.2rem;">PAWAN DEV PRASAD</span><br><br>
                <span style="font-size: 0.9rem; font-weight: normal; color: #475569;">To promote Class 10th Board Exam Paper. Call this number:</span><br>
                <a href="tel:9863454182" style="color: #10b981; font-size: 1.1rem; text-decoration: none; font-weight: bold;">📞 9863454182</a>
            </p>
            <button class="btn" onclick="closeDeveloperModal()" style="margin-top: 15px;">OK / Close</button>
        </div>
    `;
    appContainer.appendChild(overlay);
}

function renderHomeScreen(container) {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
        <label for="yearSelect">Select Academic Year:</label>
        <select id="yearSelect">
            ${yearsList.map(y => `<option value="${y}">${y}</option>`).join('')}
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
            if (subject === 'Mathematics') {
                appState.currentScreen = 'mathSubtype'; // गणित चुनने पर बेसिक/स्टैंडर्ड स्क्रीन खुलेगी
            } else {
                appState.currentScreen = 'viewer';
            }
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

// गणित के अंदर Basic और Standard चुनने की स्क्रीन
function renderMathSubtypeScreen(container) {
    const title = document.createElement('h3');
    title.style.marginBottom = "15px";
    title.innerText = `Mathematics (${appState.selectedYear})`;
    container.appendChild(title);

    const basicItem = document.createElement('div');
    basicItem.className = 'list-item';
    basicItem.innerHTML = `<span>📐 Mathematics - Basic</span> ➔`;
    basicItem.onclick = () => {
        appState.selectedMathType = 'Basic';
        appState.currentScreen = 'viewer';
        render();
    };
    container.appendChild(basicItem);

    const standardItem = document.createElement('div');
    standardItem.className = 'list-item';
    standardItem.innerHTML = `<span>📊 Mathematics - Standard</span> ➔`;
    standardItem.onclick = () => {
        appState.selectedMathType = 'Standard';
        appState.currentScreen = 'viewer';
        render();
    };
    container.appendChild(standardItem);

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.style.marginTop = "15px";
    backBtn.innerText = '⬅ Back to Subjects';
    backBtn.onclick = () => {
        appState.currentScreen = 'subjects';
        render();
    };
    container.appendChild(backBtn);
}

function renderViewerScreen(container) {
    const title = document.createElement('h3');
    title.style.marginBottom = "15px";
    let displayTitle = appState.selectedSubject;
    if (appState.selectedSubject === 'Mathematics') {
        displayTitle += ` (${appState.selectedMathType})`;
    }
    title.innerText = `${displayTitle} - ${appState.selectedYear}`;
    container.appendChild(title);

    let yearData = appState.papersData[appState.selectedYear];
    let pages = [];

    if (yearData) {
        if (appState.selectedSubject === 'Mathematics') {
            let mathObj = yearData['Mathematics'];
            if (mathObj && typeof mathObj === 'object') {
                pages = mathObj[appState.selectedMathType] || [];
            }
        } else {
            pages = yearData[appState.selectedSubject] || [];
        }
    }

    if (pages.length === 0) {
        const noData = document.createElement('div');
        noData.className = 'no-data';
        noData.innerText = 'No question papers uploaded for this section yet.';
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

            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'side-download-btn';
            downloadBtn.innerHTML = '📥 Download';
            let subTag = appState.selectedSubject === 'Mathematics' ? `_${appState.selectedMathType}` : '';
            let fileName = `Paper_${appState.selectedYear.replace('-', '_')}_${appState.selectedSubject}${subTag}_Page_${index+1}.jpg`;
            downloadBtn.onclick = () => downloadImage(url, fileName);

            pageBox.appendChild(img);
            pageBox.appendChild(downloadBtn);
            container.appendChild(pageBox);
        });
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.style.marginTop = "20px";
    backBtn.innerText = appState.selectedSubject === 'Mathematics' ? '⬅ Back to Math Types' : '⬅ Back to Subjects List';
    backBtn.onclick = () => {
        if (appState.selectedSubject === 'Mathematics') {
            appState.currentScreen = 'mathSubtype';
        } else {
            appState.currentScreen = 'subjects';
        }
        render();
    };
    container.appendChild(backBtn);
}

async function downloadImage(url, filename) {
    try {
        alert("Downloading started... Please wait 📥");
        let response = await fetch(url);
        let blob = await response.blob();
        let blobUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
        window.open(url, '_blank');
    }
}

function renderImageViewerModal(appContainer) {
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-modal';
    
    let subTag = appState.selectedSubject === 'Mathematics' ? `_${appState.selectedMathType}` : '';
    let fileName = `Paper_${appState.selectedYear ? appState.selectedYear.replace('-', '_') : 'Exam'}_${appState.selectedSubject || ''}${subTag}_Page.jpg`;

    overlay.innerHTML = `
        <div class="fullscreen-content">
            <button class="close-modal-btn" onclick="closeImageViewer()">✖ Close</button>
            <img src="${appState.activeImageViewer}" class="fullscreen-img" alt="Zoomed Paper">
            <button class="btn" id="fullDownloadBtn" style="margin-top: 15px;">📥 Download Image to Gallery</button>
        </div>
    `;
    appContainer.appendChild(overlay);

    overlay.querySelector('#fullDownloadBtn').onclick = () => {
        downloadImage(appState.activeImageViewer, fileName);
    };
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
        <label>Select Academic Year:</label>
        <select id="upYear">
            ${yearsList.map(y => `<option value="${y}">${y}</option>`).join('')}
        </select>

        <label style="margin-top: 15px;">Select Subject:</label>
        <select id="upSubject">
            ${subjectsList.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>

        <!-- गणित चुनने पर दिखने वाला Basic/Standard विकल्प -->
        <div id="mathSubCategoryDiv" style="display: none; margin-top: 15px;">
            <label>Mathematics Type:</label>
            <select id="upSubCategory">
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
            </select>
        </div>

        <label style="margin-top: 15px;">Select Paper Pages (Multiple images allowed):</label>
        <input type="file" id="upFiles" multiple accept="image/*">

        <button class="btn" id="submitUpload" style="margin-top: 15px;">Upload to Cloudinary</button>
        <button class="btn btn-secondary" id="cancelUpload">Back to Admin Menu</button>
    `;
    container.appendChild(card);

    const subjectSelect = card.querySelector('#upSubject');
    const mathSubDiv = card.querySelector('#mathSubCategoryDiv');

    subjectSelect.onchange = () => {
        if (subjectSelect.value === 'Mathematics') {
            mathSubDiv.style.display = 'block';
        } else {
            mathSubDiv.style.display = 'none';
        }
    };

    card.querySelector('#submitUpload').onclick = async () => {
        let year = card.querySelector('#upYear').value;
        let subject = card.querySelector('#upSubject').value;
        let subCategory = subject === 'Mathematics' ? card.querySelector('#upSubCategory').value : '';
        let filesInput = card.querySelector('#upFiles');

        if (filesInput.files.length === 0) {
            alert('Please select at least one file!');
            return;
        }

        let formData = new FormData();
        formData.append('password', '12300pawandevprasad03112010@gtss');
        formData.append('year', year);
        formData.append('subject', subject);
        formData.append('sub_category', subCategory);
        
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

function renderManagePapersScreen(container) {
    const title = document.createElement('h3');
    title.style.marginBottom = "15px";
    title.innerText = "🗑️ Manage & Delete Uploaded Papers";
    container.appendChild(title);

    let hasPapers = false;

    for (let year in appState.papersData) {
        for (let subject in appState.papersData[year]) {
            let subjectData = appState.papersData[year][subject];

            if (subject === 'Mathematics' && typeof subjectData === 'object' && !Array.isArray(subjectData)) {
                // गणित के अंदर Basic और Standard दोनों को अलग दिखाना
                ['Basic', 'Standard'].forEach(mathType => {
                    let pages = subjectData[mathType] || [];
                    if (pages.length > 0) {
                        hasPapers = true;
                        
                        let sectionTitle = document.createElement('h4');
                        sectionTitle.style.margin = "15px 0 8px 0";
                        sectionTitle.style.color = "var(--primary)";
                        sectionTitle.innerText = `Mathematics - ${mathType} (${year})`;
                        container.appendChild(sectionTitle);

                        pages.forEach((url, index) => {
                            createManagePaperBox(container, year, subject, mathType, url, index);
                        });
                    }
                });
            } else {
                let pages = Array.isArray(subjectData) ? subjectData : [];
                if (pages.length > 0) {
                    hasPapers = true;
                    
                    let sectionTitle = document.createElement('h4');
                    sectionTitle.style.margin = "15px 0 8px 0";
                    sectionTitle.style.color = "var(--primary)";
                    sectionTitle.innerText = `${subject} (${year})`;
                    container.appendChild(sectionTitle);

                    pages.forEach((url, index) => {
                        createManagePaperBox(container, year, subject, null, url, index);
                    });
                }
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

function createManagePaperBox(container, year, subject, subCategory, url, index) {
    const pageBox = document.createElement('div');
    pageBox.className = 'paper-box';

    const img = document.createElement('img');
    img.src = url;
    img.className = 'paper-page-thumb';
    
    const actionDiv = document.createElement('div');
    actionDiv.className = 'action-buttons';

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'side-download-btn';
    downloadBtn.innerHTML = '📥 Download';
    let subTag = subCategory ? `_${subCategory}` : '';
    let fileName = `Paper_${year.replace('-', '_')}_${subject}${subTag}_Page_${index+1}.jpg`;
    downloadBtn.onclick = () => downloadImage(url, fileName);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'side-delete-btn';
    deleteBtn.innerHTML = '🗑️ Delete';
    
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
                        sub_category: subCategory,
                        url: url
                    })
                });
                let data = await res.json();
                if (data.success) {
                    alert(data.message);
                    fetchPapers();
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
}

fetchPapers();
