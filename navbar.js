async function generateNavbar() {
    const apiUrl = `https://api.github.com/repos/${config.repoOwner}/${config.repoName}/contents/${config.pagesPath}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const navbarHtml = `
            <ul>
                <li><a href="/pooltool/">Home</a></li>
                ${generateNavItems(data)}
            </ul>
        `;
        
        document.getElementById('navbar').innerHTML = navbarHtml;
        addNavbarListeners();
    } catch (error) {
        console.error('Error generating navbar:', error);
    }
}

function generateNavItems(items, parentPath = '') {
    return items
        .filter(item => !config.excludeFiles.includes(item.name))
        .map(item => {
            const fullPath = parentPath + '/' + item.name;
            if (item.type === 'dir') {
                return `
                    <li class="dropdown">
                        <a href="#" class="dropbtn">${item.name}</a>
                        <div class="dropdown-content">
                            ${generateNavItems(item.children, fullPath)}
                        </div>
                    </li>
                `;
            } else if (item.name.endsWith('.html')) {
                return `<li><a href="/pooltool/?page=${fullPath.slice(1)}" data-page="${fullPath.slice(1)}">${item.name.replace('.html', '')}</a></li>`;
            }
            return '';
        })
        .join('');
}

function addNavbarListeners() {
    document.querySelectorAll('#navbar a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('dropbtn')) {
                e.preventDefault();
                link.parentElement.classList.toggle('active');
            } else {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                loadPage(page);
                window.history.pushState({page: page}, '', link.href);
            }
        });
    });
}

async function loadPage(page) {
    const contentDiv = document.getElementById('content');
    if (page === '') {
        contentDiv.innerHTML = '<h1>Welcome to Pool Tool</h1>';
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
