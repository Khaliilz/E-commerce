document.addEventListener('DOMContentLoaded', function() {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submitPassword', async function(e) {
            e.preventDefault();

            const userEmail = document.getElementById('userEmail').value.trim().toLowerCase();
            const newPassword = document.getElementById('newPassword').value.trim();

            try {
                const response = await fetch('http://localhost:3000/api/v1/users/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        newPassword: newPassword
                    })
                });

                if (response.ok) {
                    window.location.href = 'index.html';
                } else {
                    const errorData = await response.json();
                    document.getElementById('resetStatus').innerText = errorData.message;
                }
            } catch (error) {
                console.error('Reset password error:', error);
            }
        });
    }
});