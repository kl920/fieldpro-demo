// Mock data for tasks (same as in app.js)
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

let currentTask = null;
let materials = [];
let photos = [];

// Initialize task detail page
function initTaskDetail() {
    const taskId = localStorage.getItem('currentTaskId');
    if (!taskId || !tasks[taskId]) {
        window.location.href = 'index.html';
        return;
    }

    currentTask = tasks[taskId];
    
    // Load saved data from localStorage
    loadSavedData(taskId);
    
    // Update UI
    document.getElementById('taskTitle').textContent = currentTask.title;
    document.getElementById('detailTaskTitle').textContent = currentTask.title;
    document.getElementById('taskDate').textContent = currentTask.date;
    document.getElementById('taskDescription').textContent = currentTask.description;
    
    document.getElementById('startTime').value = currentTask.startTime;
    document.getElementById('endTime').value = currentTask.endTime;
    document.getElementById('pauseTime').value = currentTask.pause;
    
    updateTotalTime();
    renderMaterials();
    renderPhotos();
    
    // Add event listeners for time inputs
    document.getElementById('startTime').addEventListener('change', updateTotalTime);
    document.getElementById('endTime').addEventListener('change', updateTotalTime);
    document.getElementById('pauseTime').addEventListener('change', updateTotalTime);
}

// Load saved data from localStorage
function loadSavedData(taskId) {
    const savedMaterials = localStorage.getItem(`task_${taskId}_materials`);
    const savedPhotos = localStorage.getItem(`task_${taskId}_photos`);
    const savedNotes = localStorage.getItem(`task_${taskId}_notes`);
    
    if (savedMaterials) {
        materials = JSON.parse(savedMaterials);
    }
    
    if (savedPhotos) {
        photos = JSON.parse(savedPhotos);
    }
    
    if (savedNotes) {
        document.getElementById('taskNotes').value = savedNotes;
    }
}

// Save data to localStorage
function saveData() {
    const taskId = currentTask.id;
    localStorage.setItem(`task_${taskId}_materials`, JSON.stringify(materials));
    localStorage.setItem(`task_${taskId}_photos`, JSON.stringify(photos));
    
    // Save times
    const taskData = {
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        pauseTime: document.getElementById('pauseTime').value
    };
    localStorage.setItem(`task_${taskId}_times`, JSON.stringify(taskData));
}

// Calculate total time
function updateTotalTime() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const pauseTime = document.getElementById('pauseTime').value;
    
    if (startTime && endTime) {
        const start = timeToMinutes(startTime);
        const end = timeToMinutes(endTime);
        const pause = timeToMinutes(pauseTime);
        
        let totalMinutes = end - start - pause;
        if (totalMinutes < 0) totalMinutes = 0;
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        document.getElementById('totalTime').textContent = `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
}

function timeToMinutes(time) {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

// Material functions
function addMaterial() {
    document.getElementById('materialModal').classList.add('active');
    document.getElementById('materialName').value = '';
    document.getElementById('materialQuantity').value = '1';
    document.getElementById('materialUnit').value = 'stk';
}

function closeMaterialModal() {
    document.getElementById('materialModal').classList.remove('active');
}

function saveMaterial() {
    const name = document.getElementById('materialName').value.trim();
    const quantity = parseFloat(document.getElementById('materialQuantity').value);
    const unit = document.getElementById('materialUnit').value;
    
    if (!name || quantity <= 0) {
        alert('Udfyld venligst alle felter korrekt');
        return;
    }
    
    materials.push({
        id: Date.now(),
        name,
        quantity,
        unit
    });
    
    saveData();
    renderMaterials();
    closeMaterialModal();
}

function deleteMaterial(id) {
    materials = materials.filter(m => m.id !== id);
    saveData();
    renderMaterials();
}

function renderMaterials() {
    const container = document.getElementById('materialsList');
    
    if (materials.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Ingen materialer tilføjet endnu</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = materials.map(material => `
        <div class="material-item">
            <div class="material-info">
                <div class="material-name">${material.name}</div>
                <div class="material-quantity">${material.quantity} ${material.unit}</div>
            </div>
            <button class="delete-btn" onclick="deleteMaterial(${material.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

// Photo functions
async function addPhotos(event) {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
        return;
    }
    
    // Get GPS location once for all photos
    let location = null;
    try {
        if (typeof LocationService !== 'undefined') {
            location = await LocationService.getCurrentPosition();
        }
    } catch (err) {
        console.log('GPS ikke tilgængelig:', err);
    }
    
    const fileArray = Array.from(files);
    let processed = 0;
    
    fileArray.forEach((file) => {
        const reader = new FileReader();
        
        reader.onerror = function() {
            console.error('Error reading file:', file.name);
            processed++;
        };
        
        reader.onload = function(e) {
            const photoData = {
                id: Date.now() + Math.random(),
                data: e.target.result,
                timestamp: new Date().toISOString()
            };
            
            // Add GPS if available
            if (location) {
                photoData.lat = location.lat;
                photoData.lng = location.lng;
                photoData.accuracy = location.accuracy;
            }
            
            photos.push(photoData);
            
            processed++;
            if (processed === fileArray.length) {
                saveData();
                renderPhotos();
            }
        };
        
        reader.readAsDataURL(file);
    });
    
    // Reset input
    event.target.value = '';
}

