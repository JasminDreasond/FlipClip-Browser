$(function() {

    // Params
    const urlSearchParams = new URLSearchParams(window.location.search);
    var params = Object.fromEntries(urlSearchParams.entries());

    $('#appstart').fadeOut(500, function() {
        $('#appstart').remove();
    });

});