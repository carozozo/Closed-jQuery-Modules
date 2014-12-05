$.ajax.team = {};

$.ajax.team.getTeamByTeamIdAsyncAJ = function (opt, cb) {
    $.lAjax.aRunningAjax.push(
        $.ajax({
            type: 'POST',
            url: '/team/api/getTeamByTeamId',
            async: true,
            data: {
                opt: opt
            },
            success: cb
        })
    );
};

// TODO no used
$.ajax.team.getMemberListByTeamIdAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/team/api/getMemberListByTeamId',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

// TODO no used
$.ajax.team.createTeamAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/team/api/createTeam',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

// TODO no used
$.ajax.team.updateTeamAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/team/api/updateTeam',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};