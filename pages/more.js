// More / Settings Page
function renderMorePage() {
    const userName = 'Mikkel Hansen';
    const userEmail = 'mikkel@fieldpro.dk';
    
    // Calculate stats
    const totalTasks = Object.keys(AppData.tasks).length;
    const completedTasks = Object.values(AppData.tasks).filter(t => t.status === 'completed').length;
    const activeTasks = Object.values(AppData.tasks).filter(t => t.status === 'active').length;
    
    const content = `
        <div class="page page-more">
            <div class="page-header">
                <h1>Mere</h1>
            </div>

            <div class="page-content">
                <!-- User Profile -->
                <div class="profile-card">
                    <div class="profile-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="profile-info">
                        <div class="profile-name">${userName}</div>
                        <div class="profile-email">${userEmail}</div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="menu-section">
                    <div class="menu-section-header">Oversigt</div>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${totalTasks}</div>
                            <div class="stat-label">Opgaver i alt</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${activeTasks}</div>
                            <div class="stat-label">Aktive</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${completedTasks}</div>
                            <div class="stat-label">Afsluttede</div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="menu-section">
                    <div class="menu-section-header">Genveje</div>
                    <div class="menu-items">
                        <button class="menu-item" onclick="router.navigate('/calendar')">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <span>Gå til kalender</span>
                            <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        <button class="menu-item" onclick="router.navigate('/orders')">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <span>Se alle ordrer</span>
                            <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        <button class="menu-item" onclick="exportData()">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </div>
                            <span>Eksporter data</span>
                            <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- App Info -->
                <div class="menu-section">
                    <div class="menu-section-header">Om appen</div>
                    <div class="info-card">
                        <div class="info-row">
                            <span class="info-label">Version</span>
                            <span class="info-value">1.0.0</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Sidste opdatering</span>
                            <span class="info-value">${formatDate(new Date())}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Data gemt lokalt</span>
                            <span class="info-value">✓ LocalStorage</span>
                        </div>
                    </div>
                </div>

                <div class="app-version">FieldPro v1.0.0 • Made with ❤️ in Denmark</div>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
}

function exportData() {
    const data = {
        tasks: AppData.tasks,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `fieldpro-data-${formatDate(new Date())}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('Data eksporteret! 📦', 'success');
}

router.register('/more', renderMorePage);
