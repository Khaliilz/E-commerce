document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    
    // Add event listener for logout if needed
    document.addEventListener('click', function(e) {
        if (e.target.id === 'logoutBtn') {
            e.preventDefault();
            logoutUser();
        }
    });
});

function isLoggedIn() {
    // Check for token in localStorage or cookie
    return localStorage.getItem('token') !== null;
}

function getToken() {
    return localStorage.getItem('token');
}

function logoutUser() {
    // Clear the token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI();
    window.location.href = 'index.html';
}

async function updateAuthUI() {
    const authDropdown = document.getElementById('profileDropdownMenu');
    if (!authDropdown) return;

    try {
        // Verify token with backend if needed
        const isAuthenticated = await verifyToken();
        
        if (isAuthenticated) {
            // User is logged in
            const user = JSON.parse(localStorage.getItem('user'));
            authDropdown.innerHTML = `
                <li><a class="dropdown-item" href="profilo.html">Il mio profilo</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
            `;
        } else {
            // User is not logged in
            authDropdown.innerHTML = `
                <li><a class="dropdown-item" href="login.html">Login</a></li>
                <li><a class="dropdown-item" href="registrazione.html">Registrati</a></li>
            `;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        // Fallback to not logged in
        authDropdown.innerHTML = `
            <li><a class="dropdown-item" href="login.html">Login</a></li>
            <li><a class="dropdown-item" href="registrazione.html">Registrati</a></li>
        `;
    }
}

async function verifyToken() {
    const token = getToken();
    if (!token) return false;

    try {
        const response = await fetch('http://localhost:3000/api/v1/users/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
}