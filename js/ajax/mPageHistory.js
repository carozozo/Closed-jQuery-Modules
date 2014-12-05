$.ajax.mPageHistory = {};

$.ajax.mPageHistory.getPageHistoryByUidAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/mPageHistory/api/getPageHistoryByUid',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.mPageHistory.insertPageHistoryByUidAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/mPageHistory/api/insertPageHistoryByUid',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.mPageHistory.removeAllPageHistoryAJ = function (cb) {
    $.ajax({
        type: 'POST',
        url: '/mPageHistory/api/removeAllPageHistory',
        async: false,
        data: {
        },
        success: cb
    });
};

