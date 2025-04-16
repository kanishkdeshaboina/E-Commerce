/* script2.js */
document.addEventListener('DOMContentLoaded', () => {
    // Store user data (replace with server-side solution in production)
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Register
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('registerFullName').value;
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            // Check if username already exists
            if (users.find(user => user.username === username)) {
                alert('Username already exists.');
                return;
            }

            // Check if passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            users.push({
                fullName,
                username,
                password
            });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful!');
            window.location.href = 'login.html'; // Redirect to login
        });
    }

    // Login (No changes needed here, assuming loginUsername and loginPassword are still used)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const user = users.find(user => user.username === username && user.password === password);
            if (user) {
                alert('Login successful!');
                localStorage.setItem('loggedInUser', username);
                window.location.href = 'com.html'; // Redirect to your main page
            } else {
                alert('Invalid username or password.');
            }
        });
    }
});