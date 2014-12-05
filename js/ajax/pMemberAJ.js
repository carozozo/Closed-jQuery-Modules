$.ajax.member = {};

$.ajax.member.getTravelerListByMemberIdAsyncAJ = function (opt, cb) {
    $.lAjax.aRunningAjax.push(
        $.ajax({
            type: 'POST',
            url: '/member/api/getTravelerListByMemberId',
            async: true,
            data: {
                opt: opt
            },
            success: cb
        })
    );
};

$.ajax.member.getMemberListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/member/api/getMemberList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.member.getMemberByIdAsyncAJ = function (opt, cb) {
    $.lAjax.aRunningAjax.push(
        $.ajax({
            type: 'POST',
            url: '/member/api/getMemberById',
            async: true,
            data: {
                opt: opt
            },
            success: cb
        })
    );
};

$.ajax.member.getMemberById = function (opt, cb) {
    $.lAjax.aRunningAjax.push(
        $.ajax({
            type: 'POST',
            url: '/member/api/getMemberById',
            async: false,
            data: {
                opt: opt
            },
            success: cb
        })
    );
};

$.ajax.member.updateMemberAJ = function (mMemberEdit, cb) {
    $.ajax({
        type: 'POST',
        url: '/member/api/updateMember',
        async: false,
        data: {
            opt: mMemberEdit
        },
        success: cb
    });
};