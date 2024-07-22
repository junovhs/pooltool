async function generateNavbar() {
    const apiUrl = `https://api.github.com/repos/${config.repoOwner}/${config.repoName}/contents/${config.pagesPath}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const navbarHtml = `
            <ul>
                <li><a href="#" data-page="">Home</a></li>
                ${data
                    .filter(file => file.type === 'file' && file.name.endsWith('.html'))
                    .map(file => `<li><a href="#${file.name}" data-page="${file.name}">${file.name.replace('.html', '')}</a></li>`)
                    .join('')
                }
            </ul>
        `;
        
        document.getElementById('navbar').innerHTML = navbarHtml;
        addNavbarListeners();
    } catch (error) {
        console.error('Error generating navbar:', error);
    }
}

function addNavbarListeners() {
    document.querySelectorAll('#navbar a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            loadPage(page);
            window.history.pushState({page: page}, '', `#${page}`);
        });
    });
}

async function loadPage(page) {
    const contentDiv = document.getElementById('content');
    if (page === '') {
        contentDiv.innerHTML = '<h1>Welcome to Your Tools Website</h1>';
    } else {
        try {
            const response = await fetch(`${config.pagesPath}/${page}`);
            const html = await response.text();
            contentDiv.innerHTML = `<iframe src="${config.pagesPath}/${page}" style="width:100%; height:100vh; border:none;"></iframe>`;
        } catch (error) {
            console.error('Error loading page:', error);
            contentDiv.innerHTML = '<h1>Error loading page</h1>';
        }
    }
}

function handleInitialLoad() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        loadPage(hash);
    } else {
        loadPage('');
    }
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
    handleInitialLoad();
});
