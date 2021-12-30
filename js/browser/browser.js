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
    urlGenerator: function(value) { return browserSettings.proxy.replace('{cid}', value).replace('{cid32}', CIDTool.base32(value)); },

    // Tab Number
    lastTab: -1,

    // Tabs
    tabs: {

    },

    // Create Tab
    createTab: function(cid) {
        browserSettings.lastTab++;
        return $('<iframe>', {
            src: browserSettings.urlGenerator(cid),
            tab: browserSettings.lastTab,
            class: 'browser-window',
            frameBorder: 0
        }).css({
            'padding-bottom': browserSettings.addressBarSize
        });
    },

    // Redirect Tab
    redirectTab: function() {

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
                    browserSettings.createTab(cid)
                );
                console.log(value);
                fn();
                return;
            });
            return;
        });
    }
};