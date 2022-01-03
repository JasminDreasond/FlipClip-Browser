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

        $('<hr>', { class: 'my-4' }),

        // Wallet
        $('<h5>', { class: 'm-0' }).text(chrome.i18n.getMessage('wallet')).prepend($('<i>', { class: 'fab fa-bitcoin mr-2' })),

    );

    // Open Modal
    $('#webicon').modal();

};