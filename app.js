// Mock data for tasks
const tasks = {
    1: {
        id: 1,
        title: "#19 - Udskiftning af gulv",
        date: "06/05 - 2025",
        location: "Østre Alle 101, 9000 Aalborg",
        description: "Påbegyndt arbejde på Østre Alle 101. Se vedhæftede billeder for flere detaljer.",
        startTime: "07:00",
        endTime: "15:00",
        pause: "00:45",
        status: "active",
        type: "Ny",
        customer: "Isabella Westen"
    },
    2: {
        id: 2,
        title: "#20 - VVS service",
        date: "16/02 - 2026",
        location: "Nørregade 45, 9000 Aalborg",
        description: "Eftersyn af vandinstallationer og kontrol af varmtvandsbeholder.",
        startTime: "15:30",
        endTime: "17:00",
        pause: "00:00",
        status: "pending",
        type: "Service",
        customer: "Pia Jørgensen"
    },
    3: {
        id: 3,
        title: "#21 - Elektriker eftersyn",
        date: "16/02 - 2026",
        location: "Vesterbro 12, 9000 Aalborg",
        description: "Årligt eftersyn af el-installation i erhvervsejendom.",
        startTime: "09:00",
        endTime: "11:00",
        pause: "00:00",
        status: "pending",
        type: "Service",
        customer: "Bygmithus A/S"
    },
    4: {
        id: 4,
        title: "#22 - Nyt el",
        date: "16/02 - 2026",
        location: "Sunekær 1, 5471 Søndersø",
        description: "Installation af ny el-tavle og ledninger.",
        startTime: "08:00",
        endTime: "16:00",
        pause: "00:30",
        status: "pending",
        type: "Ny",
        customer: "JITS ApS"
    }
};

let currentFilter = 'all';

// Display current date
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('da-DK', options);
    }
}

// Open task detail
function openTask(taskId) {
    localStorage.setItem('currentTaskId', taskId);
    window.location.href = 'task.html';
}

// Filter tasks
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active chip
    document.querySelectorAll('.chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.filter === filter) {
            chip.classList.add('active');
        }
    });
    
    filterTasks();
}

// Search and filter tasks
function filterTasks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const taskCards = document.querySelectorAll('.task-card');
    
    taskCards.forEach((card, index) => {
        const taskId = index + 1;
        const task = tasks[taskId];
        
        if (!task) return;
        
        // Check search term
        const matchesSearch = !searchTerm || 
            task.title.toLowerCase().includes(searchTerm) ||
            task.location.toLowerCase().includes(searchTerm) ||
            task.customer.toLowerCase().includes(searchTerm);
        
        // Check filter
        let matchesFilter = true;
        if (currentFilter === 'active') {
            matchesFilter = task.status === 'active';
        } else if (currentFilter === 'pending') {
            matchesFilter = task.status === 'pending';
        } else if (currentFilter === 'today') {
            matchesFilter = task.date.includes('16/02');
        }
        
        // Show or hide card
        if (matchesSearch && matchesFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Toggle filter visibility
function toggleFilter() {
    const filterChips = document.getElementById('filterChips');
    if (filterChips.style.display === 'none') {
        filterChips.style.display = 'flex';
    } else {
        filterChips.style.display = 'none';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentDate();
});
