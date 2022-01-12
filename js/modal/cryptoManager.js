var domains = {};
var cryptoManager = {

    // Check Cryptos
    checkCrypto: function(cid) {

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

                        console.error(err);

                        $('#errorPlace ol').append(
                            $('<li>').text(err.message).prepend($('<i>', { class: 'fas fa-exclamation-triangle mr-2' }))
                        );

                        $('#errorPlace').removeClass('d-none');

                        cryptoManager.checkCrypto(null);

                    });
                }

            }),

            // Error Place
            $('<div>', { class: 'alert alert-danger text-break my-4 d-none', id: 'errorPlace' }).append($('<ol>', { class: 'm-0' })).css('white-space', 'pre-wrap')

        );

    }

};