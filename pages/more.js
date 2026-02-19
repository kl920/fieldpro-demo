// Profile Page
function renderMorePage() {
    const userName = 'Kenneth Larsen';
    const userEmail = 'kenneth@fieldpro.dk';
    
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

router.register('/more', renderMorePage);
