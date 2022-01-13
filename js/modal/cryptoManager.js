var domains = {};
var cryptoManager = {

    // Settings
    settings: { active: false, button: null },

    // Insert Error
    error: function(err, icon = 'fas fa-exclamation-triangle') {

        // Log
        console.error(err);

        // Insert Error Message
        $('#errorPlace ol').append(
            $('<li>').text(err.message).prepend($('<i>', { class: icon + ' mr-2' }))
        );

        // Show Error
        $('#errorPlace').removeClass('d-none');

    },

    // Check Cryptos
    checkCrypto: function(cid, domain, dns) {

        // Clear Data
        $('#domain_data').empty();

        // Exist Domain Name
        if (typeof domain === 'string' && domain.length > 0) {

            // Exist CID
            if (typeof cid === 'string' && cid.length > 0) {

                // Add CID Data
                $('#domain_data').append(

                    // CID
                    $('<div>', { id: 'cid', class: 'my-3' }).append(
                        $('<strong>', { class: 'mr-2' }).text('CID:'),
                        $('<span>').text(cid)
                    ),

                    // CID32
                    $('<div>', { id: 'cid', class: 'my-3' }).append(
                        $('<strong>', { class: 'mr-2' }).text('CID32:'),
                        $('<span>').text(CIDTool.base32(cid))
                    )

                );

            }

            // More Domain Info
            if (webinfo.dns[dns]) {

                // DNS URL
                const dnsURL = webinfo.dns[dns].page.replace('{domain}', domain).replace('{domainURI}', encodeURIComponent(domain));
                const domainURL = `https://${domain}/`;
                /*  https://dist.ipfs.io */

                // Add Web Data
                $('#domain_data').append(

                    // Domain
                    $('<div>', { id: 'domain', class: 'my-3' }).append(

                        $('<strong>', { class: 'mr-2' }).text('DNS:'),
                        $('<a>', { href: dnsURL, target: '_blank' }).text(dnsURL)

                    ),

                    // Domain
                    $('<div>', { id: 'domain', class: 'my-3' }).append(

                        $('<strong>', { class: 'mr-2' }).text(chrome.i18n.getMessage('domainURL')),
                        $('<a>', { href: domainURL, target: '_blank' }).text(domainURL)

                    )

                );


                // Get Wallet Buttons
                for (const item in webinfo.dns[dns].wallet) {
                    $('#domain_data').append(
                        $('<div>', { class: 'mt-3' }).append(

                            $('<strong>', { class: 'mr-1' }).text(webinfo.dns[dns].wallet[item].name + ':'),
                            $('<span>').append(
                                $('<button>', { class: 'btn btn-primary browser-button', id: 'wallet_' + webinfo.dns[dns].wallet[item].symbol }).append(
                                    $('<i>', { class: 'fas fa-eye' })
                                ).data('WALLET_SYMBOL', webinfo.dns[dns].wallet[item].symbol).click(function() {

                                    const symbol = $(this).data('WALLET_SYMBOL');
                                    $('#wallet_' + symbol).prop('disabled', true)
                                    readDomainData(domain, 'addr', symbol).then((data) => {

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

                        ));
                }

            }

        }

    },

    // Start App
    start: function() {

        // Prepare Base
        document.title = chrome.i18n.getMessage('cryptoManagerTitle');
        $('.modal-title').text(chrome.i18n.getMessage('typeACrypto'));
        $('.modal-body').append(

            // Crypto Manager Item
            $('<div>', { id: 'cryptoManager' }).append(

                // Input
                $('<input>', { type: 'text', class: 'form-control text-center' })

                // Detect Domain
                .change(function() {

                    // Prepare Update
                    $('#errorPlace ').addClass('d-none');
                    $('#errorPlace ol').empty();
                    const domain = $(this).val();

                    // Domain DNS Selected
                    let dns = null;
                    for (const where in domains) {
                        if (where !== 'filterGenerator') {
                            for (const item in domains[where]) {
                                if (domain.endsWith(domains[where][item])) {
                                    dns = where;
                                    break;
                                }
                            }
                        }
                    }

                    // Search Domain
                    if (typeof domain === 'string' && domain.length > 0 && typeof dns === 'string' && dns.length > 0) {
                        readDomainData(domain, 'ipfsHash')

                        // Success
                        .then((cid) => {
                            if (cid && typeof cid.data === 'string' && cid.data.length > 0) {
                                cryptoManager.checkCrypto(cid.data, domain, dns);
                            } else {
                                cryptoManager.checkCrypto(null, domain, dns);
                            }
                        })

                        // Error
                        .catch(err => {
                            cryptoManager.error(err);
                            cryptoManager.checkCrypto(null, domain, dns);
                        });
                    } else {
                        cryptoManager.error(new Error(chrome.i18n.getMessage('invalidDNSDomain')));
                    }

                }),

                // Error Place
                $('<div>', { class: 'alert alert-danger text-break my-4 d-none', id: 'errorPlace' }).append($('<ol>', { class: 'm-0' })).css('white-space', 'pre-wrap'),

                // Data
                $('<div>', { id: 'domain_data' })

            )

        );

        // Prepare Button
        cryptoManager.settings.button = $('<button>', { class: 'btn btn-info' });
        cryptoManager.settings.button.click(function() {

            // Enable
            if (!cryptoManager.settings.active) {

                // Read Storage
                chrome.storage.local.get(['proxyURL', 'proxyHomepage'], async function(storage) {
                    $('.modal-body').append(
                        $('<div>', { id: 'settings' }).append(

                            // Proxy URL
                            $('<div>', { class: 'form-group' }).append(

                                $('<label>', { for: 'proxyURL' }).text(chrome.i18n.getMessage('proxyURLTitle')),

                                $('<input>', {
                                    type: 'url',
                                    class: 'form-control',
                                    id: 'proxyURL',
                                    placeholder: tinyProxy.url,
                                    'aria-describedby': 'proxyURLHelp'
                                }).val(storage.proxyURL),

                                $('<small>', { id: 'proxyURLHelp' }).text(chrome.i18n.getMessage('proxyURLHelp'))

                            ),

                            // Proxy Homepage
                            $('<div>', { class: 'form-group' }).append(

                                $('<label>', { for: 'proxyHomepage' }).text(chrome.i18n.getMessage('proxyHomepageTitle')),

                                $('<input>', {
                                    type: 'url',
                                    class: 'form-control',
                                    id: 'proxyHomepage',
                                    placeholder: tinyProxy.homepage,
                                    'aria-describedby': 'proxyHomepageHelp'
                                }).val(storage.proxyHomepage),

                                $('<small>', { id: 'proxyHomepageHelp' }).text(chrome.i18n.getMessage('proxyHomepageHelp'))

                            )

                        )
                    );
                });

                // Final Action
                document.title = chrome.i18n.getMessage('settings');
                $('.modal-title').text(chrome.i18n.getMessage('settings'));
                $('#cryptoManager').addClass('d-none');
                $(this).removeClass('btn-info').addClass('btn-success');
                cryptoManager.settings.active = true;

            }

            // Disable
            else {
                $('#settings').remove();
                document.title = chrome.i18n.getMessage('cryptoManagerTitle');
                $('.modal-title').text(chrome.i18n.getMessage('typeACrypto'));
                $('#cryptoManager').removeClass('d-none');
                $(this).addClass('btn-info').removeClass('btn-success');
                cryptoManager.settings.active = false;
            }

        });

        // Settings Button
        $('.modal-footer').prepend(

            // Settings Button
            cryptoManager.settings.button.text(chrome.i18n.getMessage('settings'))

        );

    }

};