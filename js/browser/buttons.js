// Buttons List
browserSettings.buttons = {};

// Settings Button
const settingsList = [
    'automaticDownloads',
    'camera',
    'cookies',
    'fullscreen',
    'images',
    'javascript',
    'location',
    'microphone',
    'mouselock',
    'notifications',
    'plugins',
    'popups',
    'unsandboxedPlugins'
];

browserSettings.buttons.settings = function() {

    // Get Data
    $('#settings .modal-body').empty();
    chrome.storage.local.get([browserSettings.tabs[browserSettings.active].domain], async function(storage) {

        // Get Website Data
        const url = {
            primaryUrl: browserSettings.urlGenerator(
                browserSettings.tabs[browserSettings.active].cid
            ) + '*'
        };

        const data = {};
        for (const item in settingsList) {
            data[settingsList[item]] = await chrome.contentSettings[settingsList[item]].get(url);
        }

        console.log(data);
        console.log(storage);

        $('#settings .modal-body').empty().append(



        );

        $('#settings').modal('show');

    });

};