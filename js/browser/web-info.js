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
            buttonsWallet = [
                $('<hr>', { class: 'my-4' }),

                // Wallet
                $('<h5>', { class: 'm-0 mb-4' }).text(chrome.i18n.getMessage('wallet')).prepend($('<i>', { class: 'fab fa-bitcoin mr-2' }))
            ];

            // Get Wallet Buttons
            for (const item in browserSettings.webinfo.dns[browserSettings.tabs[id].dns].wallet) {

                buttonsWallet.push(
                    $('<p>').append(

                        $('<strong>', { class: 'mr-1' }).text(browserSettings.webinfo.dns[browserSettings.tabs[id].dns].wallet[item].name + ':'),
                        $('<span>').append(
                            $('<button>', { class: 'btn btn-primary browser-button', id: 'wallet_' + browserSettings.webinfo.dns[browserSettings.tabs[id].dns].wallet[item].symbol }).append(
                                $('<i>', { class: 'fas fa-eye' })
                            ).data('WALLET_SYMBOL', browserSettings.webinfo.dns[browserSettings.tabs[id].dns].wallet[item].symbol).click(function() {

                                const symbol = $(this).data('WALLET_SYMBOL');
                                $('#wallet_' + symbol).prop('disabled', true)
                                browserSettings.readDomainData(browserSettings.tabs[id].domain, 'addr', symbol).then((data) => {

                                    $('#wallet_' + symbol).replaceWith(
                                        $('<span>').text(data.data)
                                    );

                                }).catch(err => {
                                    alert(err.message);
                                    console.error(err);
                                    $('#wallet_' + symbol).removeClass('btn-primary').addClass('btn-danger');
                                });

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