document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value.trim().toLowerCase();

            try {
                const response = await fetch('http://localhost:3000/api/v1/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
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
                    const errorData = await response.json();
                    document.getElementById('loginStatus').innerText = errorData.message;
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        });
    }
});