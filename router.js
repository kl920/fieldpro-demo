// Simple SPA Router
class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
    }

    register(path, component) {
        this.routes[path] = component;
    }

    navigate(path, data = {}) {
        if (!this.routes[path]) {
            console.error(`Route ${path} not found`);
            return;
        }

        // Add to history
        window.history.pushState({ path, data }, '', `#${path}`);
        
        // Render page
        this.render(path, data);
    }

    render(path, data = {}) {
        const page = this.routes[path];
        if (!page) return;

        this.currentPage = path;
        
        // Add transition
        const appContent = document.getElementById('app-content');
        appContent.style.opacity = '0';
        
        setTimeout(() => {
            page(data);
            appContent.style.opacity = '1';
            this.updateActiveNav(path);
        }, 200);
    }

    updateActiveNav(path) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.route === path) {
                item.classList.add('active');
            }
        });
    }

    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.path) {
                this.render(e.state.path, e.state.data || {});
            }
        });

        // Get initial route from hash or default to home
        const hash = window.location.hash.slice(1) || '/';
        this.navigate(hash, {}, true);
    }
}

const router = new Router();
