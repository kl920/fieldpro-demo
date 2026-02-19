/**
 * Data Management Layer
 * Handles all application data storage and retrieval
 */

// ============================================================================
// DEMO DATA
// ============================================================================

const DEMO_TASKS = {
    1: {
        id: 1,
        orderNumber: '378-1',
        title: 'Køkkenmontering',
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
        date: '2026-02-19',
        scheduledStart: '08:00',
        scheduledEnd: '16:00',
        status: 'active',
        priority: 'high',
        description: 'Montering af nyt køkken inkl. bordplade, skabe og hvidevarer.',
        estimatedHours: 8,
        billable: true
    },
    2: {
        id: 2,
        orderNumber: '361',
        title: 'VVS reparation',
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
        date: '2026-02-19',
        scheduledStart: '13:00',
        scheduledEnd: '15:00',
        status: 'pending',
        priority: 'medium',
        description: 'Service af toilet - reparation af skylle­mekanisme.',
        estimatedHours: 2,
        billable: true
    },
    3: {
        id: 3,
        orderNumber: '355-1',
        title: 'Terrændæk støbning',
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
        date: '2026-02-20',
        scheduledStart: '07:00',
        scheduledEnd: '15:00',
        status: 'pending',
        priority: 'high',
        description: 'Støbning af terrændæk til nybyggeri.',
        estimatedHours: 8,
        billable: true
    },
    4: {
        id: 4,
        orderNumber: '344',
        title: 'El-installation',
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
        date: '2026-02-20',
        scheduledStart: '09:00',
        scheduledEnd: '12:00',
        status: 'pending',
        priority: 'medium',
        description: 'Installation af ny el-tavle.',
        estimatedHours: 3,
        billable: true
    },
    5: {
        id: 5,
        orderNumber: '399',
        title: 'Malerarbejde',
        type: 'Ny',
        customer: {
            name: 'Lars Nielsen',
            phone: '+45 25 44 55 66',
            email: 'lars@example.com'
        },
        location: {
            address: 'Rosenvej 15, 8000 Aarhus C',
            lat: 56.1629,
            lng: 10.2039
        },
        date: '2026-02-21',
        scheduledStart: '08:00',
        scheduledEnd: '16:00',
        status: 'pending',
        priority: 'medium',
        description: 'Maling af stue og gang.',
        estimatedHours: 8,
        billable: true
    },
    6: {
        id: 6,
        orderNumber: '402',
        title: 'Badeværelse renovering',
        type: 'Ny',
        customer: {
            name: 'Maria Hansen',
            phone: '+45 40 77 88 99',
            email: 'maria@example.com'
        },
        location: {
            address: 'Birkevej 23, 5000 Odense C',
            lat: 55.3959,
            lng: 10.3883
        },
        date: '2026-02-22',
        scheduledStart: '08:00',
        scheduledEnd: '17:00',
        status: 'pending',
        priority: 'high',
        description: 'Renovering af badeværelse med nyt flisegulv.',
        estimatedHours: 9,
        billable: true
    },
    7: {
        id: 7,
        orderNumber: '410',
        title: 'Vinduesudskiftning',
        type: 'Service',
        customer: {
            name: 'Thomas Petersen',
            phone: '+45 31 22 33 44',
            email: 'thomas@example.com'
        },
        location: {
            address: 'Strandvej 42, 2900 Hellerup',
            lat: 55.7340,
            lng: 12.5765
        },
        date: '2026-02-23',
        scheduledStart: '09:00',
        scheduledEnd: '14:00',
        status: 'pending',
        priority: 'medium',
        description: 'Udskiftning af 3 vinduer i stueetage.',
        estimatedHours: 5,
        billable: true
    },
    8: {
        id: 8,
        orderNumber: '415',
        title: 'Tageftersyn',
        type: 'Service',
        customer: {
            name: 'Anne Sørensen',
            phone: '+45 42 55 66 77',
            email: 'anne@example.com'
        },
        location: {
            address: 'Møllevej 8, 4000 Roskilde',
            lat: 55.6415,
            lng: 12.0803
        },
        date: '2026-02-24',
        scheduledStart: '10:00',
        scheduledEnd: '13:00',
        status: 'pending',
        priority: 'low',
        description: 'Rutineeftersyn af tag og tagrender.',
        estimatedHours: 3,
        billable: true
    },
    9: {
        id: 9,
        orderNumber: '420',
        title: 'Gulvlægning',
        type: 'Ny',
        customer: {
            name: 'Peter Andersen',
            phone: '+45 23 44 55 66',
            email: 'peter@example.com'
        },
        location: {
            address: 'Parkvej 15, 2000 Frederiksberg',
            lat: 55.6790,
            lng: 12.5345
        },
        date: '2026-02-24',
        scheduledStart: '08:00',
        scheduledEnd: '16:00',
        status: 'pending',
        priority: 'medium',
        description: 'Lægning af parketgulv i soveværelse og stue.',
        estimatedHours: 8,
        billable: true
    },
    10: {
        id: 10,
        orderNumber: '425',
        title: 'Garage port reparation',
        type: 'Service',
        customer: {
            name: 'Jens Mortensen',
            phone: '+45 50 11 22 33',
            email: 'jens@example.com'
        },
        location: {
            address: 'Egevej 30, 3000 Helsingør',
            lat: 56.0362,
            lng: 12.6136
        },
        date: '2026-02-25',
        scheduledStart: '10:00',
        scheduledEnd: '12:00',
        status: 'pending',
        priority: 'low',
        description: 'Reparation af automatisk garageport mekanisme.',
        estimatedHours: 2,
        billable: true
    }
};

