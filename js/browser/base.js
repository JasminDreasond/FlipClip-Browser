// Messages
const messages = {

    newTab: function(message) {
        console.log(message);
    }

};

// Start Window Connection
chrome.runtime.sendMessage({ type: 'connectWindow' }, (response) => {
    if (response) {
        console.log('Window Connected!');
    }
});

// Receive New Pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof messages[message.type] === 'function') { messages[message.type](message, sender, sendResponse); }
});