function deletePhoto(id) {
    photos = photos.filter(p => p.id !== id);
    saveData();
    renderPhotos();
}

function renderPhotos() {
    const container = document.getElementById('photosList');
    
    if (photos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Ingen billeder tilføjet endnu</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = photos.map(photo => `
        <div class="photo-item">
            <img src="${photo.data}" alt="Opgave foto" onclick="${photo.lat && photo.lng ? `window.open('${getGoogleMapsLink(photo.lat, photo.lng)}', '_blank')` : 'void(0)'}">
            <div class="photo-info">
                ${photo.timestamp ? `<div class="photo-timestamp">${formatPhotoTimestamp(photo.timestamp)}</div>` : ''}
                ${photo.lat && photo.lng ? `
                    <div class="photo-location">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width: 12px; height: 12px;">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${formatGPSCoordinates(photo.lat, photo.lng)}
                    </div>
                ` : ''}
            </div>
            <button class="delete-btn" onclick="event.stopPropagation(); deletePhoto(${photo.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
}

// Submit task
function submitTask() {
    const taskId = currentTask.id;
    
    const taskData = {
        taskId: taskId,
        title: currentTask.title,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        pauseTime: document.getElementById('pauseTime').value,
        totalTime: document.getElementById('totalTime').textContent,
        materials: materials,
        photos: photos,
        submittedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem(`task_${taskId}_completed`, JSON.stringify(taskData));
    
    // Show confirmation
    alert('Opgave sendt! Data er gemt lokalt.');
    
    // In a real app, you would send this to a server
    console.log('Task submitted:', taskData);
    
    // Go back to task list
    window.location.href = 'index.html';
}

// Go back to task list
function goBack() {
    window.location.href = 'index.html';
}

// Quick Actions
function quickStartTimer() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('startTime').value = `${hours}:${minutes}`;
    updateTotalTime();
    
    // Show notification
    showNotification('Timer startet!');
}

function callCustomer() {
    if (currentTask && currentTask.customer) {
        showNotification(`Ringer til ${currentTask.customer}...`);
        // In a real app, this would trigger a phone call
    }
}

function navigate() {
    if (currentTask && currentTask.location) {
        // In a real app, this would open Google Maps or similar
        const address = encodeURIComponent(currentTask.location);
        window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
    }
}

function saveNotes() {
    const notes = document.getElementById('taskNotes').value;
    localStorage.setItem(`task_${currentTask.id}_notes`, notes);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #323232;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('materialModal');
    if (event.target === modal) {
        closeMaterialModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', initTaskDetail);
