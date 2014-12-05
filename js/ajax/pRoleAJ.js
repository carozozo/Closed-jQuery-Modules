$.ajax.role = {};

$.ajax.role.getRoleListAJ = function (opt, cb) {
    $.ajax({
        type: 'POST',
        url: '/role/api/getRoleList',
        async: false,
        data: {
            opt: opt
        },
        success: cb
    });
};

$.ajax.role.getRoleByIdAJ = function (roleId, cb) {
    $.ajax({
        type: 'POST',
        url: '/role/api/getRoleById',
        async: false,
        data: {
            roleId: roleId
        },
        success: cb
    });
};

$.ajax.role.createRoleAJ = function (mRoleCreate, cb) {
    $.ajax({
        type: 'POST',
        url: '/role/api/createRole',
        async: false,
        data: {
            roleData: mRoleCreate
        },
        success: cb
    });
};

$.ajax.role.updateRoleAJ = function (mRoleUpdate, cb) {
    $.ajax({
        type: 'POST',
        url: '/role/api/updateRole',
        async: false,
        data: {
            roleData: mRoleUpdate
        },
        success: cb
    });
};