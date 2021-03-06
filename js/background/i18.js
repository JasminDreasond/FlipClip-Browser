// Start Data
var exLang = {
    locale: chrome.i18n.getUILanguage(),
    data: {}
};

// Add Manifest
var manifest = null;

const addLanguage = function(lang) {
    return new Promise(function(resolve, reject) {

        try {

            // Read Manifest
            fetch(chrome.runtime.getURL('_locales/' + lang + '/messages.json'))
                .then(response => {
                    if (!response.ok) {
                        reject(new Error("i18 HTTP error " + response.status));
                    }
                    return response.json();
                })
                .then(json => {
                    for (const item in json) {
                        if (typeof exLang.data[item] !== 'string') {
                            exLang.data[item] = json[item].message;
                        }
                    }
                    resolve();
                })
                .catch(reject);

        } catch (err) {
            reject(err);
        }

    });
};

// Read Manifest
fetch(chrome.runtime.getURL('manifest.json'))
    .then(response => {
        if (!response.ok) {
            modal('ERROR MANIFEST', response.status);
        }
        return response.json();
    })
    .then(json => {
        manifest = json;
        exLang.default_locale = json.default_locale;
        addLanguage(exLang.locale).then(() => {
            addLanguage(exLang.default_locale).then(() => {
                startBackground();
            }).catch(err => { modal('ERROR ' + err.code, err.message); });
        }).catch(() => {
            addLanguage(exLang.default_locale).then(() => {
                startBackground();
            }).catch(err => { modal('ERROR ' + err.code, err.message); });
        });
    })
    .catch(function(err) { modal('ERROR ' + err.code, err.message); });

// Get Message
chrome.i18n.getMessage = function(msgID) { return exLang.data[msgID]; };