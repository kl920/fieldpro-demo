// Time Tracking Page
function renderTimePage() {
    const allTasks = AppData.getAllTasks();
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate today's total hours
    let todayTotal = 0;
    allTasks.filter(t => t.date === today).forEach(task => {
        const timeData = AppData.getTaskData(task.id, 'time');
        if (timeData) {
            const start = timeToMinutes(timeData.startTime);
            const end = timeToMinutes(timeData.endTime);
            const pause = timeToMinutes(timeData.pause);
            todayTotal += (end - start - pause);
        }
    });
    
    const content = `
        <div class="page page-time">
            <div class="page-header">
                <h1>Tidsregistrering</h1>
            </div>

            <div class="page-content">
                <!-- Today Summary -->
                <div class="time-summary-card">
                    <div class="time-summary-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div class="time-summary-info">
                        <div class="time-summary-label">I dag</div>
                        <div class="time-summary-value">${minutesToTime(todayTotal)}</div>
                        <div class="time-summary-sublabel">${allTasks.filter(t => t.date === today).length} opgaver</div>
                    </div>
                </div>

                <!-- Week Overview -->
                <div class="section-card">
                    <h3>Denne uge</h3>
                    <div class="week-chart">
                        ${['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'].map((day, i) => {
                            const hours = Math.random() * 10; // Mock data
                            const percentage = (hours / 10) * 100;
                            return `
                                <div class="week-day">
                                    <div class="week-bar-container">
                                        <div class="week-bar" style="height: ${percentage}%"></div>
                                    </div>
                                    <div class="week-day-label">${day}</div>
                                    <div class="week-day-hours">${hours.toFixed(1)}t</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Recent Time Entries -->
                <div class="section">
                    <h2>Seneste registreringer</h2>
                    <div class="time-entries">
                        ${allTasks.slice(0, 5).map(task => {
                            const timeData = AppData.getTaskData(task.id, 'time');
                            if (!timeData) return '';
                            
                            const start = timeToMinutes(timeData.startTime);
                            const end = timeToMinutes(timeData.endTime);
                            const pause = timeToMinutes(timeData.pause);
                            const total = end - start - pause;
                            
                            return `
                                <div class="time-entry" onclick="router.navigate('/order-detail', { taskId: ${task.id} })">
                                    <div class="time-entry-main">
                                        <div class="time-entry-title">${task.orderNumber} - ${task.title}</div>
                                        <div class="time-entry-meta">
                                            ${formatDate(task.date)} • ${timeData.startTime} - ${timeData.endTime}
                                        </div>
                                    </div>
                                    <div class="time-entry-duration">
                                        ${minutesToTime(total)}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Export Button -->
                <button class="button-secondary button-large" onclick="exportTimeData()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Eksporter tidsdata
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
}

function exportTimeData() {
    showToast('Eksporterer tidsdata...', 'info');
    setTimeout(() => {
        showToast('Data eksporteret! 📊', 'success');
    }, 1000);
}

router.register('/time', renderTimePage);
