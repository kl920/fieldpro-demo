// Orders Page
function renderOrdersPage() {
    const allTasks = AppData.getAllTasks();
    let currentFilter = 'all';
    
    const content = `
        <div class="page page-orders">
            <div class="page-header">
                <h1>Mine ordrer</h1>
            </div>

            <div class="page-content">
                <!-- Search Bar -->
                <div class="search-container">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input 
                        type="search" 
                        id="orderSearch" 
                        class="search-input" 
                        placeholder="Søg i ordrer..."
                        oninput="filterOrders()"
                    >
                </div>

                <!-- Filter Chips -->
                <div class="filter-chips-container">
                    <button class="filter-chip active" data-filter="all" onclick="setOrderFilter('all', this)">
                        Alle (${allTasks.length})
                    </button>
                    <button class="filter-chip" data-filter="active" onclick="setOrderFilter('active', this)">
                        I gang (${AppData.getTasksByStatus('active').length})
                    </button>
                    <button class="filter-chip" data-filter="pending" onclick="setOrderFilter('pending', this)">
                        Ikke startet (${AppData.getTasksByStatus('pending').length})
                    </button>
                    <button class="filter-chip" data-filter="today" onclick="setOrderFilter('today', this)">
                        I dag (${AppData.getTodayTasks().length})
                    </button>
                </div>

                <!-- Orders List -->
                <div class="orders-list" id="ordersList">
                    ${allTasks.map(task => `
                        <div class="order-card" data-status="${task.status}" data-date="${task.date}" onclick="router.navigate('/order-detail', { taskId: ${task.id} })">
                            <div class="order-card-left">
                                <div class="order-number">${task.orderNumber}</div>
                                <div class="order-badge order-type-${task.type.toLowerCase()}">${task.type}</div>
                            </div>
                            <div class="order-card-main">
                                <h3>${task.title}</h3>
                                <div class="order-meta">
                                    <span class="order-meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        ${task.customer.name}
                                    </span>
                                    <span class="order-meta-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        ${formatDate(task.date)}
                                    </span>
                                </div>
                                <div class="order-location">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    ${task.location.address}
                                </div>
                            </div>
                            <div class="order-card-right">
                                <span class="order-status status-${task.status}">${getStatusText(task.status)}</span>
                                <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
}

// Filter orders
function setOrderFilter(filter, button) {
    // Update active chip
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    button.classList.add('active');
    
    // Filter orders
    const orders = document.querySelectorAll('.order-card');
    const today = new Date().toISOString().split('T')[0];
    
    orders.forEach(order => {
        let show = false;
        
        if (filter === 'all') {
            show = true;
        } else if (filter === 'today') {
            show = order.dataset.date === today;
        } else {
            show = order.dataset.status === filter;
        }
        
        order.style.display = show ? 'flex' : 'none';
    });

    vibrate(20);
}

// Search orders
function filterOrders() {
    const searchValue = document.getElementById('orderSearch').value.toLowerCase();
    const orders = document.querySelectorAll('.order-card');
    
    orders.forEach(order => {
        const text = order.textContent.toLowerCase();
        const matches = text.includes(searchValue);
        order.style.display = matches ? 'flex' : 'none';
    });
}

router.register('/orders', renderOrdersPage);
