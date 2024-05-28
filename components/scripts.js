document.addEventListener("DOMContentLoaded", function() {
    loadNavbar();
});
// Add this function to scripts.js
function generateUniqueEmail() {
    const randomString = Math.random().toString(36).substring(2, 10);
    const email = `${randomString}@tempmail.com`;
    document.getElementById('email-display').innerText = email;
}

document.getElementById('generate-email').addEventListener('click', generateUniqueEmail);
