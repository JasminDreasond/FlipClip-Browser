var startBrowser = function(fn) {

    resolution.ipfsHash(params.domain).then((value) => {
        console.log(CIDTool.base32(value));
        resolution.addr(params.domain, 'BTC').then((value) => {
            console.log(value);
            fn();
            return;
        });
        return;
    });
};