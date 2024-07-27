async function fetchSiteStructure() {
    const structure = {
        'home': { title: 'Home', path: 'pages/home.html' },
        'salviadosage': { title: 'Salvia Dosage', path: 'pages/salviadosage.html' },
        'trippycheckers': { title: 'Trippy Checkers', path: 'pages/trippycheckers.html' },
        'mushroom_stuff': {
            title: 'Mushroom Tools',
            submenu: {
                'agarcalculator': { title: 'Agar Calculator', path: 'pages/mushroom_stuff/agarcalculator.html' },
                'substratecalculator': { title: 'Substrate Calculator', path: 'pages/mushroom_stuff/substratecalculator.html' }
            }
        }
    };
    return structure;
}

function createNavbar(structure) {
    const navbar = document.getElementById('navbar');
    const mainMenu = document.createElement('ul');
    mainMenu.className = 'main-menu';

    for (const [key, page] of Object.entries(structure)) {
        const menuItem = document.createElement('li');
        
        if (page.submenu) {
            const dropdownBtn = document.createElement('button');
            dropdownBtn.textContent = page.title;
            dropdownBtn.className = 'dropdown-btn';
            menuItem.appendChild(dropdownBtn);

            const submenu = document.createElement('ul');
            submenu.className = 'submenu';
            
            for (const [subKey, subPage] of Object.entries(page.submenu)) {
                const subMenuItem = document.createElement('li');
                const subLink = document.createElement('a');
                subLink.href = `#${subKey}`;
                subLink.textContent = subPage.title;
                subLink.onclick = (e) => {
                    e.preventDefault();
                    loadPage(subPage.path);
                };
                subMenuItem.appendChild(subLink);
                submenu.appendChild(subMenuItem);
            }
            
            menuItem.appendChild(submenu);
        } else {
            const link = document.createElement('a');
            link.href = `#${key}`;
            link.textContent = page.title;
            link.onclick = (e) => {
                e.preventDefault();
                loadPage(page.path);
            };
            menuItem.appendChild(link);
        }
        
        mainMenu.appendChild(menuItem);
    }

    navbar.appendChild(mainMenu);
}
