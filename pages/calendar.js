// Calendar Page
function renderCalendarPage() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const content = `
        <div class="page page-calendar">
            <div class="page-header">
                <h1>Kalender</h1>
                <button class="button-icon" onclick="showToday()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </button>
            </div>

            <div class="page-content">
                <!-- Month Navigation -->
                <div class="calendar-nav">
                    <button class="calendar-nav-btn" onclick="changeMonth(-1)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <h2 id="currentMonthYear"></h2>
                    <button class="calendar-nav-btn" onclick="changeMonth(1)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>

                <!-- Calendar Grid -->
                <div class="calendar-container">
                    <div class="calendar-weekdays">
                        <div class="weekday">Man</div>
                        <div class="weekday">Tir</div>
                        <div class="weekday">Ons</div>
                        <div class="weekday">Tor</div>
                        <div class="weekday">Fre</div>
                        <div class="weekday">Lør</div>
                        <div class="weekday">Søn</div>
                    </div>
                    <div class="calendar-days" id="calendarDays">
                        <!-- Days will be rendered here -->
                    </div>
                </div>

                <!-- Selected Day Tasks -->
                <div class="selected-day-section" id="selectedDaySection" style="display: none;">
                    <div class="section-header">
                        <h3 id="selectedDayTitle"></h3>
                        <button class="button-text" onclick="clearSelection()">Luk</button>
                    </div>
                    <div id="selectedDayTasks" class="task-list">
                        <!-- Tasks for selected day -->
                    </div>
                </div>

                <!-- Month Overview -->
                <div class="month-stats">
                    <div class="stat-item">
                        <div class="stat-value" id="monthTotalTasks">0</div>
                        <div class="stat-label">Opgaver denne måned</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="monthCompletedTasks">0</div>
                        <div class="stat-label">Afsluttede</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="monthPendingTasks">0</div>
                        <div class="stat-label">Afventende</div>
                    </div>
                </div>

                <!-- Legend -->
                <div class="calendar-legend">
                    <div class="legend-item">
                        <span class="legend-dot" style="background: var(--success);"></span>
                        <span>Afsluttet</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot" style="background: var(--info);"></span>
                        <span>Aktiv</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot" style="background: var(--warning);"></span>
                        <span>Afventende</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('app-content').innerHTML = content;
    
    // Initialize calendar
    window.calendarState = {
        currentMonth: currentMonth,
        currentYear: currentYear,
        selectedDate: null
    };
    
    renderCalendar();
}

function renderCalendar() {
    const { currentMonth, currentYear } = window.calendarState;
    
    // Update month/year display
    const monthNames = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 
                        'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
    document.getElementById('currentMonthYear').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Get all tasks
    const allTasks = AppData.getAllTasks();
    
    // Calculate stats for current month
    const monthTasks = getTasksForMonth(currentMonth, currentYear);
    const completed = monthTasks.filter(t => t.status === 'completed').length;
    const pending = monthTasks.filter(t => t.status === 'pending').length;
    
    document.getElementById('monthTotalTasks').textContent = monthTasks.length;
    document.getElementById('monthCompletedTasks').textContent = completed;
    document.getElementById('monthPendingTasks').textContent = pending;
    
    // Render calendar days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get day of week (0 = Sunday, need to convert to Monday = 0)
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1; // Convert to Monday = 0
    
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Add days of month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = formatDateForComparison(date);
        const tasksOnDay = allTasks.filter(task => {
            const taskDate = new Date(task.date);
            return formatDateForComparison(taskDate) === dateStr;
        });
        
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = window.calendarState.selectedDate === dateStr;
        
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${tasksOnDay.length > 0 ? 'has-tasks' : ''}`;
        dayElement.onclick = () => selectDate(date);
        
        let dayHTML = `<div class="day-number">${day}</div>`;
        
        if (tasksOnDay.length > 0) {
            const statusColors = tasksOnDay.map(task => {
                if (task.status === 'completed') return 'var(--success)';
                if (task.status === 'active') return 'var(--info)';
                return 'var(--warning)';
            });
            
            dayHTML += '<div class="day-tasks">';
            statusColors.slice(0, 3).forEach(color => {
                dayHTML += `<span class="task-dot" style="background: ${color};"></span>`;
            });
            if (tasksOnDay.length > 3) {
                dayHTML += `<span class="task-count">+${tasksOnDay.length - 3}</span>`;
            }
            dayHTML += '</div>';
        }
        
        dayElement.innerHTML = dayHTML;
        calendarDays.appendChild(dayElement);
    }
}

function formatDateForComparison(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getTasksForMonth(month, year) {
    const allTasks = AppData.getAllTasks();
    return allTasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.getMonth() === month && taskDate.getFullYear() === year;
    });
}

function changeMonth(delta) {
    const { currentMonth, currentYear } = window.calendarState;
    
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    
    if (newMonth > 11) {
        newMonth = 0;
        newYear++;
    } else if (newMonth < 0) {
        newMonth = 11;
        newYear--;
    }
    
    window.calendarState.currentMonth = newMonth;
    window.calendarState.currentYear = newYear;
    window.calendarState.selectedDate = null;
    
    renderCalendar();
    clearSelection();
}

function showToday() {
    const today = new Date();
    window.calendarState.currentMonth = today.getMonth();
    window.calendarState.currentYear = today.getFullYear();
    window.calendarState.selectedDate = null;
    
    renderCalendar();
    clearSelection();
}

function selectDate(date) {
    const dateStr = formatDateForComparison(date);
    window.calendarState.selectedDate = dateStr;
    
    renderCalendar();
    
    // Show tasks for selected day
    const allTasks = AppData.getAllTasks();
    const tasksOnDay = allTasks.filter(task => {
        const taskDate = new Date(task.date);
        return formatDateForComparison(taskDate) === dateStr;
    });
    
    const selectedDaySection = document.getElementById('selectedDaySection');
    const selectedDayTitle = document.getElementById('selectedDayTitle');
    const selectedDayTasks = document.getElementById('selectedDayTasks');
    
    // Format date nicely
    const dayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
    const monthNames = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 
                        'juli', 'august', 'september', 'oktober', 'november', 'december'];
    
    selectedDayTitle.textContent = `${dayNames[date.getDay()]}, ${date.getDate()}. ${monthNames[date.getMonth()]}`;
    
    if (tasksOnDay.length === 0) {
        selectedDayTasks.innerHTML = `
            <div class="empty-state-small">
                <p>Ingen opgaver denne dag</p>
                <button class="button-secondary" onclick="showToast('Funktion kommer snart', 'info')">
                    + Tilføj opgave
                </button>
            </div>
        `;
    } else {
        selectedDayTasks.innerHTML = tasksOnDay.map(task => `
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
        `).join('');
    }
    
    selectedDaySection.style.display = 'block';
    
    // Scroll to selected day section
    setTimeout(() => {
        selectedDaySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function clearSelection() {
    window.calendarState.selectedDate = null;
    document.getElementById('selectedDaySection').style.display = 'none';
    renderCalendar();
}

router.register('/calendar', renderCalendarPage);
