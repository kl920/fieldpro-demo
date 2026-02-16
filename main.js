// Main App Entry Point
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 FieldPro initializing...');
    
    // Initialize router
    router.init();
    
    // Show welcome toast
    setTimeout(() => {
        showToast('Velkommen til FieldPro! 👋', 'success');
    }, 500);
    
    console.log('✅ FieldPro ready');
});

// PWA Service Worker (optional - for offline support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA
        // navigator.serviceWorker.register('/sw.js');
    });
}
