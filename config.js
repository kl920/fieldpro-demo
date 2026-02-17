// Application Configuration
const CONFIG = {
    // App metadata
    APP_NAME: 'FieldPro',
    VERSION: '1.0.0',
    
    // Image processing
    IMAGE: {
        MAX_WIDTH: 1200,
        QUALITY: 0.7,
        ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
    },
    
    // Geolocation
    GEO: {
        TIMEOUT: 15000, // 15 seconds
        MAX_AGE: 300000, // 5 minutes
        HIGH_ACCURACY: true
    },
    
    // Geocoding API
    GEOCODING: {
        API_URL: 'https://api.bigdatacloud.net/data/reverse-geocode-client',
        LANGUAGE: 'da'
    },
    
    // QR Scanner
    QR_SCANNER: {
        FPS: 10,
        QRBOX: {
            width: 250,
            height: 250
        }
    },
    
    // Toast notifications
    TOAST: {
        DURATION: {
            SHORT: 2000,
            MEDIUM: 3000,
            LONG: 4000
        },
        ICONS: {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        }
    },
    
    // Status badges
    STATUS: {
        PENDING: 'pending',
        ACTIVE: 'active',
        COMPLETED: 'completed'
    },
    
    // Date/Time formats
    FORMATS: {
        DATE: { weekday: 'short', day: 'numeric', month: 'short' },
        FULL_DATE: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        TIME: { hour: '2-digit', minute: '2-digit' }
    },
    
    // Local storage keys
    STORAGE_KEYS: {
        TASKS: 'fieldpro_tasks',
        TASK_DATA: 'fieldpro_task_data_',
        ACTIVITY_LOG: 'fieldpro_activity_log'
    },
    
    // Vibration patterns
    VIBRATION: {
        SHORT: 50,
        MEDIUM: [50, 50, 50],
        LONG: [100, 50, 100]
    }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
