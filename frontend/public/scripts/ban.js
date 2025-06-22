document.addEventListener('DOMContentLoaded', function() {
    const banUserForm = document.getElementById('banUserForm');
    
    if (banUserForm) {
        banUserForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const userEmail = document.getElementById('userEmail').value.trim();

            try {
                const response = await fetch('http://localhost:3000/api/v1/admin/ban', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        email: userEmail
                    })
                });
                
                if (response.ok) {

                    banStatus.innerText = `Utente ${userEmail} bandito con successo!`;
                    banStatus.style.color = "green";
                    // Clear the input after successful ban
                    document.getElementById('userEmail').value = "";
                } else {
                    const errorData = await response.json();
                    document.getElementById('banStatus').innerText = errorData.message;
                    banStatus.style.color = "red";
                }
            } catch (error) {
                console.error('Ban user error:', error);
                banStatus.innerText = "Errore di connessione. Riprova più tardi.";
                banStatus.style.color = "red"
            }
        });
    }
});