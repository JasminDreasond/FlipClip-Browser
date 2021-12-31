var startAddressBar = function(fn) {

    $('#browser').append(
        $('<nav>', { class: 'navbar navbar-expand-lg navbar-light bg-light' }).css('height', browserSettings.addressBarSize).append(
            $('<ul>', { class: 'navbar-nav mr-auto' }).append(
                $('<li>', { class: 'nav-item active' }).append(
                    $('<a>', { class: 'nav-link', href: '#' }).text('Test')
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