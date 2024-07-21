async function loadNavbar() {
    const response = await fetch('https://api.github.com/repos/junovhs/pooltool/contents/pages');
    const files = await response.json();
    
    const navbar = document.getElementById('navbar-placeholder');
    navbar.innerHTML = '<a href="index.html">Home</a>';
    
    files.forEach(file => {
        if (file.name.endsWith('.html')) {
            const pageName = file.name.replace('.html', '').replace(/-/g, ' ');
            navbar.innerHTML += `<a href="pages/${file.name}">${pageName}</a>`;
        }
    });
}

document.addEventListener('DOMContentLoaded', loadNavbar);
