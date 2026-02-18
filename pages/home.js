// Home Page
function renderHomePage() {
    const todayTasks = AppData.getTodayTasks();
    const activeTasks = AppData.getTasksByStatus('active');
    
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
                                    <div class="task-type-label">Opgavetype: ${task.type}</div>
                                </div>
                                <button class="button-start-route" onclick="event.stopPropagation(); navigateToLocation('${task.location.address}')">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                                        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                                    </svg>
                                    Start rute
                                </button>
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
