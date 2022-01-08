// Prepare Data
const contextMenus = {};

// Insert Address
chrome.contextMenus.create({
    contexts: ['editable'],
    id: 'insertAddress',
    title: 'Loading...'
});

const insertAddress = async function(data, tab, symbol, itemClick) {

    // First Validator
    if (itemClick && itemClick.base && (
            itemClick.base.tagName === 'input' ||
            itemClick.base.tagName === 'textarea'
        )) {

        // Insert Type
        let insertFullInput = false;

        // Data Validator
        if (typeof data.selectionText !== 'string' || data.selectionText.length < 1) {

            // Check Value
            if (typeof itemClick.base.value === 'string' && itemClick.base.value.length > 0) {
                data.selectionText = itemClick.base.value;
                insertFullInput = true;
            } else if (typeof itemClick.base.text === 'string' && itemClick.base.text.length > 0) {
                data.selectionText = itemClick.base.text;
                insertFullInput = true;
            }

        }

        // Exist Selection
        if (typeof data.selectionText === 'string' && data.selectionText.length > 0) {

            // Execute Lib
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['/js/ud/resolution.js', '/js/jquery.min.js']
            });

            // Execute Script
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                args: [data.selectionText, symbol, insertFullInput, itemClick],
                func: function(addr, symbol, insertFullInput, itemClick) {
                    if (itemClick && itemClick.base && itemClick.parent) {

                        // Module
                        var resolution = new unResolution.Resolution();

                        // Get Address
                        resolution.addr(addr, symbol).then((cryptoAddr) => {

                            // Result
                            console.log(insertFullInput, itemClick);
                            console.log(cryptoAddr);

                            // Elements
                            const elements = { base: { query: '' }, parent: { query: '' } };
                            const insertElements = function(where) {

                                // Insert Tag Name
                                elements[where].query += itemClick[where].tagName;

                                // Insert Elements
                                for (const item in itemClick[where].elements) {
                                    if (item === 'id') {
                                        elements[where].query += '#' + itemClick[where].elements[item];
                                    } else if (item === 'class') {
                                        elements[where].query += '.' + itemClick[where].elements[item].replace(/ /g, '.');
                                    } else {
                                        elements[where].query += '[' + item + '="' + itemClick[where].elements[item] + '"]';
                                    }
                                }

                            };

                            // Insert Query Data
                            insertElements('base');
                            insertElements('parent');
                            if (itemClick.base.text.indexOf(addr) > -1) {
                                elements.base.query += ':contains(\'' + addr + '\')';
                            }

                            // Get Element
                            console.log(elements);
                            const tinyInput = $(elements.parent.query).eq(itemClick.parent.index).find(elements.base.query).eq(elements.base.index);
                            console.log(tinyInput);

                            // Normal Insert
                            if (!insertFullInput) {

                            }

                            // Full Input
                            else {

                            }

                        })

                        // Error
                        .catch(err => {
                            console.error(err);
                        });

                    }
                }
            });

        }

    }

    // Complete
    return;

};

// Start Script
const walletsLoaded = {};
var startContextMenus = function() {

    // Insert Address
    chrome.contextMenus.update('insertAddress', {
        title: chrome.i18n.getMessage('convert_to_wallet')
    });

    // Read Crypto Data
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