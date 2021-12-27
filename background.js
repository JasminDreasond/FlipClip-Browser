/* Click on Extension Button */
function reddenPage() {
    document.body.style.backgroundColor = 'red';
}
chrome.action.onClicked.addListener(function(tab) {
    /*     chrome.windows.create({
            type: 'popup',
            url: '/index.html'
        }); */
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: reddenPage
    });
});

chrome.windows.onCreated.addListener({
    callback: function(event) {
        console.log(event);
    }
});

// Show the demo page once the extension is installed
/* chrome.runtime.onInstalled.addListener((_reason) => {
    chrome.tabs.create({
        url: 'demo/index.html'
    });
}); */