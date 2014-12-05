$.ajax.orderEventProduct = {};

$.ajax.orderEventProduct.confirmFulfillmentByProductIdAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderEventProduct/api/confirmFulfillmentByProductId',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.orderEventProduct.confirmDocProductionByProductIdAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/orderEventProduct/api/confirmDocProductionByProductId',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};