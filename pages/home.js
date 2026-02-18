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

                <!-- Recent Activity -->
                <div class="section">
                    <div class="section-header">
                        <h2>Seneste aktivitet</h2>
                        <button class="link-button" onclick="ActivityLogger.clear(); router.navigate('/')">Ryd</button>
                    </div>
                    <div class="activity-stream" id="activityStream">
                        ${renderActivityStream()}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
}

function renderActivityStream() {
    const activities = ActivityLogger.getRecent(5);
    
    if (activities.length === 0) {
        return `
            <div class="empty-state-small">
                <p>Ingen aktivitet endnu</p>
            </div>
        `;
    }
    
    const activityIcons = {
        checklist: '<path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
        voice: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>',
        signature: '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>',
        complete: '<polyline points="20 6 9 17 4 12"></polyline>',
        start: '<polygon points="5 3 19 12 5 21 5 3"></polygon>',
        material: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>',
        photo: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>'
    };
    
    return activities.map(activity => {
        const icon = activityIcons[activity.type] || activityIcons.complete;
        const timeAgo = getTimeAgo(new Date(activity.timestamp));
        
        return `
            <div class="activity-item" ${activity.taskId ? `onclick="router.navigate('/order-detail', { taskId: ${activity.taskId} })" style="cursor: pointer;"` : ''}>
                <div class="activity-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        ${icon}
                    </svg>
                </div>
                <div class="activity-content">
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Lige nu';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min siden`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} timer siden`;
    return `${Math.floor(seconds / 86400)} dage siden`;
}

router.register('/', renderHomePage);
