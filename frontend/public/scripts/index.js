document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    
    // Add event listener for logout if needed
    document.addEventListener('click', (e) => {
        if (e.target.id === 'logoutBtn') {
            e.preventDefault();
            logoutUser();
        }
    });
});

function isLoggedIn() {
    return sessionStorage.getItem('token') !== null;
}

function getToken() {
    return sessionStorage.getItem('token');
}

function logoutUser() {
    // Clear the token and user data
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    updateAuthUI();
    window.location.href = 'index.html';
}

async function updateAuthUI() {
    const authDropdown = document.getElementById('authDropdown');
    if (!authDropdown) return;

    try {
        // Verify token with backend if needed
        const isAuthenticated = await verifyToken();
        
        if (isAuthenticated) {
            // Get user from sessionStorage after verification
            const user = JSON.parse(sessionStorage.getItem('user'));
            console.log("User role:", user.role);
            
            if (user.role === "user") {
                authDropdown.innerHTML = `<li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>`;
            } else if( user.role === "admin") {
                authDropdown.innerHTML = `
                <li><a class="dropdown-item" href="profiloAdmin.html">La tua area</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                `;
            } else if( user.role === "seller") {
                authDropdown.innerHTML = `
                <li><a class="dropdown-item" href="profiloVenditore.html">La tua area</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                `;
            } else {
                // Default logged in user
                authDropdown.innerHTML = `<li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>`;
            }
        } else {
            // User is not logged in
            authDropdown.innerHTML = `
                <li><a class="dropdown-item" href="login.html">Login</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="sign-up.html">Registrati</a></li>
            `;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        // Fallback to not logged in
        authDropdown.innerHTML = `
            <li><a class="dropdown-item" href="login.html">Login</a></li>
            <li><a class="dropdown-item" href="sign-up.html">Registrati</a></li>
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
            sessionStorage.setItem('user', JSON.stringify(data.user));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Token verification failed:', error);
        return false;
    }
}