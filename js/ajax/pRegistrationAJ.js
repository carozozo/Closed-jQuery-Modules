$.ajax.registrations = {};

$.ajax.registrations.approveCreateAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/registration/api/approveCreate',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.registrations.getRegDetailAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/registration/api/getRegDetail',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.registrations.getRegistrationListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/registration/api/getRegistrationList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.registrations.getRegistrationListAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/registration/api/getRegistrationList',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

// TODO no used
$.ajax.registrations.getRegistrationContactListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/registration/api/getRegistrationContactList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.registrations.updateRegistrationAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/registration/api/updateRegistration',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};