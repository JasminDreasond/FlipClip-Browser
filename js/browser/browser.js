var browserSettings = { addressBarSize: 56 };
var startBrowser = function(fn) {

    resolution.ipfsHash(params.domain).then((value) => {
        const cid = CIDTool.base32(value);
        resolution.addr(params.domain, 'BTC').then((value) => {
            $('#browser').append(
                $('<iframe>', {
                    src: 'https://' + cid + '.ipfs.dweb.link/',
                    id: 'browser-window'
                }).css({
                    frameBorder: 0,
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