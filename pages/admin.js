// Admin Page - Manage job types with checklists and photo categories

const DEFAULT_MATERIALS = [
    { name: 'Blowing up to 24SM pr meter', category: 'Construction', unit: 'SDU' },
    { name: 'Blowing 96SM pr meter', category: 'Construction', unit: 'SDU' },
    { name: 'z\u00fcss\u00e4tzliche Fasern f\u00fcr MFH', category: 'Installation', unit: 'SDU' },
    { name: 'Patch Only', category: 'Installation', unit: 'SDU' },
    { name: 'Price per meter Unsealed', category: 'Construction', unit: 'SDU' },
    { name: 'Hourly rate - Construction', category: 'Installation', unit: 'SDU' },
    { name: 'House inspection - Status 102', category: 'Installation', unit: 'SDU' },
    { name: 'House inspection - Status 108', category: 'Installation', unit: 'SDU' },
    { name: 'Trees', category: 'Construction', unit: 'SDU' },
    { name: 'Price per meter Paving', category: 'Construction', unit: 'SDU' },
    { name: 'Hourly rate - Technichian', category: 'Installation', unit: 'SDU' },
    { name: 'Activation - Status 100', category: 'Installation', unit: 'SDU' },
    { name: 'Mosaik', category: 'Construction', unit: 'SDU' },
    { name: 'Construction - Status 109 - Blowing only', category: 'Construction', unit: 'SDU' },
    { name: 'Construction - Status 107', category: 'Construction', unit: 'SDU' },
    { name: 'House installation - Status 101', category: 'Installation', unit: 'SDU' },
    { name: 'Extra manhole secured/unsecured', category: 'Construction', unit: 'SDU' },
    { name: 'Nachr\u00fcsten GF-TA', category: 'Installation', unit: 'SDU' },
    { name: 'Extra manhole asphalt', category: 'Construction', unit: 'SDU' }
];

const DEFAULT_JOB_TYPES = [
    {
        id: 1,
        name: 'Service',
        checklistItems: [
            'Arrived at address',
            'Tools and materials ready',
            'Customer briefing',
            'Work completed',
            'Cleanup',
            'Handover to customer'
        ],
        photoCategories: [
            'Pre-existing damages in the work area image 1',
            'Pre-existing damages in the work area image 2',
            'Pre-existing damages in the work area image 3',
            'Pre-existing damages in the work area image 4',
            'Planned route from street to house wall image 1',
            'Planned route from street to house wall image 2',
            'Planned route from street to house wall image 3',
            'Planned route from street to house wall image 4',
            'Building entry point image 1',
            'Building entry point image 2',
            'Internal cable routing image 1',
            'Internal cable routing image 2',
            'Internal cable routing image 3',
            'Internal cable routing image 4',
            'Customer device placement image 1',
            'Customer device placement image 2',
            'Hidden objects - if any image 1',
            'Hidden objects - if any image 2'
        ],
        surveyQuestions: [
            {
                id: 1,
                question: 'Was the owner present?',
                type: 'yesno',
                required: true
            }
        ],
        materials: DEFAULT_MATERIALS
    }
];

function getJobTypes() {
    const stored = getFromStorage('admin_job_types', null);
    if (!stored || stored.length === 0) {
        saveToStorage('admin_job_types', DEFAULT_JOB_TYPES);
        return DEFAULT_JOB_TYPES;
    }
    // Migration: add materials to job types that don't have them yet
    let migrated = false;
    stored.forEach(jt => {
        if (!jt.materials) {
            const globalMats = getFromStorage('admin_common_materials', null);
            jt.materials = globalMats || DEFAULT_MATERIALS;
            migrated = true;
        }
    });
    if (migrated) saveToStorage('admin_job_types', stored);
    return stored;
}

