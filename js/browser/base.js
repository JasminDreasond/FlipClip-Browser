// Start Window Connection
chrome.runtime.sendMessage('connectWindow', (response) => {
    if (response) {
        console.log('Window Connected!');
    }
});