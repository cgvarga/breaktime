utils = {
    triggerEvent: function (eventName, details, element) {
        details = details || {};
        var evt = new CustomEvent(eventName, {
            detail: details,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(evt);
    },
    forEach: function (array, callback, context) {
        for (var i = 0; i < array.length; i++) {
            callback.call(context, i, array[i]);
        }
    }
}