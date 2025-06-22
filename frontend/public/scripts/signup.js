document.addEventListener('DOMContentLoaded', function() {
    const signUpForm = document.getElementById('signUpForm');
    
    if (signUpForm) {
        signUpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('signUpName').value.toLowerCase();
            const email = document.getElementById('signUpEmail').value.trim().toLowerCase();
            const password = document.getElementById('signUpPassword').value.trim().toLowerCase();
            const role = document.querySelector('input[name=role]:checked').value.trim().toLowerCase();
            
            try {
                const response = await fetch('http://localhost:3000/api/v1/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullname,
                        email,
                        password,
                        role
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
                    document.getElementById('signUpStatus').innerText = errorData.message;
                }
            } catch (error) {
                console.error('Registration error:', error);
            }
        });
    }
});