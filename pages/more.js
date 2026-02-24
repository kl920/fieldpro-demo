// Profile Page
function renderMorePage() {
    const storedUsername = localStorage.getItem('fieldpro_username') || 'Demo User';
    const userName = storedUsername;
    const userEmail = 'demo@fieldpro.dk';
    
    const content = `
        <div class="page page-more">
            <div class="page-header">
                <h1>Profil</h1>
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

                <!-- Admin Section -->
                <div class="menu-section">
                    <div class="menu-section-header">Administration</div>
                    <button class="menu-item" onclick="router.navigate('/admin')">
                        <div class="menu-item-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M12 1v6m0 6v6m5.66-13.66l-4.24 4.24m0 6l-4.24 4.24M23 12h-6m-6 0H5m13.66 5.66l-4.24-4.24m0-6l-4.24-4.24"></path>
                            </svg>
                        </div>
                        <span>Administrator</span>
                        <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>

                <!-- Logout Button -->
                <div class="menu-section">
                    <button class="logout-button" onclick="handleLogout()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Log ud
                    </button>
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
                            <span class="info-label">Status</span>
                            <span class="info-value">Demo version</span>
                        </div>
                    </div>
                </div>

                <div class="app-version">FieldPro v1.0.0</div>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
}

// Logout function
function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('fieldpro_logged_in');
        localStorage.removeItem('fieldpro_username');
        window.location.href = 'index.html';
    }
}

router.register('/more', renderMorePage);
