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

    // Theme
    theme: 'dark',

    // Address Bar
    addressBar: {
        size: 67,
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

    windowSecret: generateHexString(200),

    // Tab Number
    lastTab: -1,

    // Tabs
    tabs: {},
    framesId: {},

    // Create Tab
    createTab: function(domain, cid, path, active = false) {

        // Update Settings
        browserSettings.lastTab++;
        if (active) { browserSettings.active = browserSettings.lastTab; }
        browserSettings.tabs[browserSettings.lastTab] = {
            domain: domain,
            cid: cid,
            path: path,
            iframe: $('<iframe>', {
                tab: browserSettings.lastTab,
                class: 'browser-window',
                frameBorder: 0,
                style: 'padding-bottom: ' + browserSettings.addressBar.size + 'px;'
            })
        };

        // Change Page
        browserSettings.tabs[browserSettings.lastTab].iframe.attr('src', chrome.runtime.getURL('validator.html') + '?secret=' + browserSettings.windowSecret + '&id=' + browserSettings.lastTab);

        // Complete
        return browserSettings.tabs[browserSettings.lastTab].iframe;

    },

    // Redirect Tab
    redirectTab: function(domain, cid, path, id) {

    }

};

// Start Browser
var startBrowser = function(fn) {

    // Domain Validator
    params.domain = browserSettings.fixDomain(params.domain);
    if (typeof params.domain === "string" && params.domain.length > 0 && params.domain !== null && params.domain !== 'null') {
        browserSettings.readDomainData(params.domain, 'ipfsHash').then((cid) => {

            // Insert Browser Window
            $('#browser').append(
                browserSettings.createTab(params.domain, cid, params.path, true)
            );

            // Complete
            fn();
            return;

        });
    } else {

        // Complete
        fn();
        return;

    }

};