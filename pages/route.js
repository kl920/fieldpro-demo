// Route Planning Page
function renderRoutePage() {
    const today = new Date().toISOString().split('T')[0];
    const tasks = AppData.getAllTasks().filter(t => 
        t.scheduledDate === today && t.status !== 'completed'
    );
    
    return `
        <div class="page-header">
            <h1>📍 Dagens rute</h1>
            <p class="page-subtitle">${tasks.length} ordre i dag</p>
        </div>
        
        <div class="route-container">
            <div id="routeMap" class="route-map"></div>
            
            <div class="route-controls">
                <button class="button-primary" onclick="optimizeRoute()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    Optimer rute
                </button>
                <button class="button-secondary" onclick="getCurrentLocation()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="16 8 8 12 16 16 16 8"></polygon>
                    </svg>
                    My location
                </button>
            </div>
            
            <div class="route-list">
                <h3>Order overview</h3>
                ${tasks.length === 0 ? `
                    <div class="empty-state">
                        <p>No orders planned today</p>
                    </div>
                ` : tasks.map((task, index) => `
                    <div class="route-item" onclick="selectRouteStop(${task.id})">
                        <div class="route-number">${index + 1}</div>
                        <div class="route-info">
                            <div class="route-title">${task.title}</div>
                            <div class="route-customer">${task.customer}</div>
                            <div class="route-address">${task.location.address}</div>
                        </div>
                        <button class="route-navigate" onclick="event.stopPropagation(); navigateToTask(${task.id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                            </svg>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Initialize route page
function initRoutePage() {
    // Wait for DOM to be ready
    setTimeout(() => {
        if (document.getElementById('routeMap')) {
            initRouteMap();
        }
    }, 100);
}

let routeMap = null;
let markers = [];
let routeLine = null;
let userMarker = null;

function initRouteMap() {
    // Initialize map centered on Denmark
    if (routeMap) {
        routeMap.remove();
    }
    
    routeMap = L.map('routeMap').setView([56.26392, 9.501785], 7);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(routeMap);
    
    // Add markers for today's tasks
    const today = new Date().toISOString().split('T')[0];
    const tasks = AppData.getAllTasks().filter(t => 
        t.scheduledDate === today && t.status !== 'completed'
    );
    
    if (tasks.length === 0) return;
    
    // Geocode addresses and add markers
    const bounds = [];
    
    tasks.forEach((task, index) => {
        // Use approximate coordinates (in real app, geocode the address)
        // For demo, use some locations around Aarhus
        const baseCoords = [56.1629, 10.2039]; // Aarhus center
        const lat = baseCoords[0] + (Math.random() - 0.5) * 0.1;
        const lng = baseCoords[1] + (Math.random() - 0.5) * 0.1;
        
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-pin" style="background: ${getTaskColor(task.priority)}">
                <span>${index + 1}</span>
            </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
        
        const marker = L.marker([lat, lng], { icon: icon })
            .addTo(routeMap)
            .bindPopup(`
                <div class="marker-popup">
                    <strong>${task.title}</strong><br>
                    ${task.customer}<br>
                    <small>${task.location.address}</small>
                </div>
            `);
        
        marker.taskId = task.id;
        marker.coords = [lat, lng];
        markers.push(marker);
        bounds.push([lat, lng]);
    });
    
    // Fit map to show all markers
    if (bounds.length > 0) {
        routeMap.fitBounds(bounds, { padding: [50, 50] });
    }
    
    showToast('🗺️ Kort indlæst', 'success');
}

function getTaskColor(priority) {
    switch(priority) {
        case 'high': return '#f44336';
        case 'medium': return '#FF9800';
        default: return '#4CAF50';
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showToast('Geolocation not supported', 'error');
        return;
    }
    
    showToast('📍 Finding your location...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Remove old user marker
            if (userMarker) {
                routeMap.removeLayer(userMarker);
            }
            
            // Add new user marker
            const icon = L.divIcon({
                className: 'user-marker',
                html: '<div class="user-marker-dot"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            
            userMarker = L.marker([lat, lng], { icon: icon })
                .addTo(routeMap)
                .bindPopup('Your location');
            
            routeMap.setView([lat, lng], 13);
            showToast('📍 Location found', 'success');
        },
        (error) => {
            showToast('Could not find location', 'error');
        }
    );
}

function optimizeRoute() {
    if (markers.length === 0) {
        showToast('No orders to optimise', 'warning');
        return;
    }
    
    showToast('🔄 Optimising route...', 'info');
    
    // Simple route optimization: nearest neighbor algorithm
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            const unvisited = [...markers];
            const route = [];
            let current = [userLat, userLng];
            
            while (unvisited.length > 0) {
                let nearest = 0;
                let minDist = Infinity;
                
                unvisited.forEach((marker, index) => {
                    const dist = calculateDistance(current[0], current[1], marker.coords[0], marker.coords[1]);
                    if (dist < minDist) {
                        minDist = dist;
                        nearest = index;
                    }
                });
                
                const nextMarker = unvisited.splice(nearest, 1)[0];
                route.push(nextMarker.coords);
                current = nextMarker.coords;
            }
            
            // Draw route line
            if (routeLine) {
                routeMap.removeLayer(routeLine);
            }
            
            const fullRoute = [[userLat, userLng], ...route];
            routeLine = L.polyline(fullRoute, {
                color: '#2196F3',
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 10'
            }).addTo(routeMap);
            
            // Update order numbers
            route.forEach((coords, index) => {
                const marker = markers.find(m => m.coords[0] === coords[0] && m.coords[1] === coords[1]);
                if (marker) {
                    marker.setIcon(L.divIcon({
                        className: 'custom-marker',
                        html: `<div class="marker-pin" style="background: #2196F3">
                            <span>${index + 1}</span>
                        </div>`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 40]
                    }));
                }
            });
            
            const totalKm = calculateTotalDistance(fullRoute);
            showToast(`✅ Route optimised - ${totalKm.toFixed(1)} km`, 'success', 4000);
        },
        () => {
            showToast('Enable GPS to optimise route', 'warning');
        }
    );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function calculateTotalDistance(route) {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
        total += calculateDistance(route[i][0], route[i][1], route[i+1][0], route[i+1][1]);
    }
    return total;
}

function selectRouteStop(taskId) {
    const marker = markers.find(m => m.taskId === taskId);
    if (marker) {
        routeMap.setView(marker.coords, 15);
        marker.openPopup();
    }
}

function navigateToTask(taskId) {
    const task = AppData.getTask(taskId);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location.address)}`;
    window.open(url, '_blank');
}

// Register route page
router.register('/route', () => {
    const html = renderRoutePage();
    initRoutePage();
    return html;
});
