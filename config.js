function loadNavbar() {
    fetch('https://junovhs.github.io/pooltool/pages-list.json')
        .then(response => response.json())
        .then(pages => {
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
        });
}
