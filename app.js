document.addEventListener("DOMContentLoaded", function() {
    const navbar = document.getElementById('navbar');
    const content = document.getElementById('content');

    // Function to scan the pages directory and generate navigation
    async function generateNavigation() {
        try {
            const response = await fetch('pages/');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'))
                .filter(a => a.href.endsWith('.html'))
                .map(a => a.href.split('/').pop());

            const navHTML = links.map(page => 
                `<li><a href="#${page}">${formatLinkName(page)}</a></li>`
            ).join('');
            navbar.innerHTML = `<ul>${navHTML}</ul>`;
            addNavEventListeners();
        } catch (error) {
            console.error('Error generating navigation:', error);
        }
    }

    // Function to format link names
    function formatLinkName(link) {
        return link.replace('.html', '').split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Function to add event listeners to nav links
    function addNavEventListeners() {
        const links = navbar.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const page = this.getAttribute('href').substring(1);
                loadPage(page);
                history.pushState(null, '', `#${page}`);
            });
        });
    }

    // Function to load page content
    async function loadPage(page) {
        try {
            const response = await fetch(`pages/${page}`);
            const html = await response.text();
            content.innerHTML = html;
        } catch (error) {
            content.innerHTML = `<p>Error loading page: ${error}</p>`;
        }
    }

    // Handle popstate event for browser back/forward navigation
    window.addEventListener('popstate', function() {
        const page = location.hash.substring(1) || 'index.html';
        loadPage(page);
    });

    // Initial setup
    generateNavigation();
    const initialPage = location.hash.substring(1) || 'index.html';
    loadPage(initialPage);
});
