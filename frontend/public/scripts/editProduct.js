document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.log('ID prodotto mancante nell\'URL');
        window.location.href = 'profiloVenditore.html';
        return;
    }

    const token = sessionStorage.getItem('token');
    const statusDiv = document.getElementById('editProductStatus');

        const form = document.getElementById('productStockBtn');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            statusDiv.innerHTML = '';
            const formData = new FormData(e.target);

            try {
                const response = await fetch(`/api/v1/products/seller/${productId}/${'stock'}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(text || 'Risposta non valida dal server');
                }

                const result = await response.json();

                if (response.ok) {
                    statusDiv.innerHTML = `<div class="alert alert-success">Prodotto aggiornato con successo!</div>`;
                } else {
                    throw new Error(result.message || 'Errore durante l\'aggiornamento');
                }

            } catch (error) {
                console.error('Error:', error);
                statusDiv.innerHTML = `<div class="alert alert-danger">${'Errore durante il salvataggio'}</div>`;
            }
        });
});
