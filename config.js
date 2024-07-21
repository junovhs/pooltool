async function getPagesList() {
    const response = await fetch('https://api.github.com/repos/junovhs/pooltool/contents/pages');
    const files = await response.json();
    return files
        .filter(file => file.name.endsWith('.html'))
        .map(file => ({
            name: file.name.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            path: `pages/${file.name}`,
            enabled: true
        }));
}

function injectNavbar() {
    const navbarPlaceholder = document.createElement('div');
    navbarPlaceholder.id = 'navbar-placeholder';
    document.body.insertBefore(navbarPlaceholder, document.body.firstChild);
}

async function loadNavbar() {
    const pages = await getPagesList();
    fetch('https://junovhs.github.io/pooltool/components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            const navLinks = document.getElementById('nav-links');
            pages.forEach(page => {
                if (page.enabled) {
                    const li = document.createElement('li');
                    li.className = 'nav-item';
                    li.innerHTML = `<a class="nav-link" href="https://junovhs.github.io/pooltool/${page.path}">${page.name}</a>`;
                    navLinks.appendChild(li);
                }
            });
        });
}
