// Base
browserSettings.webinfo = {};

// Domain Info Data
browserSettings.webinfo.dns = {
    unstoppabledomains: {
        page: 'https://unstoppabledomains.com/d/{domain}'
    }
};

// Open
browserSettings.webinfo.open = function() {

    // ID
    const id = browserSettings.active;

    let domainPage = '';
    if (
        browserSettings.webinfo.dns[browserSettings.tabs[id].dns] &&
        browserSettings.webinfo.dns[browserSettings.tabs[id].dns].page
    ) {
        domainPage = browserSettings.webinfo.dns[browserSettings.tabs[id].dns].page.replace(/\{domain\}/g, browserSettings.tabs[id].domain).replace(/\{domainURI\}/g, encodeURIComponent(browserSettings.tabs[id].domain));
    }

    // Title
    $('#webicon .modal-title').addClass('text-success').text('IPFS Proxy Connection');

    // Body
    $('#webicon .modal-body').empty().append(

        // Info
        $('<p>', { class: 'm-0' }).text('This NFT domain is linked to an IPFS protocol. This extension is using a proxy connection to connect to the IPFS server for this website.'),

        $('<hr>', { class: 'my-4' }),

        // Proxy
        $('<p>').append(

            $('<strong>', { class: 'mr-1' }).text('Proxy URL:'),
            $('<a>', { href: browserSettings.proxyHomepage, target: '_blank' }).text(browserSettings.proxy)

        ),

        // Domain
        $('<p>').append(

            $('<strong>', { class: 'mr-1' }).text('Domain:'),
            $('<a>', { href: domainPage, target: '_blank' }).text(browserSettings.tabs[id].domain)

        ),

        // CID
        $('<p>').append(

            $('<strong>', { class: 'mr-1' }).text('CID:'),
            $('<span>').text(browserSettings.tabs[id].cid)

        ),

        // CID32
        $('<p>').append(

            $('<strong>', { class: 'mr-1' }).text('CID32:'),
            $('<span>').text(browserSettings.tabs[id].cid32)

        )

    );

    // Open Modal
    $('#webicon').modal();

};