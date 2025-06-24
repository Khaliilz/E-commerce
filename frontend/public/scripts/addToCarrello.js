document.addEventListener('DOMContentLoaded', function() {
    const addToCartButton = document.getElementById('addToCartButton');
    const token = sessionStorage.getItem('token');
    
    addToCartButton.addEventListener('click', async function() {
        addToCartButton.disabled = true;
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');

            if (!productId) {
                alert('Product ID not found');
                return;
            }
            
            const quantity = 1;
            
            const response = await fetch('http://localhost:3000/api/v1/user/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: quantity
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                console.error('Prodotto aggiunto al carrello!');
                
            } else {
                console.error(result.message || 'Errore durante l\'aggiunta al carrello');
            }

            const stockResponse = await fetch(`http://localhost:3000/api/v1/product/${productId}/stocks`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    adjustment: Number(-1)
                })
            });

            if (!stockResponse.ok) {
                const error = await stockResponse.json();
                throw new Error(error.message || 'Failed to update stock');
            }
            } catch (error) {
                console.error('Errore di connessione:', error);
            }
    });
});