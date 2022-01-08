// Prepare Data
const contextMenus = {};

// Insert Address
chrome.contextMenus.create({
    contexts: ['editable'],
    id: 'insertAddress',
    title: 'Loading...'
});

const insertAddress = async function(data, tab, symbol, itemClick) {

    // Exist Selection
    if (typeof data.selectionText === 'string' && data.selectionText.length > 0) {

        console.log(data, tab, symbol, itemClick);

        // Execute Lib
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['/js/ud/resolution.js', '/js/jquery.min.js']
        });

        // Execute Script
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [data.selectionText, symbol],
            func: function(addr, symbol) {

                // Module
                var resolution = new unResolution.Resolution();

                // Get Address
                resolution.addr(addr, symbol).then((addr) => {

                    // Result
                    console.log(addr);

                })

                // Error
                .catch(err => {
                    console.error(err);
                });

            }
        });

    }

    // Complete
    return;

};

// Start Script
var startContextMenus = function() {

    // Insert Address
    chrome.contextMenus.update('insertAddress', {
        title: chrome.i18n.getMessage('convert_to_wallet')
    });

    // Read Crypto Data
    const walletsLoaded = {};
    for (const dns in webinfo.dns) {
        for (const item in webinfo.dns[dns].wallet) {
            if (!walletsLoaded[webinfo.dns[dns].wallet[item].symbol]) {

                // Add Values
                walletsLoaded[webinfo.dns[dns].wallet[item].symbol] = webinfo.dns[dns].wallet[item].symbol;

                // Add Menu
                chrome.contextMenus.create({
                    contexts: ['editable'],
                    parentId: 'insertAddress',
                    id: 'insertAddress' + webinfo.dns[dns].wallet[item].symbol,
                    title: webinfo.dns[dns].wallet[item].name
                });

                // Add Callback
                contextMenus['insertAddress' + webinfo.dns[dns].wallet[item].symbol] = async function(data, tab, itemClick) {
                    return insertAddress(data, tab, webinfo.dns[dns].wallet[item].symbol, itemClick);
                };

            }
        }
    };

}

// Click Menu
chrome.contextMenus.onClicked.addListener((data, tab) => {
    return new Promise(function(resolve, reject) {
        if (tab && tab.id && data && data.menuItemId && contextMenus[data.menuItemId]) {
            chrome.tabs.sendMessage(tab.id, "getClickedEl", result => {
                contextMenus[data.menuItemId](data, tab, result).then(resolve).catch(reject);
            });
        }
    });
});