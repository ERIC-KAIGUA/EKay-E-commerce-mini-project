document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm'); // Make sure this matches HTML ID
    const msgDiv = document.getElementById('messageDiv');   // Make sure this matches HTML ID

    // CRITICAL FIX: Listen for 'submit' event, not 'signIn'
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission (page reload)

        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;

        // Basic validation
        if (!name || !password) {
            msgDiv.textContent = 'Please enter both username and password.';
            msgDiv.style.color = 'red';
            return;
        }

        try {
            // CRITICAL FIX: Use full backend URL
            // Replace 3000 with your actual Express.js backend port
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Crucial for sending/receiving session cookies
                // Ensure key names match backend expectation (e.g., 'name' or 'username')
                body: JSON.stringify({ name: name, password: password })
            });

            // CRITICAL FIX: Move data parsing and logic inside try block and use response.ok
            const data = await response.json(); // Attempt to parse JSON response

            // CRITICAL FIX: Invert if/else logic
            // This block executes ONLY if backend sent a 2xx status code (e.g., 200 OK)
            if (response.ok) {
                // CRITICAL FIX: Use data.message (consistent with backend fix)
                msgDiv.textContent = data.message || 'Login successful!';
                msgDiv.style.color = 'green';
                console.log('Login successful:', data);

                // Redirect only on successful login
                window.location.href = 'landingpage.html';

            } else { // This block executes if backend sent a non-2xx status code (e.g., 401, 400, 500)
                // CRITICAL FIX: Use data.message (consistent with backend fix)
                msgDiv.textContent = data.message || 'Login failed. Please try again.';
                msgDiv.style.color = 'red';
                console.error('Login error:', data);
            }

        } catch (error) {
            // Handle network errors or issues where the server didn't respond
            msgDiv.textContent = 'Network error or server unavailable. Please try again later.';
            msgDiv.style.color = 'red';
            console.error('Fetch error:', error);
        }
    });
});