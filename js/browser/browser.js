// Domains Servers
var domains = {

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

function generateHexString(length) {
    // Use crypto.getRandomValues if available
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.getRandomValues === 'function'
    ) {
        var tmp = new Uint8Array(Math.max((~~length) / 2));
        crypto.getRandomValues(tmp);
        return Array.from(tmp)
            .map(n => ('0' + n.toString(16)).substr(-2))
            .join('')
            .substr(0, length);
    }

    // fallback to Math.getRandomValues
    var ret = "";
    while (ret.length < length) {
        ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0, length);
}

// Browser Scripts
var browserSettings = {

    readDomainData: function(domain, type, data) {
        return new Promise(function(resolve, reject) {

            // UD
            if (domains.unstoppabledomains.find(domainName => domain.endsWith(domainName))) {

                if (type === 'ipfsHash') {
                    resolution.ipfsHash(domain).then(resolve).catch(reject);
                } else if (type === 'addr') {
                    resolution.addr(domain, data).then(resolve).catch(reject);
                } else {
                    reject(new Error('Invalid Read Domain Request!'));
                }

            }

            // Nothing
            else {
                reject(new Error('Invalid DNS App!'));
            }

        });
    },

    // Theme (dark - light)
    theme: 'light',

    // Address Bar
    addressBar: {
        size: 67 / 2,
        buttonSize: 25,
        marginButtonFix: -5,
        barFix: 31,
        fontSize: 11,
        iconsSpace: 176 - 30
    },

    // Domain URL Fix
    fixDomain: function(domain) {
        return domain.toLowerCase().replace(/\s+/g, '').replace(/\r?\n|\r/g, "");
    },

    // Proxy
    proxy: 'https://{cid32}.ipfs.dweb.link/',
    urlGenerator: function(value) {
        let urlResult = browserSettings.proxy.replace('{cid}', value).replace('{cid32}', CIDTool.base32(value));
        if (!browserSettings.proxy.endsWith('/')) { urlResult += '/'; }
        return urlResult;
    },

    // Page Load Detector
    pageLoaded: function() {
        const id = $(this).data('tab');
        if (typeof id === 'number' && browserSettings.tabs[id]) {
            const url = browserSettings.tabs[id].iframe.data('refreshData');
            if (url) {
                browserSettings.tabs[id].iframe.data('refreshData', null);
                browserSettings.tabs[id].iframe.attr('src', url);
            }
            browserSettings.tabCallback.execute(id);
        }
    },

    windowSecret: generateHexString(200),

    // Tab Number
    lastTab: -1,

    // Tabs
    tabs: {},
    framesId: {},

    // Tabs Callback
    tabCallback: {

        // Items
        items: {},

        // Execute Items
        execute: async function(id) {
            if (Array.isArray(browserSettings.tabCallback.items[id])) {

                for (const item in browserSettings.tabCallback.items[id]) {
                    await browserSettings.tabCallback.items[id][item]();
                }

                delete browserSettings.tabCallback.items[id];

            }
        },

        // Add Item
        add: function(callback, id) {
            if (!Array.isArray(browserSettings.tabCallback.items[id])) { browserSettings.tabCallback.items[id] = []; }
            browserSettings.tabCallback.items[id].push(callback);
        }

    },

    // Update Click History
    updateHistory: function() {

        // Disable Items
        browserSettings.addressBar.next.addClass('disabled').prop('disabled', true);
        browserSettings.addressBar.previous.addClass('disabled').prop('disabled', true);

        // Exist Items
        const id = browserSettings.active;
        if (
            typeof browserSettings.tabs[id].activeHistory === 'number' &&
            browserSettings.tabs[id] &&
            browserSettings.tabs[id].history.length > 1
        ) {

            // Enable Previous
            if (browserSettings.tabs[id].activeHistory > 0) {
                browserSettings.addressBar.previous.removeClass('disabled').prop('disabled', false);
            }

            // Enable Next
            if (browserSettings.tabs[id].activeHistory !== browserSettings.tabs[id].history.length - 1) {
                browserSettings.addressBar.next.removeClass('disabled').prop('disabled', false);
            }

        }

        browserSettings.updateTitle();

    },

    // Add History
    addHistory: function(id, cid, path, domain) {

        // Validator
        if (
            browserSettings.tabs[id] &&
            Array.isArray(browserSettings.tabs[id].history) &&
            (
                browserSettings.tabs[id].history[browserSettings.tabs[id].history.length - 1].cid !== cid ||
                browserSettings.tabs[id].history[browserSettings.tabs[id].history.length - 1].path !== path ||
                browserSettings.tabs[id].history[browserSettings.tabs[id].history.length - 1].domain !== domain
            )
        ) {

            // Add First History
            browserSettings.tabs[id].history.push({
                cid32: CIDTool.base32(cid),
                cid: cid,
                path: path,
                domain: domain
            });

            browserSettings.tabs[id].activeHistory = browserSettings.tabs[id].history.length - 1;

            // Add Browser History
            chrome.runtime.sendMessage({ type: 'addHistory', data: { domain: domain, path: path } });
            browserSettings.updateHistory();

        }

    },

    // Create Tab
    createTab: function(domain, cid, path, active = false) {

        // Update Settings
        browserSettings.lastTab++;
        const id = browserSettings.lastTab;
        if (active) { browserSettings.active = id; }
        browserSettings.tabs[id] = {

            history: [{
                cid32: CIDTool.base32(cid),
                cid: cid,
                path: path,
                domain: domain
            }],

            domain: domain,
            cid: cid,
            cid32: CIDTool.base32(cid),
            path: path,

            iframe: $('<iframe>', {
                class: 'browser-window',
                frameBorder: 0,
                style: 'padding-bottom: ' + browserSettings.addressBar.size + 'px;'
            })

        };

        // Change Page
        browserSettings.tabs[id].iframe.data('tab', id);
        browserSettings.tabs[id].iframe.on('load', browserSettings.pageLoaded);
        //browserSettings.tabs[id].iframe.bind('keypress keydown keyup', cancelRefresh);
        browserSettings.tabs[id].iframe.attr('src', chrome.runtime.getURL('validator.html') + '?secret=' + browserSettings.windowSecret + '&id=' + id);
        browserSettings.updateHistory();

        // Complete
        return browserSettings.tabs[id].iframe;

    },

    // Redirect Tab
    redirectTab: function(domain, cid, path, id, callback, callbackNow = false) {
        if (browserSettings.tabs[id]) {

            // Update Data
            browserSettings.tabs[id].path = path;
            browserSettings.tabs[id].cid32 = CIDTool.base32(cid);
            browserSettings.tabs[id].cid = cid;
            browserSettings.tabs[id].domain = domain;
            browserSettings.addHistory(id, cid, path, domain);

            // Add Function
            if (typeof callback === 'function') {
                if (callbackNow) { callback(); } else {
                    browserSettings.tabCallback.add(callback, id);
                }
            }

            // Run Iframe
            browserSettings.tabs[id].iframe.attr('src', browserSettings.urlGenerator(cid) + path);
            browserSettings.updateHistory();

        }
    }

};

