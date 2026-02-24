// ============================================================================
// SIGNATURE PAD
// ============================================================================

/**
 * A canvas-based signature pad for capturing user signatures.
 * Supports both mouse and touch input with high-DPI scaling.
 * 
 * @class SignaturePad
 * @example
 * const pad = new SignaturePad('signatureCanvas');
 * if (!pad.isEmpty()) {
 *     const dataUrl = pad.getDataURL();
 * }
 */
class SignaturePad {
    /**
     * Creates a new signature pad instance
     * @param {string} canvasId - The ID of the canvas element
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn(`SignaturePad: Canvas element '${canvasId}' not found`);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.hasSignature = false;
        
        this.setupCanvas();
        this.bindEvents();
    }
    
    /**
     * Sets up canvas for high-DPI displays and configures drawing style
     * @private
     */
    setupCanvas() {
        // Use parent container dimensions as the source of truth — more reliable than
        // getBoundingClientRect on the canvas itself which can return 0 if not painted
        const parent = this.canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        this.dpr = dpr;

        // Read CSS-computed height (falls back to offsetHeight → 200)
        const cssH = parseFloat(getComputedStyle(this.canvas).height) || this.canvas.offsetHeight || 200;
        const cssW = (parent ? parent.clientWidth : 0) || this.canvas.offsetWidth || 300;

        this.canvas.width  = Math.round(cssW * dpr);
        this.canvas.height = Math.round(cssH * dpr);
        this.ctx.scale(dpr, dpr);
        
        // Configure drawing style
        this.ctx.strokeStyle = '#212121';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }
    
    /**
     * Binds mouse and touch event listeners to the canvas
     * @private
     */
    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
    }
    
    /**
     * Starts a new drawing path
     * @param {MouseEvent|Touch} e - Mouse or touch event
     * @private
     */
    startDrawing(e) {
        this.isDrawing = true;
        this.hasSignature = true;
        const pos = this.getPosition(e);
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    }
    
    /**
     * Continues drawing the current path
     * @param {MouseEvent|Touch} e - Mouse or touch event
     * @private
     */
    draw(e) {
        if (!this.isDrawing) return;
        const pos = this.getPosition(e);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
    }
    
    /**
     * Stops the current drawing path
     * @private
     */
    stopDrawing() {
        this.isDrawing = false;
    }
    
    /**
     * Calculates canvas position from mouse/touch event
     * @param {MouseEvent|Touch} e - Mouse or touch event
     * @returns {{x: number, y: number}} Canvas coordinates
     * @private
     */
    getPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left),
            y: (e.clientY - rect.top)
        };
    }
    
    /**
     * Clears the signature pad
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.hasSignature = false;
    }
    
    /**
     * Gets the signature as a data URL
     * @returns {string} PNG data URL of the signature
     */
    getDataURL() {
        return this.canvas.toDataURL('image/png');
    }
    
    /**
     * Checks if the signature pad is empty
     * @returns {boolean} True if no signature has been drawn
     */
    isEmpty() {
        return !this.hasSignature;
    }
}


// ============================================================================
// VOICE RECORDER
// ============================================================================

/**
 * Records audio using the MediaRecorder API.
 * Captures audio from device microphone and provides audio blob + base64 output.
 * 
 * @class VoiceRecorder
 * @example
 * const recorder = new VoiceRecorder();
 * const started = await recorder.start();
 * if (started) {
 *     const audio = await recorder.stop(); // { url, data, duration }
 * }
 */
class VoiceRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
    }
    
    /**
     * Starts recording audio from the microphone
     * @returns {Promise<boolean>} True if recording started successfully
     */
    async start() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };
            
            this.mediaRecorder.start();
            this.isRecording = true;
            return true;
        } catch (error) {
            console.error('VoiceRecorder: Failed to start recording', error);
            showToast('Mikrofon adgang nægtet', 'error');
            return false;
        }
    }
    
    /**
     * Stops recording and returns the audio data
     * @returns {Promise<{url: string, data: string, duration: number}|null>} Audio data object or null
     */
    stop() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder || !this.isRecording) {
                resolve(null);
                return;
            }
            
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Convert to base64 for storage
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    resolve({
                        url: audioUrl,
                        data: reader.result,
                        duration: this.audioChunks.length
                    });
                };
            };
            
            this.mediaRecorder.stop();
            // Release microphone resources
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            this.isRecording = false;
        });
    }
}