function renderAdminPage() {
    // Load job types from localStorage (with defaults saved on first run)
    const jobTypes = getJobTypes();
    
    const activeJobTypeId = getFromStorage('admin_active_job_type', 1);
    
    const content = `
        <div class="page page-admin">
            <div class="page-header page-header-with-back">
                <button class="back-button" onclick="router.navigate('/more')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <div class="header-title">
                    <h1>Administrator</h1>
                    <span class="header-subtitle">Manage system settings</span>
                </div>
            </div>

            <div class="page-content">
                <!-- Job Types Management -->
                <div class="admin-section">
                    <div class="admin-section-header">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 7h-9"></path>
                                <path d="M14 17H5"></path>
                                <circle cx="17" cy="17" r="3"></circle>
                                <circle cx="7" cy="7" r="3"></circle>
                            </svg>
                            Job Types
                        </h3>
                        <button class="button-primary-sm" onclick="openAddJobTypeDialog()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add
                        </button>
                    </div>
                    <div class="admin-list" id="jobTypesList">
                        ${jobTypes.length === 0 ? `
                            <div class="empty-state-small">
                                <p>No job types created</p>
                            </div>
                        ` : jobTypes.map((jobType, index) => `
                            <div class="admin-list-item ${jobType.id === activeJobTypeId ? 'active-job-type' : ''}">
                                <div class="admin-item-icon" style="background: ${jobType.id === activeJobTypeId ? '#E3F2FD' : '#F5F5F5'};">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="${jobType.id === activeJobTypeId ? '#2196F3' : '#666'}">
                                        <path d="M20 7h-9"></path>
                                        <path d="M14 17H5"></path>
                                        <circle cx="17" cy="17" r="3"></circle>
                                        <circle cx="7" cy="7" r="3"></circle>
                                    </svg>
                                </div>
                                <div class="admin-item-content">
                                    <div class="admin-item-title">${jobType.name} ${jobType.id === activeJobTypeId ? '<span style="color: #2196F3; font-size: 11px; font-weight: 600;">(ACTIVE)</span>' : ''}</div>
                                    <div class="admin-item-subtitle">${jobType.checklistItems.length} checklist • ${jobType.photoCategories.length} photos • ${(jobType.surveyQuestions || []).length} questions • ${(jobType.materials || []).length} materials</div>
                                </div>
                                <div class="admin-item-actions">
                                    ${jobType.id !== activeJobTypeId ? `
                                        <button class="button-icon-sm" onclick="setActiveJobType(${jobType.id})" title="Set as active">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <circle cx="12" cy="12" r="10"></circle>
                                            </svg>
                                        </button>
                                    ` : ''}
                                    <button class="button-icon-sm" onclick="editJobType(${index})">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                    <button class="button-icon-sm button-danger" onclick="deleteJobType(${index})">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Stats -->
                <div class="admin-stats">
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #E3F2FD;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#1976D2">
                                <path d="M20 7h-9"></path>
                                <path d="M14 17H5"></path>
                                <circle cx="17" cy="17" r="3"></circle>
                                <circle cx="7" cy="7" r="3"></circle>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${jobTypes.length}</div>
                            <div class="stat-label">Job Types</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Job Type Modal -->
        <div id="jobTypeModal" class="modal">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3 id="jobTypeModalTitle">Add Job Type</h3>
                    <button class="modal-close" onclick="closeJobTypeModal()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Job Type Name</label>
                        <input type="text" id="jobTypeName" placeholder="e.g. Electrical Work">
                    </div>
                    
                    <div class="form-group">
                        <label>Checklist Items (one per line)</label>
                        <textarea id="jobTypeChecklist" rows="6" placeholder="Arrived at address
Tools and materials ready
Customer briefing
Work completed
Cleanup
Handover to customer"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Photo Categories (one per line)</label>
                        <textarea id="jobTypePhotos" rows="4" placeholder="Before work
During work
After work"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Survey Questions</label>
                        <button type="button" class="button-secondary" style="width: 100%;" onclick="openSurveyManager()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 18px; height: 18px; margin-right: 8px;">
                                <path d="M9 11l3 3L22 4"></path>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                            Manage Questions (<span id="surveyCount">0</span>)
                        </button>
                        <input type="hidden" id="jobTypeSurveyData" value="[]">
                    </div>

                    <div class="form-group">
                        <label>Standard Materials</label>
                        <button type="button" class="button-secondary" style="width: 100%;" onclick="openMaterialManager()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 18px; height: 18px; margin-right: 8px;">
                                <rect x="1" y="3" width="15" height="13"></rect>
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                            Manage Materials (<span id="materialCount">0</span>)
                        </button>
                        <input type="hidden" id="jobTypeMaterialsData" value="[]">
                    </div>

                    <input type="hidden" id="jobTypeIndex" value="-1">
                    <div class="button-group">
                        <button class="button-secondary" onclick="closeJobTypeModal()">Cancel</button>
                        <button class="button-primary" onclick="saveJobType()">Save</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Material Manager Modal -->
        <div id="materialManagerModal" class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>Standard Materials</h3>
                    <button class="modal-close" onclick="closeMaterialManager()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: var(--spacing-lg);">
                        <button class="button-primary-sm" onclick="openEditMaterialItem(-1)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Material
                        </button>
                    </div>
                    <div id="materialManagerList" style="max-height: 400px; overflow-y: auto;">
                        <!-- Rendered by JS -->
                    </div>
                    <div class="button-group" style="margin-top: var(--spacing-lg);">
                        <button class="button-secondary" onclick="closeMaterialManager()">Close</button>
                        <button class="button-primary" onclick="saveJobTypeMaterials()">Save</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Material Item Modal -->
        <div id="editMaterialItemModal" class="modal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3 id="editMaterialItemTitle">Add Material</h3>
                    <button class="modal-close" onclick="closeEditMaterialItem()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="jtMaterialName" placeholder="e.g. Cable 10m">
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <input type="text" id="jtMaterialCategory" placeholder="e.g. Construction">
                    </div>
                    <div class="form-group">
                        <label>Unit</label>
                        <select id="jtMaterialUnit">
                            <option value="SDU">SDU</option>
                            <option value="stk">Pieces</option>
                            <option value="m">Meters</option>
                            <option value="m2">m²</option>
                            <option value="kg">Kg</option>
                            <option value="l">Liters</option>
                            <option value="pk">Package</option>
                        </select>
                    </div>
                    <input type="hidden" id="jtMaterialIndex" value="-1">
                    <div class="button-group">
                        <button class="button-secondary" onclick="closeEditMaterialItem()">Cancel</button>
                        <button class="button-primary" onclick="saveJobTypeMaterialItem()">Save</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Survey Manager Modal -->
        <div id="surveyManagerModal" class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>Survey Questions</h3>
                    <button class="modal-close" onclick="closeSurveyManager()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: var(--spacing-lg);">
                        <button class="button-primary-sm" onclick="addSurveyQuestion()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Question
                        </button>
                    </div>
                    
                    <div id="surveyQuestionsList" style="max-height: 400px; overflow-y: auto;">
                        <!-- Survey questions will be rendered here -->
                    </div>
                    
                    <div class="button-group" style="margin-top: var(--spacing-lg);">
                        <button class="button-secondary" onclick="closeSurveyManager()">Close</button>
                        <button class="button-primary" onclick="saveSurveyQuestions()">Save</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Survey Question Modal -->
        <div id="editSurveyQuestionModal" class="modal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3 id="editSurveyQuestionTitle">Edit Question</h3>
                    <button class="modal-close" onclick="closeEditSurveyQuestion()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Question</label>
                        <input type="text" id="surveyQuestionText" placeholder="e.g. Was the owner present?">
                    </div>
                    
                    <div class="form-group">
                        <label>Answer Type</label>
                        <select id="surveyQuestionType" onchange="handleSurveyTypeChange()">
                            <option value="yesno">Yes/No</option>
                            <option value="choice">Multiple Choice</option>
                            <option value="text">Text (fritekst)</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="surveyChoicesGroup" style="display: none;">
                        <label>Choices (one per line)</label>
                        <textarea id="surveyChoices" rows="4" placeholder="Option 1
Option 2
Option 3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="surveyQuestionRequired">
                            <span>Required</span>
                        </label>
                    </div>
                    
                    <input type="hidden" id="surveyQuestionIndex" value="-1">
                    
                    <div class="button-group">
                        <button class="button-secondary" onclick="closeEditSurveyQuestion()">Cancel</button>
                        <button class="button-primary" onclick="saveSurveyQuestion()">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
}

