// Order Detail Page
function renderOrderDetailPage(data) {
    const taskId = data.taskId;
    const task = AppData.getTask(taskId);
    
    if (!task) {
        showToast('Order not found', 'error');
        router.navigate('/orders');
        return;
    }
    
    // Load saved data
    const photos = AppData.getTaskData(taskId, 'photos', []);
    const notes = AppData.getTaskData(taskId, 'notes', '');
    const timeData = AppData.getTaskData(taskId, 'time', {
        startTime: task.scheduledStart,
        endTime: task.scheduledEnd,
        pauseStart: '',
        pauseEnd: ''
    });
    
    const content = `
        <div class="page page-order-detail">
            <div class="page-header page-header-with-back">
                <button class="back-button" onclick="router.navigate('/orders')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <div class="header-title">
                    <h1>${task.location.address}</h1>
                    <span class="header-subtitle">${task.type}</span>
                </div>
            </div>

            <div class="page-content">
                <!-- Description -->
                <div class="info-card">
                    <div class="info-card-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <h3>Description</h3>
                    </div>
                    <p class="task-description">${task.description}</p>
                </div>

                <!-- Notes -->
                <div class="section-card">
                    <h3>Notes</h3>
                    <textarea 
                        id="taskNotes" 
                        class="notes-textarea" 
                        placeholder="Add notes to the task..."
                        oninput="saveTaskNotes(${taskId})"
                    >${notes}</textarea>
                </div>

                <!-- Survey Questions -->
                ${(() => {
                    // Load survey questions from active job type
                    const jobTypes = getFromStorage('admin_job_types', []);
                    const activeJobTypeId = getFromStorage('admin_active_job_type', 1);
                    const activeJobType = jobTypes.find(jt => jt.id === activeJobTypeId) || jobTypes[0];
                    const surveyQuestions = activeJobType ? (activeJobType.surveyQuestions || []) : [];
                    
                    if (surveyQuestions.length === 0) {
                        return '';
                    }
                    
                    const surveyAnswers = AppData.getTaskData(taskId, 'surveyAnswers', {});
                    
                    return `
                        <div class="section-card">
                            <h3>Survey</h3>
                            <div class="survey-questions" id="surveyQuestions${taskId}">
                                ${surveyQuestions.map((q, index) => {
                                    const answer = surveyAnswers[q.id] || '';
                                    
                                    if (q.type === 'yesno') {
                                        return `
                                            <div class="survey-question">
                                                <label class="survey-label">
                                                    ${q.question}
                                                    ${q.required ? '<span class="required-mark">*</span>' : ''}
                                                </label>
                                                <div class="survey-yesno">
                                                    <button class="survey-yesno-btn ${answer === 'Yes' ? 'active' : ''}" 
                                                            onclick="saveSurveyAnswer(${taskId}, ${q.id}, 'Yes')">
                                                        Yes
                                                    </button>
                                                    <button class="survey-yesno-btn ${answer === 'No' ? 'active' : ''}" 
                                                            onclick="saveSurveyAnswer(${taskId}, ${q.id}, 'No')">
                                                        No
                                                    </button>
                                                </div>
                                            </div>
                                        `;
                                    } else if (q.type === 'choice') {
                                        return `
                                            <div class="survey-question">
                                                <label class="survey-label">
                                                    ${q.question}
                                                    ${q.required ? '<span class="required-mark">*</span>' : ''}
                                                </label>
                                                <select class="survey-select" 
                                                        onchange="saveSurveyAnswer(${taskId}, ${q.id}, this.value)">
                                                    <option value="">Select...</option>
                                                    ${(q.choices || []).map(choice => `
                                                        <option value="${choice}" ${answer === choice ? 'selected' : ''}>
                                                            ${choice}
                                                        </option>
                                                    `).join('')}
                                                </select>
                                            </div>
                                        `;
                                    } else if (q.type === 'text') {
                                        return `
                                            <div class="survey-question">
                                                <label class="survey-label">
                                                    ${q.question}
                                                    ${q.required ? '<span class="required-mark">*</span>' : ''}
                                                </label>
                                                <input type="text" 
                                                       class="survey-input" 
                                                       placeholder="Enter answer..."
                                                       value="${answer}"
                                                       onchange="saveSurveyAnswer(${taskId}, ${q.id}, this.value)">
                                            </div>
                                        `;
                                    }
                                }).join('')}
                            </div>
                        </div>
                    `;
                })()}

                <!-- Photos -->
                <div class="section-card">
                    <div class="section-card-header">
                        <h3>Photos</h3>
                        <button class="button-icon" onclick="showPhotoTypeDialog(${taskId})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </button>
                        <input type="file" id="photoInput${taskId}" accept="image/jpeg,image/jpg,image/png,image/heic,image/heif" capture="environment" multiple style="display: none;" data-photo-type="standard">
                    </div>
                    ${(() => {
                        if (photos.length === 0) {
                            return `<div class="empty-state-small"><p>No photos added yet</p></div>`;
                        }
                        
                        // Load photo categories from active job type
                        const jobTypes = getFromStorage('admin_job_types', []);
                        const activeJobTypeId = getFromStorage('admin_active_job_type', 1);
                        const activeJobType = jobTypes.find(jt => jt.id === activeJobTypeId) || jobTypes[0];
                        if (!activeJobType || !activeJobType.photoCategories) return '<div class="empty-state-small"><p>No photos added yet</p></div>';
                        const categories = activeJobType.photoCategories;
                        
                        let html = '';
                        
                        // Group photos by category
                        categories.forEach((category, index) => {
                            const categoryPhotos = photos.filter(p => p.type === category);
                            
                            if (categoryPhotos.length > 0) {
                                html += `
                                    <div class="photo-section">
                                        <div class="photo-section-label" style="background: hsl(${index * (360 / categories.length)}, 70%, 95%); color: hsl(${index * (360 / categories.length)}, 70%, 40%);">
                                            ${category.toUpperCase()} (${categoryPhotos.length})
                                        </div>
                                        <div class="photos-grid">
                                            ${categoryPhotos.map(photo => `
                                                <div class="photo-item">
                                                    <div class="photo-type-badge" style="background: hsl(${index * (360 / categories.length)}, 70%, 60%);">
                                                        ${category}
                                                    </div>
                                                    <img src="${photo.data}" alt="${category} foto" onclick="${photo.lat && photo.lng ? `window.open('${getGoogleMapsLink(photo.lat, photo.lng)}', '_blank')` : 'void(0)'}">
                                                    <div class="photo-info">
                                                        ${photo.timestamp ? `<div class="photo-timestamp">${formatPhotoTimestamp(photo.timestamp)}</div>` : ''}
                                                        ${photo.address ? `
                                                            <div class="photo-location">
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 12px; height: 12px;">
                                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                                    <circle cx="12" cy="10" r="3"></circle>
                                                                </svg>
                                                                ${photo.address}
                                                            </div>
                                                        ` : photo.lat && photo.lng ? `
                                                            <div class="photo-location">
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 12px; height: 12px;">
                                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                                    <circle cx="12" cy="10" r="3"></circle>
                                                                </svg>
                                                                ${formatGPSCoordinates(photo.lat, photo.lng)}
                                                            </div>
                                                        ` : ''}
                                                    </div>
                                                    <button class="photo-delete" onclick="event.stopPropagation(); deletePhoto(${taskId}, '${photo.id}')">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }
                        });
                        
                        // Show uncategorized photos (those with types not in current categories)
                        const uncategorizedPhotos = photos.filter(p => !categories.includes(p.type) && p.type);
                        if (uncategorizedPhotos.length > 0) {
                            html += `
                                <div class="photo-section">
                                    <div class="photo-section-label" style="background: #f5f5f5; color: #666;">
                                        OTHER PHOTOS (${uncategorizedPhotos.length})
                                    </div>
                                    <div class="photos-grid">
                                        ${uncategorizedPhotos.map(photo => `
                                            <div class="photo-item">
                                                <div class="photo-type-badge" style="background: #999;">${photo.type || 'Standard'}</div>
                                                <img src="${photo.data}" alt="Task photo" onclick="${photo.lat && photo.lng ? `window.open('${getGoogleMapsLink(photo.lat, photo.lng)}', '_blank')` : 'void(0)'}">
                                                <div class="photo-info">
                                                    ${photo.timestamp ? `<div class="photo-timestamp">${formatPhotoTimestamp(photo.timestamp)}</div>` : ''}
                                                    ${photo.address ? `
                                                        <div class="photo-location">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 12px; height: 12px;">
                                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                                <circle cx="12" cy="10" r="3"></circle>
                                                            </svg>
                                                            ${photo.address}
                                                        </div>
                                                    ` : photo.lat && photo.lng ? `
                                                        <div class="photo-location">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 12px; height: 12px;">
                                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                                <circle cx="12" cy="10" r="3"></circle>
                                                            </svg>
                                                            ${formatGPSCoordinates(photo.lat, photo.lng)}
                                                        </div>
                                                    ` : ''}
                                                </div>
                                                <button class="photo-delete" onclick="event.stopPropagation(); deletePhoto(${taskId}, '${photo.id}')">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }
                        
                        return html;
                    })()}
                </div>

                <!-- Checklist -->
                <div class="section-card">
                    <div class="section-card-header">
                        <h3>Checklist</h3>
                        <div class="progress-badge" id="checklistProgress">0%</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" id="checklistProgressBar" style="width: 0%"></div>
                    </div>
                    <div class="checklist" id="checklist${taskId}">
                        <!-- Populated by renderChecklist() -->
                    </div>
                </div>

                <!-- Voice Notes -->
                <div class="section-card">
                    <div class="section-card-header">
                        <h3>Voice Notes</h3>
                        <button class="button-icon" id="recordButton${taskId}" onclick="toggleVoiceRecording(${taskId})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="voice-notes-list" id="voiceNotesList${taskId}">
                        <!-- Populated by renderVoiceNotes() -->
                    </div>
                </div>

                <!-- Signature -->
                <div class="section-card">
                    <div class="section-card-header">
                        <h3>Customer Signature</h3>
                        <button class="button-text" onclick="clearSignature(${taskId})">Clear</button>
                    </div>
                    <div class="signature-pad-container">
                        <canvas id="signatureCanvas${taskId}" class="signature-canvas"></canvas>
                        <div class="signature-hint">Draw signature here</div>
                    </div>
                </div>

                <!-- Work Note Button -->
                <button class="complete-task-button" onclick="router.navigate('/work-note', { taskId: ${taskId} })">
                    <div class="complete-task-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <div class="complete-task-content">
                        <div class="complete-task-title">Work note</div>
                        <div class="complete-task-subtitle">View and manage materials</div>
                    </div>
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
    
    // Initialize components
    setTimeout(() => {
        initializeTimeInputs(taskId, timeData);
        calculateTotalTime(taskId);
        renderChecklist(taskId);
        renderVoiceNotes(taskId);
        renderScannedEquipment(taskId);
        initSignaturePad(taskId);
    }, 100);
}

// Initialize time inputs with saved data
function initializeTimeInputs(taskId, timeData) {
    // Parse start time
    if (timeData.startTime) {
        const [sH, sM] = timeData.startTime.split(':');
        const sh = document.getElementById('startHour');
        const sm = document.getElementById('startMinute');
        if (sh) sh.value = sH;
        if (sm) sm.value = sM;
    }
    
    // Parse end time
    if (timeData.endTime) {
        const [eH, eM] = timeData.endTime.split(':');
        const eh = document.getElementById('endHour');
        const em = document.getElementById('endMinute');
        if (eh) eh.value = eH;
        if (em) em.value = eM;
    }
    
    // Parse pause start
    if (timeData.pauseStart) {
        const [psH, psM] = timeData.pauseStart.split(':');
        const psh = document.getElementById('pauseStartHour');
        const psm = document.getElementById('pauseStartMinute');
        if (psh) psh.value = psH;
        if (psm) psm.value = psM;
    }
    
    // Parse pause end
    if (timeData.pauseEnd) {
        const [peH, peM] = timeData.pauseEnd.split(':');
        const peh = document.getElementById('pauseEndHour');
        const pem = document.getElementById('pauseEndMinute');
        if (peh) peh.value = peH;
        if (pem) pem.value = peM;
    }
}

// Helper functions for order detail
function calculateTotalTime(taskId) {
    const startH = parseInt(document.getElementById('startHour').value) || 0;
    const startM = parseInt(document.getElementById('startMinute').value) || 0;
    const endH = parseInt(document.getElementById('endHour').value) || 0;
    const endM = parseInt(document.getElementById('endMinute').value) || 0;
    
    const pauseStartH = parseInt(document.getElementById('pauseStartHour').value) || 0;
    const pauseStartM = parseInt(document.getElementById('pauseStartMinute').value) || 0;
    const pauseEndH = parseInt(document.getElementById('pauseEndHour').value) || 0;
    const pauseEndM = parseInt(document.getElementById('pauseEndMinute').value) || 0;
    
    // Calculate work time
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    
    let workTime = endMin - startMin;
    if (workTime < 0) workTime += 1440; // Handle overnight
    
    // Calculate pause time
    const pauseStartMin = pauseStartH * 60 + pauseStartM;
    const pauseEndMin = pauseEndH * 60 + pauseEndM;
    
    let pauseMin = 0;
    if (pauseStartH > 0 || pauseStartM > 0 || pauseEndH > 0 || pauseEndM > 0) {
        pauseMin = pauseEndMin - pauseStartMin;
        if (pauseMin < 0) pauseMin += 1440;
    }
    
    // Calculate total (work time minus pause)
    let total = workTime - pauseMin;
    if (total < 0) total = 0;
    
    // Update displays
    document.getElementById('workTimeDisplay').textContent = minutesToTime(workTime);
    document.getElementById('pauseTimeDisplay').textContent = minutesToTime(pauseMin);
    document.getElementById('totalTime').textContent = minutesToTime(total);
}

function updateTaskTime(taskId) {
    const startH = document.getElementById('startHour').value.padStart(2, '0');
    const startM = document.getElementById('startMinute').value.padStart(2, '0');
    const endH = document.getElementById('endHour').value.padStart(2, '0');
    const endM = document.getElementById('endMinute').value.padStart(2, '0');
    const pauseStartH = document.getElementById('pauseStartHour').value.padStart(2, '0');
    const pauseStartM = document.getElementById('pauseStartMinute').value.padStart(2, '0');
    const pauseEndH = document.getElementById('pauseEndHour').value.padStart(2, '0');
    const pauseEndM = document.getElementById('pauseEndMinute').value.padStart(2, '0');
    
    const timeData = {
        startTime: `${startH}:${startM}`,
        endTime: `${endH}:${endM}`,
        pauseStart: `${pauseStartH}:${pauseStartM}`,
        pauseEnd: `${pauseEndH}:${pauseEndM}`
    };
    
    AppData.saveTaskData(taskId, 'time', timeData);
    calculateTotalTime(taskId);
    vibrate(20);
}

function saveTaskNotes(taskId) {
    const notes = document.getElementById('taskNotes').value;
    AppData.saveTaskData(taskId, 'notes', notes);
}

function setTimeNow(type, taskId) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    if (type === 'start') {
        document.getElementById('startHour').value = hours;
        document.getElementById('startMinute').value = minutes;
    } else if (type === 'end') {
        document.getElementById('endHour').value = hours;
        document.getElementById('endMinute').value = minutes;
    }
    
    updateTaskTime(taskId);
    vibrate(20);
}

function clearPause(taskId) {
    document.getElementById('pauseStartHour').value = '';
    document.getElementById('pauseStartMinute').value = '';
    document.getElementById('pauseEndHour').value = '';
    document.getElementById('pauseEndMinute').value = '';
    updateTaskTime(taskId);
}

function saveSurveyAnswer(taskId, questionId, answer) {
    const surveyAnswers = AppData.getTaskData(taskId, 'surveyAnswers', {});
    surveyAnswers[questionId] = answer;
    AppData.saveTaskData(taskId, 'surveyAnswers', surveyAnswers);
    
    // Update UI to show active state
    router.navigate('/order-detail', { taskId });
    vibrate(20);
}

function openMaterialModal(taskId) {
    document.getElementById('materialModal').classList.add('show');
    document.getElementById('materialName').value = '';
    document.getElementById('materialQuantity').value = '1';
}

function closeMaterialModal() {
    document.getElementById('materialModal').classList.remove('show');
}

function saveMaterial(taskId) {
    const name = document.getElementById('materialName').value.trim();
    const quantity = parseFloat(document.getElementById('materialQuantity').value);
    const unit = document.getElementById('materialUnit').value;
    
    if (!name || quantity <= 0) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    const materials = AppData.getTaskData(taskId, 'materials', []);
    materials.push({
        id: generateId(),
        name,
        quantity,
        unit
    });
    
    AppData.saveTaskData(taskId, 'materials', materials);
    ActivityLogger.log('material', `Added ${quantity} ${unit} ${name}`, taskId);
    
    closeMaterialModal();
    showToast('Material added', 'success');
    
    // Refresh page
    router.navigate('/order-detail', { taskId });
}

function deleteMaterial(taskId, materialId) {
    let materials = AppData.getTaskData(taskId, 'materials', []);
    materials = materials.filter(m => m.id !== materialId);
    AppData.saveTaskData(taskId, 'materials', materials);
    showToast('Material deleted', 'success');
    router.navigate('/order-detail', { taskId });
}

function showPhotoTypeDialog(taskId) {
    // Load photo categories from active job type
    const jobTypes = getFromStorage('admin_job_types', []);
    const activeJobTypeId = getFromStorage('admin_active_job_type', 1);
    const activeJobType = jobTypes.find(jt => jt.id === activeJobTypeId) || jobTypes[0];
    if (!activeJobType || !activeJobType.photoCategories || activeJobType.photoCategories.length === 0) {
        showToast('No photo categories configured in Admin', 'warning', 3000);
        return;
    }
    const categories = activeJobType.photoCategories;
    
    const dialog = document.createElement('div');
    dialog.className = 'photo-type-dialog-overlay';
    dialog.innerHTML = `
        <div class="photo-type-dialog">
            <h3>Select photo category</h3>
            <div class="photo-type-options">
                ${categories.map((category, index) => `
                    <button class="photo-type-btn" style="--btn-color: hsl(${index * (360 / categories.length)}, 70%, 60%)" onclick="selectPhotoType(${taskId}, '${category.replace(/'/g, "\\'")}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <span>${category}</span>
                    </button>
                `).join('')}
            </div>
            <button class="dialog-cancel" onclick="this.closest('.photo-type-dialog-overlay').remove()">
                Cancel
            </button>
        </div>
    `;
    document.body.appendChild(dialog);
}

function selectPhotoType(taskId, type) {
    const input = document.getElementById(`photoInput${taskId}`);
    input.dataset.photoType = type;
    input.onchange = (e) => addPhotos(taskId, e, type);
    input.click();
    document.querySelector('.photo-type-dialog-overlay').remove();
}

function addPhotos(taskId, event, photoType = 'standard') {
    console.log('addPhotos kaldt for taskId:', taskId, 'type:', photoType);
    const files = event.target.files;
    console.log('Antal filer:', files ? files.length : 0);
    
    if (!files || files.length === 0) {
        console.log('Ingen filer valgt');
        return;
    }
    
    // START GPS REQUEST IMMEDIATELY
    console.log('Starter GPS request...');
    let locationPromise = null;
    try {
        locationPromise = LocationService.getCurrentPosition();
        console.log('GPS request startet');
    } catch (err) {
        console.error('GPS ikke tilgængelig:', err);
        showToast('GPS not available - images uploaded without location', 'warning', 4000);
    }
    
    const photos = AppData.getTaskData(taskId, 'photos', []);
    console.log('Eksisterende billeder:', photos.length);
    
    const fileArray = Array.from(files);
    let processed = 0;
    
    // Process each file
    fileArray.forEach((file, index) => {
        console.log(`Læser fil ${index + 1}/${fileArray.length}:`, file.name, file.type, file.size);
        
        // Compress image first
        compressImage(file, 1200, 0.7).then(compressedData => {
            console.log(`Fil ${index + 1} komprimeret, original: ${file.size} bytes`);
            
            const photoData = {
                id: generateId(),
                data: compressedData,
                timestamp: new Date().toISOString(),
                type: photoType
            };
            
            photos.push(photoData);
            console.log('Billede tilføjet, total nu:', photos.length);
            
            // Add GPS if available (will resolve when ready)
            if (locationPromise) {
                console.log('Forsøger at hente GPS...');
                locationPromise.then(async location => {
                    console.log('GPS location modtaget:', location);
                    if (location && location.lat && location.lng) {
                        photoData.lat = location.lat;
                        photoData.lng = location.lng;
                        photoData.accuracy = location.accuracy;
                        console.log('GPS tilføjet til billede:', photoData.lat, photoData.lng);
                        
                        // Get address in background
                        console.log('Henter adresse...');
                        try {
                            const address = await LocationService.reverseGeocode(location.lat, location.lng);
                            console.log('Adresse resultat:', address);
                            if (address) {
                                photoData.address = address;
                                console.log('Adresse tilføjet:', address);
                                showToast('📍 Location saved: ' + address, 'success', 3000);
                            }
                        } catch (err) {
                            console.error('Adresse fejl:', err);
                        }
                        
                        // Re-save with GPS and address
                        try {
                            AppData.saveTaskData(taskId, 'photos', photos);
                            console.log('Data gemt med GPS/adresse');
                            // Refresh display to show GPS/address
                            setTimeout(() => {
                                router.navigate('/order-detail', { taskId });
                            }, 500);
                        } catch (err) {
                            console.error('Kunne ikke gemme GPS/adresse:', err);
                        }
                    }
                }).catch(err => {
                    console.error('GPS fejl:', err);
                    showToast('GPS was denied or is not available', 'warning', 3000);
                });
            } else {
                console.log('Ingen GPS location promise');
            }
            
            processed++;
            if (processed === fileArray.length) {
                console.log('Alle billeder indlæst, gemmer...');
                try {
                    AppData.saveTaskData(taskId, 'photos', photos);
                    console.log('Billeder gemt i AppData');
                    ActivityLogger.log('photo', `Added ${fileArray.length} photo(s)`, taskId);
                    showToast(`${fileArray.length} photo(s) added`, 'success', 3000);
                    vibrate(50);
                    
                    // Reset input
                    event.target.value = '';
                    
                    // Delay navigation to allow GPS/address to be captured
                    setTimeout(() => {
                        console.log('Navigerer til order-detail');
                        router.navigate('/order-detail', { taskId });
                    }, 2000);  // Increased to 2 seconds to allow GPS/address to complete
                } catch (error) {
                    console.error('Fejl ved gemning:', error);
                    if (error.name === 'QuotaExceededError') {
                        showToast('📦 Storage full! Delete old photos or clear data', 'error', 6000);
                    } else {
                        showToast('Error saving photos', 'error', 5000);
                    }
                }
            }
        }).catch(error => {
            console.error('Komprimeringsfejl for ' + file.name, error);
            showToast('Error compressing image', 'error', 5000);
            processed++;
        });
    });
}

function deletePhoto(taskId, photoId) {
    let photos = AppData.getTaskData(taskId, 'photos', []);
    photos = photos.filter(p => p.id !== photoId);
    AppData.saveTaskData(taskId, 'photos', photos);
    showToast('Billede slettet', 'success');
    router.navigate('/order-detail', { taskId });
}

// Simple Timer Functions
let workTimer = {
    startTime: null,
    taskId: null
};

function toggleWorkTimer(taskId) {
    const btn = document.getElementById(`timerBtn${taskId}`);
    const state = btn.getAttribute('data-state');
    
    if (state === 'stopped') {
        // Start task if pending
        const task = AppData.getTask(taskId);
        if (task && task.status === 'pending') {
            AppData.updateTask(taskId, { status: 'active' });
            ActivityLogger.log('start', 'Ordre startet', taskId);
        }
        
        // Start timer
        workTimer.taskId = taskId;
        workTimer.startTime = new Date();
        
        // Auto-fill start time
        document.getElementById('startHour').value = String(workTimer.startTime.getHours()).padStart(2, '0');
        document.getElementById('startMinute').value = String(workTimer.startTime.getMinutes()).padStart(2, '0');
        updateTaskTime(taskId);
        
        // Update button
        btn.setAttribute('data-state', 'started');
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18"></rect>
            </svg>
            Slut
        `;
        btn.style.background = 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)';
        
        showToast('⏱️ Timer started', 'success');
        vibrate(50);
    } else {
        // Stop timer
        if (!workTimer.startTime) return;
        
        const endTime = new Date();
        
        // Auto-fill end time
        document.getElementById('endHour').value = String(endTime.getHours()).padStart(2, '0');
        document.getElementById('endMinute').value = String(endTime.getMinutes()).padStart(2, '0');
        updateTaskTime(taskId);
        
        // Calculate duration
        const durationMs = endTime - workTimer.startTime;
        const durationMinutes = Math.round(durationMs / 60000);
        
        // Update button
        btn.setAttribute('data-state', 'stopped');
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start nu
        `;
        btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        
        // Reset timer
        workTimer.taskId = null;
        workTimer.startTime = null;
        
        showToast(`⏱️ Timer stoppet - ${durationMinutes} minutter`, 'success');
        vibrate([50, 50, 50]);
    }
}

function completeTask(taskId) {
    // Check checklist progress
    const progress = ChecklistManager.getProgress(taskId);
    if (progress.percentage < 80) {
        if (!window.confirm(`Checklist is only ${progress.percentage}% complete. Continue anyway?`)) {
            return;
        }
    }
    
    // Save signature if present
    if (signaturePad && !signaturePad.isEmpty()) {
        saveSignature(taskId);
    }
    
    if (window.confirm('Are you sure the task is complete?')) {
        AppData.updateTask(taskId, { status: 'completed' });
        ActivityLogger.log('complete', 'Order completed', taskId);
        showToast('Task completed! 🎉', 'success');
        vibrate([50, 100, 50]);
        setTimeout(() => router.navigate('/orders'), 1000);
    }
}

async function exportToPDF(taskId) {
    const task = AppData.getTask(taskId);
    const photos = AppData.getTaskData(taskId, 'photos', []);
    const materials = AppData.getTaskData(taskId, 'materials', []);
    const checklist = AppData.getTaskData(taskId, 'checklist', ChecklistManager.getDefaultChecklist());
    const signature = AppData.getTaskData(taskId, 'signature');
    
    showToast('📄 Genererer PDF...', 'info', 2000);
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        let yPos = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - (2 * margin);
        
        // Header
        doc.setFontSize(22);
        doc.setFont(undefined, 'bold');
        doc.text('Service Rapport', margin, yPos);
        
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100);
        doc.text(`Ordre #${task.orderNumber}`, margin, yPos);
        
        yPos += 15;
        
        // Order Info
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0);
        doc.text('Ordre Information', margin, yPos);
        
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        const orderInfo = [
            `Type: ${task.title}`,
            `Customer: ${task.customer}`,
            `Address: ${task.location.address}`,
            `Date: ${new Date(task.scheduledDate).toLocaleDateString('en-GB')}`,
            `Status: ${task.status === 'completed' ? 'Completed' : task.status === 'active' ? 'Active' : 'Pending'}`
        ];
        
        orderInfo.forEach(line => {
            doc.text(line, margin, yPos);
            yPos += 6;
        });
        
        yPos += 10;
        
        // Time Registration
        const startHour = document.getElementById('startHour')?.value;
        const startMinute = document.getElementById('startMinute')?.value;
        const endHour = document.getElementById('endHour')?.value;
        const endMinute = document.getElementById('endMinute')?.value;
        const totalTimeEl = document.getElementById('totalTime');
        
        if (startHour || endHour || totalTimeEl) {
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Tidsregistrering', margin, yPos);
            
            yPos += 8;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            
            if (startHour && startMinute) {
                doc.text(`Start: ${startHour}:${startMinute}`, margin, yPos);
                yPos += 6;
            }
            if (endHour && endMinute) {
                doc.text(`End: ${endHour}:${endMinute}`, margin, yPos);
                yPos += 6;
            }
            if (totalTimeEl) {
                doc.text(`Total time: ${totalTimeEl.textContent}`, margin, yPos);
                yPos += 6;
            }
            
            yPos += 10;
        }
        
        // Materials
        if (materials && materials.length > 0) {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Materialer/Dele', margin, yPos);
            
            yPos += 8;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            
            materials.forEach(mat => {
                doc.text(`• ${mat.name} (${mat.quantity} ${mat.unit})`, margin + 5, yPos);
                yPos += 6;
            });
            
            yPos += 10;
        }
        
        // Scanned Equipment
        const scannedEquipment = AppData.getTaskData(taskId, 'scannedEquipment', []);
        if (scannedEquipment && scannedEquipment.length > 0) {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Scannet Udstyr', margin, yPos);
            
            yPos += 8;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            
            scannedEquipment.forEach(eq => {
                doc.text(`• ${eq.name || eq.qrCode}`, margin + 5, yPos);
                if (eq.serialNumber) {
                    yPos += 6;
                    doc.text(`  S/N: ${eq.serialNumber}`, margin + 10, yPos);
                }
                yPos += 6;
            });
            
            yPos += 10;
        }
        
        // Checklist
        if (checklist && checklist.length > 0) {
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Checklist', margin, yPos);
            
            yPos += 8;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            
            checklist.forEach(item => {
                const status = item.checked ? '☑' : '☐';
                doc.text(`${status} ${item.label}`, margin + 5, yPos);
                yPos += 6;
            });
            
            yPos += 10;
        }
        
        // Photos - Before/After
        const beforePhotos = photos.filter(p => p.type === 'before');
        const afterPhotos = photos.filter(p => p.type === 'after');
        
        if (beforePhotos.length > 0 || afterPhotos.length > 0) {
            doc.addPage();
            yPos = 20;
            
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('Before/After Photos', margin, yPos);
            yPos += 10;
            
            // Before photos
            if (beforePhotos.length > 0) {
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text('BEFORE', margin, yPos);
                yPos += 5;
                
                for (let i = 0; i < Math.min(2, beforePhotos.length); i++) {
                    const photo = beforePhotos[i];
                    try {
                        const imgWidth = 80;
                        const imgHeight = 60;
                        doc.addImage(photo.data, 'JPEG', margin + (i * 90), yPos, imgWidth, imgHeight);
                    } catch (e) {
                        console.error('Error adding image', e);
                    }
                }
                yPos += 70;
            }
            
            // After photos
            if (afterPhotos.length > 0) {
                if (yPos > 200) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text('AFTER', margin, yPos);
                yPos += 5;
                
                for (let i = 0; i < Math.min(2, afterPhotos.length); i++) {
                    const photo = afterPhotos[i];
                    try {
                        const imgWidth = 80;
                        const imgHeight = 60;
                        doc.addImage(photo.data, 'JPEG', margin + (i * 90), yPos, imgWidth, imgHeight);
                    } catch (e) {
                        console.error('Error adding image', e);
                    }
                }
                yPos += 70;
            }
        }
        
        // Signature
        if (signature) {
            if (yPos > 220) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Customer Signature', margin, yPos);
            yPos += 5;
            
            try {
                doc.addImage(signature, 'PNG', margin, yPos, 80, 40);
            } catch (e) {
                console.error('Error adding signature', e);
            }
        }
        
        // Save PDF
        const filename = `Service_Rapport_${task.orderNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        showToast('✅ PDF eksporteret!', 'success');
        ActivityLogger.log('export', 'Eksporterede PDF rapport', taskId);
        vibrate(50);
        
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('❌ Error generating PDF', 'error');
    }
}

function callCustomer(phone) {
    showToast(`Calling ${phone}`, 'info');
    window.location.href = `tel:${phone}`;
}

function emailCustomer(email) {
    window.location.href = `mailto:${email}`;
}

function navigateToLocation(address) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
}

function shareOrder(taskId) {
    const task = AppData.getTask(taskId);
    const text = `Ordre ${task.orderNumber} - ${task.title}\n${task.location.address}`;
    
    if (navigator.share) {
        navigator.share({
            title: `Ordre ${task.orderNumber}`,
            text: text
        });
    } else {
        copyToClipboard(text);
    }
}

// Checklist functions
function renderChecklist(taskId) {
    const checklist = ChecklistManager.getChecklist(taskId);
    const progress = ChecklistManager.getProgress(taskId);
    
    const container = document.getElementById(`checklist${taskId}`);
    if (!container) return;
    
    container.innerHTML = checklist.map(item => `
        <div class="checklist-item ${item.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                id="check${item.id}" 
                ${item.completed ? 'checked' : ''}
                onchange="toggleChecklistItem(${taskId}, ${item.id}, this.checked)"
            >
            <label for="check${item.id}">${item.text}</label>
        </div>
    `).join('');
    
    // Update progress
    document.getElementById('checklistProgress').textContent = `${progress.percentage}%`;
    document.getElementById('checklistProgressBar').style.width = `${progress.percentage}%`;
}

function toggleChecklistItem(taskId, itemId, completed) {
    ChecklistManager.updateChecklistItem(taskId, itemId, completed);
    renderChecklist(taskId);
}

// Voice recording
let voiceRecorder = null;
let currentRecordingTaskId = null;
let recordingStartTime = null;

function toggleVoiceRecording(taskId) {
    const button = document.getElementById(`recordButton${taskId}`);
    
    if (voiceRecorder && voiceRecorder.isRecording) {
        // Stop recording
        stopVoiceRecording(taskId);
    } else {
        // Start recording
        startVoiceRecording(taskId);
    }
}

async function startVoiceRecording(taskId) {
    voiceRecorder = new VoiceRecorder();
    const started = await voiceRecorder.start();
    
    if (started) {
        currentRecordingTaskId = taskId;
        recordingStartTime = Date.now();
        
        const button = document.getElementById(`recordButton${taskId}`);
        button.classList.add('recording');
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
        `;
        
        showToast('Recording started...', 'info');
        vibrate(50);
    }
}

async function stopVoiceRecording(taskId) {
    const audio = await voiceRecorder.stop();
    
    if (audio) {
        const duration = Math.floor((Date.now() - recordingStartTime) / 1000);
        
        const voiceNotes = AppData.getTaskData(taskId, 'voiceNotes', []);
        voiceNotes.push({
            id: generateId(),
            data: audio.data,
            url: audio.url,
            duration: duration,
            timestamp: new Date().toISOString()
        });
        
        AppData.saveTaskData(taskId, 'voiceNotes', voiceNotes);
        ActivityLogger.log('voice', `Added voice note (${duration}s)`, taskId);
        
        renderVoiceNotes(taskId);
        showToast('Voice note saved!', 'success');
        vibrate(50);
    }
    
    const button = document.getElementById(`recordButton${taskId}`);
    button.classList.remove('recording');
    button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
    `;
    
    currentRecordingTaskId = null;
    recordingStartTime = null;
}

function renderVoiceNotes(taskId) {
    const voiceNotes = AppData.getTaskData(taskId, 'voiceNotes', []);
    const container = document.getElementById(`voiceNotesList${taskId}`);
    
    if (!container) return;
    
    if (voiceNotes.length === 0) {
        container.innerHTML = `
            <div class="empty-state-small">
                <p>No voice notes yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = voiceNotes.map(note => `
        <div class="voice-note-item">
            <button class="voice-note-play" onclick="playVoiceNote('${note.url}')">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
            </button>
            <div class="voice-note-info">
                <div class="voice-note-time">${formatDate(new Date(note.timestamp))}</div>
                <div class="voice-note-duration">${note.duration}s</div>
            </div>
            <button class="button-delete-small" onclick="deleteVoiceNote(${taskId}, '${note.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
}

function playVoiceNote(url) {
    const audio = new Audio(url);
    audio.play();
}

function deleteVoiceNote(taskId, noteId) {
    let voiceNotes = AppData.getTaskData(taskId, 'voiceNotes', []);
    voiceNotes = voiceNotes.filter(n => n.id !== noteId);
    AppData.saveTaskData(taskId, 'voiceNotes', voiceNotes);
    renderVoiceNotes(taskId);
    showToast('Voice note deleted', 'success');
}

// QR Scanner functions
let qrScanner = null;
let isQRScannerActive = false;

function toggleQRScanner(taskId) {
    const container = document.getElementById(`qrScanner${taskId}`);
    
    if (isQRScannerActive) {
        // Stop scanner
        if (qrScanner) {
            qrScanner.stop().then(() => {
                qrScanner.clear();
                qrScanner = null;
            }).catch(err => console.error('Error stopping scanner:', err));
        }
        container.style.display = 'none';
        isQRScannerActive = false;
        showToast('Scanner lukket', 'info');
    } else {
        // Start scanner
        container.style.display = 'block';
        startQRScanner(taskId);
        isQRScannerActive = true;
        showToast('📷 Scanner startet', 'info');
    }
}

function startQRScanner(taskId) {
    const readerId = `qrReader${taskId}`;
    
    qrScanner = new Html5Qrcode(readerId);
    
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };
    
    qrScanner.start(
        { facingMode: "environment" }, // Use back camera
        config,
        (decodedText, decodedResult) => {
            handleQRScan(taskId, decodedText);
        },
        (errorMessage) => {
            // Ignore scanning errors (happens continuously while scanning)
        }
    ).catch(err => {
        console.error('Error starting QR scanner:', err);
        showToast('❌ Could not start camera', 'error');
        
        // Fallback: show manual input
        showManualEquipmentInput(taskId);
    });
}

function handleQRScan(taskId, qrData) {
    // Stop scanner after successful scan
    if (qrScanner) {
        qrScanner.stop().then(() => {
            qrScanner.clear();
            qrScanner = null;
        });
    }
    
    const container = document.getElementById(`qrScanner${taskId}`);
    container.style.display = 'none';
    isQRScannerActive = false;
    
    // Parse QR code data
    let equipment = {
        id: generateId(),
        qrCode: qrData,
        timestamp: new Date().toISOString()
    };
    
    try {
        // Try to parse as JSON if it's structured data
        const parsed = JSON.parse(qrData);
        equipment = { ...equipment, ...parsed };
    } catch {
        // Plain text QR code
        equipment.name = qrData;
    }
    
    // Save equipment
    const scannedEquipment = AppData.getTaskData(taskId, 'scannedEquipment', []);
    scannedEquipment.push(equipment);
    AppData.saveTaskData(taskId, 'scannedEquipment', scannedEquipment);
    
    // Update display
    renderScannedEquipment(taskId);
    
    showToast(`✅ Udstyr scannet: ${equipment.name || qrData}`, 'success', 4000);
    vibrate(50);
    
    ActivityLogger.log('qr_scan', `Scannede udstyr: ${equipment.name || qrData}`, taskId);
}

function renderScannedEquipment(taskId) {
    const container = document.getElementById(`scannedEquipment${taskId}`);
    const scannedEquipment = AppData.getTaskData(taskId, 'scannedEquipment', []);
    
    if (scannedEquipment.length === 0) {
        container.innerHTML = '<div class="empty-state-small"><p>No equipment scanned</p></div>';
        return;
    }
    
    container.innerHTML = scannedEquipment.map(eq => `
        <div class="scanned-item">
            <div class="scanned-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                    <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                </svg>
            </div>
            <div class="scanned-info">
                <div class="scanned-name">${eq.name || eq.qrCode}</div>
                <div class="scanned-time">${formatPhotoTimestamp(eq.timestamp)}</div>
                ${eq.serialNumber ? `<div class="scanned-serial">S/N: ${eq.serialNumber}</div>` : ''}
            </div>
            <button class="button-icon-small" onclick="deleteScannedEquipment(${taskId}, '${eq.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
}

function deleteScannedEquipment(taskId, equipmentId) {
    let scannedEquipment = AppData.getTaskData(taskId, 'scannedEquipment', []);
    scannedEquipment = scannedEquipment.filter(e => e.id !== equipmentId);
    AppData.saveTaskData(taskId, 'scannedEquipment', scannedEquipment);
    renderScannedEquipment(taskId);
    showToast('Equipment removed', 'success');
}

function showManualEquipmentInput(taskId) {
    const equipmentCode = prompt('Enter equipment code manually:');
    if (equipmentCode) {
        handleQRScan(taskId, equipmentCode);
    }
}

// Signature functions
let signaturePad = null;

function initSignaturePad(taskId) {
    signaturePad = new SignaturePad(`signatureCanvas${taskId}`);
    
    // Load saved signature
    const savedSignature = AppData.getTaskData(taskId, 'signature');
    if (savedSignature) {
        const canvas = document.getElementById(`signatureCanvas${taskId}`);
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        };
        img.src = savedSignature;
        signaturePad.hasSignature = true;
    }
}

function clearSignature(taskId) {
    if (signaturePad) {
        signaturePad.clear();
        AppData.saveTaskData(taskId, 'signature', null);
        showToast('Signature cleared', 'info');
    }
}

function saveSignature(taskId) {
    if (signaturePad && !signaturePad.isEmpty()) {
        const signatureData = signaturePad.getDataURL();
        AppData.saveTaskData(taskId, 'signature', signatureData);
        ActivityLogger.log('signature', 'Customer signature received', taskId);t', taskId);
        return true;
    }
    return false;
}

router.register('/order-detail', renderOrderDetailPage);
