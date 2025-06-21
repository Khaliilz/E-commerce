document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/api/v1/seller/products', {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById("sellerProductsList");
        const noProductsMsg = document.getElementById("noProductsMsg");
        list.innerHTML = ''; // clear previous items

        if (data.status === 'success' && data.data.products.length > 0) {
            data.data.products.forEach(product => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${product.name}</strong><br>
                            <small>${product.description}</small>
                        </div>
                        <span class="text-success fw-bold">${product.price}€</span>
                    </div>
                `;

                list.appendChild(li);
            });
        } else {
            // If no products found
            list.innerHTML = `<li class="list-group-item text-center text-muted">Nessun prodotto in vendita.</li>`;
        }
    })
    .catch(error => {
        console.error('Error loading seller products:', error);
    });
});