var extraCrypto = {

    // Unstoppable Domains
    unstoppabledomains: {

        generator: function(record) {
            return function(domain) {
                return new Promise(function(resolve, reject) {
                    resolution.records(domain, [record]).then((value) => { resolve(value[record]); }).catch(reject);
                });
            }
        },

    }

};

// USDT
extraCrypto.unstoppabledomains.USDT = {
    ERC20: extraCrypto.unstoppabledomains.generator('crypto.USDT.version.ERC20.address'),
    TRON: extraCrypto.unstoppabledomains.generator('crypto.USDT.version.TRON.address'),
    EOS: extraCrypto.unstoppabledomains.generator('crypto.USDT.version.EOS.address'),
    OMNI: extraCrypto.unstoppabledomains.generator('crypto.USDT.version.OMNI.address'),
};

// MATIC
extraCrypto.unstoppabledomains.MATIC = {
    MATIC: extraCrypto.unstoppabledomains.generator('crypto.MATIC.version.MATIC.address'),
    BEP20: extraCrypto.unstoppabledomains.generator('crypto.MATIC.version.BEP20.address'),
    ERC20: extraCrypto.unstoppabledomains.generator('crypto.MATIC.version.ERC20.address'),
};

// BUSD
extraCrypto.unstoppabledomains.BUSD = {
    ERC20: extraCrypto.unstoppabledomains.generator('crypto.BUSD.version.ERC20.address'),
    BEP20: extraCrypto.unstoppabledomains.generator('crypto.BUSD.version.BEP20.address'),
    HRC20: extraCrypto.unstoppabledomains.generator('crypto.BUSD.version.HRC20.address'),
};

// SHIB
extraCrypto.unstoppabledomains.SHIB = {
    ERC20: extraCrypto.unstoppabledomains.generator('crypto.SHIB.version.ERC20.address'),
    MATIC: extraCrypto.unstoppabledomains.generator('crypto.SHIB.version.MATIC.address'),
    FANTOM: extraCrypto.unstoppabledomains.generator('crypto.SHIB.version.FANTOM.address'),
};

// CAKE
extraCrypto.unstoppabledomains.CAKE = {
    ERC20: extraCrypto.unstoppabledomains.generator('crypto.CAKE.version.ERC20.address'),
    HRC20: extraCrypto.unstoppabledomains.generator('crypto.CAKE.version.HRC20.address'),
};