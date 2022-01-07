// contextMenus

// Prepare Data
const contextMenus = {};

// Insert Address
chrome.contextMenus.create({
    contexts: ['editable'],
    id: 'insertAddress',
    title: 'Insert Wallet Address'
});

const insertAddress = function(data, tab, symbol) {

    // Exist Selection
    if (typeof data.selectionText === 'string' && data.selectionText.length > 0) {

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['/js/ud/resolution.js']
        });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [data.selectionText, symbol],
            func: function(addr, symbol) {

                // Module
                var resolution = new unResolution.Resolution();

                // Execute
                resolution.addr(addr, symbol).then((addr) => {
                    console.log(addr);
                }).catch(err => {
                    console.error(err);
                });

            }
        });

    }

    // Nope
    else {

    }

    // Complete
    return;

};

// Bitcoin
chrome.contextMenus.create({
    contexts: ['editable'],
    parentId: 'insertAddress',
    id: 'insertAddressBTC',
    title: 'BTC'
});

contextMenus.insertAddressBTC = async function(data, tab) {
    return insertAddress(data, tab, 'BTC');
};

// Ethereum
chrome.contextMenus.create({
    contexts: ['editable'],
    parentId: 'insertAddress',
    id: 'insertAddressETH',
    title: 'ETH'
});

contextMenus.insertAddressETH = async function(data, tab) {
    return insertAddress(data, tab, 'ETH');
};

// Doge
chrome.contextMenus.create({
    contexts: ['editable'],
    parentId: 'insertAddress',
    id: 'insertAddressETH',
    title: 'ETH'
});

contextMenus.insertAddressETH = async function(data, tab) {
    return insertAddress(data, tab, 'ETH');
};

// Click Menu
chrome.contextMenus.onClicked.addListener(async(data, tab) => {
    if (data && data.menuItemId && contextMenus[data.menuItemId]) {
        await contextMenus[data.menuItemId](data, tab);
    }
    return;
});