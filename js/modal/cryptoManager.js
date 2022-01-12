var domains = {};
var cryptoManager = function() {

    // Prepare Base
    document.title = chrome.i18n.getMessage('cryptoManagerTitle');
    $('.modal-title').text(chrome.i18n.getMessage('typeACrypto'));
    $('.modal-body').append(

        // Input
        $('<input>', { type: 'text', class: 'form-control text-center' })

        // Detect Domain
        .change(function() {

            // Prepare Update
            $('#errorPlace').addClass('d-none').empty();
            const domain = $(this).val();

            // Search Domain
            if (typeof domain === 'string' && domain.length > 0) {
                readDomainData(domain, 'ipfsHash')

                // Success
                .then((cid) => {
                    console.log(cid);
                })

                // Error
                .catch(err => {
                    console.error(err);
                    $('#errorPlace').text(err.message).prepend($('<i>', { class: 'fas fa-exclamation-triangle mr-2' })).removeClass('d-none');
                });
            }

        }),

        // Error Place
        $('<div>', { class: 'alert alert-danger text-break my-4 d-none', id: 'errorPlace' }).css('white-space', 'pre-wrap')

    );

};