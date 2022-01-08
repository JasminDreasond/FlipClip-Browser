//content script
var clickedEl = null;

// Context Menu Detector
$(document).on('contextmenu', () => { clickedEl = document.activeElement; });
const getElementData = function(item) {

    // Item
    if (item) {

        // Result
        const result = { elements: {} };

        // Get Element
        const element = $(item);

        // Read Elements
        $.each(item.attributes, function() {
            // this.attributes is not a plain object, but an array
            // of attribute nodes, which contain both the name and value
            if (this.specified) {
                result.elements[this.name] = this.value;
            }
        });

        // Get Value
        result.value = element.val();
        result.text = element.text();
        result.tagName = element.prop("tagName").toLowerCase();
        result.index = element.index();

        // Complete
        return result;

    }

    // Nope
    else { return null; }

};

// Receive Chrome Event
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "getClickedEl" && clickedEl) {
        try {

            // Prepare Result
            const result = {};

            // Parent
            const tinyElement = $(clickedEl);
            const parent = tinyElement.parent();

            // Input
            result.base = getElementData(clickedEl);
            result.parent = getElementData(parent[0]);

            // Send Response
            sendResponse(result);

            // Reset Click Element
            clickedEl = null;

        } catch (err) {

            chrome.runtime.sendMessage({
                type: 'errorInsertAddress',
                data: {
                    code: err.code,
                    message: err.message
                }
            });

            console.error(err);
            sendResponse(null);

        }
    }
});