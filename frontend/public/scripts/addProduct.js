document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('addProductForm');
    
    if (addProductForm) {
        addProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = addProductForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Caricamento...
            `;

            try {
                const formData = new FormData(addProductForm);
                const token = localStorage.getItem('token');
                
                if (!token) throw new Error('Devi effettuare il login');
                if (!formData.get('productImage')) throw new Error('Seleziona un\'immagine');

                const response = await fetch('http://localhost:3000/api/v1/products', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Errore durante l\'aggiunta del prodotto');
                }

                window.location.href = 'myProducts.html';

            } catch (error) {
                console.error('Add product error:', error);
                const errorElement = document.getElementById('addProductStatus') || document.createElement('div');
                errorElement.id = 'addProductStatus';
                errorElement.className = 'alert alert-danger mt-3';
                errorElement.textContent = error.message;
                addProductForm.appendChild(errorElement);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});