document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const rawId = urlParams.get('id');
    const userId = parseInt(rawId, 10);
    
    if (!Number.isInteger(userId)) {
        console.error('ID venditore non valido o mancante nell’URL.');
        document.getElementById('seller-name').textContent = 'ID venditore non valido.';
        return;
    }

    //if (userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/seller/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const { user } = await response.json();

            document.getElementById('seller-name').textContent = user.fullname;
            const description = user.description || 'Nessuna descrizione disponibile';
            document.getElementById('seller-description').textContent = description;
            document.getElementById('seller-email').textContent = "Contattami qui: ";
            document.getElementById('seller-email-link').href = `mailto:${user.email}`;

        } catch (error) {
            console.error('Error loading seller:', error);
            document.getElementById('seller-name').textContent = 'Errore nel caricamento del Venditore';
            document.getElementById('seller-description').textContent = error.message;
        }
    //}
});