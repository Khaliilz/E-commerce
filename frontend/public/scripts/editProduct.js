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

    // Caricamento dati del prodotto
    try {
        const response = await fetch(`/api/v1/products/${productId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Errore nel caricamento del prodotto');
        }

        const product = await response.json();

        // Carica le categorie
        const categoryRes = await fetch('http://localhost:3000/api/v1/categories');
        if (categoryRes.ok) {
            const categories = await categoryRes.json();
            const select = document.getElementById('productCategory');
            select.innerHTML = '<option value="">Seleziona una categoria</option>';
            categories.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = cat.name;
                select.appendChild(opt);
            });
        }

    } catch (err) {
        console.error('Error:', err);
        statusDiv.innerHTML = `<div class="alert alert-danger">Errore nel caricamento dei dati</div>`;
    }

    // Funzione riutilizzabile per ogni form
    function handleFormSubmit(formId, endpoint) {
        const form = document.getElementById(formId);
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            statusDiv.innerHTML = '';
            const formData = new FormData(e.target);

            try {
                const response = await fetch(`/api/v1/products/seller/${productId}/${endpoint}`, {
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
                    if (formData.get('image')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            document.getElementById('currentImagePreview').src = e.target.result;
                        };
                        reader.readAsDataURL(formData.get('image'));
                    }
                } else {
                    throw new Error(result.message || 'Errore durante l\'aggiornamento');
                }

            } catch (error) {
                console.error('Error:', error);
                statusDiv.innerHTML = `<div class="alert alert-danger">${error.message || 'Errore durante il salvataggio'}</div>`;
            }
        });
    }

    // Registrazione dei form con endpoint specifici
    handleFormSubmit('productNameBtn', 'nome');
    handleFormSubmit('productDescriptionBtn', 'descrizione');
    handleFormSubmit('productPriceBtn', 'prezzo');
    handleFormSubmit('productStockBtn', 'stock');
    handleFormSubmit('productCategoryBtn', 'categoria');
    handleFormSubmit('productImageBtn', 'immagine');
});
