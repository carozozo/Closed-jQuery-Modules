tmd.pPayment = function (data) {
    var obj = $.lObj.cloneObj(data);
    (function setAmountFull() {
        var amount = (data.amount) ? data.amount : 0;
        var currencyCode = (data.currencyCode) ? data.currencyCode : '';
        obj.amountFull = currencyCode + ' ' + $.lStr.formatMoney(amount, 'int');
    })();

    (function setRecordCreatedAt() {
        var recordCreatedAt = data.recordCreatedAt;
        if (recordCreatedAt) {
            obj.recordCreatedAt = $.lDateTime.formatDateTime(recordCreatedAt, 'dateTime');
        }
    })();

    (function setRecordUpdatedAt() {
        var recordUpdatedAt = data.recordUpdatedAt;
        if (recordUpdatedAt) {
            obj.recordUpdatedAt = $.lDateTime.formatDateTime(recordUpdatedAt, 'dateTime');
        }
    })();

    // used for payment data in [order-detail] page
    (function setRecordModifiedAt() {
        var recordModifiedAt = data.recordModifiedAt;
        if (recordModifiedAt) {
            obj.recordModifiedAt = $.lDateTime.formatDateTime(recordModifiedAt, 'dateTime');
        }
    })();
    return obj;
};

tmd.pPaymentTransaction = function (data) {
    var obj = $.lObj.cloneObj(data);
    (function setAmountFull() {
        var amount = (data.amount) ? data.amount : 0;
        var currencyCode = (data.currencyCode) ? data.currencyCode : '';
        obj.amountFull = currencyCode + ' ' + $.lStr.formatMoney(amount, 'int');
    })();

    (function setPaymentMethod() {
        var paymentMethodCode = data.paymentMethodCode;
        if (paymentMethodCode) {
            obj.paymentMethod = $.lHelper.getPaymentMethodByCode(paymentMethodCode);
        }
    })();

    (function setRecordCreatedAt() {
        var recordCreatedAt = data.recordCreatedAt;
        if (recordCreatedAt) {
            obj.recordCreatedAt = $.lDateTime.formatDateTime(recordCreatedAt, 'dateTime');
        }
    })();

    (function setRecordUpdatedAt() {
        var recordModifiedAt = data.recordModifiedAt;
        if (recordModifiedAt) {
            obj.recordModifiedAt = $.lDateTime.formatDateTime(recordModifiedAt, 'dateTime');
        }
    })();
    return obj;
};

tmd.pPaymentOrderTransaction = function (data) {
    var obj = $.lObj.cloneObj(data);
    (function setAmountFull() {
        var currencyCode = data.currencyCode;
        var amount = data.amount;
        obj.amountFull = $.lStr.formatMoney(amount, {
            prefix: currencyCode
        });
    })();

    (function setRecordCreatedAt() {
        var recordCreatedAt = data.recordCreatedAt;
        if (recordCreatedAt) {
            obj.recordCreatedAt = $.lDateTime.formatDateTime(recordCreatedAt, 'dateTime');
        }
    })();

    (function setRecordUpdatedAt() {
        var recordUpdatedAt = data.recordUpdatedAt;
        if (recordUpdatedAt) {
            obj.recordUpdatedAt = $.lDateTime.formatDateTime(recordUpdatedAt, 'dateTime');
        }
    })();
    return obj;
};