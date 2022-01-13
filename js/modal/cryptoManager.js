var domains = {};
var cryptoManager = {

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
        console.log(dns);

        // Exist Domain Name
        if (typeof domain === 'string' && domain.length > 0) {

            // Exist CID
            if (typeof cid === 'string' && cid.length > 0) {

                // Add CID Data
                $('#domain_data').append(

                    // CID
                    $('<div>', { id: 'cid', class: 'my-3' }).append(
                        $('<strong>').text('CID: '),
                        $('<span>').text(cid)
                    ),

                    // CID32
                    $('<div>', { id: 'cid', class: 'my-3' }).append(
                        $('<strong>').text('CID32: '),
                        $('<span>').text(CIDTool.base32(cid))
                    )

                );

            }

        }

    },

    // Start App
    start: function() {

        // Prepare Base
        document.title = chrome.i18n.getMessage('cryptoManagerTitle');
        $('.modal-title').text(chrome.i18n.getMessage('typeACrypto'));
        $('.modal-body').append(

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
                if (typeof domain === 'string' && domain.length > 0) {
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
                }

            }),

            // Error Place
            $('<div>', { class: 'alert alert-danger text-break my-4 d-none', id: 'errorPlace' }).append($('<ol>', { class: 'm-0' })).css('white-space', 'pre-wrap'),

            // Data
            $('<div>', { id: 'domain_data' })

        );

    }

};