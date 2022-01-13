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
    checkCrypto: function(cid) {

        // Clear Data
        $('#domain_data').empty();

        // Exist CID
        if (cid) {

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

                // Search Domain
                if (typeof domain === 'string' && domain.length > 0) {
                    readDomainData(domain, 'ipfsHash')

                    // Success
                    .then((cid) => {
                        if (cid && typeof cid.data === 'string' && cid.data.length > 0) {
                            cryptoManager.checkCrypto(cid.data);
                        } else {
                            cryptoManager.checkCrypto(null);
                        }
                    })

                    // Error
                    .catch(err => {
                        cryptoManager.error(err);
                        cryptoManager.checkCrypto(null);
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