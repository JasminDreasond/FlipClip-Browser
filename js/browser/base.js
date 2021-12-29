// Start Window Connection
chrome.runtime.sendMessage('connectWindow', (response) => {
    if (response) {
        console.log('Window Connected!');
    }
});

// Receive New Pages
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'newTab') {
        console.log(message);
    }
});