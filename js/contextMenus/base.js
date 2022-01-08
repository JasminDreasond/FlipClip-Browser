// contextMenus

// Prepare Data
const contextMenus = {};

// Insert Address
chrome.contextMenus.create({
    contexts: ['editable'],
    id: 'insertAddress',
    title: chrome.i18n.getMessage('convert_to_wallet')
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

// Bitcoin
chrome.contextMenus.create({
    contexts: ['editable'],
    parentId: 'insertAddress',
    id: 'insertAddressBTC',
    title: 'Bitcoin'
});

contextMenus.insertAddressBTC = async function(data, tab, itemClick) {
    return insertAddress(data, tab, 'BTC', itemClick);
};

// Ethereum
chrome.contextMenus.create({
    contexts: ['editable'],
    parentId: 'insertAddress',
    id: 'insertAddressETH',
    title: 'Ethereum'
});

contextMenus.insertAddressETH = async function(data, tab, itemClick) {
    return insertAddress(data, tab, 'ETH', itemClick);
};

// Doge
chrome.contextMenus.create({
    contexts: ['editable'],
    parentId: 'insertAddress',
    id: 'insertAddressDOGE',
    title: 'Doge Coin'
});

contextMenus.insertAddressDOGE = async function(data, tab, itemClick) {
    return insertAddress(data, tab, 'DOGE', itemClick);
};

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