// Module
var resolution = new unResolution.Resolution();

// Params
const urlSearchParams = new URLSearchParams(window.location.search);
var params = Object.fromEntries(urlSearchParams.entries());

// Messages
const messages = {

    // New Tab
    newTab: function(message) {
        console.log(message);
    },

    // Load Page Complete
    onComplete: function(message) {

        // ID
        const id = browserSettings.framesId[message.data.frameId];

        // Exist the Tab Here
        if (id && browserSettings.tabs[id]) {

            // Detect Error
            if (message.data.statusCode >= 400 && message.data.statusCode < 500) {

                // Prepare Data
                let url = message.data.url.split('/');

                // Remove Protocol
                url.shift();

                // Remove Blank
                url.shift();

                // Remove Domain
                url.shift();

                // Fix URL
                url = url.join('/');

                // Remove Browser History
                chrome.runtime.sendMessage({ type: 'removeHistory', data: { domain: browserSettings.tabs[id].domain, path: url } });

            }

        }

    },

    // Frame Update
    frameUpdate: function(message) {

        // ID
        const id = browserSettings.framesId[message.data.frameId];

        // New iFrame Data
        if (message.data.url.startsWith(chrome.runtime.getURL('validator.html') + '?secret=')) {
            const urlData = new URL(message.data.url);
            const urlSearchParams = new URLSearchParams(urlData.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            if (params.secret === browserSettings.windowSecret && browserSettings.tabs[params.id]) {
                browserSettings.tabs[params.id].frameId = message.data.frameId;
                browserSettings.framesId[message.data.frameId] = params.id;
                browserSettings.tabs[params.id].iframe.attr('src', browserSettings.urlGenerator(browserSettings.tabs[params.id].cid) + browserSettings.tabs[params.id].path);
                browserSettings.updateAddressBar();
            }
        }

        // Set New Tab Address
        else if (id && browserSettings.tabs[id]) {

            // Prepare Data
            let url = message.data.url.split('/');
            let urlBase = browserSettings.proxy.split('/');

            // Remove Protocol
            url.shift();
            urlBase.shift();

            // Remove Blank
            url.shift();
            urlBase.shift();

            // Get Domain
            const domain = url[0];
            const domainCheck = urlBase[0].replace('{cid}', '').replace('{cid32}', '');
            const cid = domain.split('.')[0];
            url.shift();
            urlBase.shift();

            // Fix URL
            url = url.join('/');

            // Redirect Normal Web
            const redirectNormalWeb = function() {

                chrome.windows.create({
                    type: 'normal',
                    url: message.data.url
                });

                browserSettings.redirectTab(
                    browserSettings.tabs[id].domain,
                    browserSettings.tabs[id].cid,
                    browserSettings.tabs[id].path,
                    id
                );

            };

            // Verification
            if (domain.endsWith(domainCheck)) {

                // Same Domain
                if (browserSettings.tabs[id].cid32 === cid) {

                    browserSettings.tabs[id].path = url;
                    browserSettings.addHistory(
                        id,
                        browserSettings.tabs[id].cid,
                        url,
                        browserSettings.tabs[id].domain
                    );

                    browserSettings.updateAddressBar();

                }

                // New Domain
                else {
                    redirectNormalWeb();
                }

            }

            // Failed
            else {

                // Insert Browser Window
                browserSettings.startDomain(domain).then(cid => {

                    browserSettings.tabs[id].cid = cid;
                    browserSettings.tabs[id].cid32 = CIDTool.base32(cid);
                    browserSettings.tabs[id].domain = domain;
                    browserSettings.tabs[id].path = url;
                    browserSettings.addHistory(id, cid, url, domain);

                    // Complete
                    return;

                }).catch(() => {
                    redirectNormalWeb();
                });

            }

        }

    }

};

// Start Window Connection
console.log('FlipClip Browser starting...');
$(function() {
    console.log('FlipClip Browser sending request...');
    chrome.runtime.sendMessage('connectWindow', (response) => {
        if (response) {
            console.log('FlipClip Browser Started!');
            startAddressBar(function() {
                startBrowser(function() {
                    $('#appstart').fadeOut(500, function() {
                        $('#appstart').remove();
                    });
                });
            });
        }
    });
});

// Receive New Pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof messages[message.type] === 'function') { messages[message.type](message, sender, sendResponse); }
});