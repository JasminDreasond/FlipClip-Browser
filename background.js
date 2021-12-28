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

                    chrome.windows.create({
                        focused: true,
                        state: 'maximized',
                        type: 'popup',
                        url: `/browser.html?path=${encodeURIComponent(url)}&domain=${encodeURIComponent(domain)}`
                    }, function(newWindow) {

                        resolve();
                        return;

                    });

                    return;

                });

            });

        } catch (err) { console.error(err); }

    }

    // Complete
    return;

};

// Web Request
const webRequestValidator = function(details) {
    if (details.frameId === 0) {
        openNFTPage(details.tabId, details.url, true);
    }
};

chrome.action.onClicked.addListener(function(tab) { return openNFTPage(tab.id, tab.url, true); });
chrome.webNavigation.onBeforeNavigate.addListener(webRequestValidator, {
    urls: domains.filterGenerator(),
});

/* "*://*.google.com/*", 
        "*://*.duckduckgo.com/*", 
        "*://*.yahoo.com/*",
         "*://*.yandex.ru/*", 
         "*://*.qwant.com/*", 
         "*://*.mojeek.com/*", 
         "*://*.aol.co.uk/*", 
         "*://*.baidu.com/*", 
         "*://*.bing.com/*", 
         "*://*.wiki.com/*" */

// Show the demo page once the extension is installed
/* chrome.runtime.onInstalled.addListener((_reason) => {
    chrome.tabs.create({
        url: 'demo/index.html'
    });
}); */