// Prepare Data
const contextMenus = {};

// Insert Address
chrome.contextMenus.create({
    contexts: ['editable'],
    id: 'insertAddress',
    title: 'Loading...'
});

chrome.contextMenus.create({
    contexts: ['selection'],
    id: 'getAddress',
    title: 'Loading...'
});

chrome.contextMenus.create({
    contexts: ['editable', 'selection'],
    id: 'openDomainProfile',
    title: 'Loading...'
});

const getAddress = async function(data, tab, symbol) {

    // Validate Selection
    if (urlValidator('https://' + data.selectionText + '/')) {

        // Execute Lib
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['/js/ud/resolution.js']
        });

        // Execute Script
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [data.selectionText, symbol],
            func: function(addr, symbol) {

                // Module
                var resolution = new unResolution.Resolution();

                // Get Address
                resolution.addr(addr, symbol).then((cryptoAddr) => {
                    chrome.runtime.sendMessage({
                        type: 'getAddressResult',
                        data: {
                            domain: addr,
                            symbol: symbol,
                            addr: cryptoAddr
                        }
                    });
                })

                // Error
                .catch(err => {

                    chrome.runtime.sendMessage({
                        type: 'errorInsertAddress',
                        data: {
                            code: err.code,
                            message: err.message
                        }
                    });

                    console.error(err);

                });


            }
        });

    }

    // Invalid Domain
    else {
        modal(
            chrome.i18n.getMessage('invalid_get_domain_title'),
            chrome.i18n.getMessage('invalid_get_domain_text').replace('{domain}', data.selectionText));
    }

    // Complete
    return;

};

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

            // Validate Selection
            if (urlValidator('https://' + data.selectionText + '/')) {

                // Execute Lib
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['/js/ud/resolution.js', '/js/jquery.min.js', '/js/loadingoverlay.min.js']
                });

                // Execute Script
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    args: [data.selectionText, symbol, insertFullInput, itemClick],
                    func: function(addr, symbol, insertFullInput, itemClick) {
                        if (
                            itemClick &&
                            itemClick.base &&
                            itemClick.parent &&
                            typeof itemClick.base.selectionEnd === 'number' &&
                            typeof itemClick.base.selectionStart === 'number'
                        ) {

                            // Module
                            var resolution = new unResolution.Resolution();

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
                                    } else if (item !== 'value') {
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

                            // Validator 1
                            let tinyInput = $(elements.parent.query).eq(itemClick.parent.index).find(elements.base.query).eq(elements.base.index);
                            if (tinyInput.length < 1) { tinyInput = tinyInput.prevObject; }
                            if (
                                tinyInput.length > 0
                            ) {

                                // Validator 2
                                const itemValue = tinyInput.val();
                                const itemText = tinyInput.text();
                                if (
                                    tinyInput.prop("tagName").toLowerCase() === itemClick.base.tagName &&
                                    (
                                        (typeof itemValue === 'string' && itemValue.indexOf(addr) > -1) ||
                                        (typeof itemText === 'string' && itemText.indexOf(addr) > -1)
                                    )
                                ) {

                                    // Loading Settings
                                    const loadingSettings = {
                                        background: 'rgba(255,255,255, 0.5)'
                                    };

                                    // Use Loading
                                    tinyInput.LoadingOverlay("show", loadingSettings);

                                    // Get Address
                                    resolution.addr(addr, symbol).then((cryptoAddr) => {

                                        // Get Element
                                        var bbrep = function(text) {
                                            var tmpVal = tinyInput.val().substring(itemClick.base.selectionStart, itemClick.base.selectionEnd);
                                            tinyInput.val(tinyInput.val().replace(tmpVal, text));
                                        }

                                        // Normal Insert
                                        if (!insertFullInput) { bbrep(cryptoAddr); }

                                        // Full Input
                                        else { tinyInput.val(cryptoAddr); }

                                        // Complete
                                        tinyInput.LoadingOverlay("hide", true);

                                    })

                                    // Error
                                    .catch(err => {

                                        chrome.runtime.sendMessage({
                                            type: 'errorInsertAddress',
                                            data: {
                                                code: err.code,
                                                message: err.message
                                            }
                                        });

                                        console.error(err);

                                        // Complete
                                        tinyInput.LoadingOverlay("hide", true);

                                    });

                                }
                            }

                        }
                    }
                });

            }

            // Invalid Domain
            else {
                modal(
                    chrome.i18n.getMessage('invalid_get_domain_title'),
                    chrome.i18n.getMessage('invalid_get_domain_text').replace('{domain}', data.selectionText));
            }

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
        title: chrome.i18n.getMessage('convert_to_wallet') + ' (BETA)'
    });

    chrome.contextMenus.update('getAddress', {
        title: chrome.i18n.getMessage('get_wallet_address')
    });

    chrome.contextMenus.update('openDomainProfile', {
        title: chrome.i18n.getMessage('openDomainProfile')
    });

    // Get Domain Profile
    contextMenus['openDomainProfile'] = async function(data) {
        const dns = urlValidator('https://' + data.selectionText + '/');
        if (webinfo.dns[dns] && webinfo.dns[dns].page) {
            chrome.tabs.create({
                url: webinfo.dns[dns].page.replace('{domain}', data.selectionText)
            });
        } else {
            modal(
                chrome.i18n.getMessage('invalid_get_domain_title'),
                chrome.i18n.getMessage('invalid_get_domain_text').replace('{domain}', data.selectionText));
        }
        return;
    };

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

                chrome.contextMenus.create({
                    contexts: ['selection'],
                    parentId: 'getAddress',
                    id: 'getAddress' + webinfo.dns[dns].wallet[item].symbol,
                    title: webinfo.dns[dns].wallet[item].name
                });

                // Add Callback
                contextMenus['insertAddress' + webinfo.dns[dns].wallet[item].symbol] = async function(data, tab, itemClick) {
                    return insertAddress(data, tab, webinfo.dns[dns].wallet[item].symbol, itemClick);
                };

                contextMenus['getAddress' + webinfo.dns[dns].wallet[item].symbol] = async function(data, tab) {
                    return getAddress(data, tab, webinfo.dns[dns].wallet[item].symbol);
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