document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const rawId = urlParams.get('id');
    const userId = parseInt(rawId, 10);
    
    if (!Number.isInteger(userId)) {
        console.error('ID venditore non valido o mancante nell’URL.');
        document.getElementById('seller-name').textContent = 'ID venditore non valido.';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/v1/seller/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
            
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const { user } = await response.json();

        document.getElementById('seller-name').textContent = user.fullname;
        const description = user.description || 'Nessuna descrizione disponibile';
        document.getElementById('seller-description').textContent = (description===null?"Benvenuto sul mio profilo!":description);
        
        document.getElementById('seller-email-link').href = `mailto:${user.email}`;
        document.getElementById('seller-email-link').textContent = user.email;

    } catch (error) {
        console.error('Error loading seller:', error);
        document.getElementById('seller-name').textContent = 'Errore nel caricamento del Venditore';
        document.getElementById('seller-description').textContent = error.message;
    }

    const productsContainer = document.querySelector('.row');
    try {
        const response = await fetch(`http://localhost:3000/api/v1/products/seller/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const responseData = await response.json();
        productsContainer.innerHTML = '';

        console.log("products: " + responseData.data.products.length);

        if (responseData.data.products.length > 0) {
            responseData.data.products.forEach(product => {
                console.log("product: " + product.name + " - id: " + product.id);

                const placeholderImage = 'http://localhost:3000/uploads/placeholder.png';
                const imageUrl = product.image_url || placeholderImage;

                const productCard = `
                    <div class="col">
                        <div class="card h-100">
                            <img src="${imageUrl}" class="card-img-top" alt="${product.name}">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text fw-bold">€${Number(product.price).toFixed(2)}</p>
                                <a href="prodotto.html?id=${product.id}" class="btn btn-primary">Dettagli</a>
                            </div>
                        </div>
                    </div>
                `;
                productsContainer.insertAdjacentHTML('beforeend', productCard);
            });
        } else {
            productsContainer.innerHTML = '<p class="text-muted mb-4">Nessun prodotto in vendita.</p>';
        }
    } catch (error) {
        console.error('Errore nel caricamento prodotti:', error);
        productsContainer.innerHTML = '<p class="text-danger">Errore nel caricamento dei prodotti.</p>';
    }
});