const COMMON_MATERIALS = [
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
];

// ============================================================================
// DATA LAYER
// ============================================================================

/**
 * Application data management singleton
 */
const AppData = {
    // Data storage
    tasks: {},
    commonMaterials: COMMON_MATERIALS,
    
    /**
     * Get task by ID
     * @param {number|string} id - Task ID
     * @returns {Object|undefined} Task object
     */
    getTask(id) {
        return this.tasks[id];
    },

    /**
     * Get all tasks as array
     * @returns {Array<Object>} Array of all tasks
     */
    getAllTasks() {
        return Object.values(this.tasks);
    },

    /**
     * Get tasks for today
     * @returns {Array<Object>} Today's tasks
     */
    getTodayTasks() {
        const today = new Date().toISOString().split('T')[0];
        return this.getAllTasks().filter(task => task.date === today);
    },

    /**
     * Get tasks filtered by status
     * @param {string} status - Status to filter by
     * @returns {Array<Object>} Filtered tasks
     */
    getTasksByStatus(status) {
        return this.getAllTasks().filter(task => task.status === status);
    },

    /**
     * Update task with new data
     * @param {number|string} id - Task ID
     * @param {Object} updates - Fields to update
     * @returns {boolean} Success status
     */
    updateTask(id, updates) {
        if (!this.tasks[id]) {
            console.error(`Task ${id} not found`);
            return false;
        }
        
        this.tasks[id] = { ...this.tasks[id], ...updates };
        this.saveToLocalStorage();
        return true;
    },

    /**
     * Save task-specific data (photos, materials, time, etc)
     * @param {number|string} taskId - Task ID
     * @param {string} dataType - Type of data (photos, materials, time, notes, etc)
     * @param {*} data - Data to save
     * @returns {boolean} Success status
     */
    saveTaskData(taskId, dataType, data) {
        const key = `${CONFIG.STORAGE_KEYS.TASK_DATA}${taskId}_${dataType}`;
        return saveToStorage(key, data);
    },

    /**
     * Get task-specific data
     * @param {number|string} taskId - Task ID
     * @param {string} dataType - Type of data
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Saved data or default value
     */
    getTaskData(taskId, dataType, defaultValue = null) {
        const key = `${CONFIG.STORAGE_KEYS.TASK_DATA}${taskId}_${dataType}`;
        return getFromStorage(key, defaultValue);
    },

    /**
     * Save all tasks to localStorage
     * @returns {boolean} Success status
     */
    saveToLocalStorage() {
        return saveToStorage(CONFIG.STORAGE_KEYS.TASKS, this.tasks);
    },

    /**
     * Load tasks from localStorage
     */
    loadFromLocalStorage() {
        const saved = getFromStorage(CONFIG.STORAGE_KEYS.TASKS);
        if (saved && Object.keys(saved).length > 0) {
            this.tasks = saved;
        } else {
            // Use demo data if no saved data exists
            this.tasks = { ...DEMO_TASKS };
            this.saveToLocalStorage();
        }
    },

    /**
     * Reset to demo data (useful for testing)
     */
    resetToDemoData() {
        this.tasks = { ...DEMO_TASKS };
        this.saveToLocalStorage();
        showToast('Data nulstillet til demo', 'info');
    },

    /**
     * Initialize data layer
     */
    init() {
        this.loadFromLocalStorage();
        console.log(`AppData initialized with ${this.getAllTasks().length} tasks`);
    }
};

// Initialize on load
AppData.init();
