$.ajax.travelerDoc = {};

// TODO no used
$.ajax.travelerDoc.getTravelerDocDetailAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/travelerDoc/api/getTravelerDocDetail',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

// TODO no used
$.ajax.travelerDoc.getTravelerDocListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/travelerDoc/api/getTravelerDocList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

// TODO no used
$.ajax.travelerDoc.createTravelerDocAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/travelerDoc/api/createTravelerDoc',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.travelerDoc.updateTravelerDocAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/travelerDoc/api/updateTravelerDoc',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};