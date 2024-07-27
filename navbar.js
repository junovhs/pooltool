const config = {
    repoOwner: 'junovhs',
    repoName: 'pooltool',
    pagesPath: 'pages'
};

function generateNavbar() {
    const navbarHtml = `
        <ul>
            <li><a href="/pooltool/">Home</a></li>
            <li><a href="/pooltool/pages/salviadosage.html">Salvia Dosage</a></li>
            <li><a href="/pooltool/pages/trippycheckers.html">Trippy Checkers</a></li>
            <li><a href="/pooltool/pages/mushroom_stuff/agarcalculator.html">Agar Calculator</a></li>
            <li><a href="/pooltool/pages/mushroom_stuff/substratecalculator.html">Substrate Calculator</a></li>
        </ul>
    `;
    
    document.getElementById('navbar').innerHTML = navbarHtml;
}

function loadPage(page) {
    const contentDiv = document.getElementById('content');
    if (page === '') {
        contentDiv.innerHTML = '<h1>Welcome to Pool Tool</h1>';
    } else {
        contentDiv.innerHTML = `<iframe src="${page}" style="width:100%; height:100vh; border:none;"></iframe>`;
    }
}

function handlePageLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || '';
    loadPage(page);
}

document.addEventListener('DOMContentLoaded', () => {
    generateNavbar();
    handlePageLoad();
});
