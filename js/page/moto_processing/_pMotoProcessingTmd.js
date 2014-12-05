tmd.pMotoProcessing = function (data) {
    var obj = $.lObj.cloneObj(data);
    (function setAmount() {
        var orderPaidAmount = data.orderPaidAmount;
        var currencyCode = orderPaidAmount.currencyCode;
        var value = orderPaidAmount.value;
        if (orderPaidAmount) {
            obj.amountFull = $.lStr.formatMoney(value, {
                prefix: currencyCode
            });
        }
    })();

    (function setOrderTranxId() {
        // creditCardPaymentInstruction.orderTxnRefNo = orderTransaction.orderTransactionNo
        // orderTransactionId is last-2-charts from orderTransaction.orderTransactionNo
        var orderTxnRefNo = data.orderTxnRefNo;
        obj.orderTxnRefNo = orderTxnRefNo.slice(0, -2);
        obj.orderTranxId = orderTxnRefNo.slice(-2);
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