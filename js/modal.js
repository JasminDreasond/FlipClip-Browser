// Address Bar Resize
const resizeFunction = function() {
    $('.modal-content').css('height', $(document).height());
};

$(window).on('scroll focus mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup keyup keypress keydown hover blur click change', resizeFunction);
$(window).resize(resizeFunction);

// Close Escape
$(document).keyup(function(e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        window.close();
    }
});

// Start Script
$(function() {

    // Dark Mode Enabled
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        $('#modal, .modal-content, body').addClass('bg-dark').addClass('text-white');
    }

    // Params
    const urlSearchParams = new URLSearchParams(window.location.search);
    var params = Object.fromEntries(urlSearchParams.entries());

    // Icon
    let alertIcon = 'fas fa-exclamation-triangle';
    if (typeof params.icon === 'string' && params.icon.length > 0) {

        // Okay
        if (params.icon === 'okay') {
            alertIcon = 'fas fa-thumbs-up"';
        }

        // Info
        else if (params.icon === 'info') {
            alertIcon = 'fas fa-info-circle';
        }

        // Question
        if (params.icon === 'question') {
            alertIcon = 'fas fa-question-circle';
        }

    }

    // Insert Title
    $('.modal-title').text(params.title).prepend(
        $('<i>', { class: alertIcon + ' mr-2' })
    );

    document.title = params.title;

    // Insert Data
    $('.modal-body').text(params.message);

    // Close Button
    $('#close-modal, .close').click(function() { window.close(); });

    // Open Modal
    $(window).trigger('resize');
    $('#appstart').fadeOut(500, function() {
        $('#appstart').remove();
    });

    $('#modal').fadeIn(500);

});