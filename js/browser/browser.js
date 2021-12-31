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

    // Address Bar
    addressBarSize: 56,

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
    tabs: {

    },

    // Create Tab
    createTab: function(cid, path, active = false) {

        // Update Settings
        browserSettings.lastTab++;
        browserSettings.tabs[browserSettings.lastTab] = {
            cid: cid,
            path: path,
            active: active,
            iframe: $('<iframe>', {
                tab: browserSettings.lastTab,
                class: 'browser-window',
                frameBorder: 0,
                style: 'padding-bottom: ' + browserSettings.addressBarSize + 'px;'
            })
        };

        // Change Page
        browserSettings.tabs[browserSettings.lastTab].attr('src', chrome.runtime.getURL('validator.html') + '?secret=' + browserSettings.windowSecret + '&id=' + browserSettings.lastTab);

        // Complete
        return browserSettings.tabs[browserSettings.lastTab];

    },

    // Update Tab
    updateTab: function(tabLocation) {

        const url = tabLocation.split('/');
        const proxy = browserSettings.proxy.split('/');
        console.log(url, proxy);

    },

    // Redirect Tab
    redirectTab: function(cid, path) {

    }

};

// Start Browser
var startBrowser = function(fn) {

    // Domain Validator
    params.domain = browserSettings.fixDomain(params.domain);
    if (typeof params.domain === "string" && params.domain.length > 0 && params.domain !== null && params.domain !== 'null') {
        resolution.ipfsHash(params.domain).then((cid) => {

            // Insert Browser Window
            $('#browser').append(
                browserSettings.createTab(cid, params.path, true)
            );

            // Complete
            fn();
            return;

        });
    }
};