browserSettings.webinfo = {};
browserSettings.webinfo.open = function() {

    // Title
    $('#webicon .modal-title').addClass('text-success').text('IPFS Proxy Connection');

    // Body
    $('#webicon .modal-body').empty().append(

        // Info
        $('<p>', { class: 'm-0' }).text('This NFT domain is linked to an IPFS protocol. This extension is using a proxy connection to connect to the IPFS server for this website.'),

        $('<hr>', { class: 'my-4' }),

        // Address
        $('<p>').append(

            $('<strong>', { class: 'mr-1' }).text('Proxy URL:'),
            $('<span>').text(browserSettings.proxy)

        )

    );

    // Open Modal
    $('#webicon').modal();

};