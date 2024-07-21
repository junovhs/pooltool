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
                    .map(file => `<li><a href="#" data-page="${file.name}">${file.name.replace('.html', '')}</a></li>`)
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
        });
    });
}

async function loadPage(page) {
    const contentDiv = document.getElementById('content');
    if (page === '') {
        // Load home page content
        contentDiv.innerHTML = '<h1>Welcome to Your Tools Website</h1>';
    } else {
        try {
            const response = await fetch(`${config.pagesPath}/${page}`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            contentDiv.innerHTML = doc.body.innerHTML;

            // Execute scripts in the loaded content
            doc.querySelectorAll('script').forEach(script => {
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(script.innerHTML));
                document.body.appendChild(newScript);
            });
        } catch (error) {
            console.error('Error loading page:', error);
            contentDiv.innerHTML = '<h1>Error loading page</h1>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateNavbar();
    // Load the home page initially
    loadPage('');
});
