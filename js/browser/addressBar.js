browserSettings.updateAddressBar = function() {

    // URL
    const url = 'https://' + browserSettings.tabs[browserSettings.active].domain + '/' + browserSettings.tabs[browserSettings.active].path;

    // Update Address Bar
    browserSettings.addressBar.bar.text.view.find('#text').empty().append(
        'ipfs://', $('<span>', { class: 'domain-name-' + browserSettings.theme }).text(browserSettings.tabs[browserSettings.active].domain), '/' + browserSettings.tabs[browserSettings.active].path
    );

    browserSettings.addressBar.bar.text.input.val(url);

};

browserSettings.updateTab = function(newURL, tabID) {

    // Params
    const url = new URL(newURL);

    browserSettings.readDomainData(url.host, 'ipfsHash').then((cid) => {

        // Complete
        browserSettings.redirectTab(
            url.host,
            cid,
            url.pathname.substring(1) + url.search,
            tabID,
            browserSettings.updateAddressBar
        );

        return;

    });

};

// Address Bar Resize
$(window).on('resize scroll focus mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup keyup keypress keydown hover blur click change', function() {
    if (browserSettings && browserSettings.addressBar && browserSettings.addressBar.bar && browserSettings.addressBar.bar.base) {
        browserSettings.addressBar.bar.base.css('width', $(document).width() - browserSettings.addressBar.iconsSpace - 100)
    }
});

// Reload Window
var reloadNFTPage = function() {
    if (browserSettings.tabs[browserSettings.active] && browserSettings.tabs[browserSettings.active].iframe && !browserSettings.tabs[browserSettings.active].iframe.data('refreshData')) {

        browserSettings.tabs[browserSettings.active].iframe.data('refreshData',
            browserSettings.urlGenerator(
                browserSettings.tabs[browserSettings.active].cid
            ) + browserSettings.tabs[browserSettings.active].path
        );

        browserSettings.tabs[browserSettings.active].iframe.attr('src', '');

    }
};

