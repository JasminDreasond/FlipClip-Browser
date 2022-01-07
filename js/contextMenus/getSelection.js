//content script
var clickedEl = null;

// Context Menu Detector
$(document).on('contextmenu', () => {
    clickedEl = document.activeElement;
});

// Receive Chrome Event
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "getClickedEl" && clickedEl) {

        // Get Element
        const element = $(clickedEl);

        // Send Response
        sendResponse({ value: element.val() });

        // Reset Click Element
        clickedEl = null;

    }
});