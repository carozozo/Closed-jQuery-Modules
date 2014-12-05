$.ajax.eWallet = {};

$.ajax.eWallet.addCreditLimitAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/eWallet/api/addCreditLimit',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.eWallet.reduceCreditLimitAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/eWallet/api/reduceCreditLimit',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.eWallet.getEwalletByIdAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/eWallet/api/getEwalletById',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.eWallet.depositCashAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/eWallet/api/depositCash',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.eWallet.withdrawCashAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/eWallet/api/withdrawCash',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};