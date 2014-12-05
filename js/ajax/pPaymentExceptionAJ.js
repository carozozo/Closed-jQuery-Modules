$.ajax.paymentException = {};

$.ajax.paymentException.updateExceptionTransactionAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/paymentException/api/updateExceptionTransaction',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.paymentException.getExceptionTransactionListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/paymentException/api/getExceptionTransactionList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};
$.ajax.paymentException.getExceptionTransactionListAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/paymentException/api/getExceptionTransactionList',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};