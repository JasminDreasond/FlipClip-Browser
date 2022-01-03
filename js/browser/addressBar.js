browserSettings.updateTitle = function() {

    /* if (
        typeof browserSettings.active === 'number' &&
        browserSettings.tabs[browserSettings.active] &&
        browserSettings.tabs[browserSettings.active].iframe &&
        browserSettings.tabs[browserSettings.active].iframe[0] &&
        browserSettings.tabs[browserSettings.active].iframe[0].contentWindow &&
        browserSettings.tabs[browserSettings.active].iframe[0].contentWindow.document
    ) {
        const title = browserSettings.tabs[browserSettings.active].iframe[0].contentWindow.document.title.trim();
        if (typeof title === 'string' && title.length > 0) { $(document).find("title").text(title); }
    } */

};

browserSettings.updateAddressBar = function() {

    // URL
    const url = 'https://' + browserSettings.tabs[browserSettings.active].domain + '/' + browserSettings.tabs[browserSettings.active].path;

    // Update Address Bar
    browserSettings.addressBar.bar.text.view.find('#text').empty().append(
        'ipfs://', $('<span>', { class: 'domain-name-' + browserSettings.theme }).text(browserSettings.tabs[browserSettings.active].domain), '/' + browserSettings.tabs[browserSettings.active].path
    );

    browserSettings.addressBar.bar.text.input.val(url);
    browserSettings.updateTitle();

};

browserSettings.updateTab = function(newURL, tabID) {

    // Params
    const url = new URL(newURL);

    // Read Domain Data
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

    }).catch(err => {
        alert(err.message);
        console.error(err);
    });

};

// Address Bar Resize
const resizeFunction = function() {
    if (browserSettings && browserSettings.addressBar && browserSettings.addressBar.bar && browserSettings.addressBar.bar.base) {
        browserSettings.addressBar.bar.base.css('width', $(document).width() - browserSettings.addressBar.iconsSpace - 100)
    }
};

