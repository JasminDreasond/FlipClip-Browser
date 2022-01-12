var domains = {};
var cryptoManager = function() {

    // Prepare Base
    document.title = chrome.i18n.getMessage('cryptoManagerTitle');
    $('.modal-title').text(chrome.i18n.getMessage('typeACrypto'));
    $('.modal-body').append(
        $('<input>', { type: 'text', class: 'form-control text-center' })

        // Detect Domain
        .change(function() {

            // Domain DNS Selected
            let dns = null;
            const domain = $(this).val();
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

            // Exist
            if (dns) {

                readDomainData(domain, 'ipfsHash').then((cid) => {
                    console.log(cid);
                });

            }

        })
    );

};