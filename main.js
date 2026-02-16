// Main App Entry Point
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 FieldPro initializing...');
    
    // Show app with smooth fade-in
    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper) {
        appWrapper.style.opacity = '0';
        setTimeout(() => {
            appWrapper.style.transition = 'opacity 0.4s ease-out';
            appWrapper.style.opacity = '1';
        }, 50);
    }
    
    // Initialize router
    router.init();
    
    // Check for updates periodically (for PWA)
    checkForUpdates();
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add keyboard shortcuts
    initKeyboardShortcuts();
    
    // Initialize active nav on load
    updateNavOnLoad();
    
    console.log('✅ FieldPro ready');
});

// Update navigation state on initial load
function updateNavOnLoad() {
    const currentPath = window.location.hash.slice(1) || '/';
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.route === currentPath) {
            item.classList.add('active');
        }
    });
}

// Keyboard shortcuts for power users
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K for search (future feature)
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            showToast('Søgefunktion kommer snart', 'info');
        }
        
        // Cmd/Ctrl + H for home
        if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
            e.preventDefault();
            router.navigate('/');
        }
    });
}

// Check for app updates
function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        setInterval(() => {
            // Check for new version every 30 minutes
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(reg => reg.update());
            });
        }, 30 * 60 * 1000);
    }
}

// PWA Service Worker (optional - for offline support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA
        // navigator.serviceWorker.register('/sw.js').then(reg => {
        //     console.log('Service Worker registered', reg);
        // });
    });
}

// Handle online/offline status
window.addEventListener('online', () => {
    showToast('Forbindelse genetableret', 'success', 2000);
});

window.addEventListener('offline', () => {
    showToast('Ingen internetforbindelse', 'warning', 3000);
});

// Add global error handler for better UX
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Don't show toast for every error, but log it
});

// Prevent accidental data loss
window.addEventListener('beforeunload', (e) => {
    // Check if user has unsaved changes
    const hasUnsavedChanges = checkForUnsavedChanges();
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

function checkForUnsavedChanges() {
    // Check if there are any forms with unsaved data
    // This is a simple check - can be enhanced
    return false;
}
