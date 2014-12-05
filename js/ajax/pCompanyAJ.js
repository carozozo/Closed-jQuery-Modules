$.ajax.company = {};

$.ajax.company.getCompanyByIdAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/company/api/getCompanyById',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.company.getCompanyListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/company/api/getCompanyList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.company.getTeamListByCompanyIdAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/company/api/getTeamListByCompanyId',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.company.getMemberListByCompanyIdAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/company/api/getMemberListByCompanyId',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.company.getCompanyProfileAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/company/api/getCompanyProfile',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.company.getCompanyEwalletForListAsyncAJ = function (opt, cb) {
    $.lAjax.aRunningAjax.push(
        $.ajax({
            type: 'POST',
            url: '/company/api/getCompanyEwalletForList',
            async: true,
            data: {
                opt: opt
            },
            success: cb
        })
    );
};

$.ajax.company.getCompanyEwalletAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/company/api/getCompanyEwallet',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.company.getStaffListByCompanyIdAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/company/api/getMemberListByCompanyId',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.company.updateCompanyAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/company/api/updateCompany',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};