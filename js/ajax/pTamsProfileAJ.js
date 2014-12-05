$.ajax.tamsProfile = {};

// TODO pre-write
$.ajax.tamsProfile.getCustomerByIdAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/tamsProfile/api/getCustomerById',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

// TODO pre-write
$.ajax.tamsProfile.createCustomerAJ = function (opt, cb) {
    $.lAjax.aRunningAjax.push(
        $.ajax({
            type: 'POST',
            url: '/tamsProfile/api/createCustomer',
            async: false,
            data: {
                opt: opt
            },
            success: cb
        })
    );
};

// TODO pre-write
$.ajax.tamsProfile.updateCustomerAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/tamsProfile/api/updateCustomer',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};