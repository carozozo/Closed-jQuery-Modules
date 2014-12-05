$.ajax.payment = {};

// TODO testing
$.ajax.payment.getSupportedPaymentMethodAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/payment/api/getSupportedPaymentMethod',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

// TODO no used
$.ajax.payment.getPaymentListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/payment/api/getPaymentList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

// TODO no test
$.ajax.payment.createPaymentAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/payment/api/createPayment',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

// TODO no used
$.ajax.payment.updatePaymentAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/payment/api/updatePayment',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.payment.authorizeCreditCardPaymentInstructionAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/payment/api/authorizeCreditCardPaymentInstruction',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.payment.cancelCreditCardPaymentInstructionAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/payment/api/cancelCreditCardPaymentInstruction',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.payment.getPaymentOrderTransactionListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/payment/api/getPaymentOrderTransactionList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.payment.getCreditCardPaymentInstructionByCriteriaAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/payment/api/getCreditCardPaymentInstructionByCriteria',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.payment.getCreditCardPaymentInstructionByCriteriaAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/payment/api/getCreditCardPaymentInstructionByCriteria',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.payment.getCreditCardNoByMerchantTranxIdAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/payment/api/getCreditCardNoByMerchantTranxId',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};