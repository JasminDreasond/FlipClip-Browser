var extraCrypto = {

    // Unstoppable Domains
    unstoppabledomains: {

        generator: function(record) {
            return function(domain) {
                return new Promise(function(resolve, reject) {
                    resolution.records(domain, record).then((value) => {
                        if (record.length < 2) {
                            resolve(value[record[0]]);
                        } else {
                            resolve(value);
                        }
                    }).catch(reject);
                });
            }
        },

        data: {
            USDT: ['ERC20', 'TRON', 'EOS', 'OMNI'],
            MATIC: ['MATIC', 'BEP20', 'ERC20'],
            BUSD: ['ERC20', 'BEP20', 'HRC20'],
            SHIB: ['ERC20', 'MATIC', 'FANTOM'],
            CAKE: ['ERC20', 'HRC20']
        },

    }

};

// Read Crypto
for (const dns in extraCrypto) {

    // Read Data
    for (const data in extraCrypto[dns].data) {

        // Read Versions
        const versions = [];
        for (const item in extraCrypto[dns].data[data]) {

            // Create Versions
            if (!extraCrypto[dns][data]) { extraCrypto[dns][data] = {}; }
            const record = 'crypto.' + data + '.version.' + extraCrypto[dns].data[data][item] + '.address';

            versions.push(record);
            extraCrypto[dns][data][extraCrypto[dns].data[data][item]] = extraCrypto.unstoppabledomains.generator([record]);

        }

        // Add Full Versions
        extraCrypto[dns][data].ALL = extraCrypto.unstoppabledomains.generator(versions);

    }

    // Delete Data
    delete extraCrypto[dns].data;
    delete extraCrypto[dns].generator;

}