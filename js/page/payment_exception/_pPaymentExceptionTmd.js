tmd.pPaymentException = function (data) {
    var obj = $.lObj.cloneObj(data);

    (function setPreviousDate() {
        var previousDate = data.previousDate;
        if (previousDate) {
            obj.previousDate = $.lDateTime.formatDateTime(previousDate, 'dateTime');
        }
    })();

    (function setPresentDate() {
        var presentDate = data.presentDate;
        if (presentDate) {
            obj.presentDate = $.lDateTime.formatDateTime(presentDate, 'dateTime');
        }
    })();

    (function setHandledDate() {
        var handledDate = data.handledDate;
        if (handledDate) {
            obj.handledDate = $.lDateTime.formatDateTime(handledDate, 'dateTime');
        }
    })();
    return obj;
};