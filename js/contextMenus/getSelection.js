//content script
var clickedEl = null;

// Context Menu Detector
$(document).on('contextmenu', () => {
    clickedEl = document.activeElement;
});

// Receive Chrome Event
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "getClickedEl" && clickedEl) {

        // Prepare Result
        const result = { elements: {} };

        // Read Elements
        $.each(clickedEl.attributes, function() {
            // this.attributes is not a plain object, but an array
            // of attribute nodes, which contain both the name and value
            if (this.specified) {
                result.elements[this.name] = this.value;
            }
        });

        // Send Response
        sendResponse(result);

        // Reset Click Element
        clickedEl = null;

    }
});