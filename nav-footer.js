document.addEventListener('DOMContentLoaded', () => {
    // 1. Ensure shared styles, Bootstrap, and icons are in head
    ensureHeadLinks();

    // 2. Inject Navbar
    injectNavbar();

    // 3. Inject Footer
    injectFooter();
});

function ensureHeadLinks() {
    const head = document.head;
    
    // Add Google Fonts
    if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap';
        head.appendChild(fontLink);
    }

    // Add Bootstrap CSS (if not already there)
    if (!document.querySelector('link[href*="bootstrap.min.css"]')) {
        const bsLink = document.createElement('link');
        bsLink.rel = 'stylesheet';
        bsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
        head.appendChild(bsLink);
    }

    // Add Bootstrap Icons (if not already there)
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
        const iconLink = document.createElement('link');
        iconLink.rel = 'stylesheet';
        iconLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
        head.appendChild(iconLink);
    }

    // Add shared-styles.css (if not already there)
    if (!document.querySelector('link[href*="shared-styles.css"]')) {
        const sharedCss = document.createElement('link');
        sharedCss.rel = 'stylesheet';
        sharedCss.href = 'shared-styles.css';
        head.appendChild(sharedCss);
    }
}

function injectNavbar() {
    let container = document.getElementById('navbar-container');
    if (!container) {
        // Create container at top of body
        container = document.createElement('div');
        container.id = 'navbar-container';
        document.body.insertBefore(container, document.body.firstChild);
    }

    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'start.html';

    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    const isLoggedIn = !!user;

    // Define navigation items based on auth state
    let navItems = '';
    if (isLoggedIn) {
        navItems = `
            <li class="nav-item">
                <a class="nav-link ${pageName === 'semproject.html' ? 'active' : ''}" href="semproject.html">
                    <i class="bi bi-speedometer2 me-1"></i>Dashboard
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link ${pageName === 'Disease.html' ? 'active' : ''}" href="Disease.html">
                    <i class="bi bi-bug me-1"></i>Disease Predictor
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link ${pageName === 'soil.html' ? 'active' : ''}" href="soil.html">
                    <i class="bi bi-droplet me-1"></i>Soil Moisture
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link ${pageName === 'crop_rotation.html' ? 'active' : ''}" href="crop_rotation.html">
                    <i class="bi bi-arrow-repeat me-1"></i>Crop Rotation
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link ${pageName === 'seasonschedule.html' ? 'active' : ''}" href="seasonschedule.html">
                    <i class="bi bi-calendar-check me-1"></i>Crop Planner
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link ${pageName === 'nutritionalcrops.html' ? 'active' : ''}" href="nutritionalcrops.html">
                    <i class="bi bi-egg-fried me-1"></i>Crop Nutrition
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link ${pageName === 'about.html' ? 'active' : ''}" href="about.html">
                    <i class="bi bi-info-circle me-1"></i>About
                </a>
            </li>
            <li class="nav-item ms-lg-2">
                <a class="nav-link nav-logout btn btn-danger btn-sm text-white py-1 px-3 mt-2 mt-lg-0" href="#" id="logoutButton" style="border: none;">
                    <i class="bi bi-box-arrow-right me-1"></i>Logout
                </a>
            </li>
        `;
    } else {
        // Not logged in navbar
        navItems = `
            <li class="nav-item">
                <a class="nav-link ${pageName === 'start.html' ? 'active' : ''}" href="start.html">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link ${pageName === 'Registration_page.html' ? 'active' : ''}" href="Registration_page.html">Login / Register</a>
            </li>
        `;
    }

    container.innerHTML = `
        <nav class="navbar navbar-expand-lg">
            <div class="container-fluid max-width-container" style="max-width: 1200px; margin: 0 auto; width: 100%;">
                <a class="navbar-brand" href="${isLoggedIn ? 'semproject.html' : 'start.html'}">
                    <i class="bi bi-flower1"></i> GrowSathi 
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sharedNavbar" aria-controls="sharedNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="sharedNavbar">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
                        ${navItems}
                    </ul>
                </div>
            </div>
        </nav>
    `;

    // Logout listener
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'start.html';
        });
    }
}

function injectFooter() {
    let container = document.getElementById('footer-container');
    if (!container) {
        // Create container at bottom of body
        container = document.createElement('div');
        container.id = 'footer-container';
        document.body.appendChild(container);
    }

    container.innerHTML = `
        <footer>
            <div class="container text-center">
                <p class="mb-2">🌾 GrowSathi — Intelligent Agricultural Support System 🚜</p>
                <p class="mb-0" style="font-size: 0.8rem; opacity: 0.8;">&copy; 2026 Smart Crop Advisor | Developed with MongoDB, Express & Gemini AI for Indian Farmers</p>
            </div>
        </footer>
    `;
}
