/**
 * Utility Functions
 * Organized by category for better maintainability
 */

// ============================================================================
// UI NOTIFICATIONS
// ============================================================================

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 * @param {number} duration - How long to show the toast in ms
 */
function showToast(message, type = 'info', duration = CONFIG.TOAST.DURATION.MEDIUM) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = CONFIG.TOAST.ICONS[type] || CONFIG.TOAST.ICONS.info;
    toast.innerHTML = `
        <div class="toast-icon" style="width: 20px; height: 20px;">${icon}</div>
        <div class="toast-message">${message}</div>
    `;
    
    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

/**
 * Show/hide loading overlay
 */
function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
}

/**
 * Vibrate device if supported
 * @param {number|number[]} pattern - Vibration duration or pattern
 */
function vibrate(pattern = CONFIG.VIBRATION.SHORT) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// ============================================================================
// DATE & TIME FORMATTING
// ============================================================================

/**
 * Format time string
 * @param {string} timeString - Time in HH:MM format
 * @returns {string} Formatted time or '00:00'
 */
function formatTime(timeString) {
    return timeString || '00:00';
}

/**
 * Convert time string to minutes
 * @param {string} time - Time in HH:MM format
 * @returns {number} Total minutes
 */
function timeToMinutes(time) {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Convert minutes to time string
 * @param {number} minutes - Total minutes
 * @returns {string} Time in HH:MM format
 */
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Format date string to Danish format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', CONFIG.FORMATS.DATE);
}

/**
 * Format date string to full Danish format
 * @param {string} dateString - ISO date string
 * @returns {string} Full formatted date
 */
function formatFullDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', CONFIG.FORMATS.FULL_DATE);
}

/**
 * Format photo timestamp with relative date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted timestamp
 */
function formatPhotoTimestamp(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const timeStr = date.toLocaleTimeString('da-DK', CONFIG.FORMATS.TIME);
    
    if (isToday) {
        return `I dag ${timeStr}`;
    }
    
    const dateStr = date.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
    return `${dateStr} ${timeStr}`;
}

/**
 * Check if date is today
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is today
 */
function isToday(dateString) {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
}

/**
 * Get greeting based on time of day
 * @returns {string} Danish greeting
 */
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 10) return 'God morgen';
    if (hour < 18) return 'God dag';
    return 'God aften';
}

// ============================================================================
// GPS & LOCATION
// ============================================================================

/**
 * Format GPS coordinates to human-readable string
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Formatted coordinates
 */
function formatGPSCoordinates(lat, lng) {
    if (!lat || !lng) return '';
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'Ø' : 'V';
    return `${Math.abs(lat).toFixed(5)}° ${latDir}, ${Math.abs(lng).toFixed(5)}° ${lngDir}`;
}

/**
 * Get Google Maps link for coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Google Maps URL
 */
function getGoogleMapsLink(lat, lng) {
    if (!lat || !lng) return '#';
    return `https://www.google.com/maps?q=${lat},${lng}`;
}

// ============================================================================
// IMAGE PROCESSING
// ============================================================================

/**
 * Compress image file before upload
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<string>} Compressed image as base64
 */
function compressImage(file, maxWidth = CONFIG.IMAGE.MAX_WIDTH, quality = CONFIG.IMAGE.QUALITY) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Failed to read file'));
        
        reader.onload = (e) => {
            const img = new Image();
            img.onerror = () => reject(new Error('Failed to load image'));
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                
                // Maintain aspect ratio
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    });
}

// ============================================================================
// STATUS HELPERS
// ============================================================================

/**
 * Get color for status
 * @param {string} status - Status code
 * @returns {string} Hex color code
 */
function getStatusColor(status) {
    const colors = {
        active: '#4CAF50',
        pending: '#FF9800',
        completed: '#2196F3',
        cancelled: '#F44336'
    };
    return colors[status] || '#757575';
}

/**
 * Get Danish text for status
 * @param {string} status - Status code
 * @returns {string} Danish status text
 */
function getStatusText(status) {
    const texts = {
        active: 'I gang',
        pending: 'Ikke startet',
        completed: 'Afsluttet',
        cancelled: 'Annulleret'
    };
    return texts[status] || status;
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

/**
 * Safely get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Parsed value or default
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Storage read error:', error);
        return defaultValue;
    }
}

/**
 * Safely save item to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to save
 * @returns {boolean} Success status
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Storage write error:', error);
        showToast('Kunne ikke gemme data', 'error');
        return false;
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyToClipboard(text);
        return;
    }
    
    navigator.clipboard.writeText(text)
        .then(() => showToast('Kopieret til udklipsholder', 'success', CONFIG.TOAST.DURATION.SHORT))
        .catch(() => fallbackCopyToClipboard(text));
}

/**
 * Fallback clipboard copy for older browsers
 * @param {string} text - Text to copy
 */
function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('Kopieret til udklipsholder', 'success', CONFIG.TOAST.DURATION.SHORT);
    } catch (error) {
        showToast('Kunne ikke kopiere', 'error');
    }
    
    document.body.removeChild(textarea);
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Scroll to element smoothly
 * @param {HTMLElement} element - Element to scroll to
 * @param {number} offset - Offset from top
 */
function scrollToElement(element, offset = 0) {
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Format Danish phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) {
        return `+45 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
}

// ============================================================================
// MOCK FUNCTIONS (Replace with real API calls in production)
// ============================================================================

/**
 * Get weather data (mock)
 * @returns {Object} Weather object
 */
function getWeather() {
    const conditions = ['Solrigt', 'Let skyet', 'Overskyet', 'Regn'];
    const temp = Math.floor(Math.random() * 15) + 5;
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
        temp,
        condition,
        icon: temp > 15 ? '☀️' : temp > 10 ? '🌤️' : '🌧️'
    };
}

/**
 * Calculate distance (mock)
 * @param {string} address - Address
 * @returns {string} Distance in km
 */
function calculateDistance(address) {
    return (Math.random() * 50 + 5).toFixed(1);
}

