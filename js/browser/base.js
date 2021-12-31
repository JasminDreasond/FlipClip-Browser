// Module
var resolution = new unResolution.Resolution();

// Params
const urlSearchParams = new URLSearchParams(window.location.search);
var params = Object.fromEntries(urlSearchParams.entries());

// Messages
const messages = {

    newTab: function(message) {
        console.log(message);
    },

    frameUpdate: function(message) {

        // Prepare Data
        let url = message.data.url.split('/');

        // New iFrame Data
        if (message.data.url.startsWith(chrome.runtime.getURL('validator.html') + '?secret=')) {
            const urlData = new URL(message.data.url);
            const urlSearchParams = new URLSearchParams(urlData.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            if (params.secret === browserSettings.windowSecret && browserSettings.tabs[params.id]) {
                browserSettings.tabs[params.id].frameId = message.data.frameId;
                browserSettings.framesId[message.data.frameId] = params.id;
                browserSettings.tabs[params.id].iframe.attr('src', browserSettings.urlGenerator(browserSettings.tabs[params.id].cid) + browserSettings.tabs[params.id].path);
            }
        }

        // Set New Tab Address
        else if (browserSettings.framesId[message.data.frameId] && browserSettings.tabs[browserSettings.framesId[message.data.frameId]]) {

            // Remove Protocol
            url.shift();

            // Remove Blank
            url.shift();

            // Get Domain
            const domain = url[0];
            const cid = domain.split('.')[0];
            url.shift();

            // Fix URL
            url = url.join('/');

            browserSettings.tabs[browserSettings.framesId[message.data.frameId]].cid = cid;
            browserSettings.tabs[browserSettings.framesId[message.data.frameId]].path = url;

        }

    }

};

// Start Window Connection
console.log('FlipClip Browser starting...');
$(function() {
    console.log('FlipClip Browser sending request...');
    chrome.runtime.sendMessage('connectWindow', (response) => {
        if (response) {
            console.log('FlipClip Browser Started!');
            startAddressBar(function() {
                startBrowser(function() {
                    $('#appstart').fadeOut(500, function() {
                        $('#appstart').remove();
                    });
                });
            });
        }
    });
});

// Receive New Pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof messages[message.type] === 'function') { messages[message.type](message, sender, sendResponse); }
});