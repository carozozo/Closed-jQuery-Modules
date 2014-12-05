$.ajax.orderDocument = {};

$.ajax.orderDocument.getOrderDocumentListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/getOrderDocumentList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.getOrderReceiptEmailAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/getOrderReceiptEmail',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.getPaymentConfirmedEmailAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/getPaymentConfirmedEmail',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.getPaymentRejectedEmailAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/getPaymentRejectedEmail',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.getEticketEmailAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/getEticketEmail',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.getPaymentRefundEmailAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/getPaymentRefundEmail',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.sendOrderReceiptEmailAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/sendOrderReceiptEmail',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.sendPaymentConfirmedEmailAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/sendPaymentConfirmedEmail',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.sendPaymentRejectedEmailAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/sendPaymentRejectedEmail',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.sendEticketEmailAsyncAJ = function (opt, cb) {
    opt = $.lHelper.coverToFormData(opt);
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/sendEticketEmail',
        async: true,
        // Don't process the files
        processData: false,
        // Set content type to false as jQuery will tell the server its a query string request
        contentType: false,
        data: opt,
        success: cb
    });
};

$.ajax.orderDocument.sendPaymentRefundEmailAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/sendPaymentRefundEmail',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.getOrderReceiptSmsMsgAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/getOrderReceiptSmsMsg',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.getPaymentConfirmedSmsMsgAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/getPaymentConfirmedSmsMsg',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.getPaymentRejectedSmsMsgAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/getPaymentRejectedSmsMsg',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.getEticketSmsMsgAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/getEticketSmsMsg',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.getPaymentRefundSmsMsgAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/getPaymentRefundSmsMsg',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

//$.ajax.orderDocument.sendOrderDucSmsAJ = function (opt, cb) {
//    $.ajax({
//        type: 'POST',
//        url: '/orderDocument/api/sendOrderDucSms',
//        async: false,
//        data: {
//            opt: opt
//        },
//        success: cb
//    });
//};

$.ajax.orderDocument.sendOrderReceiptSmsAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/sendOrderReceiptSms',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.sendPaymentConfirmedSmsAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/sendPaymentConfirmedSms',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.sendPaymentRejectedSmsAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/sendPaymentRejectedSms',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.sendEticketSmsAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/sendEticketSms',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.sendPaymentRefundSmsAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/sendPaymentRefundSms',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.sendCustomerSmsAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/sendCustomerSms',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderDocument.downloadDocAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderDocument/api/downloadDoc',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};