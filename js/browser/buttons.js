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
        const optionsBase = $('<div>', { class: 'form-group row my-2' });
        $('#settings .modal-body').append(optionsBase);
        for (const item in settingsList) {

            // Insert Default Data
            data[settingsList[item]] = await chrome.contentSettings[settingsList[item]].get(url);
            if (!storage[id][settingsList[item]]) { storage[id][settingsList[item]] = data[settingsList[item]]; }
            if (!storage[id][settingsList[item]]) { storage[id][settingsList[item]] = {}; }

            // Select
            const select = $('<select>', { class: 'form-control', id: settingsList[item] }).append(
                $('<option>', { value: 'ask' }).text('Ask'),
                $('<option>', { value: 'allow' }).text('Allow'),
                $('<option>', { value: 'block' }).text('Block')
            );

            // Insert Cfg
            optionsBase.append(
                $('<label>', { for: settingsList[item], class: 'col-sm-6 col-form-label my-2' }).text(settingsList[item]),
                $('<div>', { class: 'col-sm-4 my-2' }).append(
                    select.change(function() {

                        const tinyThis = $(this);
                        select.prop('disabled', true);
                        chrome.contentSettings[tinyThis.attr('id')].set({
                            primaryPattern: url.primaryUrl,
                            setting: tinyThis.val()
                        }, function() {
                            chrome.storage.local.set(storage, function() {
                                select.prop('disabled', false);
                            });
                        });

                    })
                )
            );

            // Insert Config
            if (storage[id][settingsList[item]].setting) { select.val(storage[id][settingsList[item]].setting); }

        }

        // Prepare Save
        console.log(data);
        await chrome.storage.local.set(storage);
        return;

    });

};