// Work Note Page - Shows materials used for the task
function renderWorkNotePage(data) {
    const taskId = data.taskId;
    const task = AppData.getTask(taskId);
    
    if (!task) {
        showToast('Order not found', 'error');
        router.navigate('/orders');
        return;
    }
    
    // Load saved materials
    const materials = AppData.getTaskData(taskId, 'materials', []);
    
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
                <!-- Task Info Card -->
                <div class="info-card">
                    <div class="info-row">
                        <span class="info-label">Order number</span>
                        <span class="info-value">#${task.orderNumber}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Type</span>
                        <span class="info-value">${task.type}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Customer</span>
                        <span class="info-value">${task.customer.name}</span>
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

// Open material modal from work note page
function openMaterialModalFromWorkNote(taskId) {
    const modal = document.getElementById('materialModal');
    modal.style.display = 'flex';
    modal.dataset.taskId = taskId;
    
    // Clear form
    document.getElementById('materialName').value = '';
    document.getElementById('materialQuantity').value = '1';
    
    // Focus on name input
    setTimeout(() => document.getElementById('materialName').focus(), 100);
}

// Close material modal from work note page
function closeMaterialModalFromWorkNote() {
    const modal = document.getElementById('materialModal');
    modal.style.display = 'none';
}

// Save material from work note page
function saveMaterialFromWorkNote(taskId) {
    const name = document.getElementById('materialName').value.trim();
    const quantity = parseFloat(document.getElementById('materialQuantity').value);
    const unit = 'stk';
    
    if (!name) {
        showToast('Please enter a material name', 'error');
        return;
    }
    
    if (!quantity || quantity <= 0) {
        showToast('Please enter a valid quantity', 'error');
        return;
    }
    
    // Get existing materials
    const materials = AppData.getTaskData(taskId, 'materials', []);
    
    // Add new material
    const material = {
        id: Date.now().toString(),
        name: name,
        quantity: quantity,
        unit: unit,
        addedAt: new Date().toISOString()
    };
    
    materials.push(material);
    
    // Save to storage
    AppData.saveTaskData(taskId, 'materials', materials);
    
    // Close modal and refresh page
    closeMaterialModalFromWorkNote();
    showToast('Material added', 'success');
    
    // Refresh the page
    renderWorkNotePage({ taskId });
}

// Delete material from work note page
function deleteMaterialFromWorkNote(taskId, materialId) {
    if (!confirm('Delete this material?')) {
        return;
    }
    
    // Get existing materials
    const materials = AppData.getTaskData(taskId, 'materials', []);
    
    // Filter out the material to delete
    const updatedMaterials = materials.filter(m => m.id !== materialId);
    
    // Save to storage
    AppData.saveTaskData(taskId, 'materials', updatedMaterials);
    
    showToast('Material deleted', 'success');
    
    // Refresh the page
    renderWorkNotePage({ taskId });
}

// Complete work note and return to home
function completeWorkNote(taskId) {
    const materials = AppData.getTaskData(taskId, 'materials', []);
    
    if (materials.length === 0) {
        if (!confirm('No materials added. Continue anyway?')) {
            return;
        }
    }
    
    // Mark task as completed (optional)
    showToast('Work note saved!', 'success');
    
    // Navigate back to home or orders
    setTimeout(() => {
        router.navigate('/');
    }, 800);
}

// Register route
router.register('/work-note', renderWorkNotePage);
