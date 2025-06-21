document.addEventListener('DOMContentLoaded', function() {
    // Function to check if the cart has items and show/hide the button accordingly
    function updateProcediButtonVisibility() {
        const cartItems = document.querySelectorAll('.list-group-item');
        const procediButton = document.getElementById('paga');
        
        // If there are items in the cart, show the button; otherwise, hide it
        if (cartItems.length > 0) {
            procediButton.classList.remove('d-none');
        } else {
            procediButton.classList.add('d-none');
        }
    }
    
    // Initially hide the "Procedi al pagamento" button
    updateProcediButtonVisibility();
    
    // Listen for changes in the cart (e.g., adding/removing items)
    const removeButtons = document.querySelectorAll('.btn-danger');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.list-group-item').remove();
            updateProcediButtonVisibility();
        });
    });
});
