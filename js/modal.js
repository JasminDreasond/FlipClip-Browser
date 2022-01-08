$(function() {

    // Dark Mode Enable
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        $('#modal, .modal-content').addClass('bg-dark').addClass('text-white');
    }

    // Params
    const urlSearchParams = new URLSearchParams(window.location.search);
    var params = Object.fromEntries(urlSearchParams.entries());

    // Insert Title
    $('.modal-title').text(params.title);
    document.title = params.title;

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

    // Insert Data
    $('.modal-body').text(params.message).prepend(
        $('<i>', { class: alertIcon })
    );

    // Close Button
    $('#close-modal, .close').click(function() { window.close(); });

    // Open Modal
    $('#appstart').fadeOut(500, function() {
        $('#appstart').remove();
    });

    $('#modal').fadeIn(500);

});