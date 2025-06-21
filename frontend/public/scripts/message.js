document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    
    if (messageForm) {
        messageForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const userEmail = document.getElementById('messageTitle').value.trim();
            const messageText = document.getElementById('messageText').value.trim();

            try {
                const response = await fetch('http://localhost:3000/api/v1/admin/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        targetuserEmail: userEmail,
                        message: messageText
                    })
                });
                
                if (response.ok) {
                    const responseData = await response.json();
                    
                    const token = response.headers.get('Authorization').split(' ')[1];
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(responseData.user));
                    
                    window.location.href = 'admin.html';
                } else {
                    const errorData = await response.json();
                    document.getElementById('messageStatus').innerText = errorData.message;
                }
            } catch (error) {
                console.error('Message to user error:', error);
            }
        });
    }
});