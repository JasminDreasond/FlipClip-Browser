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

    // Insert Data
    $('.modal-body').text(params.message);

    // Close Button
    $('#close-modal, .close').click(function() { window.close(); });

    // Open Modal
    $('#appstart').fadeOut(500, function() {
        $('#appstart').remove();
    });

    $('#modal').fadeIn(500);

});