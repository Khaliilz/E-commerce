document.addEventListener('DOMContentLoaded', function() {
    const categoryName = document.getElementById('categoryName');
    
    if (categoryName) {
        categoryName.addEventListener('submit', async function(e) {
            e.preventDefault();

            const category = document.getElementById('categoryName').value;

            try {
                const response = await fetch('http://localhost:3000/api/v1/newCategory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        name: category
                    })
                });
                
                if (response.ok) {

                    categoryStatus.innerText = `Categoria ${category} aggiunta con successo!`;
                    categoryStatus.style.color = "green";
                    // Clear the input after successful addition
                    document.getElementById('categoryName').value = "";
                } else {
                    const errorData = await response.json();
                    document.getElementById('categoryStatus').innerText = errorData.message;
                    categoryStatus.style.color = "red";
                }
            } catch (error) {
                console.error('New category error:', error);
                categoryStatus.innerText = "Errore di connessione. Riprova più tardi.";
                categoryStatus.style.color = "red"
            }
        });
    }
});