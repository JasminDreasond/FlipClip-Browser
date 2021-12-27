// Open NFT Script
const openNFTPage = function(tabID, vanillaURL, newTab) {

    /*     chrome.windows.create({
            type: 'popup',
            url: '/index.html'
        }); */

    // Prepare URL Filter
    const url = vanillaURL.split('/');
    console.log(url);

    // URL Checker
    /* if (
        url.startsWith('ipfs://')
    ) {

        chrome.scripting.executeScript({
            target: { tabId: tabID },
            function: function() {
                console.log('Close OLD NFT Window.');
                window.close();
            }
        });

    } */

    // Complete
    return;

};

// Icon Click
chrome.action.onClicked.addListener(function(tab) { return openNFTPage(tab.id, tab.url, true); });

// Show the demo page once the extension is installed
/* chrome.runtime.onInstalled.addListener((_reason) => {
    chrome.tabs.create({
        url: 'demo/index.html'
    });
}); */