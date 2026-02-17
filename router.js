// ============================================================================
// SPA ROUTER
// ============================================================================

/**
 * Simple Single Page Application Router with hash-based routing.
 * Handles navigation, history management, and smooth page transitions.
 * 
 * @class Router
 * @example
 * router.register('/home', renderHomePage);
 * router.navigate('/home', { userId: 123 });
 */
class Router {
    constructor() {
        /** @type {Object<string, Function>} Registered routes */
        this.routes = {};
        /** @type {string|null} Current active route path */
        this.currentPage = null;
        /** @type {number} Transition duration in ms */
        this.TRANSITION_DURATION = 200;
    }

    /**
     * Registers a route with its rendering function
     * @param {string} path - Route path (e.g., '/home', '/orders')
     * @param {Function} component - Function to render the page
     */
    register(path, component) {
        this.routes[path] = component;
    }

    /**
     * Navigates to a specified route
     * @param {string} path - Route path to navigate to
     * @param {Object} data - Optional data to pass to the page
     */
    navigate(path, data = {}) {
        if (!this.routes[path]) {
            console.error(`Router: Route '${path}' not found. Available routes:`, Object.keys(this.routes));
            return;
        }

        // Add to browser history
        window.history.pushState({ path, data }, '', `#${path}`);
        
        // Render the page
        this.render(path, data);
    }

    /**
     * Renders a page with smooth transition
     * @param {string} path - Route path to render
     * @param {Object} data - Optional data to pass to the page
     * @private
     */
    render(path, data = {}) {
        const page = this.routes[path];
        if (!page) {
            console.warn(`Router: Cannot render undefined route '${path}'`);
            return;
        }

        this.currentPage = path;
        
        // Fade out transition
        const appContent = document.getElementById('app-content');
        if (appContent) {
            appContent.style.opacity = '0';
            
            // Wait for fade out, then render new page
            setTimeout(() => {
                page(data);
                appContent.style.opacity = '1';
                this.updateActiveNav(path);
            }, this.TRANSITION_DURATION);
        } else {
            // No app-content element, render directly
            page(data);
            this.updateActiveNav(path);
        }
    }

    /**
     * Updates navigation bar to highlight active route
     * @param {string} path - Currently active route path
     * @private
     */
    updateActiveNav(path) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.route === path) {
                item.classList.add('active');
            }
        });
    }

    /**
     * Initializes the router and sets up event listeners
     * Should be called once on application startup
     */
    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.path) {
                this.render(e.state.path, e.state.data || {});
            }
        });

        // Get initial route from URL hash, default to home
        const hash = window.location.hash.slice(1) || '/';
        this.navigate(hash, {}, true);
    }
}

/**
 * Global router instance
 * @type {Router}
 */
const router = new Router();

