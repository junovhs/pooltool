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
    if (page === '') {
        contentDiv.innerHTML = '<h1>Welcome to Your Tools Website</h1>';
    } else {
        contentDiv.innerHTML = `<iframe src="${config.pagesPath}/${page}" style="width:100%; height:100vh; border:none;" frameborder="0"></iframe>`;
        
        // Ensure the iframe content is fully loaded before adjusting its height
        const iframe = contentDiv.querySelector('iframe');
        iframe.onload = function() {
            this.style.height = this.contentWindow.document.body.scrollHeight + 'px';
            
            // Copy the styles from the iframe to the parent document
            const styles = this.contentWindow.document.getElementsByTagName('style');
            for (let style of styles) {
                const newStyle = document.createElement('style');
                newStyle.textContent = style.textContent;
                document.head.appendChild(newStyle);
            }
        };
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
