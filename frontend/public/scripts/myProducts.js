document.addEventListener('DOMContentLoaded', async () => {
    const productsContainer = document.querySelector('.row');

    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        
        if (!user || !user.id) {
            throw new Error('User not authenticated or missing ID');
        }

        const sellerId = user.id;

        const response = await fetch(`http://localhost:3000/api/v1/products/seller/${sellerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const { data } = await response.json();
            
            productsContainer.innerHTML = '';
            
            if (data.products && data.products.length > 0) {
                data.products.forEach(product => {
                    const placeholderImage = 'http://localhost:3000/uploads/placeholder.png';
                    const productCard = `
                        <div class="col">
                            <div class="card h-100">
                                <img src="${product.image_path ? 'http://localhost:3000' + product.image_path : placeholderImage}" class="card-img-top" alt="${product.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text fw-bold">€${Number(product.price).toFixed(2)}</p>
                                    <a href="editProduct.html?id=${product.id}" class="btn btn-primary">Modifica</a>
                                    <input type="button" class="btn btn-primary" value="Rimuovi"></input>
                                </div>
                            </div>
                        </div>
                    `;
                    productsContainer.insertAdjacentHTML('beforeend', productCard);
                });
            } else {
                productsContainer.innerHTML = '<p class="text-muted mb-4">Nessun prodotto in vendita.</p>';
            }
            
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            productsContainer.innerHTML = '<p class="text-danger">Errore nel caricamento dei prodotti.</p>';
        }
    } catch (error) {
        console.error('MyProducts error:', error);
        productsContainer.innerHTML = '<p class="text-danger">Errore di connessione.</p>';
    }
});