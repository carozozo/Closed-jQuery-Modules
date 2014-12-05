$.ajax.eWalletTransaction = {};

$.ajax.eWalletTransaction.getTransactionListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/eWalletTransaction/api/getTransactionList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};