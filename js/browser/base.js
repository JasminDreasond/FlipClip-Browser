// Params
const urlSearchParams = new URLSearchParams(window.location.search);
var params = Object.fromEntries(urlSearchParams.entries());

// Messages
const messages = {

    newTab: function(message) {
        console.log(message);
    }

};

// Start Window Connection
console.log('FlipClip Browser starting...');
$(function() {
    console.log('FlipClip Browser sending request...');
    chrome.runtime.sendMessage('connectWindow', (response) => {
        if (response) {
            console.log('FlipClip Browser Started!');
        }
    });
});

// Receive New Pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof messages[message.type] === 'function') { messages[message.type](message, sender, sendResponse); }
});