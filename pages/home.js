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

