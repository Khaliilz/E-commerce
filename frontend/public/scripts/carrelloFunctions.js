async function modificaQuantità(event) {
    const productId = event.target.dataset.productId;
    const newQuantity = event.target.value;
    
    try {
        const response = await fetch('http://localhost:3000/api/v1/user/cart', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId,
                quantity: newQuantity
            })
        });
        
        if (response.ok) aggiornaPrezzoTotale();
        else{
            const error = await response.json();
            alert(error.message || 'Failed to update quantity');
            
            event.target.value = event.target.defaultValue;
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Connection error');
        event.target.value = event.target.defaultValue;
    }
}

async function rimuoviProdotto(event) {
    const productId = event.target.dataset.productId;
    
    try {
        const response = await fetch(`http://localhost:3000/api/v1/user/cart?productId=${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            event.target.closest('.list-group-item').remove();
            
            if (!document.querySelector('.list-group-item')) {
                document.querySelector('.list-group').innerHTML = 
                    '<p class="text-muted">Il tuo carrello è vuoto.</p>';
                document.getElementById("paga").remove();
            }
            aggiornaPrezzoTotale();
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to remove item');
        }
    } catch (error) {
        console.error('Error removing product:', error);
        alert('Connection error');
    }
}

function aggiornaPrezzoTotale() {
    const items = document.querySelectorAll('.list-group-item');
    const prezzoTotElement = document.getElementById('prezzoTot');

    if (!prezzoTotElement) return;

    if (items.length === 0) {
        prezzoTotElement.innerText = '';
        return;
    }

    let totale = 0;
    items.forEach(item => {
        const prezzo = parseFloat(item.querySelector('span.fw-bold')?.innerText?.replace('€', '') || '0');
        const quantita = parseInt(item.querySelector('.quantity-input')?.value || '1');
        totale += prezzo * quantita;
    });

    prezzoTotElement.innerText = `Prezzo totale: €${totale.toFixed(2)}`;
}

export { modificaQuantità, rimuoviProdotto, aggiornaPrezzoTotale};