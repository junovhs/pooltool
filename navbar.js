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
            window.location.href = e.target.href; // This line replaces loadPage and pushState
        });
    });
}

async function loadPage(page) {
    const contentDiv = document.getElementById('content');
    console.log('Loading page:', page);
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
            console.log('Fetched HTML:', html.substring(0, 100) + '...');

            // Create a new iframe
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100vh';
            iframe.style.border = 'none';
            
            // Replace the content with the iframe
            contentDiv.innerHTML = '';
            contentDiv.appendChild(iframe);

            // Write the fetched HTML to the iframe
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();

            document.body.classList.add('tool-page');
            
            console.log('Content loaded into iframe');
        } catch (error) {
            console.error('Error loading page:', error);
            contentDiv.innerHTML = '<h1>Error loading page</h1>';
        }
    }
}

function handlePageLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || '';
    // loadPage(page); // Comment out or remove this line
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
    // handlePageLoad(); // Comment out or remove this line
});
