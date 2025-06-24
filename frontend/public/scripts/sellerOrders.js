document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('sellerProductsList');
    const noProductsMsg = document.getElementById('noProductsMsg');
    const token = sessionStorage.getItem('token');

    if (!token) {
        list.innerHTML = '<li class="list-group-item text-danger">Devi essere loggato.</li>';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/v1/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const orders = await response.json();

        if (orders.length === 0) return;

        noProductsMsg.style.display = 'none';

        orders.forEach(order => {
            const li = document.createElement('li');
            li.className = 'list-group-item';

            li.innerHTML = `
                <strong>Ordine #${order.order_id}</strong> - ${new Date(order.created_at).toLocaleString()}<br>
                Compratore: ${order.buyer_name}<br>
                Prodotto: ${order.product_name}<br>
                Quantità: ${order.quantity}<br>
                Totale ordine: €${order.total}<br>
                Stato: ${order.status}
            `;

            list.appendChild(li);
        });

    } catch (err) {
        console.error('Errore nel caricamento ordini venditore:', err);
        list.innerHTML = '<li class="list-group-item text-danger">Errore di rete.</li>';
    }
});
