document.addEventListener("DOMContentLoaded", function() {
    loadNavbar();
});
// Generate a unique email address
function generateUniqueEmail() {
    const randomString = Math.random().toString(36).substring(2, 10);
    const email = `${randomString}@tempmail.com`;
    document.getElementById('email-display').innerText = email;
}

// Copy the generated email address to the clipboard
document.getElementById('copy-email').addEventListener('click', () => {
    const email = document.getElementById('email-display').innerText;
    navigator.clipboard.writeText(email).then(() => {
        alert('Email address copied to clipboard');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
});

// WebRTC signaling using Hastebin
async function exchangeSignalingData(data) {
    const response = await fetch('https://hastebin.com/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    return json.key; // Unique ID for the data
}

async function retrieveSignalingData(key) {
    const response = await fetch(`https://hastebin.com/raw/${key}`);
    const data = await response.json();
    return data;
}

function encrypt(data, password) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
}

function decrypt(ciphertext, password) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

const peerConnection = new RTCPeerConnection();

peerConnection.ondatachannel = (event) => {
    const receiveChannel = event.channel;
    receiveChannel.onmessage = (event) => {
        const emailData = JSON.parse(event.data);
        // Store the received email data in IndexedDB
        storeEmail(emailData);
    };
};

async function createOffer() {
    const dataChannel = peerConnection.createDataChannel('emailChannel');
    dataChannel.onopen = () => console.log('Data channel opened');
    dataChannel.onclose = () => console.log('Data channel closed');

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const encryptedOffer = encrypt({ offer }, 'password');
    const offerKey = await exchangeSignalingData(encryptedOffer);
    return offerKey;
}

async function handleAnswer(answerKey) {
    const encryptedAnswer = await retrieveSignalingData(answerKey);
    const answerData = decrypt(encryptedAnswer, 'password');
    const remoteDesc = new RTCSessionDescription(answerData.answer);
    await peerConnection.setRemoteDescription(remoteDesc);
}

// Service worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(() => {
        console.log('Service Worker registered');
    });
}

// IndexedDB for storing and displaying emails
const dbRequest = indexedDB.open('emailDB', 1);

dbRequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('emails', { autoIncrement: true });
};

dbRequest.onsuccess = (event) => {
    const db = event.target.result;

    function storeEmail(email) {
        const tx = db.transaction('emails', 'readwrite');
        const store = tx.objectStore('emails');
        store.add(email);
        tx.oncomplete = () => displayEmails(); // Refresh the email list
    }

    function displayEmails() {
        const tx = db.transaction('emails', 'readonly');
        const store = tx.objectStore('emails');
        const request = store.getAll();
        request.onsuccess = (event) => {
            const emails = event.target.result;
            const emailList = document.getElementById('email-list');
            emailList.innerHTML = emails.map(email => `<li>${email}</li>`).join('');
        };
    }

    // Call displayEmails to show stored emails on page load
    displayEmails();
};

document.getElementById('generate-email').addEventListener('click', generateUniqueEmail);
