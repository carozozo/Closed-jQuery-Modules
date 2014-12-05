$.ajax.orderTransaction = {};

$.ajax.orderTransaction.getOrderTransactionListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderTransaction/api/getOrderTransactionList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderTransaction.getOrderTransactionListAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderTransaction/api/getOrderTransactionList',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderTransaction.getOrderTransactionByOrderTransactionIdAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderTransaction/api/getOrderTransactionByOrderTransactionId',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};