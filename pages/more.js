// More / Settings Page
function renderMorePage() {
    const userName = 'Mikkel Hansen';
    const userEmail = 'mikkel@fieldpro.dk';
    
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
                    <button class="profile-edit" onclick="editProfile()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                </div>

                <!-- Menu Sections -->
                <div class="menu-section">
                    <div class="menu-section-header">Arbejde</div>
                    <div class="menu-items">
                        <button class="menu-item" onclick="showToast('Åbner kalender...', 'info')">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </div>
                            <span>Kalender</span>
                            <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        <button class="menu-item" onclick="showToast('Åbner rapporter...', 'info')">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="12" y1="20" x2="12" y2="10"></line>
                                    <line x1="18" y1="20" x2="18" y2="4"></line>
                                    <line x1="6" y1="20" x2="6" y2="16"></line>
                                </svg>
                            </div>
                            <span>Rapporter</span>
                            <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        <button class="menu-item" onclick="showToast('Åbner kunder...', 'info')">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <span>Kunder</span>
                            <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        <button class="menu-item" onclick="showToast('Åbner dokumenter...', 'info')">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                    <polyline points="13 2 13 9 20 9"></polyline>
                                </svg>
                            </div>
                            <span>Dokumenter</span>
                            <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="menu-section">
                    <div class="menu-section-header">Indstillinger</div>
                    <div class="menu-items">
                        <button class="menu-item" onclick="showToast('Åbner notifikationer...', 'info')">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                            </div>
                            <span>Notifikationer</span>
                            <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        <button class="menu-item" onclick="showToast('Åbner præferencer...', 'info')">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M12 1v6m0 6v6m5.66-13.66l-4.24 4.24m-2.83 2.83l-4.24 4.24M23 12h-6m-6 0H1m18.66 5.66l-4.24-4.24m-2.83-2.83l-4.24-4.24"></path>
                                </svg>
                            </div>
                            <span>Præferencer</span>
                            <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        <button class="menu-item" onclick="toggleDarkMode()">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            </div>
                            <span>Mørk tilstand</span>
                            <div class="toggle">
                                <input type="checkbox" id="darkModeToggle">
                                <label for="darkModeToggle"></label>
                            </div>
                        </button>
                    </div>
                </div>

                <div class="menu-section">
                    <div class="menu-section-header">Support</div>
                    <div class="menu-items">
                        <button class="menu-item" onclick="showToast('Åbner hjælp...', 'info')">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </div>
                            <span>Hjælp & Support</span>
                            <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>

                        <button class="menu-item" onclick="showToast('FieldPro v1.0.0', 'info')">
                            <div class="menu-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                            </div>
                            <span>Om FieldPro</span>
                            <svg class="menu-item-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Logout Button -->
                <button class="button-danger button-large" onclick="logout()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log ud
                </button>

                <div class="app-version">FieldPro v1.0.0 • Made with ❤️ in Denmark</div>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
}

function editProfile() {
    showToast('Rediger profil kommer snart', 'info');
}

function toggleDarkMode() {
    showToast('Mørk tilstand kommer snart 🌙', 'info');
}

function logout() {
    if (window.confirm('Er du sikker på du vil logge ud?')) {
        showToast('Logger ud...', 'info');
        setTimeout(() => {
            showToast('Du er nu logget ud', 'success');
        }, 1000);
    }
}

router.register('/more', renderMorePage);
