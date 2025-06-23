import { modificaQuantità, rimuoviProdotto, aggiornaPrezzoTotale } from "./carrelloFunctions.js";

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.list-group');
    const token = sessionStorage.getItem('token');

    if (!token) {
        container.innerHTML = '<p class="text-muted">Accedi per visualizzare il tuo carrello.</p>';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/v1/user/cart', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (!response.ok) {
            container.innerHTML = `<p class="text-danger">${result.message || 'Error loading cart'}</p>`;
            return;
        }

        const products = result.data.products;
        container.innerHTML = '';

        if (!products || products.length === 0) {
            container.innerHTML = '<p class="text-muted">Il tuo carrello è vuoto.</p>';
            return;
        }

        products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'list-group';

            let imageUrl = 'http://localhost:3000/uploads/placeholder.png';
            if (product.image_path) {
                imageUrl = product.image_path.startsWith('http') 
                    ? product.image_path 
                    : `http://localhost:3000${product.image_path}`;
            }

            item.innerHTML = `
                <div class="list-group-item d-flex align-items-center">
                    <img class="rounded me-3" src="${imageUrl}" alt="${product.name}" style="width: 64px; height: 64px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <h5 class="mb-1">
                            <a href="prodotto.html?id=${product.product_id}">${product.name}</a>
                        </h5>
                        <p class="mb-0 text-muted">${product.description || 'No description available'}</p>
                    </div>
                    <span class="me-3 fw-bold">€${Number(product.price).toFixed(2)}</span>
                    <input type="number" class="form-control me-3 quantity-input" 
                        value="${product.quantity}" min="1" max="${product.stock}" 
                        style="width: 70px;" data-product-id="${product.product_id}">
                    <button class="btn btn-danger btn-sm remove-btn" data-product-id="${product.product_id}">Remove</button>
                </div>
            `;

            container.appendChild(item);
        });

        const containerBig = document.getElementById("containerBig");
        
        const pagamento = document.createElement('div');
        pagamento.className = 'd-flex justify-content-end align-items-center mt-4';
        pagamento.innerHTML = `
                <h4 id="prezzoTot" class="me-4 mb-0">Prezzo totale: </h4>
                <a id="paga" class="btn btn-success btn-lg" href="pagamento.html">Procedi al pagamento</a>`;

        containerBig.appendChild(pagamento);
        aggiornaPrezzoTotale();
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', modificaQuantità);
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', rimuoviProdotto);
        });

    } catch (error) {
        console.error('Error loading cart:', error);
        container.innerHTML = '<p class="text-danger">Connection error. Please try again later.</p>';
    }
});