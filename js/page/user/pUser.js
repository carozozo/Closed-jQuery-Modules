$.pUser = (function () {
    var self = {};
    self.pagePms = ['userReadPms', 'userCreatePms', 'userUpdatePms'];
    self.userListPath = '/user/list/userList';
    self.userCreatePath = '/user/create/userCreate';
    self.userEditPath = '/user/edit/userEdit';
    self.getDefListOpt = function () {
        return $.lHelper.getListPageOpt({
            sortBy: 'userName',
            order: 'ASC'
        });
    };
    self.setCrumbs = function () {
        $.mCrumbs.regCrumb('userList', 'pUser.list.pageTitle', function () {
            $.lUtil.goPage(self.userListPath);
        });
        $.mCrumbs.regCrumb('userCreate', 'pUser.create.pageTitle', function () {
            $.lUtil.goPage(self.userCreatePath);
        });
        $.mCrumbs.regCrumb('userEdit', 'pUser.edit.pageTitle');
    };
    self.bdRoleListSelect = function (formDom) {
        var dRoleListSelect = formDom.find('#roleId');
        var createSelect = function (oaRole) {
            var oaData = [];
            $.each(oaRole, function (i, oRole) {
                var item = {
                    name: oRole.name,
                    val: oRole.roleId
                };
                oaData.push(item);
            });
            dRoleListSelect.mSelect(oaData);
        };
        // set page size to 100, is want to get all list
        $.ajax.role.getRoleListAJ({pageSize: 100}, function (res) {
            $.lAjax.parseRes(res, function (result) {
                var oaRole = result.results;
                dRoleListSelect = createSelect(oaRole);
            });
        });

    };
    self.getDefListOpt = function () {
        return $.lHelper.getListPageOpt({
            sortBy: 'userName',
            order: 'ASC'
        });
    };
    self.setUserCrumbs = function () {
        $.mCrumbs.regCrumb('userList', 'pUser.list.pageTitle', function () {
            $.lUtil.goPage($.pUser.userListPath);
        });
        $.mCrumbs.regCrumb('userCreate', 'pUser.create.pageTitle', function () {
            $.lUtil.goPage($.pUser.userCreatePath);
        });
        $.mCrumbs.regCrumb('userEdit', 'pUser.edit.pageTitle');
    };
    self.bdRoleListSelect = function (formDom) {
        var dRoleListSelect = formDom.find('#roleId');
        var createSelect = function (oaRole) {
            var oaData = [];
            $.each(oaRole, function (i, oRole) {
                var item = {
                    name: oRole.name,
                    val: oRole.roleId
                };
                oaData.push(item);
            });
            dRoleListSelect.mSelect(oaData);
        };
        // set page size to 100, is want to get all list
        $.ajax.role.getRoleListAJ({pageSize: 100}, function (res) {
            $.lAjax.parseRes(res, function (result) {
                var oaRole = result.results;
                dRoleListSelect = createSelect(oaRole);
            });
        });
    };
    return self;
})();

$.tPageInfo[$.pUser.userListPath] = {
    title: 'pUser.list.pageTitle',
    initFn: function () {
        $('#userListPage').pUserList();
    }
};

$.tPageInfo[$.pUser.userCreatePath] = {
    title: 'pUser.create.pageTitle',
    initFn: function () {
        $.pUser.setCrumbs();
        $.mCrumbs.disable('userCreate');
        $.mCrumbs.unRegCrumb('userEdit');
        $.mCrumbs.render();
        $('#userCreatePage').pUserCreate();
    }
};

$.tPageInfo[$.pUser.userEditPath] = {
    title: 'pUser.edit.pageTitle',
    initFn: function (opt) {
        $.pUser.setCrumbs();
        $.mCrumbs.disable('userEdit');
        $.mCrumbs.render();
        $('#userEditPage').pUserEdit(opt);
    }
};

$.pUserListOpt = $.pUser.getDefListOpt();

$.lEventEmitter.hookEvent('befLogin', 'pUser', function () {
    $.pUserListOpt = $.pUser.getDefListOpt();
});