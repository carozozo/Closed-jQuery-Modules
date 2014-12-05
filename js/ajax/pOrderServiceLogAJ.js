$.ajax.orderServiceLog = {};

$.ajax.orderServiceLog.getOrderServiceLogListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderServiceLog/api/getOrderServiceLogList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderServiceLog.createOrderServiceLogAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderServiceLog/api/createOrderServiceLog',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};