// ============================================================================
// JOB TYPE MANAGEMENT
// ============================================================================

function openAddJobTypeDialog() {
    const modal = document.getElementById('jobTypeModal');
    document.getElementById('jobTypeModalTitle').textContent = 'Add Job Type';
    document.getElementById('jobTypeName').value = '';
    document.getElementById('jobTypeChecklist').value = '';
    document.getElementById('jobTypePhotos').value = '';
    document.getElementById('jobTypeSurveyData').value = '[]';
    document.getElementById('surveyCount').textContent = '0';
    document.getElementById('jobTypeMaterialsData').value = '[]';
    document.getElementById('materialCount').textContent = '0';
    document.getElementById('jobTypeIndex').value = '-1';
    tempSurveyQuestions = []; // reset temp state
    tempMaterials = [];       // reset temp state
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('jobTypeName').focus(), 100);
}

function editJobType(index) {
    console.log('editJobType called with index:', index, 'type:', typeof index);
    const jobTypes = getJobTypes();
    console.log('jobTypes loaded:', jobTypes.length, 'items');
    console.log('jobTypes:', JSON.stringify(jobTypes));
    
    const jobType = jobTypes[index];
    console.log('jobType at index', index, ':', jobType);
    
    if (!jobType) {
        console.error('No job type found at index', index);
        showToast('Error: Job type not found', 'error');
        return;
    }
    
    const modal = document.getElementById('jobTypeModal');
    document.getElementById('jobTypeModalTitle').textContent = 'Edit Job Type';
    document.getElementById('jobTypeName').value = jobType.name;
    document.getElementById('jobTypeChecklist').value = jobType.checklistItems.join('\n');
    document.getElementById('jobTypePhotos').value = jobType.photoCategories.join('\n');
    document.getElementById('jobTypeSurveyData').value = JSON.stringify(jobType.surveyQuestions || []);
    document.getElementById('surveyCount').textContent = (jobType.surveyQuestions || []).length;
    document.getElementById('jobTypeMaterialsData').value = JSON.stringify(jobType.materials || []);
    document.getElementById('materialCount').textContent = (jobType.materials || []).length;
    document.getElementById('jobTypeIndex').value = index;
    tempSurveyQuestions = JSON.parse(JSON.stringify(jobType.surveyQuestions || [])); // deep copy
    tempMaterials = JSON.parse(JSON.stringify(jobType.materials || []));             // deep copy
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('jobTypeName').focus(), 100);
}

