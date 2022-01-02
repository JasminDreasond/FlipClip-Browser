// Buttons List
browserSettings.buttons = {};

// Settings Button
const settingsList = [
    { value: 'automaticDownloads' },
    { value: 'camera' },
    { value: 'cookies' },
    { value: 'fullscreen' },
    { value: 'images' },
    { value: 'javascript' },
    { value: 'location' },
    { value: 'microphone' },
    { value: 'mouselock' },
    { value: 'notifications' },
    { value: 'plugins' },
    { value: 'popups' },
    { value: 'unsandboxedPlugins' }
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
            data[settingsList[item].value] = await chrome.contentSettings[settingsList[item].value].get(url);
            if (!storage[id][settingsList[item].value]) { storage[id][settingsList[item].value] = data[settingsList[item].value]; }
            if (!storage[id][settingsList[item].value]) { storage[id][settingsList[item].value] = {}; }

            // Select
            const select = $('<select>', { class: 'form-control', id: settingsList[item].value }).append(
                $('<option>', { value: 'ask' }).text(chrome.i18n.getMessage('ask')),
                $('<option>', { value: 'allow' }).text(chrome.i18n.getMessage('allow')),
                $('<option>', { value: 'block' }).text(chrome.i18n.getMessage('block'))
            );

            // Insert Cfg
            optionsBase.append(
                $('<label>', { for: settingsList[item].value, class: 'col-sm-6 col-form-label my-2' }).text(chrome.i18n.getMessage(settingsList[item].value)),
                $('<div>', { class: 'col-sm-4 my-2' }).append(
                    select.change(async function() {

                        const tinyThis = $(this);
                        const oldValue = $(this).val();
                        select.prop('disabled', true);

                        try {

                            await chrome.contentSettings[tinyThis.attr('id')].set({
                                primaryPattern: url.primaryUrl,
                                setting: tinyThis.val()
                            });
                            select.data('oldOption', tinyThis.val());
                            storage[id][tinyThis.attr('id')].setting = tinyThis.val();

                        } catch (err) {
                            alert(err.message);
                            select.val(select.data('oldOption'));
                        }

                        await chrome.storage.local.set(storage);
                        select.prop('disabled', false);

                    })
                )
            );

            // Insert Config
            if (storage[id][settingsList[item].value].setting) { select.val(storage[id][settingsList[item].value].setting); }
            select.data('oldOption', select.val());

        }

        // Prepare Save
        console.log(data);
        await chrome.storage.local.set(storage);
        return;

    });

};