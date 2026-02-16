// Data Management

const AppData = {
    // Tasks/Orders
    tasks: {
        1: {
            id: 1,
            orderNumber: '378-1',
            title: 'Montering',
            type: 'Ny',
            customer: {
                name: 'Isabella Westen',
                phone: '+45 20 12 34 56',
                email: 'isabella@example.com'
            },
            location: {
                address: 'Lyngbyvej 28, 2100 København Ø',
                lat: 55.7058,
                lng: 12.5733
            },
            date: '2026-02-16',
            scheduledStart: '07:00',
            scheduledEnd: '15:00',
            status: 'active',
            priority: 'high',
            description: 'Montering af nyt køkken inkl. bordplade, skabe og hvidevarer.',
            estimatedHours: 8,
            billable: true
        },
        2: {
            id: 2,
            orderNumber: '361',
            title: 'WC',
            type: 'Service',
            customer: {
                name: 'Pia Jørgensen',
                phone: '+45 30 11 22 33',
                email: 'pia@example.com'
            },
            location: {
                address: 'Skolevej 8, 4650 Køge',
                lat: 55.4580,
                lng: 12.1823
            },
            date: '2026-02-16',
            scheduledStart: '09:00',
            scheduledEnd: '11:00',
            status: 'pending',
            priority: 'medium',
            description: 'Service af toilet - reparation af skylle­mekanisme.',
            estimatedHours: 2,
            billable: true
        },
        3: {
            id: 3,
            orderNumber: '355-1',
            title: 'Terrændæk 10',
            type: 'Ny',
            customer: {
                name: 'Bygmithus A/S',
                phone: '+45 44 55 66 77',
                email: 'info@bygmithus.dk'
            },
            location: {
                address: 'Byggevej 1, 6850 Varde',
                lat: 55.6217,
                lng: 8.4831
            },
            date: '2026-02-17',
            scheduledStart: '08:00',
            scheduledEnd: '16:00',
            status: 'pending',
            priority: 'high',
            description: 'Støbning af terrændæk til nybyggeri.',
            estimatedHours: 8,
            billable: true
        },
        4: {
            id: 4,
            orderNumber: '344',
            title: 'Nyt el',
            type: 'Service',
            customer: {
                name: 'JITS ApS',
                phone: '+45 22 88 99 00',
                email: 'kontakt@jits.dk'
            },
            location: {
                address: 'Sunekær 1, 5471 Søndersø',
                lat: 55.4948,
                lng: 10.2632
            },
            date: '2026-02-18',
            scheduledStart: '10:00',
            scheduledEnd: '14:00',
            status: 'pending',
            priority: 'low',
            description: 'Installation af ny el-tavle.',
            estimatedHours: 4,
            billable: true
        }
    },

    // Common materials
    commonMaterials: [
        { name: 'Gulvbrædder', unit: 'm2', category: 'Træ' },
        { name: 'Skruer 4x50mm', unit: 'stk', category: 'Beslag' },
        { name: 'Spartelmasse', unit: 'kg', category: 'Maling' },
        { name: 'Maling hvid', unit: 'l', category: 'Maling' },
        { name: 'Gips', unit: 'kg', category: 'Bygningsmaterialer' },
        { name: 'Cement', unit: 'kg', category: 'Bygningsmaterialer' },
        { name: 'Kabler 3x1.5', unit: 'm', category: 'El' },
        { name: 'Stikkontakt', unit: 'stk', category: 'El' },
        { name: 'Rør 110mm', unit: 'm', category: 'VVS' },
        { name: 'Bøjning 90°', unit: 'stk', category: 'VVS' }
    ],

    // Get task by ID
    getTask(id) {
        return this.tasks[id];
    },

    // Get all tasks
    getAllTasks() {
        return Object.values(this.tasks);
    },

    // Get tasks for today
    getTodayTasks() {
        const today = new Date().toISOString().split('T')[0];
        return this.getAllTasks().filter(task => task.date === today);
    },

    // Get tasks by status
    getTasksByStatus(status) {
        return this.getAllTasks().filter(task => task.status === status);
    },

    // Update task
    updateTask(id, updates) {
        if (this.tasks[id]) {
            this.tasks[id] = { ...this.tasks[id], ...updates };
            this.saveToLocalStorage();
            return true;
        }
        return false;
    },

    // Save task data (materials, photos, time, notes)
    saveTaskData(taskId, dataType, data) {
        const key = `task_${taskId}_${dataType}`;
        saveToStorage(key, data);
    },

    // Get task data
    getTaskData(taskId, dataType, defaultValue = null) {
        const key = `task_${taskId}_${dataType}`;
        return getFromStorage(key, defaultValue);
    },

    // Save to localStorage
    saveToLocalStorage() {
        saveToStorage('app_tasks', this.tasks);
    },

    // Load from localStorage
    loadFromLocalStorage() {
        const saved = getFromStorage('app_tasks');
        if (saved) {
            this.tasks = saved;
        }
    },

    // Initialize
    init() {
        this.loadFromLocalStorage();
    }
};

// Initialize data
AppData.init();
