$.ajax.user = {};

$.ajax.user.getUserListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/user/api/getUserList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.user.getUserByIdAJ = function (uid, cb) {
    $.ajax({
        type: 'POST',
        url: '/user/api/getUserById',
        async: false,
        data: {
            uid: uid
        },
        success: cb
    });
};

$.ajax.user.createUserAJ = function (mUserCreate, cb) {
    $.ajax({
        type: 'POST',
        url: '/user/api/createUser',
        async: false,
        data: {
            userData: mUserCreate
        },
        success: cb
    });
};

$.ajax.user.updateUserAJ = function (mUserUpdate, cb) {
    $.ajax({
        type: 'POST',
        url: '/user/api/updateUser',
        async: false,
        data: {
            userData: mUserUpdate
        },
        success: cb
    });
};

$.ajax.user.updateUserAndSetInfoAJ = function (mUserUpdate, cb) {
    $.ajax({
        type: 'POST',
        url: '/user/api/updateUserAndSetInfo',
        async: false,
        data: {
            userData: mUserUpdate
        },
        success: cb
    });
};