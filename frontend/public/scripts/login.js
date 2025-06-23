document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginStatus = document.getElementById('loginStatus');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value.trim();

            loginStatus.textContent = '';
            loginStatus.style.color = '';

            try {
                const response = await fetch('http://localhost:3000/api/v1/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email.toLowerCase(),
                        password
                    })
                });

                if (response.ok) {
                    const responseData = await response.json();
                    
                    const token = response.headers.get('Authorization').split(' ')[1];
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('user', JSON.stringify(responseData.user));
                    
                    window.location.href = 'index.html';
                } else {
                    loginStatus.innerText = responseData.message || 'Login failed';
                    loginStatus.style.color = 'red';
                }
            } catch (error) {
                console.error('Login error:', error);
                loginStatus.innerText = 'An error occurred during login';
                loginStatus.style.color = 'red';
            }
        });
    }
});