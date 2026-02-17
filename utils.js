// Utility Functions

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        'success': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 20px; height: 20px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        'error': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 20px; height: 20px;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
        'warning': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 20px; height: 20px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        'info': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 20px; height: 20px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-message">${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove after duration
    setTimeout(() => {
        toast.remove();
    }, duration);
}

// Show loading overlay
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Format time
function formatTime(timeString) {
    if (!timeString) return '00:00';
    return timeString;
}

// Calculate time difference in minutes
function timeToMinutes(time) {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('da-DK', options);
}

function formatFullDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('da-DK', options);
}

function formatPhotoTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const timeStr = date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) {
        return `I dag ${timeStr}`;
    } else {
        const dateStr = date.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
        return `${dateStr} ${timeStr}`;
    }
}

function formatGPSCoordinates(lat, lng) {
    if (!lat || !lng) return '';
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'Ø' : 'V';
    return `${Math.abs(lat).toFixed(5)}° ${latDir}, ${Math.abs(lng).toFixed(5)}° ${lngDir}`;
}

function getGoogleMapsLink(lat, lng) {
    if (!lat || !lng) return '#';
    return `https://www.google.com/maps?q=${lat},${lng}`;
}

function isToday(dateString) {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
}

// Calculate distance (mock - in real app use geolocation API)
function calculateDistance(address) {
    // Mock calculation - returns random km
    return (Math.random() * 50 + 5).toFixed(1);
}

// Get current location (mock)
function getCurrentLocation() {
    return {
        lat: 57.0488,
        lng: 9.9217,
        address: 'Din nuværende position'
    };
}

// Vibrate device (if supported)
function vibrate(duration = 50) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Kopieret til udklipsholder', 'success');
        });
    }
}

// Confirm dialog
function confirm(message, onConfirm, onCancel) {
    const confirmed = window.confirm(message);
    if (confirmed && onConfirm) {
        onConfirm();
    } else if (!confirmed && onCancel) {
        onCancel();
    }
    return confirmed;
}

// Get weather (mock - in real app use weather API)
function getWeather() {
    const conditions = ['Solrigt', 'Let skyet', 'Overskyet', 'Regn', 'Torden'];
    const temp = Math.floor(Math.random() * 15) + 5;
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
        temp,
        condition,
        icon: temp > 15 ? '☀️' : temp > 10 ? '🌤️' : '🌧️'
    };
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get greeting based on time of day
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 10) return 'God morgen';
    if (hour < 18) return 'God dag';
    return 'God aften';
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'active': '#4CAF50',
        'pending': '#FF9800',
        'completed': '#2196F3',
        'cancelled': '#F44336'
    };
    return colors[status] || '#757575';
}

// Get status text
function getStatusText(status) {
    const texts = {
        'active': 'I gang',
        'pending': 'Ikke startet',
        'completed': 'Afsluttet',
        'cancelled': 'Annulleret'
    };
    return texts[status] || status;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Safe localStorage get
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return defaultValue;
    }
}

// Safe localStorage set
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error writing to localStorage:', e);
        showToast('Kunne ikke gemme data', 'error');
        return false;
    }
}

// Debounce function for input optimization
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll to element smoothly
function scrollToElement(element, offset = 0) {
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
}

// Copy to clipboard with feedback
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Kopieret til udklipsholder', 'success', 2000);
        }).catch(() => {
            showToast('Kunne ikke kopiere', 'error');
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('Kopieret til udklipsholder', 'success', 2000);
        } catch (err) {
            showToast('Kunne ikke kopiere', 'error');
        }
        document.body.removeChild(textarea);
    }
}

// Format phone number for display
function formatPhoneNumber(phone) {
    if (!phone) return '';
    // Danish phone format: +45 12 34 56 78
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) {
        return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '+45 $1 $2 $3 $4');
    }
    return phone;
}

// Validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