function closeJobTypeModal() {
    document.getElementById('jobTypeModal').style.display = 'none';
}

function saveJobType() {
    const name = document.getElementById('jobTypeName').value.trim();
    const checklistText = document.getElementById('jobTypeChecklist').value.trim();
    const photosText = document.getElementById('jobTypePhotos').value.trim();
    const index = parseInt(document.getElementById('jobTypeIndex').value);
    
    if (!name) {
        showToast('Enter job type name', 'error');
        return;
    }
    
    if (!checklistText) {
        showToast('Enter at least one checklist item', 'error');
        return;
    }
    
    if (!photosText) {
        showToast('Enter at least one photo category', 'error');
        return;
    }
    
    // Parse checklist items and photo categories from textarea
    const checklistItems = checklistText.split('\n').map(item => item.trim()).filter(item => item);
    const photoCategories = photosText.split('\n').map(cat => cat.trim()).filter(cat => cat);
    
    // Get survey questions and materials — use in-memory temp vars which are always up to date
    // Fall back to hidden field (for new job types), wrapped in try-catch against corrupt data
    let surveyQuestions = tempSurveyQuestions;
    let materials = tempMaterials;
    // If temp vars are empty but hidden field has data (e.g. page reload edge case), parse those
    try {
        const hSurvey = document.getElementById('jobTypeSurveyData').value;
        if (surveyQuestions.length === 0 && hSurvey && hSurvey !== '[]') {
            surveyQuestions = JSON.parse(hSurvey);
        }
    } catch(e) { console.warn('Survey parse error:', e); }
    try {
        const hMat = document.getElementById('jobTypeMaterialsData').value;
        if (materials.length === 0 && hMat && hMat !== '[]') {
            materials = JSON.parse(hMat);
        }
    } catch(e) { console.warn('Materials parse error:', e); }

    // For existing job types, also merge from localStorage as ultimate fallback
    const jobTypes = getJobTypes();
    if (index >= 0 && jobTypes[index]) {
        if (surveyQuestions.length === 0) surveyQuestions = jobTypes[index].surveyQuestions || [];
        if (materials.length === 0) materials = jobTypes[index].materials || [];
    }
    
    if (index >= 0) {
        // Edit existing - keep the same ID
        jobTypes[index].name = name;
        jobTypes[index].checklistItems = checklistItems;
        jobTypes[index].photoCategories = photoCategories;
        jobTypes[index].surveyQuestions = surveyQuestions;
        jobTypes[index].materials = materials;
        showToast('Job type updated', 'success');
    } else {
        // Add new - generate new ID
        const newId = jobTypes.length > 0 ? Math.max(...jobTypes.map(jt => jt.id)) + 1 : 1;
        jobTypes.push({
            id: newId,
            name: name,
            checklistItems: checklistItems,
            photoCategories: photoCategories,
            surveyQuestions: surveyQuestions,
            materials: materials
        });
        
        // If this is the first job type, make it active
        if (jobTypes.length === 1) {
            saveToStorage('admin_active_job_type', newId);
        }
        
        showToast('Job type added', 'success');
    }
    
    saveToStorage('admin_job_types', jobTypes);
    closeJobTypeModal();
    renderAdminPage();
}

