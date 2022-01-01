browserSettings.updateAddressBar = function() {

    console.log(browserSettings);

};

var startAddressBar = function(fn) {

    $('#browser').append(
        $('<div>', { id: 'address-bar' }).append(
            $('<nav>', { class: 'navbar navbar-expand-lg navbar-' + browserSettings.theme + ' bg-' + browserSettings.theme, id: 'tabs' }).css('height', browserSettings.addressBar.size / 2 - 3).append(
                $('<ul>', { class: 'navbar-nav mr-auto' }).append(
                    $('<li>', { class: 'nav-item' }).append(
                        $('<a>', { class: 'nav-link', href: '#' }).text('Test')
                    )
                )
            ),
            $('<nav>', { class: 'navbar navbar-expand-lg navbar-' + browserSettings.theme + ' bg-' + browserSettings.theme, id: 'menu' }).css('height', browserSettings.addressBar.size / 2 + 3).append(
                $('<ul>', { class: 'navbar-nav mr-auto' }).append(

                    $('<li>', { class: 'nav-item' }).append(
                        $('<a>', { class: 'nav-link mx-1', href: '#' }).append(
                            $('<i>', { class: 'fas fa-caret-left' }).css('font-size', browserSettings.addressBar.buttonSize)
                        )
                    ),

                    $('<li>', { class: 'nav-item' }).append(
                        $('<a>', { class: 'nav-link mx-1', href: '#' }).append(
                            $('<i>', { class: 'fas fa-caret-right' }).css('font-size', browserSettings.addressBar.buttonSize)
                        )
                    )

                )
            )
        )
    );

    // Complete
    fn();

};

/* 
    resolution.addr(params.domain, 'BTC').then((value) => {});
*/