$(window).on('scroll focus mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup keyup keypress keydown hover blur click change', resizeFunction);
$(window).resize(resizeFunction);

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

    // Dark Mode
    let darkMode;
    if (browserSettings.theme === 'dark') {
        darkMode = ' bg-dark text-white';
    }

    // Settings
    browserSettings.settings = {};
    browserSettings.settings.base = $('<div>', { class: 'modal fade', id: 'settings', tabindex: '-1', 'aria-hidden': 'true' }).append(
        $('<div>', { class: 'modal-dialog' }).append(
            $('<div>', { class: 'modal-content' + darkMode }).append(

                $('<div>', { class: 'modal-header' }).append(
                    $('<h5>', { class: 'modal-title browser-button noselect', draggable: false }).text(chrome.i18n.getMessage('websiteSettings')),
                    $('<button>', { type: 'button', class: 'close browser-button noselect', draggable: false, 'data-dismiss': 'modal' }).append(
                        $('<span>', { 'aria-hidden': 'true' }).text('×')
                    )
                ),

                $('<div>', { class: 'modal-body' }),

                $('<div>', { class: 'modal-footer' }).append(
                    $('<button>', { type: 'button', class: 'btn btn-secondary browser-button noselect', draggable: false, 'data-dismiss': 'modal' }).text(chrome.i18n.getMessage('close'))
                )

            )
        )
    );

    browserSettings.settings.webicon = $('<div>', { class: 'modal fade', id: 'webicon', tabindex: '-1', 'aria-hidden': 'true' }).append(
        $('<div>', { class: 'modal-dialog modal-lg' }).append(
            $('<div>', { class: 'modal-content' + darkMode }).append(

                $('<div>', { class: 'modal-header' }).append(
                    $('<h5>', { class: 'modal-title browser-button noselect', draggable: false }),
                    $('<button>', { type: 'button', class: 'close browser-button noselect', draggable: false, 'data-dismiss': 'modal' }).append(
                        $('<span>', { 'aria-hidden': 'true' }).text('×')
                    )
                ),

                $('<div>', { class: 'modal-body' }),

                $('<div>', { class: 'modal-footer' }).append(
                    $('<button>', { type: 'button', class: 'btn btn-secondary browser-button noselect', draggable: false, 'data-dismiss': 'modal' }).text(chrome.i18n.getMessage('close'))
                )

            )
        )
    );

    $('body').prepend(browserSettings.settings.base, browserSettings.settings.webicon);

    // Prepare Nav
    browserSettings.addressBar.nav = {};

    // Tabs
    browserSettings.addressBar.tabs = $('<ul>', { class: 'navbar-nav mr-auto' });

    /* browserSettings.addressBar.nav.tabs = $('<nav>', { class: 'navbar navbar-expand navbar-tab-' + browserSettings.theme + ' navbar-' + browserSettings.theme + ' bg-' + browserSettings.theme, id: 'tabs' }).css('height', browserSettings.addressBar.size / 2 - 3).append(
        browserSettings.addressBar.tabs
    ); */
    browserSettings.addressBar.nav.tabs = $('<nav>', { class: 'navbar navbar-expand navbar-tab-' + browserSettings.theme + ' navbar-' + browserSettings.theme + ' bg-' + browserSettings.theme, id: 'tabs' }).css('height', browserSettings.addressBar.size - 3).append(
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
    browserSettings.addressBar.bar.icon = $('<div>', { class: 'input-group-prepend h-100', title: chrome.i18n.getMessage('webInfo') }).css({
        'border-right': 0
    }).append(
        $('<span>', { class: 'input-group-text h-100 bg-' + bgAdress + ' border-' + browserSettings.theme, id: 'page-status' })
        .css('font-size', 'small').append(
            $('<i>', { class: 'fas fa-lock' })
        )
    ).click(function() { browserSettings.webinfo.open(); });

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

    // Next and Previous Action
    const nextPrevAction = function(id) {

        // Get New Window Index
        const newPage = browserSettings.tabs[id].activeHistory;

        // Redirect
        if (browserSettings.tabs[id].history[newPage]) {
            browserSettings.redirectTab(
                browserSettings.tabs[id].history[newPage].domain,
                browserSettings.tabs[id].history[newPage].cid,
                browserSettings.tabs[id].history[newPage].path,
                id
            );
        }

        // Complete
        browserSettings.updateHistory();

    };

    // Previous
    browserSettings.addressBar.previous = $('<a>', { class: 'nav-link mx-1 browser-button', draggable: false, title: chrome.i18n.getMessage('previousPageInfo') }).append(
        $('<i>', { class: 'fas fa-caret-left' }).css({
            'font-size': browserSettings.addressBar.buttonSize,
            'margin': browserSettings.addressBar.marginButtonFix,
            'margin-right': 1
        })
    );

    browserSettings.addressBar.previous.click(function() {

        // Get ID
        const id = browserSettings.active;

        // Validator
        if (
            typeof browserSettings.tabs[id].activeHistory === 'number' &&
            browserSettings.tabs[id].activeHistory > 0
        ) {
            browserSettings.tabs[id].activeHistory--;
            nextPrevAction(id);
        }

    }).on("contextmenu", function() {});

    // Next
    browserSettings.addressBar.next = $('<a>', { class: 'nav-link mx-1 browser-button', draggable: false, title: chrome.i18n.getMessage('nextPageInfo') }).append(
        $('<i>', { class: 'fas fa-caret-right' }).css({
            'font-size': browserSettings.addressBar.buttonSize,
            'margin': browserSettings.addressBar.marginButtonFix,
            'margin-left': 1
        })
    );

    browserSettings.addressBar.next.click(function() {

        // Get ID
        const id = browserSettings.active;

        // Validator
        if (
            typeof browserSettings.tabs[id].activeHistory === 'number' &&
            browserSettings.tabs[id].activeHistory < browserSettings.tabs[id].history.length - 1
        ) {
            browserSettings.tabs[id].activeHistory++;
            nextPrevAction(id);
        }

    }).on("contextmenu", function() {});

    // Items
    /* browserSettings.addressBar.nav.items = $('<nav>', { class: 'navbar navbar-expand navbar-' + browserSettings.theme + ' bg-' + browserSettings.theme, id: 'menu' }).css('height', browserSettings.addressBar.size / 2 + 3).append( */
    browserSettings.addressBar.nav.items = $('<nav>', { class: 'navbar navbar-expand navbar-' + browserSettings.theme + ' bg-' + browserSettings.theme, id: 'menu' }).css('height', browserSettings.addressBar.size + 3).append(
        $('<ul>', { class: 'navbar-nav mr-auto' }).append(

            // Previous
            $('<li>', { class: 'nav-item' }).append(browserSettings.addressBar.previous),

            // Next
            $('<li>', { class: 'nav-item' }).append(browserSettings.addressBar.next),

            // Refresh
            $('<li>', { class: 'nav-item' }).append(
                $('<a>', { class: 'nav-link mx-1 browser-button', draggable: false, title: chrome.i18n.getMessage('refreshInfo') }).append(
                    $('<i>', { class: 'fas fa-redo-alt' })
                ).click(reloadNFTPage)
            ),

            // Settings
            $('<li>', { class: 'nav-item' }).append(
                $('<a>', { class: 'nav-link mx-1 browser-button', draggable: false, title: chrome.i18n.getMessage('pageSettingsInfo') }).append(
                    $('<i>', { class: 'fas fa-cog' })
                ).click(browserSettings.buttons.settings)
            ),

            // Bookmark
            /* $('<li>', { class: 'nav-item' }).append(
                $('<a>', { class: 'nav-link mx-1 browser-button', draggable: false }).append(
                    $('<i>', { class: 'fas fa-bookmark' })
                )
            ), */

            // Address Bar
            $('<form>', { class: 'd-inline m-0 w-100' }).append(
                browserSettings.addressBar.bar.base
            )

            // Search
            /* .on('keyup', function(e) {

                chrome.runtime.sendMessage({
                    type: 'searchHistory',
                    data: {
                        text: browserSettings.addressBar.bar.text.input.val()
                    }
                }, function(err, data) {

                    // Complete
                    if (!err) {
                        if (data) {



                        } else {
                            console.error('NO SEARCH DATA FOUND!');
                        }
                    }

                    // Error
                    else { console.err(err); }

                });

            }) */

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
            /* browserSettings.addressBar.nav.tabs, */
            browserSettings.addressBar.nav.items
        )
    );

    // Complete
    fn();

};