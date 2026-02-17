// Order Detail Page
function renderOrderDetailPage(data) {
    const taskId = data.taskId;
    const task = AppData.getTask(taskId);
    
    if (!task) {
        showToast('Ordre ikke fundet', 'error');
        router.navigate('/orders');
        return;
    }
    
    // Load saved data
    const materials = AppData.getTaskData(taskId, 'materials', []);
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
                    <h1>Ordre ${task.orderNumber}</h1>
                    <span class="header-subtitle">${task.title}</span>
                </div>
                <button class="header-action" onclick="shareOrder(${taskId})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
            </div>

            <div class="page-content">
                <!-- Status Banner -->
                <div class="status-banner status-banner-${task.status}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${getStatusText(task.status)}</span>
                </div>

                <!-- Customer Info Card -->
                <div class="info-card">
                    <div class="info-card-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <h3>Kunde</h3>
                    </div>
                    <div class="customer-info">
                        <div class="customer-name">${task.customer.name}</div>
                        <div class="customer-actions">
                            <button class="icon-button" onclick="callCustomer('${task.customer.phone}')">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                Ring
                            </button>
                            <button class="icon-button" onclick="emailCustomer('${task.customer.email}')">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                Email
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Location Card -->
                <div class="info-card">
                    <div class="info-card-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <h3>Lokation</h3>
                    </div>
                    <div class="location-info">
                        <div class="location-address">${task.location.address}</div>
                        <button class="button-secondary" onclick="navigateToLocation('${task.location.address}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                            </svg>
                            Start navigation
                        </button>
                    </div>
                </div>

                <!-- Description -->
                <div class="info-card">
                    <div class="info-card-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <h3>Beskrivelse</h3>
                    </div>
                    <p class="task-description">${task.description}</p>
                </div>

                <!-- Quick Start Button -->
                ${task.status === 'pending' ? `
                    <button class="button-primary button-large" onclick="startTask(${taskId})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Start opgave
                    </button>
                ` : ''}

                <!-- Time Registration -->
                <div class="section-card">
                    <div class="section-card-header">
                        <h3>Tidsregistrering</h3>
                        <button class="button-text" onclick="setTimeNow('start', ${taskId})">Nu</button>
                    </div>
                    
                    <div class="time-inputs-modern">
                        <div class="time-input-modern">
                            <label>Start</label>
                            <div class="time-picker">
                                <input type="number" id="startHour" min="0" max="23" placeholder="00" onchange="updateTaskTime(${taskId})" class="time-number">
                                <span class="time-separator">:</span>
                                <input type="number" id="startMinute" min="0" max="59" placeholder="00" onchange="updateTaskTime(${taskId})" class="time-number">
                            </div>
                        </div>
                        
                        <div class="time-input-modern">
                            <label>Slut</label>
                            <div class="time-picker">
                                <input type="number" id="endHour" min="0" max="23" placeholder="00" onchange="updateTaskTime(${taskId})" class="time-number">
                                <span class="time-separator">:</span>
                                <input type="number" id="endMinute" min="0" max="59" placeholder="00" onchange="updateTaskTime(${taskId})" class="time-number">
                                <button class="time-now-btn" onclick="setTimeNow('end', ${taskId})" title="Sæt til nu">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="pause-section">
                        <div class="pause-header">
                            <label>Pause</label>
                            <button class="button-text-small" onclick="clearPause(${taskId})">Ryd</button>
                        </div>
                        <div class="time-inputs-modern">
                            <div class="time-input-modern">
                                <label class="label-small">Fra</label>
                                <div class="time-picker">
                                    <input type="number" id="pauseStartHour" min="0" max="23" placeholder="00" onchange="updateTaskTime(${taskId})" class="time-number">
                                    <span class="time-separator">:</span>
                                    <input type="number" id="pauseStartMinute" min="0" max="59" placeholder="00" onchange="updateTaskTime(${taskId})" class="time-number">
                                </div>
                            </div>
                            
                            <div class="time-input-modern">
                                <label class="label-small">Til</label>
                                <div class="time-picker">
                                    <input type="number" id="pauseEndHour" min="0" max="23" placeholder="00" onchange="updateTaskTime(${taskId})" class="time-number">
                                    <span class="time-separator">:</span>
                                    <input type="number" id="pauseEndMinute" min="0" max="59" placeholder="00" onchange="updateTaskTime(${taskId})" class="time-number">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="time-summary">
                        <div class="time-summary-row">
                            <span>Arbejdstid</span>
                            <span id="workTimeDisplay" class="time-value">0:00</span>
                        </div>
                        <div class="time-summary-row">
                            <span>Pause</span>
                            <span id="pauseTimeDisplay" class="time-value">0:00</span>
                        </div>
                        <div class="time-total-row">
                            <span>Total</span>
                            <span id="totalTime" class="time-value-large">0:00</span>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div class="section-card">
                    <h3>Noter</h3>
                    <textarea 
                        id="taskNotes" 
                        class="notes-textarea" 
                        placeholder="Tilføj noter til opgaven..."
                        oninput="saveTaskNotes(${taskId})"
                    >${notes}</textarea>
                </div>

                <!-- Materials -->
                <div class="section-card">
                    <div class="section-card-header">
                        <h3>Materialer</h3>
                        <button class="button-icon" onclick="openMaterialModal(${taskId})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="materials-list" id="materialsList">
                        ${materials.length === 0 ? `
                            <div class="empty-state-small">
                                <p>Ingen materialer tilføjet endnu</p>
                            </div>
                        ` : materials.map(mat => `
                            <div class="material-item">
                                <div class="material-info">
                                    <div class="material-name">${mat.name}</div>
                                    <div class="material-quantity">${mat.quantity} ${mat.unit}</div>
                                </div>
                                <button class="button-delete" onclick="deleteMaterial(${taskId}, '${mat.id}')">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Photos -->
                <div class="section-card">
                    <div class="section-card-header">
                        <h3>Billeder</h3>
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
                        const beforePhotos = photos.filter(p => p.type === 'before');
                        const afterPhotos = photos.filter(p => p.type === 'after');
                        const standardPhotos = photos.filter(p => !p.type || p.type === 'standard');
                        
                        if (photos.length === 0) {
                            return `<div class="empty-state-small"><p>Ingen billeder tilføjet endnu</p></div>`;
                        }
                        
                        let html = '';
                        
                        // Before photos
                        if (beforePhotos.length > 0) {
                            html += `
                                <div class="photo-section">
                                    <div class="photo-section-label before">FØR (${beforePhotos.length})</div>
                                    <div class="photos-grid">
                                        ${beforePhotos.map(photo => `
                                            <div class="photo-item">
                                                <div class="photo-type-badge before">FØR</div>
                                                <img src="${photo.data}" alt="Før foto" onclick="${photo.lat && photo.lng ? `window.open('${getGoogleMapsLink(photo.lat, photo.lng)}', '_blank')` : 'void(0)'}">
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
                        
                        // After photos
                        if (afterPhotos.length > 0) {
                            html += `
                                <div class="photo-section">
                                    <div class="photo-section-label after">EFTER (${afterPhotos.length})</div>
                                    <div class="photos-grid">
                                        ${afterPhotos.map(photo => `
                                            <div class="photo-item">
                                                <div class="photo-type-badge after">EFTER</div>
                                                <img src="${photo.data}" alt="Efter foto" onclick="${photo.lat && photo.lng ? `window.open('${getGoogleMapsLink(photo.lat, photo.lng)}', '_blank')` : 'void(0)'}">
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
                        
                        // Standard photos
                        if (standardPhotos.length > 0) {
                            html += `
                                <div class="photo-section">
                                    ${beforePhotos.length > 0 || afterPhotos.length > 0 ? `<div class="photo-section-label">ANDRE BILLEDER (${standardPhotos.length})</div>` : ''}
                                    <div class="photos-grid">
                                        ${standardPhotos.map(photo => `
                                            <div class="photo-item">
                                                <img src="${photo.data}" alt="Opgave foto" onclick="${photo.lat && photo.lng ? `window.open('${getGoogleMapsLink(photo.lat, photo.lng)}', '_blank')` : 'void(0)'}">
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
                        <h3>Tjekliste</h3>
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
                        <h3>Stemmebeskeder</h3>
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
                        <h3>Kundens signatur</h3>
                        <button class="button-text" onclick="clearSignature(${taskId})">Ryd</button>
                    </div>
                    <div class="signature-pad-container">
                        <canvas id="signatureCanvas${taskId}" class="signature-canvas"></canvas>
                        <div class="signature-hint">Tegn signatur her</div>
                    </div>
                </div>

                <!-- Complete Task Button -->
                <button class="complete-task-button" onclick="completeTask(${taskId})">
                    <div class="complete-task-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div class="complete-task-content">
                        <div class="complete-task-title">Afslut opgave</div>
                        <div class="complete-task-subtitle">Marker som færdig og send til kunde</div>
                    </div>
                </button>
            </div>
        </div>

        <!-- Material Modal -->
        <div id="materialModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Tilføj materiale</h3>
                    <button class="modal-close" onclick="closeMaterialModal()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Materiale</label>
                        <input type="text" id="materialName" list="commonMaterials" placeholder="Vælg eller skriv...">
                        <datalist id="commonMaterials">
                            ${AppData.commonMaterials.map(m => `<option value="${m.name}">`).join('')}
                        </datalist>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Antal</label>
                            <input type="number" id="materialQuantity" value="1" min="0.1" step="0.1">
                        </div>
                        <div class="form-group">
                            <label>Enhed</label>
                            <select id="materialUnit">
                                <option value="stk">Stk</option>
                                <option value="m">Meter</option>
                                <option value="m2">m²</option>
                                <option value="kg">Kg</option>
                                <option value="l">Liter</option>
                                <option value="pk">Pakke</option>
                            </select>
                        </div>
                    </div>
                    <button class="button-primary button-block" onclick="saveMaterial(${taskId})">
                        Gem materiale
                    </button>
                </div>
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
        initSignaturePad(taskId);
    }, 100);
}

// Initialize time inputs with saved data
function initializeTimeInputs(taskId, timeData) {
    // Parse start time
    if (timeData.startTime) {
        const [sH, sM] = timeData.startTime.split(':');
        document.getElementById('startHour').value = sH;
        document.getElementById('startMinute').value = sM;
    }
    
    // Parse end time
    if (timeData.endTime) {
        const [eH, eM] = timeData.endTime.split(':');
        document.getElementById('endHour').value = eH;
        document.getElementById('endMinute').value = eM;
    }
    
    // Parse pause start
    if (timeData.pauseStart) {
        const [psH, psM] = timeData.pauseStart.split(':');
        document.getElementById('pauseStartHour').value = psH;
        document.getElementById('pauseStartMinute').value = psM;
    }
    
    // Parse pause end
    if (timeData.pauseEnd) {
        const [peH, peM] = timeData.pauseEnd.split(':');
        document.getElementById('pauseEndHour').value = peH;
        document.getElementById('pauseEndMinute').value = peM;
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
        showToast('Udfyld venligst alle felter', 'error');
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
    ActivityLogger.log('material', `Tilføjede ${quantity} ${unit} ${name}`, taskId);
    
    closeMaterialModal();
    showToast('Materiale tilføjet', 'success');
    
    // Refresh page
    router.navigate('/order-detail', { taskId });
}

function deleteMaterial(taskId, materialId) {
    let materials = AppData.getTaskData(taskId, 'materials', []);
    materials = materials.filter(m => m.id !== materialId);
    AppData.saveTaskData(taskId, 'materials', materials);
    showToast('Materiale slettet', 'success');
    router.navigate('/order-detail', { taskId });
}

function showPhotoTypeDialog(taskId) {
    const dialog = document.createElement('div');
    dialog.className = 'photo-type-dialog-overlay';
    dialog.innerHTML = `
        <div class="photo-type-dialog">
            <h3>Vælg billedtype</h3>
            <div class="photo-type-options">
                <button class="photo-type-btn before" onclick="selectPhotoType(${taskId}, 'before')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>FØR</span>
                    <small>Start af arbejde</small>
                </button>
                <button class="photo-type-btn after" onclick="selectPhotoType(${taskId}, 'after')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>EFTER</span>
                    <small>Færdigt arbejde</small>
                </button>
                <button class="photo-type-btn standard" onclick="selectPhotoType(${taskId}, 'standard')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>STANDARD</span>
                    <small>Generelt billede</small>
                </button>
            </div>
            <button class="dialog-cancel" onclick="this.closest('.photo-type-dialog-overlay').remove()">
                Annuller
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
        showToast('GPS ikke tilgængelig - billeder uploades uden lokation', 'warning', 4000);
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
                                showToast('📍 Lokation gemt: ' + address, 'success', 3000);
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
                    showToast('GPS blev afvist eller er ikke tilgængelig', 'warning', 3000);
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
                    ActivityLogger.log('photo', `Tilføjede ${fileArray.length} billede(r)`, taskId);
                    showToast(`${fileArray.length} billede(r) tilføjet`, 'success', 3000);
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
                        showToast('📦 Lagerplads fuld! Slet gamle billeder eller ryd data', 'error', 6000);
                    } else {
                        showToast('Fejl ved gemning af billeder', 'error', 5000);
                    }
                }
            }
        }).catch(error => {
            console.error('Komprimeringsfejl for ' + file.name, error);
            showToast('Fejl ved komprimering af billede', 'error', 5000);
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

function startTask(taskId) {
    AppData.updateTask(taskId, { status: 'active' });
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    document.getElementById('startHour').value = hours;
    document.getElementById('startMinute').value = minutes;
    updateTaskTime(taskId);
    
    const task = AppData.getTask(taskId);
    ActivityLogger.log('start', `Startede opgave ${task.orderNumber}`, taskId);
    
    showToast('Opgave startet!', 'success');
    vibrate(50);
    router.navigate('/order-detail', { taskId });
}

function completeTask(taskId) {
    // Check checklist progress
    const progress = ChecklistManager.getProgress(taskId);
    if (progress.percentage < 80) {
        if (!window.confirm(`Tjeklisten er kun ${progress.percentage}% færdig. Vil du fortsætte?`)) {
            return;
        }
    }
    
    // Save signature if present
    if (signaturePad && !signaturePad.isEmpty()) {
        saveSignature(taskId);
    }
    
    if (window.confirm('Er du sikker på at opgaven er færdig?')) {
        AppData.updateTask(taskId, { status: 'completed' });
        ActivityLogger.log('complete', 'Ordre afsluttet', taskId);
        showToast('Opgave afsluttet! 🎉', 'success');
        vibrate([50, 100, 50]);
        setTimeout(() => router.navigate('/orders'), 1000);
    }
}

function callCustomer(phone) {
    showToast(`Ringer til ${phone}`, 'info');
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
        
        showToast('Optagelse startet...', 'info');
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
        ActivityLogger.log('voice', `Tilføjede stemmebesked (${duration}s)`, taskId);
        
        renderVoiceNotes(taskId);
        showToast('Stemmebesked gemt!', 'success');
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
                <p>Ingen stemmebeskeder endnu</p>
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
    showToast('Stemmebesked slettet', 'success');
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
        showToast('Signatur ryddet', 'info');
    }
}

function saveSignature(taskId) {
    if (signaturePad && !signaturePad.isEmpty()) {
        const signatureData = signaturePad.getDataURL();
        AppData.saveTaskData(taskId, 'signature', signatureData);
        ActivityLogger.log('signature', 'Kundens signatur modtaget', taskId);
        return true;
    }
    return false;
}

router.register('/order-detail', renderOrderDetailPage);
