// Home Page
function renderHomePage() {
    const allTasks   = AppData.getAllTasks();
    const todayDate  = new Date().toISOString().split('T')[0];

    const todayTasks    = allTasks.filter(t => t.date === todayDate)
                                  .sort((a,b) => a.scheduledStart.localeCompare(b.scheduledStart));
    const upcomingTasks = allTasks.filter(t => t.date > todayDate)
                                  .sort((a,b) => a.date.localeCompare(b.date) || a.scheduledStart.localeCompare(b.scheduledStart));
    const pastTasks     = allTasks.filter(t => t.date < todayDate)
                                  .sort((a,b) => b.date.localeCompare(a.date))
                                  .slice(0, 5);

    const today = new Date();
    const dateString = today.toLocaleDateString('da-DK', { weekday: 'long', day: 'numeric', month: 'long' });

    // Helper: days until a task date
    function daysUntil(dateStr) {
        return Math.round((new Date(dateStr) - new Date(todayDate)) / 86400000);
    }

    // Helper: "om X dage" label
    function daysLabel(dateStr) {
        const d = daysUntil(dateStr);
        if (d === 1) return 'I morgen';
        if (d <= 7)  return `Om ${d} dage`;
        return new Date(dateStr).toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
    }

    // Color band for urgency
    function urgencyClass(dateStr) {
        const d = daysUntil(dateStr);
        if (d <= 2) return 'urgency-high';
        if (d <= 7) return 'urgency-mid';
        return 'urgency-low';
    }

    const content = `
        <div class="page page-home">
            <div class="home-header">
                <div class="home-header-text">
                    <div class="home-greeting">God dag,</div>
                    <h1 class="home-name">Kenneth Larsen</h1>
                </div>
                <div class="home-date-badge">${today.getDate()} ${today.toLocaleDateString('da-DK',{month:'short'})}</div>
            </div>

            <div class="page-content">

                <!-- ── TODAY ─────────────────────────────── -->
                <div class="home-section">
                    <div class="home-section-label">I dag · ${dateString}</div>

                    ${todayTasks.length === 0 ? `
                        <div class="home-empty">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="28" height="28"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                            <span>Ingen opgaver i dag</span>
                        </div>
                    ` : todayTasks.map(task => `
                        <div class="today-card" onclick="router.navigate('/order-detail', { taskId: ${task.id} })">
                            <div class="today-card-top">
                                <div class="today-card-meta">
                                    <span class="today-order-id">#${task.orderNumber}</span>
                                    <span class="today-type-tag">${task.type}</span>
                                </div>
                                <span class="today-time">${task.scheduledStart}–${task.scheduledEnd}</span>
                            </div>
                            <h3 class="today-title">${task.title}</h3>
                            <div class="today-address">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                ${task.location.address}
                            </div>
                            <button class="today-route-btn" onclick="event.stopPropagation(); navigateToLocation('${task.location.address}')">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                                Start rute
                            </button>
                        </div>
                    `).join('')}
                </div>

                <!-- ── UPCOMING ───────────────────────────── -->
                ${upcomingTasks.length > 0 ? `
                <div class="home-section">
                    <div class="home-section-label">
                        Kommende
                        <span class="home-section-count">${upcomingTasks.length}</span>
                    </div>
                    <div class="upcoming-list">
                        ${upcomingTasks.map((task, i) => `
                            <div class="upcoming-row ${i === 0 ? 'upcoming-row-next' : ''}" onclick="router.navigate('/order-detail', { taskId: ${task.id} })">
                                <div class="upcoming-row-date ${urgencyClass(task.date)}">
                                    <div class="udate-day">${new Date(task.date).getDate()}</div>
                                    <div class="udate-mon">${new Date(task.date).toLocaleDateString('da-DK',{month:'short'})}</div>
                                </div>
                                <div class="upcoming-row-body">
                                    <div class="upcoming-row-top">
                                        <span class="upcoming-row-title">${task.title}</span>
                                        ${i === 0 ? '<span class="next-badge">Næste</span>' : `<span class="upcoming-row-when">${daysLabel(task.date)}</span>`}
                                    </div>
                                    <div class="upcoming-row-sub">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                        ${task.location.address}
                                        <span class="upcoming-row-time">· ${task.scheduledStart}</span>
                                    </div>
                                </div>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" class="upcoming-row-chevron"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- ── HISTORY ────────────────────────────── -->
                ${pastTasks.length > 0 ? `
                <div class="home-section home-section-past">
                    <div class="home-section-label">
                        Historik
                        <span class="home-section-count home-section-count-past">seneste ${pastTasks.length}</span>
                    </div>
                    <div class="history-list">
                        ${pastTasks.map(task => `
                            <div class="history-row" onclick="router.navigate('/order-detail', { taskId: ${task.id} })">
                                <div class="history-dot"></div>
                                <div class="history-body">
                                    <span class="history-title">${task.title}</span>
                                    <span class="history-date">${new Date(task.date).toLocaleDateString('da-DK',{day:'numeric',month:'short'})}</span>
                                </div>
                                <span class="history-id">#${task.orderNumber}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

            </div>
        </div>
    `;

    document.getElementById('app-content').innerHTML = content;
}

router.register('/', renderHomePage);

    
    // Get upcoming tasks (not today)
    const upcomingTasks = allTasks.filter(task => task.date > todayDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get last 5 past tasks (before today), newest first
    const pastTasks = allTasks.filter(task => task.date < todayDate)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    // Get today's date in dd-mm-yyyy format
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const dateString = `${day}-${month}-${year}`;
    
    const content = `
        <div class="page page-home">
            <div class="page-header">
                <div class="header-main">
                    <h1>Kenneth Larsen</h1>
                </div>
            </div>

            <div class="page-content">
                <!-- Today's Tasks -->
                <div class="section">
                    <div class="section-header">
                        <h2>${dateString}</h2>
                    </div>

                    <div class="task-list">
                        ${todayTasks.length === 0 ? `
                            <div class="empty-state">
                                <div class="empty-icon">📋</div>
                                <h3>No tasks today</h3>
                                <p>You have no scheduled tasks for today</p>
                            </div>
                        ` : todayTasks.map(task => `
                            <div class="task-card-clean">
                                <div class="task-card-main" onclick="router.navigate('/order-detail', { taskId: ${task.id} })">
                                    <div class="task-id">ID: ${task.orderNumber}</div>
                                    <h3 class="task-title-clean">${task.title}</h3>
                                    <div class="task-address">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        <span>${task.location.address}</span>
                                    </div>
                                    <div class="task-time">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        <span>${task.scheduledStart} - ${task.scheduledEnd}</span>
                                    </div>
                                    <div class="task-type-label">Task type: ${task.type}</div>
                                </div>
                                <button class="button-start-route" onclick="event.stopPropagation(); navigateToLocation('${task.location.address}')">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                                        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                                    </svg>
                                    Start route
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Past Tasks -->
                ${pastTasks.length > 0 ? `
                    <div class="section section-past">
                        <div class="section-header">
                            <h2>Seneste opgaver</h2>
                            <span class="task-count task-count-past">${pastTasks.length}</span>
                        </div>
                        <div class="upcoming-task-list">
                            ${pastTasks.map(task => `
                                <div class="upcoming-task-card past-task-card" onclick="router.navigate('/order-detail', { taskId: ${task.id} })">
                                    <div class="upcoming-task-left">
                                        <div class="upcoming-task-date past-task-date">
                                            <div class="date-day">${new Date(task.date).getDate()}</div>
                                            <div class="date-month">${new Date(task.date).toLocaleDateString('da-DK', { month: 'short' })}</div>
                                        </div>
                                    </div>
                                    <div class="upcoming-task-content">
                                        <div class="upcoming-task-header">
                                            <span class="upcoming-task-id">ID: ${task.orderNumber}</span>
                                            <span class="upcoming-task-type">${task.type}</span>
                                        </div>
                                        <h4 class="upcoming-task-title">${task.title}</h4>
                                        <div class="upcoming-task-meta">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                            <span>${task.location.address}</span>
                                        </div>
                                    </div>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18" style="flex-shrink:0;opacity:0.4">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Upcoming Tasks -->
                ${upcomingTasks.length > 0 ? `
                    <div class="section section-upcoming">
                        <div class="section-header">
                            <h2>Upcoming tasks</h2>
                            <span class="task-count">${upcomingTasks.length}</span>
                        </div>
                        
                        <div class="upcoming-task-list">
                            ${upcomingTasks.map(task => `
                                <div class="upcoming-task-card" onclick="router.navigate('/order-detail', { taskId: ${task.id} })">
                                    <div class="upcoming-task-left">
                                        <div class="upcoming-task-date">
                                            <div class="date-day">${new Date(task.date).getDate()}</div>
                                            <div class="date-month">${new Date(task.date).toLocaleDateString('da-DK', { month: 'short' })}</div>
                                        </div>
                                    </div>
                                    <div class="upcoming-task-content">
                                        <div class="upcoming-task-header">
                                            <span class="upcoming-task-id">ID: ${task.orderNumber}</span>
                                            <span class="upcoming-task-type">${task.type}</span>
                                        </div>
                                        <h4 class="upcoming-task-title">${task.title}</h4>
                                        <div class="upcoming-task-meta">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                            <span>${task.location.address}</span>
                                        </div>
                                    </div>
                                    <svg class="upcoming-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
}

router.register('/', renderHomePage);
