//content script
var clickedEl = null;

$(document).on('contextmenu', () => {
    clickedEl = this.target;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "getClickedEl") {
        sendResponse({ value: clickedEl.value });
    }
});