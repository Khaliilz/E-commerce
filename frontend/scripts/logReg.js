const isLoggedIn = false;

function renderProfileMenu() {
    const menu = document.getElementById('profileDropdownMenu');
    menu.innerHTML = '';
    if (isLoggedIn) {
        menu.innerHTML = `<li><a class="dropdown-item" href="#" id="logoutBtn">Log out</a></li>`;
    } else {
        menu.innerHTML = `
            <li><a class="dropdown-item" href="sign-in.html">Sign in</a></li>
            <li><a class="dropdown-item" href="sign-up.html">Sign up</a></li>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderProfileMenu();
    document.body.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'logoutBtn') {
            localStorage.removeItem('loggedIn');
            location.reload();
        }
    });
});