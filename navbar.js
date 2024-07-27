const config = {
    repoOwner: 'junovhs',
    repoName: 'pooltool',
    pagesPath: 'pages',
    excludeFiles: ['index.html', 'config.js', 'navbar.js', 'styles.css', '404.html']
};

async function generateNavbar() {
    try {
        const response = await fetch(`https://api.github.com/repos/${config.repoOwner}/${config.repoName}/contents/${config.pagesPath}`);
        const data = await response.json();
        
        const navbarHtml = `
            <ul>
                <li><a href="/pooltool/" class="logo">Pool Tool</a></li>
                ${await generateNavItems(data)}
            </ul>
        `;
        
        document.getElementById('navbar').innerHTML = navbarHtml;
        addNavbarListeners();
    } catch (error) {
        console.error('Error generating navbar:', error);
    }
}

async function generateNavItems(items, parentPath = '') {
    let navItems = '';
    for (const item of items) {
        if (config.excludeFiles.includes(item.name)) continue;
        
        const fullPath = parentPath + '/' + item.name;
        if (item.type === 'dir') {
            const response = await fetch(item.url);
            const children = await response.json();
            navItems += `
                <li class="dropdown">
                    <a href="#" class="dropbtn">${item.name}</a>
                    <div class="dropdown-content">
                        ${await generateNavItems(children, fullPath)}
                    </div>
                </li>
            `;
        } else if (item.name.endsWith('.html')) {
            navItems += `<li><a href="#" data-page="${fullPath.slice(1)}">${item.name.replace('.html', '')}</a></li>`;
        }
    }
    return navItems;
}

function addNavbarListeners() {
    document.querySelectorAll('#navbar a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (link.classList.contains('dropbtn')) {
                link.parentElement.classList.toggle('active');
            } else {
                const page = link.getAttribute('data-page');
                if (page) {
                    loadPage(page);
                    window.history.pushState({page: page}, '', `/pooltool/?page=${page}`);
                } else {
                    loadPage('');
                    window.history.pushState({page: ''}, '', '/pooltool/');
                }
            }
        });
    });
}

async function loadPage(page) {
    const contentDiv = document.getElementById('content');
    if (page === '') {
        contentDiv.innerHTML = `
            <h1>Welcome to Pool Tool</h1>
            <p>Select a tool from the navigation menu to get started.</p>
        `;
    } else {
        try {
            const response = await fetch(`/${config.pagesPath}/${page}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            contentDiv.innerHTML = html;
        } catch (error) {
            console.error('Error loading page:', error);
            contentDiv.innerHTML = '<h1>Error loading page</h1>';
        }
    }
}

function handlePageLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || '';
    loadPage(page);
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        loadPage(event.state.page);
    } else {
        loadPage('');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    generateNavbar();
    handlePageLoad();
});
