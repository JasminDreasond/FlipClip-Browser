chrome.action.onClicked.addListener(function(tab) {
    /*     chrome.windows.create({
            type: 'popup',
            url: '/index.html'
        }); */
    console.log(tab);
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: function() { window.close(); }
    });
});

// Show the demo page once the extension is installed
/* chrome.runtime.onInstalled.addListener((_reason) => {
    chrome.tabs.create({
        url: 'demo/index.html'
    });
}); */