const loadCategoryPreview = async (categoryId, containerId, maxItems = 5) => {
    const container = document.getElementById(containerId);
    const placeholderImage = 'http://localhost:3000/uploads/placeholder.png';

    try {
        const response = await fetch(`http://localhost:3000/api/v1/category/${categoryId}/products`);
        const data = await response.json();

        const products = data.data.products.slice(0, maxItems);

        products.forEach(product => {
            const productLink = document.createElement('a');
            productLink.href = `prodotto.html?id=${product.id}`;
            productLink.className = 'col-auto';

            const img = document.createElement('img');
            img.src = product.image_path ? `http://localhost:3000${product.image_path}` : placeholderImage;
            img.alt = product.name;
            img.style = 'height: 200px; width: auto; min-width: 120px; object-fit: cover;';
            img.onerror = () => { img.src = placeholderImage; };

            productLink.appendChild(img);

            // Simply append the products after the existing content
            container.appendChild(productLink);
        });

    } catch (err) {
        console.error('Errore durante il caricamento anteprima categoria:', err);
    }
};

export {loadCategoryPreview}
