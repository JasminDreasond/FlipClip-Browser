// Anti Repeat
let started = false;

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
    }

};

// Send Modal
var modal = function(title, message, type = 'normal', icon = '') {
    return new Promise(function(resolve, reject) {
        chrome.windows.create({
            type: 'popup',
            height: 400,
            width: 600,
            url: chrome.runtime.getURL(`/modal.html?title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}&type=${encodeURIComponent(type)}&icon=${encodeURIComponent(icon)}`)
        }).then(resolve).catch(reject);
    });
};

// URL Validator
var urlValidator = function(vanillaURL) {

    // URL
    let url = vanillaURL.split('/');
    if (
        (
            url[0].startsWith('ipfs:') ||
            url[0].startsWith('https:') ||
            url[0].startsWith('http:')
        ) &&
        url[1] === ''
    ) {

        // UD
        if ((domains.unstoppabledomains.find(domain => url[2].endsWith(domain)))) {
            return 'unstoppabledomains';
        }

        // Nothing
        else { return null; }

    } else { return null; }

};

// Start Background
var startBackground = function() {
    if (!started) {

        if (!global) { var global = {}; }
        if (!global.window) { global.window = {}; }

        // Windows
        const windows = {};

        // Open NFT Script
        const openNFTPage = async function(tabID, vanillaURL, newTab) {

            // Prepare URL Filter
            let url = vanillaURL.split('/');
            let domain = null;
            let windowDetected = false;

            // Create Window
            const createWindow = function(resolve) {
                chrome.windows.create({
                    type: 'popup',
                    state: 'maximized',
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

            // Detect Window
            const detectWindow = function() {

                // Detect Window
                for (const item in windows) {
                    if (windows[item].usingNow) {

                        // Send Data to Window
                        chrome.runtime.sendMessage(null, { type: 'newTab', url: url, domain: domain });

                        // Complete
                        windowDetected = true;
                        break;

                    }
                }

            };

            // URL Checker
            if (urlValidator(vanillaURL)) {

                try {

                    // Remove Protocol
                    url.shift();

                    // Remove Blank
                    url.shift();

                    // Get Domain
                    domain = url[0];
                    url.shift();

                    // Fix URL
                    url = url.join('/');
                    await new Promise(function(resolve) {
                        chrome.tabs.remove(tabID, function() {

                            // New Window
                            if (Object.keys(windows).length < 1) { createWindow(resolve); }

                            // Exist Window
                            else {

                                /*                         // Detect Window
                                                    detectWindow();
    
                                                    // Complete
                                                    if (windowDetected) { resolve(); }
    
                                                    // Nope
                                                    else { createWindow(resolve); } */

                                createWindow(resolve);

                            }

                        });
                    });

                } catch (err) {
                    modal('ERROR ' + err.code, err.message);
                    console.error(err);
                }

            }

            // New Browser Page
            else if (newTab) {

                try {

                    await new Promise(function(resolve) {

                        // Get Domain
                        domain = '';
                        url = '';

                        // Complete
                        createWindow(resolve);

                    });

                } catch (err) {
                    modal('ERROR ' + err.code, err.message);
                    console.error(err);
                }

            }

            // Complete
            return;

        };

        // Web Request
        const webRequestValidator = function(details) {

            // Open URL
            if (details.frameId === 0 && details.type === "main_frame" && details.method === "GET") {
                openNFTPage(details.tabId, details.url);
            }

            // Send Frame Data
            else if (details.frameId > 0 && details.type === "sub_frame" && details.parentFrameId === 0) {
                chrome.runtime.sendMessage(null, {
                    type: 'frameUpdate',
                    data: details
                });
            }

        };

        /* chrome.action.onClicked.addListener(function(tab) { return openNFTPage(tab.id, tab.url, true); }); */
        chrome.webRequest.onBeforeRequest.addListener(webRequestValidator, {
            urls: ["<all_urls>"]
        });

        chrome.webRequest.onCompleted.addListener(function(details) {

            // Send Frame Data
            if (details.frameId > 0 && details.type === "sub_frame" && details.parentFrameId === 0) {
                chrome.runtime.sendMessage(null, {
                    type: 'onComplete',
                    data: details
                });
            }

        }, {
            urls: ["<all_urls>"]
        });

        chrome.windows.onBoundsChanged.addListener(function(window) {

            // Send Frame Data
            if (windows[window.id]) {
                chrome.runtime.sendMessage(null, {
                    type: 'onBoundsChanged',
                    data: window
                });
            }

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

        // Messages
        const messages = {

            // Connect Window
            connectWindow: function(sender, sendResponse) {
                if (!windows[sender.tab.windowId]) { windows[sender.tab.windowId] = {}; }
                windows[sender.tab.windowId].storage = {};
                windows[sender.tab.windowId].sender = sender;
                sendResponse(true);
            },

            // Add History
            addHistory: function(sender, sendResponse, data) {
                chrome.history.addUrl({ url: `https://${data.domain}/${data.path}` });
            },

            // Remove History
            removeHistory: function(sender, sendResponse, data) {
                chrome.history.deleteUrl({ url: `https://${data.domain}/${data.path}` });
            },

            // Search History
            searchHistory: function(sender, sendResponse, data) {
                chrome.history.search(data).then(search => {
                    sendResponse(null, search);
                }).catch(err => {
                    sendResponse(err);
                });
            },

            // Error Insert Address
            errorInsertAddress: function(sender, sendResponse, data) {
                modal('ERROR ' + data.code, data.message);
            },

            // Get Address Resykt
            getAddressResult: function(sender, sendResponse, data) {
                if (typeof data.domain === 'string' && typeof data.symbol === 'string' && typeof data.addr === 'string') {
                    modal(
                        chrome.i18n.getMessage('new_address_from_tab')
                        .replace('{domain}', data.domain).replace('{symbol}', data.symbol),
                        data.addr,
                        'getText',
                        'info'
                    );
                }
            }

        };

        // Window Connection
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (typeof message === 'string') {
                if (typeof messages[message] === 'function') { messages[message](sender, sendResponse); }
            } else {
                if (typeof messages[message.type] === 'function') { messages[message.type](sender, sendResponse, message.data); }
            }
        });

        // ContextMenus
        startContextMenus();
        started = true;

    }
};

// Import Script
importScripts('/js/background/i18.js');
importScripts('/js/ud/domains.js');
importScripts('/js/contextMenus/base.js');
importScripts('/js/contextMenus/webInfo.js');