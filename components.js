// Signature Pad Component
class SignaturePad {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.hasSignature = false;
        
        this.setupCanvas();
        this.bindEvents();
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * 2;
        this.canvas.height = rect.height * 2;
        this.ctx.scale(2, 2);
        
        this.ctx.strokeStyle = '#212121';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }
    
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
    
    startDrawing(e) {
        this.isDrawing = true;
        this.hasSignature = true;
        const pos = this.getPosition(e);
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        const pos = this.getPosition(e);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
    }
    
    stopDrawing() {
        this.isDrawing = false;
    }
    
    getPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left),
            y: (e.clientY - rect.top)
        };
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.hasSignature = false;
    }
    
    getDataURL() {
        return this.canvas.toDataURL('image/png');
    }
    
    isEmpty() {
        return !this.hasSignature;
    }
}

// Voice Recorder Component
class VoiceRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
    }
    
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
            console.error('Error starting recording:', error);
            showToast('Mikrofon adgang nægtet', 'error');
            return false;
        }
    }
    
    stop() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder || !this.isRecording) {
                resolve(null);
                return;
            }
            
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Convert to base64
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
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            this.isRecording = false;
        });
    }
}

// GPS Location Service
class LocationService {
    static async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
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
                    reject(error);
                },
                {
                    enableHighAccuracy: false,  // Changed to false for faster response
                    timeout: 15000,  // Increased to 15 seconds
                    maximumAge: 300000  // Accept cached position up to 5 minutes old
                }
            );
        });
    }
    
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
    
    static formatDistance(km) {
        if (km < 1) {
            return `${Math.round(km * 1000)} m`;
        }
        return `${km.toFixed(1)} km`;
    }
    
    static async reverseGeocode(lat, lng) {
        try {
            // Use BigDataCloud - free, no API key, no CORS issues
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=da`
            );
            
            if (!response.ok) {
                throw new Error('Geocoding failed');
            }
            
            const data = await response.json();
            
            // Format address from BigDataCloud
            let formattedAddress = '';
            
            if (data.locality) {
                // Street address
                if (data.localityInfo && data.localityInfo.administrative) {
                    const admin = data.localityInfo.administrative;
                    if (admin.find(a => a.name)) {
                        const street = admin.find(a => a.order === 8);
                        if (street) formattedAddress = street.name;
                    }
                }
                
                // City
                if (data.city) {
                    if (formattedAddress) {
                        formattedAddress += ', ' + data.city;
                    } else {
                        formattedAddress = data.city;
                    }
                } else if (data.locality && data.locality !== formattedAddress) {
                    if (formattedAddress) {
                        formattedAddress += ', ' + data.locality;
                    } else {
                        formattedAddress = data.locality;
                    }
                }
            } else if (data.city) {
                formattedAddress = data.city;
            } else if (data.principalSubdivision) {
                formattedAddress = data.principalSubdivision;
            }
            
            return formattedAddress || data.localityInfo?.informative?.find(i => i.name)?.name || null;
        } catch (error) {
            console.log('Reverse geocoding fejl:', error);
            return null;
        }
    }
}

// Quick Timer Widget
class QuickTimer {
    constructor() {
        this.startTime = null;
        this.elapsedTime = 0;
        this.interval = null;
        this.isRunning = false;
        this.currentTaskId = null;
    }
    
    start(taskId) {
        if (this.isRunning) {
            this.stop();
        }
        
        this.currentTaskId = taskId;
        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;
        
        this.interval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
        }, 1000);
        
        saveToStorage('quickTimer', {
            taskId,
            startTime: this.startTime,
            elapsedTime: this.elapsedTime
        });
        
        vibrate(50);
    }
    
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
    
    updateDisplay() {
        const element = document.getElementById('quickTimerDisplay');
        if (element) {
            element.textContent = this.formatTime(this.elapsedTime);
        }
    }
    
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
    
    restore() {
        const saved = getFromStorage('quickTimer');
        if (saved && saved.startTime) {
            this.currentTaskId = saved.taskId;
            this.startTime = saved.startTime;
            this.elapsedTime = Date.now() - saved.startTime;
            this.isRunning = true;
            
            this.interval = setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateDisplay();
            }, 1000);
        }
    }
}

const quickTimer = new QuickTimer();

// Activity Logger
class ActivityLogger {
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
    
    static getRecent(limit = 10) {
        const activities = getFromStorage('activities', []);
        return activities.slice(0, limit);
    }
    
    static clear() {
        saveToStorage('activities', []);
    }
}

// Swipe Handler
class SwipeHandler {
    constructor(element, callbacks) {
        this.element = element;
        this.callbacks = callbacks;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        
        this.bindEvents();
    }
    
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
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0 && this.callbacks.onSwipeRight) {
                    this.callbacks.onSwipeRight();
                } else if (diffX < 0 && this.callbacks.onSwipeLeft) {
                    this.callbacks.onSwipeLeft();
                }
            }
            
            this.startX = 0;
            this.startY = 0;
            this.currentX = 0;
            this.currentY = 0;
        });
    }
}

// Checklist Manager
class ChecklistManager {
    static getDefaultChecklist() {
        return [
            { id: 1, text: 'Ankommet til lokation', completed: false },
            { id: 2, text: 'Kontakt med kunde', completed: false },
            { id: 3, text: 'Arbejdsområde afmærket', completed: false },
            { id: 4, text: 'Værktøj og materialer klar', completed: false },
            { id: 5, text: 'Arbejde udført', completed: false },
            { id: 6, text: 'Kvalitetskontrol', completed: false },
            { id: 7, text: 'Oprydning', completed: false },
            { id: 8, text: 'Kundegennemgang', completed: false },
            { id: 9, text: 'Signatur', completed: false }
        ];
    }
    
    static getChecklist(taskId) {
        return AppData.getTaskData(taskId, 'checklist', this.getDefaultChecklist());
    }
    
    static updateChecklistItem(taskId, itemId, completed) {
        const checklist = this.getChecklist(taskId);
        const item = checklist.find(i => i.id === itemId);
        if (item) {
            item.completed = completed;
            AppData.saveTaskData(taskId, 'checklist', checklist);
            
            // Log activity
            const task = AppData.getTask(taskId);
            ActivityLogger.log('checklist', `${completed ? 'Afkrydsede' : 'Fjernede markering fra'}: ${item.text}`, taskId);
            
            vibrate(20);
        }
    }
    
    static getProgress(taskId) {
        const checklist = this.getChecklist(taskId);
        const completed = checklist.filter(i => i.completed).length;
        return {
            completed,
            total: checklist.length,
            percentage: Math.round((completed / checklist.length) * 100)
        };
    }
}

// Initialize components
document.addEventListener('DOMContentLoaded', function() {
    // Restore quick timer if running
    quickTimer.restore();
});
