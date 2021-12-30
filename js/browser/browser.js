// Browser Scripts
var browserSettings = {

    // Address Bar
    addressBarSize: 56,

    // Proxy
    proxy: 'https://{cid32}.ipfs.dweb.link/',
    urlGenerator: function(value) { return browserSettings.proxy.replace('{cid}', value).replace('{cid32}', CIDTool.base32(value)); }

};

var startBrowser = function(fn) {

    resolution.ipfsHash(params.domain).then((cid) => {
        resolution.addr(params.domain, 'BTC').then((value) => {
            $('#browser').append(
                $('<iframe>', {
                    src: browserSettings.urlGenerator(cid),
                    id: 'browser-window',
                    frameBorder: 0
                }).css({
                    'min-height': '100%',
                    'min-width': '100%',
                    height: '100%',
                    width: '100%',
                    position: 'fixed',
                    'padding-bottom': browserSettings.addressBarSize
                })
            );
            console.log(value);
            fn();
            return;
        });
        return;
    });
};