// ============================================================================
// LOCATION SERVICE
// ============================================================================

/**
 * Static service for GPS location operations.
 * Provides geolocation, distance calculations, and reverse geocoding.
 * 
 * @class LocationService
 * @static
 */
class LocationService {
    /**
     * Gets the current device position using GPS
     * @returns {Promise<{lat: number, lng: number, accuracy: number}>} Location data
     * @throws {Error} If geolocation is not supported or permission denied
     */
    static async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation ikke understøttet'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    console.error('LocationService: Failed to get position', error);
                    reject(error);
                },
                {
                    enableHighAccuracy: CONFIG.GEO.HIGH_ACCURACY,
                    timeout: CONFIG.GEO.TIMEOUT,
                    maximumAge: CONFIG.GEO.MAX_AGE
                }
            );
        });
    }
    
    /**
     * Calculates distance between two coordinates using Haversine formula
     * @param {number} lat1 - First latitude
     * @param {number} lon1 - First longitude
     * @param {number} lat2 - Second latitude
     * @param {number} lon2 - Second longitude
     * @returns {number} Distance in kilometers
     */
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance;
    }
    
    /**
     * Formats distance in human-readable format
     * @param {number} km - Distance in kilometers
     * @returns {string} Formatted distance string (meters or km)
     */
    static formatDistance(km) {
        if (km < 1) {
            return `${Math.round(km * 1000)} m`;
        }
        return `${km.toFixed(1)} km`;
    }
    
    /**
     * Performs reverse geocoding to get address from coordinates
     * Uses BigDataCloud API (free, no API key required)
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @returns {Promise<string|null>} Formatted address or null on error
     */
    static async reverseGeocode(lat, lng) {
        try {
            const response = await fetch(
                `${CONFIG.GEOCODING.API_URL}?latitude=${lat}&longitude=${lng}&localityLanguage=${CONFIG.GEOCODING.LANGUAGE}`
            );
            
            if (!response.ok) {
                throw new Error(`Geocoding failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Geocode response:', data);
            
            // Build address from available components
            const addressParts = [];
            
            // Try to get street name and number
            if (data.localityName && data.localityName !== data.locality) {
                addressParts.push(data.localityName);
            }
            
            // Check administrative levels for street/road info (Order 8 = street level in Denmark)
            if (data.localityInfo?.administrative) {
                const admin = data.localityInfo.administrative;
                const street = admin.find(a => a.order === 8 && a.name);
                if (street && !addressParts.includes(street.name)) {
                    addressParts.push(street.name);
                }
            }
            
            // Add city/locality (avoid duplicates)
            if (data.city && !addressParts.includes(data.city)) {
                addressParts.push(data.city);
            } else if (data.locality && !addressParts.includes(data.locality)) {
                addressParts.push(data.locality);
            }
            
            // Fallback to region if no specific address
            const formattedAddress = addressParts.length > 0 
                ? addressParts.join(', ')
                : (data.principalSubdivision || 'Ukendt lokation');
            
            return formattedAddress;
        } catch (error) {
            console.error('LocationService: Reverse geocoding failed', error);
            return null;
        }
    }
}


// ============================================================================
// QUICK TIMER
// ============================================================================

/**
 * Manages a quick timer widget for tracking work time on tasks.
 * Persists timer state in localStorage and can restore after page reload.
 * 
 * @class QuickTimer
 */
class QuickTimer {
    constructor() {
        this.startTime = null;
        this.elapsedTime = 0;
        this.interval = null;
        this.isRunning = false;
        this.currentTaskId = null;
    }
    
    /**
     * Starts the timer for a specific task
     * @param {string} taskId - ID of the task to time
     */
    start(taskId) {
        if (this.isRunning) {
            this.stop();
        }
        
        this.currentTaskId = taskId;
        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;
        
        // Update display every second
        this.interval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
        }, 1000);
        
        // Persist timer state
        saveToStorage('quickTimer', {
            taskId,
            startTime: this.startTime,
            elapsedTime: this.elapsedTime
        });
        
        vibrate(CONFIG.VIBRATION.SHORT);
    }
    
    /**
     * Stops the timer and returns elapsed time
     * @returns {number} Elapsed time in milliseconds
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        
        const duration = this.elapsedTime;
        this.elapsedTime = 0;
        this.startTime = null;
        
        localStorage.removeItem('quickTimer');
        
        return duration;
    }
    
    /**
     * Updates the timer display element
     * @private
     */
    updateDisplay() {
        const element = document.getElementById('quickTimerDisplay');
        if (element) {
            element.textContent = this.formatTime(this.elapsedTime);
        }
    }
    
    /**
     * Formats milliseconds to HH:MM:SS or MM:SS
     * @param {number} ms - Time in milliseconds
     * @returns {string} Formatted time string
     * @private
     */
    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    }
    
    /**
     * Restores timer state from localStorage (called on page load)
     */
    restore() {
        const saved = getFromStorage('quickTimer');
        if (saved && saved.startTime) {
            this.currentTaskId = saved.taskId;
            this.startTime = saved.startTime;
            this.elapsedTime = Date.now() - saved.startTime;
            this.isRunning = true;
            
            // Resume interval
            this.interval = setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateDisplay();
            }, 1000);
        }
    }
}

// ============================================================================
// GLOBAL TIMER INSTANCE
// ============================================================================

/**
 * Global quick timer instance used across the application
 * @type {QuickTimer}
 */
const quickTimer = new QuickTimer();


// ============================================================================
// ACTIVITY LOGGER
// ============================================================================

/**
 * Static service for logging user activities.
 * Maintains a log of recent activities with automatic trimming.
 * 
 * @class ActivityLogger
 * @static
 */
class ActivityLogger {
    /**
     * Logs a new activity
     * @param {string} type - Activity type (e.g., 'photo', 'note', 'checklist')
     * @param {string} description - Human-readable description
     * @param {string|null} taskId - Associated task ID (optional)
     */
    static log(type, description, taskId = null) {
        const activities = getFromStorage('activities', []);
        
        activities.unshift({
            id: generateId(),
            type,
            description,
            taskId,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 activities
        if (activities.length > 50) {
            activities.length = 50;
        }
        
        saveToStorage('activities', activities);
    }
    
    /**
     * Retrieves recent activities
     * @param {number} limit - Maximum number of activities to return
     * @returns {Array<Object>} Array of activity objects
     */
    static getRecent(limit = 10) {
        const activities = getFromStorage('activities', []);
        return activities.slice(0, limit);
    }
    
    /**
     * Clears all logged activities
     */
    static clear() {
        saveToStorage('activities', []);
    }
}


// ============================================================================
// SWIPE HANDLER
// ============================================================================

/**
 * Handles touch swipe gestures on an element.
 * Detects left and right swipes and triggers callbacks.
 * 
 * @class SwipeHandler
 * @example
 * const handler = new SwipeHandler(element, {
 *     onSwipeRight: () => console.log('Swiped right'),
 *     onSwipeLeft: () => console.log('Swiped left')
 * });
 */
class SwipeHandler {
    /**
     * Creates a new swipe handler
     * @param {HTMLElement} element - Element to track swipes on
     * @param {Object} callbacks - Callback functions
     * @param {Function} [callbacks.onSwipeRight] - Called on right swipe
     * @param {Function} [callbacks.onSwipeLeft] - Called on left swipe
     */
    constructor(element, callbacks) {
        this.element = element;
        this.callbacks = callbacks;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.SWIPE_THRESHOLD = 50; // Minimum swipe distance in pixels
        
        this.bindEvents();
    }
    
    /**
     * Binds touch event listeners
     * @private
     */
    bindEvents() {
        this.element.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        });
        
        this.element.addEventListener('touchmove', (e) => {
            this.currentX = e.touches[0].clientX;
            this.currentY = e.touches[0].clientY;
        });
        
        this.element.addEventListener('touchend', () => {
            const diffX = this.currentX - this.startX;
            const diffY = this.currentY - this.startY;
            
            // Only trigger if horizontal swipe is dominant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.SWIPE_THRESHOLD) {
                if (diffX > 0 && this.callbacks.onSwipeRight) {
                    this.callbacks.onSwipeRight();
                } else if (diffX < 0 && this.callbacks.onSwipeLeft) {
                    this.callbacks.onSwipeLeft();
                }
            }
            
            // Reset coordinates
            this.startX = 0;
            this.startY = 0;
            this.currentX = 0;
            this.currentY = 0;
        });
    }
}


// ============================================================================
// CHECKLIST MANAGER
// ============================================================================

/**
 * Static service for managing task checklists.
 * Provides default checklist and progress tracking.
 * 
 * @class ChecklistManager
 * @static
 */
class ChecklistManager {
    /**
     * Returns the default checklist template from admin settings
     * @returns {Array<{id: number, text: string, completed: boolean}>} Default checklist items
     */
    static getDefaultChecklist() {
        // Get checklist items from active job type in admin settings
        const jobTypes = getFromStorage('admin_job_types', []);
        
        const activeJobTypeId = getFromStorage('admin_active_job_type', 1);
        const activeJobType = jobTypes.find(jt => jt.id === activeJobTypeId) || jobTypes[0];
        
        if (!activeJobType || !activeJobType.checklistItems) return [];
        
        // Convert to checklist format
        return activeJobType.checklistItems.map((text, index) => ({
            id: index + 1,
            text: text,
            completed: false
        }));
    }
    
    /**
     * Gets the checklist for a specific task
     * @param {string} taskId - Task ID
     * @returns {Array} Checklist items
     */
    static getChecklist(taskId) {
        const stored = AppData.getTaskData(taskId, 'checklist', null);
        // If nothing saved yet, or saved as empty array (before defaults existed), use defaults
        if (!stored || stored.length === 0) {
            const defaults = this.getDefaultChecklist();
            if (defaults.length > 0) {
                AppData.saveTaskData(taskId, 'checklist', defaults);
                return defaults;
            }
        }
        return stored || [];
    }
    
    /**
     * Updates a checklist item's completion status
     * @param {string} taskId - Task ID
     * @param {number} itemId - Checklist item ID
     * @param {boolean} completed - New completion status
     */
    static updateChecklistItem(taskId, itemId, completed) {
        const checklist = this.getChecklist(taskId);
        const item = checklist.find(i => i.id === itemId);
        
        if (item) {
            item.completed = completed;
            AppData.saveTaskData(taskId, 'checklist', checklist);
            
            // Log activity
            const action = completed ? 'Afkrydsede' : 'Fjernede markering fra';
            ActivityLogger.log('checklist', `${action}: ${item.text}`, taskId);
            
            vibrate(CONFIG.VIBRATION.SHORT);
        }
    }
    
    /**
     * Gets checklist completion progress
     * @param {string} taskId - Task ID
     * @returns {{completed: number, total: number, percentage: number}} Progress statistics
     */
    static getProgress(taskId) {
        const checklist = this.getChecklist(taskId);
        const completed = checklist.filter(i => i.completed).length;
        const total = checklist.length;
        
        return {
            completed,
            total,
            percentage: total === 0 ? 0 : Math.round((completed / total) * 100)
        };
    }
}


// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize components on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Restore quick timer if it was running before page reload
    quickTimer.restore();
});

