document.getElementById('paga').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/v1/user/cart/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok) {
            alert(`✅ Ordine completato con successo! ID ordine: ${result.data.orderId}`);
            window.location.href = 'http://localhost:3100/carrello.html';
        } else {
            alert(`❌ Errore: ${result.message}`);
        }
    } catch (error) {
        console.error('Errore durante il checkout:', error);
        alert('⚠️ Si è verificato un errore imprevisto.');
    }
});