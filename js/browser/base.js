// Module
var resolution = new unResolution.Resolution();

// Params
const urlSearchParams = new URLSearchParams(window.location.search);
var params = Object.fromEntries(urlSearchParams.entries());

// Messages
const messages = {

    newTab: function(message) {
        console.log(message);
    },

    frameUpdate: function(message) {

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
        else if (browserSettings.framesId[message.data.frameId] && browserSettings.tabs[browserSettings.framesId[message.data.frameId]]) {

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
                    browserSettings.tabs[browserSettings.framesId[message.data.frameId]].domain,
                    browserSettings.tabs[browserSettings.framesId[message.data.frameId]].cid,
                    browserSettings.tabs[browserSettings.framesId[message.data.frameId]].path,
                    browserSettings.framesId[message.data.frameId]
                );

            };

            // Verification
            if (domain.endsWith(domainCheck)) {

                // Same Domain
                if (browserSettings.tabs[browserSettings.framesId[message.data.frameId]].cid32 === cid) {

                    browserSettings.tabs[browserSettings.framesId[message.data.frameId]].path = url;
                    browserSettings.addHistory(
                        browserSettings.framesId[message.data.frameId],
                        browserSettings.tabs[browserSettings.framesId[message.data.frameId]].cid,
                        url,
                        browserSettings.tabs[browserSettings.framesId[message.data.frameId]].domain
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

                    $('#browser').append(
                        browserSettings.createTab(params.domain, cid, params.path, true)
                    );

                    // Complete
                    fn();
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