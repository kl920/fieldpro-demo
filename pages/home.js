// Home Page
function renderHomePage() {
    const weather = getWeather();
    const greeting = getGreeting();
    const todayTasks = AppData.getTodayTasks();
    const activeTasks = AppData.getTasksByStatus('active');
    
    const content = `
        <div class="page page-home">
            <div class="page-header">
                <div class="header-main">
                    <h1>${greeting}! 👋</h1>
                    <div class="weather-widget">
                        <span class="weather-icon">${weather.icon}</span>
                        <span class="weather-temp">${weather.temp}°C</span>
                        <span class="weather-condition">${weather.condition}</span>
                    </div>
                </div>
            </div>

            <div class="page-content">
                <!-- Today's Tasks -->
                <div class="section">
                    <div class="section-header">
                        <h2>Dagens opgaver</h2>
                        <a href="#/orders" onclick="router.navigate('/orders')" class="link-button">Se alle</a>
                    </div>

                    <div class="task-list">
                        ${todayTasks.length === 0 ? `
                            <div class="empty-state">
                                <div class="empty-icon">📋</div>
                                <h3>Ingen opgaver i dag</h3>
                                <p>Du har ingen planlagte opgaver for i dag</p>
                            </div>
                        ` : todayTasks.map(task => `
                            <div class="task-card" onclick="router.navigate('/order-detail', { taskId: ${task.id} })">
                                <div class="task-card-header">
                                    <div class="task-badge task-badge-${task.type.toLowerCase()}">${task.type}</div>
                                    <div class="task-priority priority-${task.priority}">
                                        <span class="priority-dot"></span>
                                    </div>
                                </div>
                                <h3 class="task-title">${task.orderNumber} - ${task.title}</h3>
                                <div class="task-meta">
                                    <div class="task-meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        <span>${task.customer.name}</span>
                                    </div>
                                    <div class="task-meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        <span>${task.scheduledStart} - ${task.scheduledEnd}</span>
                                    </div>
                                </div>
                                <div class="task-card-footer">
                                    <span class="status-badge status-${task.status}">${getStatusText(task.status)}</span>
                                    <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
}

router.register('/', renderHomePage);
