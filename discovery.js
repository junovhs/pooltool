// discovery.js
(function() {
    function announcePageToParent() {
        if (window.parent !== window) {
            const pageName = window.location.pathname.split('/').pop();
            window.parent.postMessage({ type: 'PAGE_ANNOUNCEMENT', page: pageName }, '*');
        }
    }

    if (document.readyState === 'complete') {
        announcePageToParent();
    } else {
        window.addEventListener('load', announcePageToParent);
    }
})();
