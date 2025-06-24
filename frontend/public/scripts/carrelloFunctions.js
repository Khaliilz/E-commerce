async function modificaQuantità(event) {
    const productId = event.target.dataset.productId;
    const newQuantity = Number(event.target.value);
    const oldQuantity = Number(event.target.dataset.oldQuantity || event.target.defaultValue);

    if (isNaN(newQuantity) || newQuantity < 0) {
        event.target.value = oldQuantity;
        alert('La quantità deve essere un numero positivo');
        return;
    }
    
    if (isNaN(newQuantity) || newQuantity < 0) {
        event.target.value = oldQuantity;
        alert('La quantità deve essere un numero positivo');
        return;
    }

    try {
        const cartResponse = await fetch('http://localhost:3000/api/v1/user/cart', {
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
        
        if (!cartResponse.ok) {
            const error = await cartResponse.json();
            throw new Error(error.message || 'Failed to update cart');
        }

        const quantityDifference = newQuantity - oldQuantity;
        if (!Number.isFinite(quantityDifference)) throw new Error('Invalid quantity difference');
        
        if (quantityDifference !== 0) {
            const stockResponse = await fetch(`http://localhost:3000/api/v1/product/${productId}/stocks`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    adjustment: Number(-quantityDifference)
                })
            });

            if (!stockResponse.ok) {
                const error = await stockResponse.json();
                throw new Error(error.message || 'Failed to update stock');
            }
        }

        event.target.dataset.oldQuantity = newQuantity;
        event.target.defaultValue = newQuantity;
        aggiornaPrezzoTotale();

    } catch (error) {
        console.error('Error updating quantity:', error);
        alert(error.message || 'Errore durante l\'aggiornamento');
        event.target.value = oldQuantity;
    }
}

async function rimuoviProdotto(event) {
    const productId = event.target.dataset.productId;
    const quantity = parseInt(event.target.closest('.list-group-item').querySelector('.quantity-input').value);
    
    if (!confirm('Sei sicuro di voler rimuovere questo prodotto dal carrello?')) {
        return;
    }
    
    try {
        const stockResponse = await fetch(`http://localhost:3000/api/v1/product/${productId}/stocks`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adjustment: quantity
            })
        });

        if (!stockResponse.ok) {
            const error = await stockResponse.json();
            throw new Error(error.message || 'Failed to update stock');
        }

        const cartResponse = await fetch(`http://localhost:3000/api/v1/user/cart?productId=${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });
        
        if (!cartResponse.ok) {
            const error = await cartResponse.json();
            throw new Error(error.message || 'Failed to remove from cart');
        }

        event.target.closest('.list-group-item').remove();
        
        if (!document.querySelector('.list-group-item')) {
            document.querySelector('.list-group').innerHTML = 
                '<p class="text-muted">Il tuo carrello è vuoto.</p>';
            const payButton = document.getElementById("paga");
            if (payButton) payButton.remove();
        }
        aggiornaPrezzoTotale();

    } catch (error) {
        console.error('Error removing product:', error);
        alert(error.message || 'Errore durante la rimozione');
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

export { modificaQuantità, rimuoviProdotto, aggiornaPrezzoTotale };