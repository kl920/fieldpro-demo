// Admin Page - Manage checklists and materials
function renderAdminPage() {
    // Load admin settings from localStorage
    const checklistItems = getFromStorage('admin_checklist_items', [
        'Ankommet til adresse',
        'Værktøj og materialer klar',
        'Gennemgang med kunde',
        'Arbejde udført',
        'Oprydning',
        'Aflevering til kunde'
    ]);
    
    const materials = AppData.commonMaterials;
    
    const photoCategories = getFromStorage('admin_photo_categories', [
        'Før arbejde',
        'Under arbejde',
        'Efter arbejde'
    ]);
    
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
                    <span class="header-subtitle">Administrer system indstillinger</span>
                </div>
            </div>

            <div class="page-content">
                <!-- Checklist Management -->
                <div class="admin-section">
                    <div class="admin-section-header">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 11 12 14 22 4"></polyline>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                            Tjekliste Punkter
                        </h3>
                        <button class="button-primary-sm" onclick="openAddChecklistItemDialog()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Tilføj
                        </button>
                    </div>
                    <div class="admin-list" id="checklistItemsList">
                        ${checklistItems.length === 0 ? `
                            <div class="empty-state-small">
                                <p>Ingen tjekliste punkter oprettet</p>
                            </div>
                        ` : checklistItems.map((item, index) => `
                            <div class="admin-list-item">
                                <div class="admin-item-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div class="admin-item-content">
                                    <div class="admin-item-title">${item}</div>
                                    <div class="admin-item-subtitle">Punkt ${index + 1}</div>
                                </div>
                                <div class="admin-item-actions">
                                    <button class="button-icon-sm" onclick="editChecklistItem(${index}, '${item.replace(/'/g, "\\'")}')">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                    <button class="button-icon-sm button-danger" onclick="deleteChecklistItem(${index})">
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

                <!-- Materials Management -->
                <div class="admin-section">
                    <div class="admin-section-header">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                            Standard Materialer
                        </h3>
                        <button class="button-primary-sm" onclick="openAddMaterialDialog()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Tilføj
                        </button>
                    </div>
                    <div class="admin-list" id="materialsList">
                        ${materials.length === 0 ? `
                            <div class="empty-state-small">
                                <p>Ingen materialer oprettet</p>
                            </div>
                        ` : materials.map((mat, index) => `
                            <div class="admin-list-item">
                                <div class="admin-item-icon" style="background: #E8F5E9;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50">
                                        <rect x="1" y="3" width="15" height="13"></rect>
                                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                    </svg>
                                </div>
                                <div class="admin-item-content">
                                    <div class="admin-item-title">${mat.name}</div>
                                    <div class="admin-item-subtitle">${mat.category || 'Uden kategori'} • ${mat.unit}</div>
                                </div>
                                <div class="admin-item-actions">
                                    <button class="button-icon-sm" onclick="editMaterial(${index})">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                    <button class="button-icon-sm button-danger" onclick="deleteMaterial(${index})">
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

                <!-- Photo Categories Management -->
                <div class="admin-section">
                    <div class="admin-section-header">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            Foto Kategorier
                        </h3>
                        <button class="button-primary-sm" onclick="openAddPhotoCategoryDialog()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Tilføj
                        </button>
                    </div>
                    <div class="admin-list" id="photoCategoriesList">
                        ${photoCategories.length === 0 ? `
                            <div class="empty-state-small">
                                <p>Ingen foto kategorier oprettet</p>
                            </div>
                        ` : photoCategories.map((category, index) => `
                            <div class="admin-list-item">
                                <div class="admin-item-icon" style="background: #FFF3E0;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#FF9800">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                </div>
                                <div class="admin-item-content">
                                    <div class="admin-item-title">${category}</div>
                                    <div class="admin-item-subtitle">Kategori ${index + 1}</div>
                                </div>
                                <div class="admin-item-actions">
                                    <button class="button-icon-sm" onclick="editPhotoCategory(${index}, '${category.replace(/'/g, "\\'")}')">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                    <button class="button-icon-sm button-danger" onclick="deletePhotoCategory(${index})">
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
                                <polyline points="9 11 12 14 22 4"></polyline>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${checklistItems.length}</div>
                            <div class="stat-label">Tjekliste punkter</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background: #E8F5E9;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50">
                                <rect x="1" y="3" width="15" height="13"></rect>
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${materials.length}</div>
                            <div class="stat-label">Materialer</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Checklist Item Modal -->
        <div id="checklistModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="checklistModalTitle">Tilføj tjekliste punkt</h3>
                    <button class="modal-close" onclick="closeChecklistModal()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Tekst</label>
                        <input type="text" id="checklistItemText" placeholder="F.eks. Ankommet til adresse">
                    </div>
                    <input type="hidden" id="checklistItemIndex" value="-1">
                    <div class="button-group">
                        <button class="button-secondary" onclick="closeChecklistModal()">Annuller</button>
                        <button class="button-primary" onclick="saveChecklistItem()">Gem</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Material Modal -->
        <div id="materialModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="materialModalTitle">Tilføj materiale</h3>
                    <button class="modal-close" onclick="closeMaterialModal()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Navn</label>
                        <input type="text" id="materialName" placeholder="F.eks. Gulvbrædder">
                    </div>
                    <div class="form-group">
                        <label>Kategori</label>
                        <input type="text" id="materialCategory" placeholder="F.eks. Træ">
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
                    <input type="hidden" id="materialIndex" value="-1">
                    <div class="button-group">
                        <button class="button-secondary" onclick="closeMaterialModal()">Annuller</button>
                        <button class="button-primary" onclick="saveMaterial()">Gem</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Photo Category Modal -->
        <div id="photoCategoryModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="photoCategoryModalTitle">Tilføj foto kategori</h3>
                    <button class="modal-close" onclick="closePhotoCategoryModal()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Kategori navn</label>
                        <input type="text" id="photoCategoryName" placeholder="F.eks. Område før arbejde">
                    </div>
                    <input type="hidden" id="photoCategoryIndex" value="-1">
                    <div class="button-group">
                        <button class="button-secondary" onclick="closePhotoCategoryModal()">Annuller</button>
                        <button class="button-primary" onclick="savePhotoCategory()">Gem</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
}

// ============================================================================
// CHECKLIST MANAGEMENT
// ============================================================================

function openAddChecklistItemDialog() {
    const modal = document.getElementById('checklistModal');
    document.getElementById('checklistModalTitle').textContent = 'Tilføj tjekliste punkt';
    document.getElementById('checklistItemText').value = '';
    document.getElementById('checklistItemIndex').value = '-1';
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('checklistItemText').focus(), 100);
}

function editChecklistItem(index, text) {
    const modal = document.getElementById('checklistModal');
    document.getElementById('checklistModalTitle').textContent = 'Rediger tjekliste punkt';
    document.getElementById('checklistItemText').value = text;
    document.getElementById('checklistItemIndex').value = index;
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('checklistItemText').focus(), 100);
}

function closeChecklistModal() {
    document.getElementById('checklistModal').style.display = 'none';
}

function saveChecklistItem() {
    const text = document.getElementById('checklistItemText').value.trim();
    const index = parseInt(document.getElementById('checklistItemIndex').value);
    
    if (!text) {
        showToast('Indtast tekst', 'error');
        return;
    }
    
    const items = getFromStorage('admin_checklist_items', []);
    
    if (index >= 0) {
        // Edit existing
        items[index] = text;
        showToast('Tjekliste punkt opdateret', 'success');
    } else {
        // Add new
        items.push(text);
        showToast('Tjekliste punkt tilføjet', 'success');
    }
    
    saveToStorage('admin_checklist_items', items);
    closeChecklistModal();
    renderAdminPage();
}

function deleteChecklistItem(index) {
    if (!confirm('Vil du slette dette tjekliste punkt?')) {
        return;
    }
    
    const items = getFromStorage('admin_checklist_items', []);
    items.splice(index, 1);
    saveToStorage('admin_checklist_items', items);
    
    showToast('Tjekliste punkt slettet', 'success');
    renderAdminPage();
}

// ============================================================================
// MATERIAL MANAGEMENT
// ============================================================================

function openAddMaterialDialog() {
    const modal = document.getElementById('materialModal');
    document.getElementById('materialModalTitle').textContent = 'Tilføj materiale';
    document.getElementById('materialName').value = '';
    document.getElementById('materialCategory').value = '';
    document.getElementById('materialUnit').value = 'stk';
    document.getElementById('materialIndex').value = '-1';
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('materialName').focus(), 100);
}

function editMaterial(index) {
    const materials = AppData.commonMaterials;
    const mat = materials[index];
    
    const modal = document.getElementById('materialModal');
    document.getElementById('materialModalTitle').textContent = 'Rediger materiale';
    document.getElementById('materialName').value = mat.name;
    document.getElementById('materialCategory').value = mat.category || '';
    document.getElementById('materialUnit').value = mat.unit;
    document.getElementById('materialIndex').value = index;
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('materialName').focus(), 100);
}

function closeMaterialModal() {
    document.getElementById('materialModal').style.display = 'none';
}

function saveMaterial() {
    const name = document.getElementById('materialName').value.trim();
    const category = document.getElementById('materialCategory').value.trim();
    const unit = document.getElementById('materialUnit').value;
    const index = parseInt(document.getElementById('materialIndex').value);
    
    if (!name) {
        showToast('Indtast materiale navn', 'error');
        return;
    }
    
    const material = {
        name: name,
        category: category || 'Andet',
        unit: unit
    };
    
    if (index >= 0) {
        // Edit existing
        AppData.commonMaterials[index] = material;
        showToast('Materiale opdateret', 'success');
    } else {
        // Add new
        AppData.commonMaterials.push(material);
        showToast('Materiale tilføjet', 'success');
    }
    
    // Save to localStorage
    saveToStorage('admin_common_materials', AppData.commonMaterials);
    
    closeMaterialModal();
    renderAdminPage();
}

function deleteMaterial(index) {
    if (!confirm('Vil du slette dette materiale?')) {
        return;
    }
    
    AppData.commonMaterials.splice(index, 1);
    saveToStorage('admin_common_materials', AppData.commonMaterials);
    
    showToast('Materiale slettet', 'success');
    renderAdminPage();
}

// ============================================================================
// PHOTO CATEGORY MANAGEMENT
// ============================================================================

function openAddPhotoCategoryDialog() {
    const modal = document.getElementById('photoCategoryModal');
    document.getElementById('photoCategoryModalTitle').textContent = 'Tilføj foto kategori';
    document.getElementById('photoCategoryName').value = '';
    document.getElementById('photoCategoryIndex').value = '-1';
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('photoCategoryName').focus(), 100);
}

function editPhotoCategory(index, name) {
    const modal = document.getElementById('photoCategoryModal');
    document.getElementById('photoCategoryModalTitle').textContent = 'Rediger foto kategori';
    document.getElementById('photoCategoryName').value = name;
    document.getElementById('photoCategoryIndex').value = index;
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('photoCategoryName').focus(), 100);
}

function closePhotoCategoryModal() {
    document.getElementById('photoCategoryModal').style.display = 'none';
}

function savePhotoCategory() {
    const name = document.getElementById('photoCategoryName').value.trim();
    const index = parseInt(document.getElementById('photoCategoryIndex').value);
    
    if (!name) {
        showToast('Indtast kategori navn', 'error');
        return;
    }
    
    const categories = getFromStorage('admin_photo_categories', ['Før arbejde', 'Under arbejde', 'Efter arbejde']);
    
    if (index >= 0) {
        // Edit existing
        categories[index] = name;
        showToast('Foto kategori opdateret', 'success');
    } else {
        // Add new
        categories.push(name);
        showToast('Foto kategori tilføjet', 'success');
    }
    
    saveToStorage('admin_photo_categories', categories);
    
    closePhotoCategoryModal();
    renderAdminPage();
}

function deletePhotoCategory(index) {
    if (!confirm('Vil du slette denne foto kategori?')) {
        return;
    }
    
    const categories = getFromStorage('admin_photo_categories', ['Før arbejde', 'Under arbejde', 'Efter arbejde']);
    categories.splice(index, 1);
    saveToStorage('admin_photo_categories', categories);
    
    showToast('Foto kategori slettet', 'success');
    renderAdminPage();
}

// ============================================================================
// INITIALIZE
// ============================================================================

// Load custom materials from storage on app start
function initializeAdminData() {
    const savedMaterials = getFromStorage('admin_common_materials');
    if (savedMaterials && savedMaterials.length > 0) {
        AppData.commonMaterials = savedMaterials;
    }
}

// Call this when app initializes
if (typeof window !== 'undefined') {
    initializeAdminData();
}

// Register route
router.register('/admin', renderAdminPage);
