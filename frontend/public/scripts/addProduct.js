document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('addProductForm');
    
    if (addProductForm) {
        addProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('productName').value;
            const description = document.getElementById('productDescription').value;
            const price = document.getElementById('productPrice').value;
            const stock = document.getElementById('productStock').value;
            const imageInput = document.getElementById('productImages');
            let image = '';
            if (imageInput && imageInput.files && imageInput.files[0]) {
                const file = imageInput.files[0];
                image = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }
            
            try {
                const response = await fetch('http://localhost:3000/api/v1/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        price,
                        stock,
                        image
                    })
                });
                
                if (response.ok) {
                    const responseData = await response.json();
                    
                    const token = response.headers.get('Authorization').split(' ')[1];
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(responseData.user));
                    
                    window.location.href = 'index.html';
                } else {
                    const errorData = await response.json();
                    document.getElementById('addProductStatus').innerText = errorData.message;
                }
            } catch (error) {
                console.error('Add product error:', error);
            }
        });
    }
});