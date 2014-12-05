$.ajax.traveler = {};

$.ajax.traveler.getTravelerDetailAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/traveler/api/getTravelerDetail',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.traveler.getTravelerDocumentByTravelerIdAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/traveler/api/getTravelerDocumentByTravelerId',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.traveler.getTravelerPhoneNumbersByTravelerIdAsyncAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/traveler/api/getTravelerPhoneNumbersByTravelerId',
        async: true,
        data: {
            opt: opt
        },
        success: cb
    });
};

// TODO no test
$.ajax.traveler.getTravelerListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/traveler/api/getTravelerList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

// TODO no test
$.ajax.traveler.createTravelerAJ = function (mTravelerCreate, cb) {
    $.ajax({
        type: 'POST',
        url: '/traveler/api/createTraveler',
        async: false,
        data: {
            opt: mTravelerCreate
        },
        success: cb
    });
};

// TODO no test
$.ajax.traveler.updateTravelerAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/traveler/api/updateTraveler',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};
