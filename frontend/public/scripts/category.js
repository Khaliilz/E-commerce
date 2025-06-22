const initializeCategoryProducts = async (categoryId) => {
    const productsContainer = document.querySelector('.row');
    
    const loadProducts = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/category/${categoryId}/products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const responseData = await response.json();
                
                productsContainer.innerHTML = '';
                
                if (responseData.data.products.length > 0) {
                    responseData.data.products.forEach(product => {
                        const placeholderImage = 'http://localhost:3000/uploads/placeholder.png';
                        const productCard = `
                            <div class="col">
                                <div class="card h-100">
                                    <img src="${product.image_path ? 'http://localhost:3000' + product.image_path : placeholderImage}" 
                                         class="card-img-top" 
                                         alt="${product.name}"
                                         onerror="this.onerror=null;this.src='${placeholderImage}'">
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
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                productsContainer.innerHTML = '<p class="text-danger">Errore nel caricamento dei prodotti.</p>';
            }
        } catch (error) {
            console.error('Error loading products:', error);
            productsContainer.innerHTML = '<p class="text-danger">Errore di connessione.</p>';
        }
    };

    document.addEventListener('DOMContentLoaded', loadProducts);
}

export {initializeCategoryProducts} 
