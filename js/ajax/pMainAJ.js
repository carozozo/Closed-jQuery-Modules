$.ajax.main = {};

$.ajax.main.getVarsAJ = function (cb) {
    $.ajax({
        type: 'POST',
        url: '/main/api/getVars',
        async: false,
        data: {
        },
        success: cb
    });
};

$.ajax.main.loginAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/main/api/login',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.main.logoutAJ = function (cb) {
    $.ajax({
        type: 'POST',
        url: '/main/api/logout',
        async: false,
        data: {
        },
        success: cb
    });
};

$.ajax.main.authPwdAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/main/api/authPwd',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.main.getPageAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/main/api/getPage',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.main.getPageAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/main/api/getPage',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};