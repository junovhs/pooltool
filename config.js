const pages = [
    { name: "Home", path: "index.html", enabled: true },
    { name: "QR Code Generator", path: "pages/qr.html", enabled: true },
    // Add more pages as needed
];

function loadNavbar() {
    console.log('loadNavbar called'); // Debugging log
    fetch('https://junovhs.github.io/pooltool/components/navbar.html')
        .then(response => {
            console.log('fetch response received'); // Debugging log
            return response.text();
        })
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            const navLinks = document.getElementById('nav-links');
            console.log('navLinks:', navLinks); // Debugging log
            pages.forEach(page => {
                if (page.enabled) {
                    const li = document.createElement('li');
                    li.className = 'nav-item';
                    li.innerHTML = `<a class="nav-link" href="https://junovhs.github.io/pooltool/${page.path}">${page.name}</a>`;
                    navLinks.appendChild(li);
                    console.log(`Added link for ${page.name}`); // Debugging log
                }
            });
        });
}