// Dark Mode Enable
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    browserSettings.theme = 'dark';
}

// Start Domain
browserSettings.startDomain = function(domain) {
    return new Promise(function(resolve, reject) {

        // Domain Validator
        if (typeof domain === "string") {
            domain = browserSettings.fixDomain(domain);
            if (typeof domain === "string" && domain.length > 0 && domain !== null && domain !== 'null') {
                browserSettings.readDomainData(domain, 'ipfsHash').then(resolve).catch(reject);
            } else {

                // Complete
                reject(new Error('Invalid Domain'));
                return;

            }
        } else {

            // Complete
            reject(new Error('Invalid Domain Value'));
            return;

        }

    });
};

// Start Browser
var startBrowser = function(fn) {

    // Insert Browser Window
    browserSettings.startDomain(params.domain).then(cid => {

        const id = params.domain + '__privacy';
        chrome.storage.local.get([id], async function(storage) {

            for (const item in settingsList) {
                if (storage[id] && storage[id][settingsList[item].value] && storage[id][settingsList[item].value].setting) {
                    await chrome.contentSettings[settingsList[item].value].set({
                        primaryPattern: browserSettings.urlGenerator(cid) + '*',
                        setting: storage[id][settingsList[item].value].setting
                    });
                }
            }

            // Add Browser History
            chrome.runtime.sendMessage({ type: 'addHistory', data: { domain: params.domain, path: params.path } });

            $('#browser').append(
                browserSettings.createTab(params.domain, cid, params.path, true)
            );

            // Complete
            browserSettings.updateHistory();
            fn();
            return;

        });

    }).catch(err => {
        console.error(err);
        alert(err.message);
    });

};

// Cancel Refresh
const cancelRefresh = function(e) {
    browserSettings.updateHistory();
    //reloadNFTPage();
};

// Reload App
/* $(document).bind('keypress keydown keyup', cancelRefresh);
$(window).bind('keypress keydown keyup', cancelRefresh);
$('*').bind('keypress keydown keyup', cancelRefresh); */
$(window).bind('beforeunload', function() { return false; });