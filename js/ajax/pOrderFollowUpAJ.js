$.ajax.orderFollowUp = {};

$.ajax.orderFollowUp.getOrderFollowUpListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderFollowUp/api/getOrderFollowUpList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderFollowUp.updateOrderFollowUpAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderFollowUp/api/updateOrderFollowUp',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};