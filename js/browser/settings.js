// Buttons List
browserSettings.buttons = {};
browserSettings.webinfo = webinfo;

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

    // Dark Mode
    let darkMode;
    if (browserSettings.theme === 'dark') {
        darkMode = ' bg-dark text-white';
    }

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

        const changeOptionColor = function(tinyThis, value) {
            tinyThis.removeClass('text-warning').removeClass('text-success').removeClass('text-danger');
            if (value === 'ask') { tinyThis.addClass('text-warning'); } else if (value === 'block') { tinyThis.addClass('text-danger'); } else if (value === 'allow') { tinyThis.addClass('text-success'); }
        }

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
            const select = $('<select>', { class: 'form-control' + darkMode, id: settingsList[item].value }).append(
                $('<option>', { value: 'ask', class: 'text-warning' }).text(chrome.i18n.getMessage('ask')),
                $('<option>', { value: 'allow', class: 'text-success' }).text(chrome.i18n.getMessage('allow')),
                $('<option>', { value: 'block', class: 'text-danger' }).text(chrome.i18n.getMessage('block'))
            );

            // Insert Cfg
            optionsBase.append(
                $('<label>', { for: settingsList[item].value, class: 'col-sm-6 col-form-label my-2' }).text(chrome.i18n.getMessage(settingsList[item].value)),
                $('<div>', { class: 'col-sm-4 my-2' }).append(
                    select.change(async function() {

                        const value = $(this).val();
                        const tinyThis = $(this);
                        changeOptionColor(tinyThis, value);

                        select.prop('disabled', true);

                        try {

                            await chrome.contentSettings[tinyThis.attr('id')].set({
                                primaryPattern: url.primaryUrl,
                                setting: value
                            });
                            select.data('oldOption', value);
                            storage[id][tinyThis.attr('id')].setting = value;

                        } catch (err) {
                            alert(err.message);
                            changeOptionColor(select, select.data('oldOption'));
                            select.val(select.data('oldOption'));
                        }

                        await chrome.storage.local.set(storage);
                        select.prop('disabled', false);

                    })
                )
            );

            // Insert Config
            if (storage[id][settingsList[item].value].setting) { select.val(storage[id][settingsList[item].value].setting); }
            changeOptionColor(select, select.val());
            select.data('oldOption', select.val());

        }

        // Prepare Save
        await chrome.storage.local.set(storage);
        return;

    });

};