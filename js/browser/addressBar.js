browserSettings.updateAddressBar = function() {

    console.log(browserSettings);

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
                )
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
                $('<div>', { class: 'input-group mr-2 ml-2' }).css('height', browserSettings.addressBar.barFix).append(
                    $('<div>', { class: 'input-group-prepend h-100' }).append(
                        $('<span>', { class: 'input-group-text h-100 bg-' + bgAdress, id: 'page-status' })
                        .css('font-size', 'small').text(':3')
                    ),
                    $('<input>', { class: 'form-control shadow-none h-100', type: 'text', id: 'addressbar' })
                )
            )

        )
    );

    // Set Browser Items
    $('#browser').append(
        $('<div>', { id: 'address-bar' }).append(
            browserSettings.addressBar.nav.tabs,
            browserSettings.addressBar.nav.items
        )
    );

    // Complete
    fn();

};