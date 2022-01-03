// Base
browserSettings.webinfo = {};

// Domain Info Data
browserSettings.webinfo.dns = {
    unstoppabledomains: {
        page: 'https://unstoppabledomains.com/d/{domain}',
        wallet: [{
                name: 'Bitcoin',
                symbol: 'BTC'
            }, {
                name: 'Ethereum',
                symbol: 'ETH'
            }, {
                name: 'Tether',
                symbol: 'USDT'
            },
            {
                name: 'Doge',
                symbol: 'DOGE'
            },
            {
                name: 'Shiba Inu',
                symbol: 'SHIB'
            }
        ]
    }
};

// Open
browserSettings.webinfo.open = function() {

    // ID
    const id = browserSettings.active;

    // Prepare Domain Info
    let domainPage = '';
    let buttonsWallet = [];
    if (browserSettings.webinfo.dns[browserSettings.tabs[id].dns]) {

        // Domain URL
        if (browserSettings.webinfo.dns[browserSettings.tabs[id].dns].page) {
            domainPage = browserSettings.webinfo.dns[browserSettings.tabs[id].dns].page.replace(/\{domain\}/g, browserSettings.tabs[id].domain).replace(/\{domainURI\}/g, encodeURIComponent(browserSettings.tabs[id].domain));
        }

        // Domain Wallets
        if (browserSettings.webinfo.dns[browserSettings.tabs[id].dns].wallet) {

            // Prepare Base
            buttonsWallet[
                $('<hr>', { class: 'my-4' }),

                // Wallet
                $('<h5>', { class: 'm-0' }).text(chrome.i18n.getMessage('wallet')).prepend($('<i>', { class: 'fab fa-bitcoin mr-2' }))
            ];

            for (const item in browserSettings.webinfo.dns[browserSettings.tabs[id].dns].wallet) {

                buttonsWallet.push(
                    $('<p>').append(

                        $('<strong>', { class: 'mr-1' }).text(browserSettings.webinfo.dns[browserSettings.tabs[id].dns].wallet[item].name + ':'),
                        $('<span>').append(
                            $('<button>', { class: 'btn btn-primary' }).data('WALLET_SYMBOL', browserSettings.webinfo.dns[browserSettings.tabs[id].dns].wallet[item].symbol).click(function() {

                                console.log($(this).data('WALLET_SYMBOL'));

                            })
                        )

                    ))

            }

        }

    }

    // Title
    $('#webicon .modal-title').addClass('text-success').empty().text(chrome.i18n.getMessage('ipfsConnectionTitle')).prepend($('<i>', { class: 'fas fa-lock mr-2' }));

    // Body
    $('#webicon .modal-body').empty().append(

        // Info
        $('<p>', { class: 'm-0' }).text(chrome.i18n.getMessage('ipfsConnectionInfo')),

        $('<hr>', { class: 'my-4' }),

        // Proxy
        $('<p>').append(

            $('<strong>', { class: 'mr-1' }).text(chrome.i18n.getMessage('proxyURL')),
            $('<a>', { href: browserSettings.proxyHomepage, target: '_blank' }).text(browserSettings.proxy)

        ),

        // Domain
        $('<p>').append(

            $('<strong>', { class: 'mr-1' }).text(chrome.i18n.getMessage('domainURL')),
            $('<a>', { href: domainPage, target: '_blank' }).text(browserSettings.tabs[id].domain)

        ),

        // CID
        $('<p>').append(

            $('<strong>', { class: 'mr-1' }).text(chrome.i18n.getMessage('cidURL')),
            $('<span>').text(browserSettings.tabs[id].cid)

        ),

        // CID32
        $('<p>').append(

            $('<strong>', { class: 'mr-1' }).text(chrome.i18n.getMessage('cid32URL')),
            $('<span>').text(browserSettings.tabs[id].cid32)

        ),

        // Wallet
        buttonsWallet,

    );

    // Open Modal
    $('#webicon').modal();

};