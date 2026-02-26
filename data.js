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
    },
    11: {
        id: 11,
        orderNumber: '431',
        title: 'Kloakrensning',
        type: 'Service',
        customer: {
            name: 'Dorthe Madsen',
            phone: '+45 29 33 44 55',
            email: 'dorthe@example.com'
        },
        location: {
            address: 'Elmevej 6, 4200 Slagelse',
            lat: 55.4022,
            lng: 11.3547
        },
        date: '2026-03-03',
        scheduledStart: '07:30',
        scheduledEnd: '10:00',
        status: 'pending',
        priority: 'high',
        description: 'Rensning af tilstoppet kloakledning.',
        estimatedHours: 2.5,
        billable: true
    },
    12: {
        id: 12,
        orderNumber: '436',
        title: 'Isolering af loft',
        type: 'Ny',
        customer: {
            name: 'Henrik Lund',
            phone: '+45 51 66 77 88',
            email: 'henrik@example.com'
        },
        location: {
            address: 'Fyrrevej 18, 7400 Herning',
            lat: 56.1396,
            lng: 8.9766
        },
        date: '2026-03-05',
        scheduledStart: '08:00',
        scheduledEnd: '15:00',
        status: 'pending',
        priority: 'medium',
        description: 'Efterisolering af loft med 200mm mineraluld.',
        estimatedHours: 7,
        billable: true
    },
    13: {
        id: 13,
        orderNumber: '440',
        title: 'Varmeanlæg service',
        type: 'Service',
        customer: {
            name: 'Susanne Holm',
            phone: '+45 33 55 66 77',
            email: 'susanne@example.com'
        },
        location: {
            address: 'Dahliasvej 3, 9000 Aalborg',
            lat: 57.0488,
            lng: 9.9217
        },
        date: '2026-03-09',
        scheduledStart: '09:00',
        scheduledEnd: '12:00',
        status: 'pending',
        priority: 'medium',
        description: 'Årligt serviceeftersyn af oliefyr og varmeanlæg.',
        estimatedHours: 3,
        billable: true
    },
    14: {
        id: 14,
        orderNumber: '445',
        title: 'Betonreparation',
        type: 'Ny',
        customer: {
            name: 'NordBeton A/S',
            phone: '+45 44 88 99 11',
            email: 'info@nordbeton.dk'
        },
        location: {
            address: 'Industriparken 22, 2600 Glostrup',
            lat: 55.6681,
            lng: 12.4003
        },
        date: '2026-03-12',
        scheduledStart: '07:00',
        scheduledEnd: '15:00',
        status: 'pending',
        priority: 'high',
        description: 'Reparation af revner i betondæk på parkeringsanlæg.',
        estimatedHours: 8,
        billable: true
    },
    15: {
        id: 15,
        orderNumber: '449',
        title: 'Facaderenovering',
        type: 'Ny',
        customer: {
            name: 'Boligfonden Vest',
            phone: '+45 76 22 33 44',
            email: 'kontakt@bfvest.dk'
        },
        location: {
            address: 'Havnegade 12, 6700 Esbjerg',
            lat: 55.4675,
            lng: 8.4530
        },
        date: '2026-03-16',
        scheduledStart: '08:00',
        scheduledEnd: '16:00',
        status: 'pending',
        priority: 'high',
        description: 'Pudsning og maling af facade på boligblok.',
        estimatedHours: 8,
        billable: true
    },
    16: {
        id: 16,
        orderNumber: '453',
        title: 'Solcelleinstallation',
        type: 'Ny',
        customer: {
            name: 'Rasmus Kjær',
            phone: '+45 21 44 55 66',
            email: 'rasmus@example.com'
        },
        location: {
            address: 'Skovstien 9, 8600 Silkeborg',
            lat: 56.1775,
            lng: 9.5494
        },
        date: '2026-03-19',
        scheduledStart: '08:30',
        scheduledEnd: '16:30',
        status: 'pending',
        priority: 'medium',
        description: 'Montering af 16 solceller og inverter.',
        estimatedHours: 8,
        billable: true
    },
    17: {
        id: 17,
        orderNumber: '458',
        title: 'Tagteglskifte',
        type: 'Service',
        customer: {
            name: 'Birte Olesen',
            phone: '+45 40 22 33 44',
            email: 'birte@example.com'
        },
        location: {
            address: 'Møllebanken 5, 5210 Odense NV',
            lat: 55.4141,
            lng: 10.3577
        },
        date: '2026-03-24',
        scheduledStart: '07:30',
        scheduledEnd: '13:30',
        status: 'pending',
        priority: 'medium',
        description: 'Udskiftning af revnede tagtegl efter storm.',
        estimatedHours: 6,
        billable: true
    },
    18: {
        id: 18,
        orderNumber: '462',
        title: 'Køleanlæg installation',
        type: 'Ny',
        customer: {
            name: 'Friskhuset ApS',
            phone: '+45 88 44 55 66',
            email: 'info@friskhuset.dk'
        },
        location: {
            address: 'Englandsgade 30, 5000 Odense C',
            lat: 55.3928,
            lng: 10.3783
        },
        date: '2026-03-27',
        scheduledStart: '09:00',
        scheduledEnd: '17:00',
        status: 'pending',
        priority: 'high',
        description: 'Installation af nyt køle- og frysekompleks til butik.',
        estimatedHours: 8,
        billable: true
    },
    19: {
        id: 19,
        orderNumber: '470',
        title: 'Fiber cable installation',
        type: 'Service',
        customer: {
            name: 'Michael Berg',
            phone: '+45 20 55 66 77',
            email: 'michael.berg@example.com'
        },
        location: {
            address: 'Kastanievej 12, 2800 Kongens Lyngby',
            lat: 55.7700,
            lng: 12.5030
        },
        date: '2026-02-26',
        scheduledStart: '08:00',
        scheduledEnd: '11:00',
        status: 'pending',
        priority: 'high',
        description: 'New fiber connection from street to house. Customer present at 08:00.',
        estimatedHours: 3,
        billable: true
    },
    20: {
        id: 20,
        orderNumber: '471',
        title: 'Network termination inspection',
        type: 'Service',
        customer: {
            name: 'Sandra Møller',
            phone: '+45 31 77 88 99',
            email: 'sandra@example.com'
        },
        location: {
            address: 'Rolighedsvej 5, 1958 Frederiksberg C',
            lat: 55.6780,
            lng: 12.5260
        },
        date: '2026-02-26',
        scheduledStart: '13:00',
        scheduledEnd: '15:00',
        status: 'pending',
        priority: 'medium',
        description: 'Inspection and testing of existing fiber termination point.',
        estimatedHours: 2,
        billable: true
    },
    21: {
        id: 21,
        orderNumber: '472',
        title: 'House entry point installation',
        type: 'Service',
        customer: {
            name: 'Klaus Henriksen',
            phone: '+45 40 33 44 55',
            email: 'klaus.h@example.com'
        },
        location: {
            address: 'Bregnevej 9, 3460 Birkerød',
            lat: 55.8460,
            lng: 12.4270
        },
        date: '2026-02-27',
        scheduledStart: '08:30',
        scheduledEnd: '12:30',
        status: 'pending',
        priority: 'high',
        description: 'Install new house entry point and route internal cable to living room.',
        estimatedHours: 4,
        billable: true
    },
    22: {
        id: 22,
        orderNumber: '473',
        title: 'Cable blowing - 45m',
        type: 'Service',
        customer: {
            name: 'Trine Vestergaard',
            phone: '+45 22 11 33 44',
            email: 'trine.v@example.com'
        },
        location: {
            address: 'Solbakken 3, 4300 Holbæk',
            lat: 55.7153,
            lng: 11.7145
        },
        date: '2026-02-28',
        scheduledStart: '09:00',
        scheduledEnd: '13:00',
        status: 'pending',
        priority: 'medium',
        description: 'Blow fiber cable through existing conduit, approx. 45 meters. No house entry required.',
        estimatedHours: 4,
        billable: true
    },
    23: {
        id: 23,
        orderNumber: '474',
        title: 'GF-TA upgrade',
        type: 'Service',
        customer: {
            name: 'Ole Dalgaard',
            phone: '+45 51 22 33 66',
            email: 'ole.d@example.com'
        },
        location: {
            address: 'Hybenvej 17, 8700 Horsens',
            lat: 55.8606,
            lng: 9.8470
        },
        date: '2026-03-01',
        scheduledStart: '10:00',
        scheduledEnd: '12:00',
        status: 'pending',
        priority: 'medium',
        description: 'Upgrade existing termination box to GF-TA. Customer must be home.',
        estimatedHours: 2,
        billable: true
    },
    24: {
        id: 24,
        orderNumber: '475',
        title: 'Fiber splice repair',
        type: 'Service',
        customer: {
            name: 'Hanne Christoffersen',
            phone: '+45 29 44 55 88',
            email: 'hanne.c@example.com'
        },
        location: {
            address: 'Lindegårdsvej 22, 2920 Charlottenlund',
            lat: 55.7570,
            lng: 12.5820
        },
        date: '2026-03-02',
        scheduledStart: '08:00',
        scheduledEnd: '10:30',
        status: 'pending',
        priority: 'high',
        description: 'Repair broken splice in outdoor splice box. No internet since yesterday.',
        estimatedHours: 2.5,
        billable: true
    },
    25: {
        id: 25,
        orderNumber: '476',
        title: 'New connection - apartment block',
        type: 'Service',
        customer: {
            name: 'Boligselskabet Nord',
            phone: '+45 70 22 44 66',
            email: 'drift@bsnord.dk'
        },
        location: {
            address: 'Nørrebrogade 81, 2200 København N',
            lat: 55.6960,
            lng: 12.5510
        },
        date: '2026-03-03',
        scheduledStart: '07:30',
        scheduledEnd: '15:30',
        status: 'pending',
        priority: 'high',
        description: 'Install fiber connections for 4 apartments. Conduit already available.',
        estimatedHours: 8,
        billable: true
    },
    26: {
        id: 26,
        orderNumber: '477',
        title: 'Activation check - Status 100',
        type: 'Service',
        customer: {
            name: 'Finn Overgaard',
            phone: '+45 42 88 11 22',
            email: 'finn.o@example.com'
        },
        location: {
            address: 'Åbrinken 6, 8800 Viborg',
            lat: 56.4530,
            lng: 9.3970
        },
        date: '2026-03-04',
        scheduledStart: '09:00',
        scheduledEnd: '11:00',
        status: 'pending',
        priority: 'low',
        description: 'Verify fiber activation and signal levels after recent installation.',
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
        // Always start with DEMO_TASKS as the base so new tasks are never lost.
        // Saved data overrides individual tasks (preserves status changes etc.)
        this.tasks = { ...DEMO_TASKS, ...(saved || {}) };
        this.saveToLocalStorage();
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
