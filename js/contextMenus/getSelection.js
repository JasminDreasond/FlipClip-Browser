//content script
var clickedEl = null;

// Context Menu Detector
$(document).on('contextmenu', () => {
    clickedEl = document.activeElement;
});

const getElementData = function(item) {

    // Result
    const result = {};

    // Get Element
    const element = $(item);

    // Read Elements
    $.each(item.attributes, function() {
        // this.attributes is not a plain object, but an array
        // of attribute nodes, which contain both the name and value
        if (this.specified) {
            result[this.name] = this.value;
        }
    });

    // Get Value
    result.value = element.val();
    result.text = element.text();
    result.tagName = element.prop("tagName").toLowerCase();

    // Complete
    return result;

};

// Receive Chrome Event
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "getClickedEl" && clickedEl) {

        // Prepare Result
        const result = {};

        // Input
        result.elements = getElementData(clickedEl);
        console.log($(clickedEl).parent());

        // Send Response
        sendResponse(result);

        // Reset Click Element
        clickedEl = null;

    }
});