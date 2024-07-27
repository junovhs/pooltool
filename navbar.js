const config = {
    repoOwner: 'junovhs',
    repoName: 'pooltool',
    pagesPath: 'pages',
    excludeFiles: ['index.html', 'config.js', 'navbar.js', 'styles.css']
};

async function generateNavbar() {
    const apiUrl = `https://api.github.com/repos/${config.repoOwner}/${config.repoName}/contents/${config.pagesPath}`;
    
    try {
        const response = await fetch(apiUrl);
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
            <h2>Welcome to Pool Tool</h2>
            <p>Pool Tool is a collection of useful calculators and tools for various purposes. Select a tool from the navigation menu to get started.</p>
            <section id="featured-tools">
                <h3>Featured Tools</h3>
                <ul>
                    <li><a href="#" data-page="salviadosage.html">S.A.L.V.I.A. Experience Level Calculator</a></li>
                </ul>
            </section>
        `;
        addContentListeners();
    } else {
        try {
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100vh';
            iframe.style.border = 'none';
            iframe.src = `${config.pagesPath}/${page}`;
            
            contentDiv.innerHTML = '';
            contentDiv.appendChild(iframe);
        } catch (error) {
            console.error('Error loading page:', error);
            contentDiv.innerHTML = '<h1>Error loading page</h1>';
        }
    }
}

function addContentListeners() {
    document.querySelectorAll('#content a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            loadPage(page);
            window.history.pushState({page: page}, '', `/pooltool/?page=${page}`);
        });
    });
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
