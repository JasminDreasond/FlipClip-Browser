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

// Open NFT Script
const openNFTPage = async function(tabID, vanillaURL, newTab) {

    // Prepare URL Filter
    let url = vanillaURL.split('/');

    // URL Checker
    if (

        // URL Base
        (url[0].startsWith('ipfs:') || url[0].startsWith('https:') || url[0].startsWith('http:')) &&
        url[1] === '' &&

        // Domains
        (domains.unstoppabledomains.find(domain => url[2].endsWith(domain)))

    ) {

        try {

            // Remove Protocol
            url.shift();

            // Remove Blank
            url.shift();

            // Get Domain
            const domain = url[0];
            url.shift();

            // Fix URL
            url = url.join('/');
            await new Promise(function(resolve) {
                chrome.tabs.remove(tabID, function() {

                    // Create Window
                    const createWindow = function() {
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

                    // New Window
                    if (Object.keys(windows).length < 1) { createWindow(); }

                    // Exist Window
                    else {

                        let windowDetected = false;

                        // Detect Window
                        for (const item in windows) {
                            if (windows[item].usingNow) {

                                // Send Data to Window


                                // Complete
                                windowDetected = true;
                                break;

                            }
                        }

                        // Complete
                        if (windowDetected) { resolve(); }

                        // Nope
                        else { createWindow(); }

                    }

                });
            });

        } catch (err) { console.error(err); }

    }

    // Complete
    return;

};

// Web Request
const webRequestValidator = function(details) {
    if (details.frameId === 0 && details.type === "main_frame" && details.method === "GET") {
        openNFTPage(details.tabId, details.url, true);
    }
};

chrome.action.onClicked.addListener(function(tab) { return openNFTPage(tab.id, tab.url, true); });
chrome.webRequest.onBeforeRequest.addListener(webRequestValidator, {
    urls: domains.filterGenerator(),
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

// Show the demo page once the extension is installed
/* chrome.runtime.onInstalled.addListener((_reason) => {
    chrome.tabs.create({
        url: 'demo/index.html'
    });
}); */