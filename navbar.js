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
                <li><a href="/pooltool/">Home</a></li>
                ${data
                    .filter(file => file.type === 'file' && file.name.endsWith('.html'))
                    .map(file => `<li><a href="/pooltool/?page=${file.name}">${file.name.replace('.html', '')}</a></li>`)
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
            const page = new URLSearchParams(new URL(e.target.href).search).get('page') || '';
            loadPage(page);
            window.history.pushState({page: page}, '', e.target.href);
        });
    });
}

async function loadPage(page) {
    const contentDiv = document.getElementById('content');
    console.log('Loading page:', page); // Debug log
    if (page === '') {
        contentDiv.innerHTML = '<h1>Welcome to Pool Tool</h1>';
        document.body.classList.remove('tool-page');
        document.querySelectorAll('style[data-tool-style]').forEach(el => el.remove());
    } else {
        try {
            const response = await fetch(`${config.pagesPath}/${page}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            console.log('Fetched HTML:', html.substring(0, 100) + '...'); // Debug log

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            const styles = tempDiv.getElementsByTagName('style');
            for (let style of styles) {
                const newStyle = document.createElement('style');
                newStyle.textContent = style.textContent;
                newStyle.setAttribute('data-tool-style', '');
                document.head.appendChild(newStyle);
            }
            
            document.body.classList.add('tool-page');
            
            contentDiv.innerHTML = tempDiv.innerHTML;
            console.log('Content set:', contentDiv.innerHTML.substring(0, 100) + '...'); // Debug log
            
            const scripts = tempDiv.getElementsByTagName('script');
            for (let script of scripts) {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            }
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