var startAddressBar = function(fn) {

    // Prepare Nav
    browserSettings.addressBar.nav = {};

    // Tabs
    browserSettings.addressBar.tabs = $('<ul>', { class: 'navbar-nav mr-auto' });

    browserSettings.addressBar.nav.tabs = $('<nav>', { class: 'navbar navbar-expand navbar-tab-' + browserSettings.theme + ' navbar-' + browserSettings.theme + ' bg-' + browserSettings.theme, id: 'tabs' }).css('height', browserSettings.addressBar.size / 2 - 3).append(
        browserSettings.addressBar.tabs
    );

    // BG Address
    let bgAdress = '';
    if (browserSettings.theme === 'light') {
        bgAdress = 'white';
    } else if (browserSettings.theme === 'dark') {
        bgAdress = 'dark';
    }

    // Bar
    browserSettings.addressBar.bar = {};
    browserSettings.addressBar.bar.icon = $('<div>', { class: 'input-group-prepend h-100' }).css({
        'border-right': 0
    }).append(
        $('<span>', { class: 'input-group-text h-100 bg-' + bgAdress + ' border-' + browserSettings.theme, id: 'page-status' })
        .css('font-size', 'small').append(
            $('<i>', { class: 'fas fa-lock' })
        )
    );

    browserSettings.addressBar.bar.text = {};

    browserSettings.addressBar.bar.text.view = $('<div>', {
        class: 'form-control h-100 addressbar text-truncate border-' + browserSettings.theme
    }).css({
        'border-left': 0,
        cursor: 'text',
        left: -11
    }).append($('<span>', { id: 'text' }).css({
        'font-size': browserSettings.addressBar.fontSize + 'pt',
        position: 'absolute',
        top: 3,
        left: 12
    })).click(function() {
        browserSettings.updateAddressBar();
        browserSettings.addressBar.bar.text.view.addClass('d-none');
        browserSettings.addressBar.bar.text.input.removeClass('d-none').focus().select();
    });

    browserSettings.addressBar.bar.text.input = $('<input>', {
        class: 'form-control shadow-none h-100 d-none addressbar border-' + browserSettings.theme,
        type: 'text',
        id: 'addressbar',
        autocomplete: 'off'
    }).css({
        left: -10,
        'font-size': browserSettings.addressBar.fontSize + 'pt',
        'border-left': 0
    });

    const inputAdressBarEnd = function() {
        browserSettings.addressBar.bar.text.view.removeClass('d-none');
        browserSettings.addressBar.bar.text.input.addClass('d-none');
    };

    browserSettings.addressBar.bar.text.input.blur(inputAdressBarEnd).keyup(function(e) {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            browserSettings.updateAddressBar();
            browserSettings.addressBar.bar.text.input.blur();
        }
    });

    browserSettings.addressBar.bar.base = $('<div>', { class: 'input-group mr-2 ml-2 addressbar-' + browserSettings.theme }).css('height', browserSettings.addressBar.barFix).append(
        browserSettings.addressBar.bar.icon,
        browserSettings.addressBar.bar.text.view,
        browserSettings.addressBar.bar.text.input
    );

    // Items
    browserSettings.addressBar.nav.items = $('<nav>', { class: 'navbar navbar-expand navbar-' + browserSettings.theme + ' bg-' + browserSettings.theme, id: 'menu' }).css('height', browserSettings.addressBar.size / 2 + 3).append(
        $('<ul>', { class: 'navbar-nav mr-auto' }).append(

            // Previous
            $('<li>', { class: 'nav-item' }).append(
                $('<a>', { class: 'nav-link mx-1 browser-button', draggable: false }).append(
                    $('<i>', { class: 'fas fa-caret-left' }).css({
                        'font-size': browserSettings.addressBar.buttonSize,
                        'margin': browserSettings.addressBar.marginButtonFix,
                        'margin-right': 1
                    })
                )
            ),

            // Next
            $('<li>', { class: 'nav-item' }).append(
                $('<a>', { class: 'nav-link mx-1 browser-button', draggable: false }).append(
                    $('<i>', { class: 'fas fa-caret-right' }).css({
                        'font-size': browserSettings.addressBar.buttonSize,
                        'margin': browserSettings.addressBar.marginButtonFix,
                        'margin-left': 1
                    })
                )
            ),

            // Refresh
            $('<li>', { class: 'nav-item' }).append(
                $('<a>', { class: 'nav-link mx-1 browser-button', draggable: false }).append(
                    $('<i>', { class: 'fas fa-redo-alt' })
                ).click(reloadNFTPage)
            ),

            // Home
            $('<li>', { class: 'nav-item' }).append(
                $('<a>', { class: 'nav-link mx-1 browser-button', draggable: false }).append(
                    $('<i>', { class: 'fas fa-home' })
                )
            ),

            // Bookmark
            $('<li>', { class: 'nav-item' }).append(
                $('<a>', { class: 'nav-link mx-1 browser-button', draggable: false }).append(
                    $('<i>', { class: 'fas fa-bookmark' })
                )
            ),

            // Address Bar
            $('<form>', { class: 'd-inline m-0 w-100' }).append(
                browserSettings.addressBar.bar.base
            )

            // Submit New Web Page
            .submit(function() {

                // Prepare URL
                let url = $('#addressbar').val();
                if (typeof url === 'string' && url.length > 0) {
                    if (!url.startsWith('https://') && !url.startsWith('https://')) { url = 'https://' + url; }
                    browserSettings.updateTab(browserSettings.fixDomain(url), browserSettings.active, true);
                    browserSettings.addressBar.bar.text.input.blur();
                }

                return false;

            })

        )
    );

    // Set Browser Items
    $(window).trigger('resize');
    $('#browser').append(
        $('<div>', { id: 'address-bar' }).append(
            browserSettings.addressBar.nav.tabs,
            browserSettings.addressBar.nav.items
        )
    );

    // Complete
    fn();

};