// ============================================================================
// MAIN APPLICATION ENTRY POINT
// ============================================================================

/**
 * Initialize application on DOM ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 FieldPro initializing...');
    
    // Show app with smooth fade-in effect
    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper) {
        appWrapper.style.opacity = '0';
        setTimeout(() => {
            appWrapper.style.transition = 'opacity 0.4s ease-out';
            appWrapper.style.opacity = '1';
        }, 50);
    }
    
    // Initialize router and navigate to initial page
    router.init();
    
    // Check for PWA updates periodically
    checkForUpdates();
    
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Setup keyboard shortcuts
    initKeyboardShortcuts();
    
    // Initialize navigation state
    updateNavOnLoad();
    
    console.log('✅ FieldPro ready');
});


// ============================================================================
// NAVIGATION
// ============================================================================

/**
 * Updates navigation state on initial page load
 * Syncs active nav item with current route from URL hash
 */
function updateNavOnLoad() {
    const currentPath = window.location.hash.slice(1) || '/';
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.route === currentPath) {
            item.classList.add('active');
        }
    });
}


// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

/**
 * Initializes keyboard shortcuts for power users
 * - Cmd/Ctrl + K: Quick search (future feature)
 * - Cmd/Ctrl + H: Navigate to home
 */
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


// ============================================================================
// PWA & SERVICE WORKER
// ============================================================================

/**
 * Checks for application updates periodically
 * Triggers service worker update check every 30 minutes
 */
function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        setInterval(() => {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(reg => reg.update());
            });
        }, 30 * 60 * 1000); // Every 30 minutes
    }
}

/**
 * Register service worker for PWA functionality (currently disabled)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA offline support
        // navigator.serviceWorker.register('/sw.js').then(reg => {
        //     console.log('Service Worker registered', reg);
        // });
    });
}


// ============================================================================
// NETWORK STATUS
// ============================================================================

/**
 * Notifies user when internet connection is restored
 */
window.addEventListener('online', () => {
    showToast('Forbindelse genetableret', 'success', 2000);
});

/**
 * Notifies user when internet connection is lost
 */
window.addEventListener('offline', () => {
    showToast('Ingen internetforbindelse', 'warning', 3000);
});


// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Global error handler for logging uncaught errors
 */
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Log errors silently - don't show toast for every error
});


// ============================================================================
// DATA PROTECTION
// ============================================================================

/**
 * Warns user before leaving page if there are unsaved changes
 */
window.addEventListener('beforeunload', (e) => {
    const hasUnsavedChanges = checkForUnsavedChanges();
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

/**
 * Checks if current page has unsaved form data
 * @returns {boolean} True if there are unsaved changes
 */
function checkForUnsavedChanges() {
    // Simple check - can be enhanced with form tracking
    // Currently returns false (disabled)
    return false;
}

