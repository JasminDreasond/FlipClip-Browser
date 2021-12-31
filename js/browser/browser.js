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

    // Tab Number
    lastTab: -1,

    // Tabs
    tabs: {

    },

    // Create Tab
    createTab: function(cid, path, active = false) {

        browserSettings.lastTab++;
        browserSettings.tabs[browserSettings.lastTab] = {
            cid: cid,
            path: path,
            active: active
        };

        return $('<iframe>', {
            src: browserSettings.urlGenerator(cid) + path,
            tab: browserSettings.lastTab,
            class: 'browser-window',
            frameBorder: 0
        }).css({
            'padding-bottom': browserSettings.addressBarSize
        });

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
            resolution.addr(params.domain, 'BTC').then((value) => {
                $('#browser').append(
                    browserSettings.createTab(cid, params.path)
                );
                console.log(value);
                fn();
                return;
            });
            return;
        });
    }
};