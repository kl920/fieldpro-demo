// Utility Functions

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = {
        'success': '✓',
        'error': '✕',
        'warning': '⚠',
        'info': 'ℹ'
    }[type] || 'ℹ';
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
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
        return false;
    }
}
