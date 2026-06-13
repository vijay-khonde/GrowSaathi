// Toggle between login and registration sections
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');

if (showRegister && showLogin) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });
}

// Check if already logged in, redirect to dashboard
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
    window.location.href = "semproject.html";
}

// Registration validation and submit
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const regEmail = document.getElementById('regEmail').value.trim();
        const regPassword = document.getElementById('regPassword').value.trim();
        const farmLocation = document.getElementById('farmLocation').value.trim();

        if (!fullName || !regEmail || !regPassword || !farmLocation) {
            alert('Please fill in all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(regEmail)) {
            alert('Please enter a valid email.');
            return;
        }

        if (regPassword.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email: regEmail, password: regPassword, farmLocation })
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Registration failed.');
                return;
            }

            alert('Registration successful! Please log in.');
            registerForm.reset();
            
            // Switch to login
            registerSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
        } catch (err) {
            console.error('Registration error:', err);
            alert('An error occurred during registration. Please try again.');
        }
    });
}

// Login validation and submit
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Login failed.');
                return;
            }

            alert('Login successful!');
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            loginForm.reset();

            // Redirect to main dashboard
            window.location.href = "semproject.html";
        } catch (err) {
            console.error('Login error:', err);
            alert('An error occurred during login. Please try again.');
        }
    });
}
