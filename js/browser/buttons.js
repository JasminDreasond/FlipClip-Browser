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
    const id = browserSettings.tabs[browserSettings.active].domain + '__privacy';
    chrome.storage.local.get([id], async function(storage) {

        // Create Storage
        if (!storage[id]) {
            storage[id] = {};
        }

        // Start Page        
        $('#settings').modal('show');

        // Get Website Data
        const url = {
            primaryUrl: browserSettings.urlGenerator(
                browserSettings.tabs[browserSettings.active].cid
            ) + '*'
        };

        // Get Data
        const data = {};
        for (const item in settingsList) {

            // Insert Default Data
            data[settingsList[item]] = await chrome.contentSettings[settingsList[item]].get(url);
            if (!storage[id][settingsList[item]]) { storage[id][settingsList[item]] = data[settingsList[item]]; }

            // Insert Cfg
            $('#settings .modal-body').append(
                $('<select>').change(function() {

                    // Prepare Save
                    chrome.storage.local.set(storage, function() {
                        console.log('Value is set to ' + value);
                    });

                })
            );

        }

        // Prepare Save
        await chrome.storage.local.set(storage);
        return;

    });

};