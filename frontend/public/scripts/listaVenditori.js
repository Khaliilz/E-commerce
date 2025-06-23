document.addEventListener("DOMContentLoaded", async () => {
    try{
        const response = await fetch('http://localhost:3000/api/v1/allSellers', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`);}

        const data = await response.json();
        const list = document.getElementById("sellersList");
        list.innerHTML = '';

        if (data.status === 'success' && data.data.sellers.length > 0) {
            data.data.sellers.forEach(seller => {
                const sellerItem = document.createElement("a");
                sellerItem.href = `venditore.html?id=${seller.id}`;
                sellerItem.className = "list-group-item list-group-item-action d-flex align-items-center";
                
                sellerItem.innerHTML = `
                    <img src="http://localhost:3000/uploads/profile.png" 
                         alt="${seller.fullname} icon" 
                         class="rounded me-3" 
                         style="width: 64px; height: 64px; object-fit: cover;">
                    <div>
                        <h5 class="mb-1">${seller.fullname || 'Venditore'}</h5>
                        <p class="mb-0 text-muted">${seller.description || 'Nessuna descrizione disponibile'}</p>
                    </div>
                `;

                list.appendChild(sellerItem);
            });
        } else {
            list.innerHTML = `<li class="list-group-item text-center text-muted">Nessun venditore trovato</li>`;
        }
    }catch(error) {
        console.error('Error loading sellers:', error);
    }
});