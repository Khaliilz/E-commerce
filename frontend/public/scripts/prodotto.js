document.addEventListener('DOMContentLoaded', async () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/product/${productId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { data } = await response.json();
            const product = data.product;

            if(product.stock === 0) document.getElementById('addToCartButton').disabled = true;

            document.getElementById('product-name').textContent = product.name;
            
            document.getElementById('product-price').textContent = `€ ${Number(product.price).toFixed(2)}`;
            
            const description = product.description || 'Nessuna descrizione disponibile';
            document.getElementById('product-description').textContent = description;
            
            const stockElement = document.getElementById('product-stock');
            stockElement.innerHTML = product.stock > 0 ? `<span class="text-success">Disponibile (${product.stock} pezzi)</span>` : '<span class="text-danger">Esaurito</span>';
            
            const imgElement = document.getElementById('product-image');
            
            const spinner = document.getElementById('image-spinner');
            
            if (product.image_path) {
                const imageUrl = `http://localhost:3000${product.image_path}`;
                
                const testImage = new Image();
                testImage.src = imageUrl;
                
                testImage.onload = () => {
                    imgElement.src = imageUrl;
                    imgElement.style.opacity = 1;
                    spinner.style.display = 'none';
                };
                
                testImage.onerror = () => {
                    showPlaceholder(imgElement, spinner);
                };
            } else {
                showPlaceholder(imgElement, spinner);
            }


        } catch (error) {
            console.error('Error loading product:', error);
            document.getElementById('product-name').textContent = 'Errore nel caricamento del prodotto';
            document.getElementById('product-description').textContent = error.message;
        }
    }

    function showPlaceholder(imgElement, spinner) {
        imgElement.src = 'http://localhost:3000/uploads/placeholder.png';
        imgElement.style.opacity = 1;
        spinner.style.display = 'none';
    }
});