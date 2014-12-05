$.ajax.passwordAuth = {};

$.ajax.passwordAuth.updatePasswordAuthAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/passwordAuth/api/updatePasswordAuth',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};