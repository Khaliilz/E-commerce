document.addEventListener('DOMContentLoaded', async () => {
    const avvisiList = document.getElementById('avvisiList');
    const token = sessionStorage.getItem('token');

    if (!token) {
        avvisiList.innerHTML = '<li class="list-group-item">Devi essere loggato per vedere gli avvisi.</li>';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/v1/user/message', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const messages = await response.json();

            if (messages.length === 0) {
                avvisiList.innerHTML = '<li class="list-group-item">Nessun avviso al momento.</li>';
                return;
            }

            messages.forEach(msg => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `
                    <strong>${new Date(msg.created_at).toLocaleString()}:</strong><br>
                    ${msg.content}
                `;
                avvisiList.appendChild(li);
            });
        } else {
            avvisiList.innerHTML = '<li class="list-group-item text-danger">Errore nel recupero degli avvisi.</li>';
        }
    } catch (err) {
        console.error(err);
        avvisiList.innerHTML = '<li class="list-group-item text-danger">Errore di rete.</li>';
    }
});
