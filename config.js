const pages = [
    { name: "Home", path: "index.html", enabled: true },
    { name: "QR Code Generator", path: "pages/qr.html", enabled: true },
    { name: "Encryption Tool", path: "pages/encryption.html", enabled: false }
];

function loadNavbar() {
    fetch('components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            const navLinks = document.getElementById('nav-links');
            pages.forEach(page => {
                if (page.enabled) {
                    const li = document.createElement('li');
                    li.className = 'nav-item';
                    li.innerHTML = `<a class="nav-link" href="${page.path}">${page.name}</a>`;
                    navLinks.appendChild(li);
                }
            });
        });
}
