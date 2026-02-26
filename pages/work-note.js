// Work Note Page - Shows materials used for the task
function renderWorkNotePage(data) {
    const taskId = data.taskId;
    const task = AppData.getTask(taskId);
    
    if (!task) {
        showToast('Order not found', 'error');
        router.navigate('/orders');
        return;
    }
    
    const materials = AppData.getTaskData(taskId, 'materials', []);
    const timeEntries = AppData.getTaskData(taskId, 'workerTimeEntries', []);

    const WORKERS = ['Kenneth Larsen', 'Alexander Petersen'];

    function renderTimeEntries(entries) {
        if (entries.length === 0) return `
            <div class="empty-state-small">
                <p>No time entries yet</p>
                <small>Select a worker and fill in times above</small>
            </div>`;
        return entries.map(e => {
            const startMins = timeToMins(e.start);
            const endMins = timeToMins(e.end);
            const total = Math.max(0, endMins - startMins - (parseInt(e.pause) || 0));
            const h = Math.floor(total / 60);
            const m = total % 60;
            const totalStr = h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
            return `
            <div class="worker-time-entry">
                <div class="worker-time-entry-left">
                    <div class="worker-time-name">${e.worker}</div>
                </div>
                <div class="worker-time-entry-right">
                    <div class="worker-time-meta">
                        <span class="worker-time-badge">${e.start} – ${e.end}</span>
                        <span class="worker-time-pause">Pause: ${parseInt(e.pause) || 0} min</span>
                        <span class="worker-time-total">${totalStr}</span>
                    </div>
                    <button class="button-delete" onclick="deleteWorkerTimeEntry(${taskId}, '${e.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>`;
        }).join('');
    }

    const content = `
        <div class="page page-work-note">
            <div class="page-header page-header-with-back">
                <button class="back-button" onclick="router.navigate('/order-detail', { taskId: ${taskId} })">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <div class="header-title">
                    <h1>Work Note</h1>
                    <span class="header-subtitle">${task.location.address}</span>
                </div>
            </div>

            <div class="page-content">

                <!-- Time Registration -->
                <div class="section-card">
                    <div class="section-card-header">
                        <h3>Time Registration</h3>
                    </div>

                    <!-- Worker selector -->
                    <div class="form-group" style="margin-bottom: 12px;">
                        <label>Worker</label>
                        <select id="workerSelect" class="worker-select">
                            ${WORKERS.map(w => `<option value="${w}">${w}</option>`).join('')}
                        </select>
                    </div>

                    <!-- Time inputs -->
                    <div class="form-row" style="gap: 10px; margin-bottom: 12px;">
                        <div class="form-group" style="flex:1;">
                            <label>Start</label>
                            <input type="time" id="workerStart" value="08:00">
                        </div>
                        <div class="form-group" style="flex:1;">
                            <label>End</label>
                            <input type="time" id="workerEnd" value="16:00">
                        </div>
                        <div class="form-group" style="flex: 0 0 80px;">
                            <label>Pause (min)</label>
                            <input type="number" id="workerPause" value="0" min="0" step="5" style="text-align:center;">
                        </div>
                    </div>

                    <button class="button-primary button-block" onclick="addWorkerTimeEntry(${taskId})">
                        + Add time entry
                    </button>

                    <!-- Saved entries -->
                    <div id="workerTimeList" style="margin-top: 16px;">
                        ${renderTimeEntries(timeEntries)}
                    </div>
                </div>

                <!-- Materials Used -->
                <div class="section-card">
                    <div class="section-card-header">
                        <h3>Materials used</h3>
                        <button class="button-icon" onclick="openMaterialModalFromWorkNote(${taskId})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="materials-list" id="workNoteMaterialsList">
                        ${materials.length === 0 ? `
                    <div class="empty-state-small">
                                <p>No materials added yet</p>
                                <small>Tap + to add materials</small>
                            </div>
                        ` : `
                            <div class="materials-summary">
                                ${materials.map(mat => `
                                    <div class="material-item">
                                        <div class="material-info">
                                            <div class="material-name">${mat.name}</div>
                                            <div class="material-quantity">${mat.quantity} ${mat.unit}</div>
                                        </div>
                                        <button class="button-delete" onclick="deleteMaterialFromWorkNote(${taskId}, '${mat.id}')">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="button-group">
                    <button class="button-secondary" onclick="router.navigate('/order-detail', { taskId: ${taskId} })">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back to task
                    </button>
                    <button class="button-primary" onclick="completeWorkNote(${taskId})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Save &amp; close
                    </button>
                </div>
            </div>
        </div>

        <!-- Material Modal -->
        <div id="materialModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add material</h3>
                    <button class="modal-close" onclick="closeMaterialModalFromWorkNote()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Material</label>
                        <input type="text" id="materialName" list="commonMaterials" placeholder="Select or type...">
                        <datalist id="commonMaterials">
                            ${(() => {
                                const jobTypes = getFromStorage('admin_job_types', []);
                                const activeId = getFromStorage('admin_active_job_type', 1);
                                const jt = jobTypes.find(j => j.id === activeId) || jobTypes[0];
                                return ((jt && jt.materials) || []).map(m => `<option value="${m.name}">`).join('');
                            })()}
                        </datalist>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Quantity</label>
                            <input type="number" id="materialQuantity" value="1" min="0.1" step="0.1">
                        </div>
                    </div>
                    <button class="button-primary button-block" onclick="saveMaterialFromWorkNote(${taskId})">
                        Save material
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
}

// Helper: convert HH:MM to minutes
function timeToMins(t) {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

// Add worker time entry
function addWorkerTimeEntry(taskId) {
    const worker = document.getElementById('workerSelect').value;
    const start = document.getElementById('workerStart').value;
    const end = document.getElementById('workerEnd').value;
    const pause = parseInt(document.getElementById('workerPause').value) || 0;

    if (!start || !end) {
        showToast('Please fill in start and end time', 'error');
        return;
    }
    if (timeToMins(end) <= timeToMins(start)) {
        showToast('End time must be after start time', 'error');
        return;
    }

    const entries = AppData.getTaskData(taskId, 'workerTimeEntries', []);
    entries.push({ id: Date.now().toString(), worker, start, end, pause, addedAt: new Date().toISOString() });
    AppData.saveTaskData(taskId, 'workerTimeEntries', entries);
    showToast('Time entry added', 'success');
    renderWorkNotePage({ taskId });
}

// Delete worker time entry
function deleteWorkerTimeEntry(taskId, entryId) {
    let entries = AppData.getTaskData(taskId, 'workerTimeEntries', []);
    entries = entries.filter(e => e.id !== entryId);
    AppData.saveTaskData(taskId, 'workerTimeEntries', entries);
    showToast('Entry deleted', 'success');
    renderWorkNotePage({ taskId });
}

// Open material modal from work note page
function openMaterialModalFromWorkNote(taskId) {
    const modal = document.getElementById('materialModal');
    modal.style.display = 'flex';
    modal.dataset.taskId = taskId;
    document.getElementById('materialName').value = '';
    document.getElementById('materialQuantity').value = '1';
    setTimeout(() => document.getElementById('materialName').focus(), 100);
}

// Close material modal from work note page
function closeMaterialModalFromWorkNote() {
    document.getElementById('materialModal').style.display = 'none';
}

// Save material from work note page
function saveMaterialFromWorkNote(taskId) {
    const name = document.getElementById('materialName').value.trim();
    const quantity = parseFloat(document.getElementById('materialQuantity').value);
    const unit = 'stk';
    
    if (!name) { showToast('Please enter a material name', 'error'); return; }
    if (!quantity || quantity <= 0) { showToast('Please enter a valid quantity', 'error'); return; }
    
    const materials = AppData.getTaskData(taskId, 'materials', []);
    materials.push({ id: Date.now().toString(), name, quantity, unit, addedAt: new Date().toISOString() });
    AppData.saveTaskData(taskId, 'materials', materials);
    closeMaterialModalFromWorkNote();
    showToast('Material added', 'success');
    renderWorkNotePage({ taskId });
}

// Delete material from work note page
function deleteMaterialFromWorkNote(taskId, materialId) {
    const materials = AppData.getTaskData(taskId, 'materials', []).filter(m => m.id !== materialId);
    AppData.saveTaskData(taskId, 'materials', materials);
    showToast('Material deleted', 'success');
    renderWorkNotePage({ taskId });
}

// Complete work note and return to home
function completeWorkNote(taskId) {
    showToast('Work note saved!', 'success');
    setTimeout(() => router.navigate('/'), 800);
}

// Register route
router.register('/work-note', renderWorkNotePage);
