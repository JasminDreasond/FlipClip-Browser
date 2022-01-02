// Windows
const windows = {};

// Domains Servers
const domains = {

    filterGenerator: function() {
        const result = [];
        for (const where in domains) {
            if (where !== 'filterGenerator') {
                for (const item in domains[where]) {
                    result.push(`*://*${domains[where][item]}/*`);
                }
            }
        }
        return result;
    },

    unstoppabledomains: [
        '.crypto',
        '.zil',
        '.coin',
        '.wallet',
        '.bitcoin',
        '.x',
        '.888',
        '.nft',
        '.dao',
        '.blockchain'
    ]

};

// URL Validator
const urlValidator = function(vanillaURL) {

    // URL
    let url = vanillaURL.split('/');

    return (

        // URL Base
        (url[0].startsWith('ipfs:') || url[0].startsWith('https:') || url[0].startsWith('http:')) &&
        url[1] === '' &&

        // Domains
        (domains.unstoppabledomains.find(domain => url[2].endsWith(domain)))
    );

};

// Open NFT Script
const openNFTPage = async function(tabID, vanillaURL, newTab) {

    // Prepare URL Filter
    let url = vanillaURL.split('/');
    let domain = null;
    let windowDetected = false;

    // Create Window
    const createWindow = function(resolve) {
        chrome.windows.create({
            type: 'popup',
            url: chrome.runtime.getURL(`/browser.html?path=${encodeURIComponent(url)}&domain=${encodeURIComponent(domain)}`)
        }, function(newWindow) {

            // Add New Window
            windows[newWindow.id] = { data: newWindow };
            windows[newWindow.id].usingNow = true;

            // Complete
            resolve();
            return;

        });
    };

    // Detect Window
    const detectWindow = function() {

        // Detect Window
        for (const item in windows) {
            if (windows[item].usingNow) {

                // Send Data to Window
                chrome.runtime.sendMessage(null, { type: 'newTab', url: url, domain: domain });

                // Complete
                windowDetected = true;
                break;

            }
        }

    };

    // URL Checker
    if (urlValidator(vanillaURL)) {

        try {

            // Remove Protocol
            url.shift();

            // Remove Blank
            url.shift();

            // Get Domain
            domain = url[0];
            url.shift();

            // Fix URL
            url = url.join('/');
            await new Promise(function(resolve) {
                chrome.tabs.remove(tabID, function() {

                    // New Window
                    if (Object.keys(windows).length < 1) { createWindow(resolve); }

                    // Exist Window
                    else {

                        // Detect Window
                        detectWindow();

                        // Complete
                        if (windowDetected) { resolve(); }

                        // Nope
                        else { createWindow(resolve); }

                    }

                });
            });

        } catch (err) { console.error(err); }

    }

    // New Browser Page
    else if (newTab) {

        try {

            await new Promise(function(resolve) {

                // Get Domain
                domain = '';
                url = '';

                // Complete
                createWindow(resolve);

            });

        } catch (err) { console.error(err); }

    }

    // Complete
    return;

};

// Web Request
const webRequestValidator = function(details) {

    // Open URL
    if (details.frameId === 0 && details.type === "main_frame" && details.method === "GET") {
        openNFTPage(details.tabId, details.url);
    }

    // Send Frame Data
    else if (details.frameId > 0 && details.type === "sub_frame" && details.parentFrameId === 0) {
        chrome.runtime.sendMessage(null, {
            type: 'frameUpdate',
            data: details
        });
    }

};

chrome.action.onClicked.addListener(function(tab) { return openNFTPage(tab.id, tab.url, true); });
chrome.webRequest.onBeforeRequest.addListener(webRequestValidator, {
    urls: ["<all_urls>"]
});

chrome.webRequest.onCompleted.addListener(function(details) {

    // Send Frame Data
    if (details.frameId > 0 && details.type === "sub_frame" && details.parentFrameId === 0) {
        chrome.runtime.sendMessage(null, {
            type: 'onComplete',
            data: details
        });
    }

}, {
    urls: ["<all_urls>"]
});

// Delete Window Data
chrome.windows.onRemoved.addListener(function(windowID) {
    if (windows[windowID]) {

        // Using Now
        if (windows[windowID].usingNow) {
            for (const item in windows) {
                if (item !== String(windowID)) {
                    windows[item].usingNow = true;
                    break;
                }
            }
        }

        // Delete Data
        delete windows[windowID];

    }
});

// Change Window Using Now
chrome.windows.onFocusChanged.addListener(function(windowID) {
    if (windows[windowID]) {
        for (const item in windows) {
            if (String(windowID) === item) {
                windows[item].usingNow = true;
            } else if (windows[item].usingNow) {
                delete windows[item].usingNow;
            }
        }
    }
});

// Messages
const messages = {

    connectWindow: function(sender, sendResponse) {
        if (!windows[sender.tab.windowId]) { windows[sender.tab.windowId] = {}; }
        windows[sender.tab.windowId].storage = {};
        windows[sender.tab.windowId].sender = sender;
        sendResponse(true);
    },

    addHistory: function(sender, sendResponse, data) {
        chrome.history.addUrl({ url: `https://${data.domain}/${data.path}` });
    },

    removeHistory: function(sender, sendResponse, data) {
        console.log(data);
        chrome.history.removeUrl({ url: `https://${data.domain}/${data.path}` });
    }

};

// Window Connection
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof message === 'string') {
        if (typeof messages[message] === 'function') { messages[message](sender, sendResponse); }
    } else {
        if (typeof messages[message.type] === 'function') { messages[message.type](sender, sendResponse, message.data); }
    }
});

// Show the demo page once the extension is installed
chrome.runtime.onInstalled.addListener((_reason) => {
    return openNFTPage(null, '', true);
});