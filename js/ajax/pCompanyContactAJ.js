$.ajax.companyContact = {};

$.ajax.companyContact.updateCompanyContactAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/companyContact/api/updateCompanyContact',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};