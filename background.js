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

            console.log(vanillaURL);
            console.log(url);
            console.log(domain);
            await new Promise(function(resolve) {
                chrome.scripting.executeScript({
                    target: { tabId: tabID },
                    function: function() {

                        window.close();

                        chrome.windows.create({
                            type: 'popup',
                            url: `/browser.html?path=${encodeURIComponent(url)}&domain=${encodeURIComponent(domain)}`
                        });

                        resolve();
                        return;

                    }
                });
            });

            return;

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
chrome.webRequest.onBeforeRequest.addListener(webRequestValidator, { urls: ["<all_urls>"] });

// Show the demo page once the extension is installed
/* chrome.runtime.onInstalled.addListener((_reason) => {
    chrome.tabs.create({
        url: 'demo/index.html'
    });
}); */