function deleteJobType(index) {
    console.log('deleteJobType called with index:', index);
    const jobTypes = getJobTypes();
    const jobType = jobTypes[index];
    
    if (!jobType) {
        console.error('No job type found at index', index);
        showToast('Error: Job type not found', 'error');
        return;
    }
    
    if (jobTypes.length === 1) {
        showToast('Cannot delete the only job type', 'error');
        return;
    }
    
    if (!confirm(`Delete job type "${jobType.name}"?`)) {
        return;
    }
    
    const activeJobTypeId = getFromStorage('admin_active_job_type', 1);
    
    jobTypes.splice(index, 1);
    saveToStorage('admin_job_types', jobTypes);
    
    // If we deleted the active job type, set the first one as active
    if (jobType.id === activeJobTypeId && jobTypes.length > 0) {
        saveToStorage('admin_active_job_type', jobTypes[0].id);
    }
    
    showToast('Job type deleted', 'success');
    renderAdminPage();
}

function setActiveJobType(jobTypeId) {
    saveToStorage('admin_active_job_type', jobTypeId);
    showToast('Active job type changed', 'success');
    renderAdminPage();
}

// ============================================================================
// SURVEY MANAGEMENT
// ============================================================================

let tempSurveyQuestions = [];

// Helper: persist surveys + materials into localStorage immediately for current job type
function persistJobTypeDataNow() {
    const index = parseInt(document.getElementById('jobTypeIndex').value);
    if (index < 0) return; // new job type not saved yet
    const jobTypes = getJobTypes();
    if (!jobTypes[index]) return;
    jobTypes[index].surveyQuestions = tempSurveyQuestions;
    jobTypes[index].materials = tempMaterials;
    saveToStorage('admin_job_types', jobTypes);
}

function openSurveyManager() {
    // Load current survey questions from hidden field
    const currentData = document.getElementById('jobTypeSurveyData').value;
    tempSurveyQuestions = JSON.parse(currentData || '[]');
    
    // Show modal
    document.getElementById('surveyManagerModal').style.display = 'flex';
    renderSurveyQuestions();
}

function closeSurveyManager() {
    document.getElementById('jobTypeSurveyData').value = JSON.stringify(tempSurveyQuestions);
    document.getElementById('surveyCount').textContent = tempSurveyQuestions.length;
    persistJobTypeDataNow(); // persist to localStorage immediately
    document.getElementById('surveyManagerModal').style.display = 'none';
}

