document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm'); 
    const msgDiv = document.getElementById('messageDiv');   

    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;

        
        if (!name || !password) {
            msgDiv.textContent = 'Please enter both username and password.';
            msgDiv.style.color = 'red';
            return;
        }

        try {
           
           
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
            
                body: JSON.stringify({ name: name, password: password })
            });

           
            const data = await response.json();

           
           
            if (response.ok) {
               
                msgDiv.textContent = data.message || 'Login successful!';
                msgDiv.style.color = 'green';
                console.log('Login successful:', data);

               
                window.location.href = 'index.html';

            } else { 
                msgDiv.textContent = data.message || 'Login failed. Please try again.';
                msgDiv.style.color = 'red';
                console.error('Login error:', data);
            }

        } catch (error) {
           
            msgDiv.textContent = 'Network error or server unavailable. Please try again later.';
            msgDiv.style.color = 'red';
            console.error('Fetch error:', error);
        }
    });
});