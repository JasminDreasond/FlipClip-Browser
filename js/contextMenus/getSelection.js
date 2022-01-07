//content script
var clickedEl = null;

$(document).on('contextmenu', () => {
    clickedEl = document.activeElement;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "getClickedEl") {
        console.log(clickedEl);
        sendResponse({ value: clickedEl.value });
    }
});