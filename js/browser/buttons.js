// Buttons List
browserSettings.buttons = {};

// Settings Button
browserSettings.buttons.settings = function() {

    $('#settings .modal-body').empty();
    chrome.storage.local.get([browserSettings.tabs[browserSettings.active].domain], function(storage) {
        chrome.contentSettings.javascript.get({
            primaryUrl: browserSettings.urlGenerator(
                browserSettings.tabs[browserSettings.active].cid
            ) + '*'
        }, function(data) {

            console.log(data);
            console.log(storage);

            $('#settings .modal-body').empty().append(



            );

            $('#settings').modal('show');


        });
    });

};