function renderSurveyQuestions() {
    const container = document.getElementById('surveyQuestionsList');
    
    if (tempSurveyQuestions.length === 0) {
        container.innerHTML = `
            <div class="empty-state-small">
                <p>No questions added yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tempSurveyQuestions.map((q, index) => {
        let typeLabel = '';
        if (q.type === 'yesno') typeLabel = 'Yes/No';
        else if (q.type === 'choice') typeLabel = `Multiple Choice (${(q.choices || []).length} options)`;
        else if (q.type === 'text') typeLabel = 'Text';
        
        return `
            <div class="admin-list-item" style="margin-bottom: var(--spacing-sm);">
                <div class="admin-item-icon" style="background: #FFF3E0;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#FF9800">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                </div>
                <div class="admin-item-content">
                    <div class="admin-item-title">${q.question} ${q.required ? '<span style="color: #f44336;">*</span>' : ''}</div>
                    <div class="admin-item-subtitle">${typeLabel}</div>
                </div>
                <div class="admin-item-actions">
                    <button class="button-icon-sm" onclick="editSurveyQuestion(${index})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="button-icon-sm button-danger" onclick="deleteSurveyQuestion(${index})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function addSurveyQuestion() {
    document.getElementById('editSurveyQuestionTitle').textContent = 'Add Question';
    document.getElementById('surveyQuestionText').value = '';
    document.getElementById('surveyQuestionType').value = 'yesno';
    document.getElementById('surveyChoices').value = '';
    document.getElementById('surveyChoicesGroup').style.display = 'none';
    document.getElementById('surveyQuestionRequired').checked = false;
    document.getElementById('surveyQuestionIndex').value = '-1';
    document.getElementById('editSurveyQuestionModal').style.display = 'flex';
}

function editSurveyQuestion(index) {
    const q = tempSurveyQuestions[index];
    document.getElementById('editSurveyQuestionTitle').textContent = 'Edit Question';
    document.getElementById('surveyQuestionText').value = q.question;
    document.getElementById('surveyQuestionType').value = q.type;
    document.getElementById('surveyQuestionRequired').checked = q.required;
    document.getElementById('surveyQuestionIndex').value = index;
    
    if (q.type === 'choice') {
        document.getElementById('surveyChoicesGroup').style.display = 'block';
        document.getElementById('surveyChoices').value = (q.choices || []).join('\n');
    } else {
        document.getElementById('surveyChoicesGroup').style.display = 'none';
    }
    
    document.getElementById('editSurveyQuestionModal').style.display = 'flex';
}

function closeEditSurveyQuestion() {
    document.getElementById('editSurveyQuestionModal').style.display = 'none';
}

function handleSurveyTypeChange() {
    const type = document.getElementById('surveyQuestionType').value;
    const choicesGroup = document.getElementById('surveyChoicesGroup');
    
    if (type === 'choice') {
        choicesGroup.style.display = 'block';
    } else {
        choicesGroup.style.display = 'none';
    }
}

function saveSurveyQuestion() {
    const question = document.getElementById('surveyQuestionText').value.trim();
    const type = document.getElementById('surveyQuestionType').value;
    const required = document.getElementById('surveyQuestionRequired').checked;
    const index = parseInt(document.getElementById('surveyQuestionIndex').value);
    
    if (!question) {
        showToast('Enter question', 'error');
        return;
    }
    
    const questionData = {
        id: index >= 0 ? tempSurveyQuestions[index].id : Date.now(),
        question: question,
        type: type,
        required: required
    };
    
    if (type === 'choice') {
        const choicesText = document.getElementById('surveyChoices').value.trim();
        if (!choicesText) {
            showToast('Enter at least one choice', 'error');
            return;
        }
        questionData.choices = choicesText.split('\n').map(c => c.trim()).filter(c => c);
    }
    
    if (index >= 0) {
        tempSurveyQuestions[index] = questionData;
        showToast('Question updated', 'success');
    } else {
        tempSurveyQuestions.push(questionData);
        showToast('Question added', 'success');
    }
    
    closeEditSurveyQuestion();
    renderSurveyQuestions();
    persistJobTypeDataNow(); // save immediately
}

function deleteSurveyQuestion(index) {
    if (!confirm('Delete this question?')) {
        return;
    }
    
    tempSurveyQuestions.splice(index, 1);
    showToast('Question deleted', 'success');
    renderSurveyQuestions();
    persistJobTypeDataNow(); // save immediately
}

function saveSurveyQuestions() {
    document.getElementById('jobTypeSurveyData').value = JSON.stringify(tempSurveyQuestions);
    document.getElementById('surveyCount').textContent = tempSurveyQuestions.length;
    persistJobTypeDataNow();
    closeSurveyManager();
    showToast('Survey questions saved', 'success');
}

// ============================================================================
// MATERIAL MANAGER (per job type)
// ============================================================================

let tempMaterials = [];

function openMaterialManager() {
    const currentData = document.getElementById('jobTypeMaterialsData').value;
    tempMaterials = JSON.parse(currentData || '[]');
    document.getElementById('materialManagerModal').style.display = 'flex';
    renderMaterialManagerList();
}

function closeMaterialManager() {
    document.getElementById('jobTypeMaterialsData').value = JSON.stringify(tempMaterials);
    document.getElementById('materialCount').textContent = tempMaterials.length;
    persistJobTypeDataNow(); // persist to localStorage immediately
    document.getElementById('materialManagerModal').style.display = 'none';
}

function renderMaterialManagerList() {
    const container = document.getElementById('materialManagerList');
    if (tempMaterials.length === 0) {
        container.innerHTML = `<div class="empty-state-small"><p>No materials added yet</p></div>`;
        return;
    }
    container.innerHTML = tempMaterials.map((m, index) => `
        <div class="admin-list-item" style="margin-bottom: var(--spacing-sm);">
            <div class="admin-item-icon" style="background: #E8F5E9;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
            </div>
            <div class="admin-item-content">
                <div class="admin-item-title">${m.name}</div>
                <div class="admin-item-subtitle">${m.category || 'Other'} • ${m.unit}</div>
            </div>
            <div class="admin-item-actions">
                <button class="button-icon-sm" onclick="openEditMaterialItem(${index})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="button-icon-sm button-danger" onclick="deleteJobTypeMaterialItem(${index})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function openEditMaterialItem(index) {
    document.getElementById('jtMaterialIndex').value = index;
    if (index >= 0) {
        const m = tempMaterials[index];
        document.getElementById('editMaterialItemTitle').textContent = 'Edit Material';
        document.getElementById('jtMaterialName').value = m.name;
        document.getElementById('jtMaterialCategory').value = m.category || '';
        document.getElementById('jtMaterialUnit').value = m.unit;
    } else {
        document.getElementById('editMaterialItemTitle').textContent = 'Add Material';
        document.getElementById('jtMaterialName').value = '';
        document.getElementById('jtMaterialCategory').value = '';
        document.getElementById('jtMaterialUnit').value = 'SDU';
    }
    document.getElementById('editMaterialItemModal').style.display = 'flex';
    setTimeout(() => document.getElementById('jtMaterialName').focus(), 100);
}

function closeEditMaterialItem() {
    document.getElementById('editMaterialItemModal').style.display = 'none';
}

function saveJobTypeMaterialItem() {
    const name = document.getElementById('jtMaterialName').value.trim();
    const category = document.getElementById('jtMaterialCategory').value.trim();
    const unit = document.getElementById('jtMaterialUnit').value;
    const index = parseInt(document.getElementById('jtMaterialIndex').value);

    if (!name) {
        showToast('Enter material name', 'error');
        return;
    }

    const item = { name, category: category || 'Other', unit };

    if (index >= 0) {
        tempMaterials[index] = item;
        showToast('Material updated', 'success');
    } else {
        tempMaterials.push(item);
        showToast('Material added', 'success');
    }

    closeEditMaterialItem();
    renderMaterialManagerList();
    persistJobTypeDataNow(); // save immediately
}

function deleteJobTypeMaterialItem(index) {
    if (!confirm('Delete this material?')) return;
    tempMaterials.splice(index, 1);
    showToast('Material deleted', 'success');
    renderMaterialManagerList();
    persistJobTypeDataNow(); // save immediately
}

function saveJobTypeMaterials() {
    document.getElementById('jobTypeMaterialsData').value = JSON.stringify(tempMaterials);
    document.getElementById('materialCount').textContent = tempMaterials.length;
    persistJobTypeDataNow();
    closeMaterialManager();
    showToast('Materials saved', 'success');
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Get the active job type
function getActiveJobType() {
    const jobTypes = getJobTypes();
    const activeJobTypeId = getFromStorage('admin_active_job_type', 1);
    return jobTypes.find(jt => jt.id === activeJobTypeId) || jobTypes[0];
}

// ============================================================================
// INITIALIZE
// ============================================================================

// Call this when app initializes - ensure job types are seeded
if (typeof window !== 'undefined') {
    getJobTypes(); // seeds defaults + runs migration on first call
}

// Register route
router.register('/admin', renderAdminPage);
