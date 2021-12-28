// Domains Servers
const domains = {
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
const openNFTPage = function(tabID, vanillaURL, newTab) {

    // Prepare URL Filter
    const url = vanillaURL.split('/');

    // URL Checker
    if (

        // URL Base
        (url[0].startsWith('ipfs:') || url[0].startsWith('https:') || url[0].startsWith('http:')) &&
        url[1] === '' &&

        // Domains
        (domains.unstoppabledomains.find(domain => url[2].endsWith(domain)))

    ) {

        try {

            chrome.scripting.executeScript({
                target: { tabId: tabID },
                function: function() {

                    window.close();

                    chrome.windows.create({
                        type: 'popup',
                        url: '/browser.html?open=' + encodeURIComponent(vanillaURL)
                    });

                }
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
chrome.webRequest.onResponseStarted.addListener(webRequestValidator, { urls: ["<all_urls>"] });
chrome.webRequest.onErrorOccurred.addListener(webRequestValidator, { urls: ["<all_urls>"] });
chrome.webNavigation.onCommitted.addListener(webRequestValidator, { urls: ["<all_urls>"] });

// Show the demo page once the extension is installed
/* chrome.runtime.onInstalled.addListener((_reason) => {
    chrome.tabs.create({
        url: 'demo/index.html'
    });
}); */