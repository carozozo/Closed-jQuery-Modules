$.pRole = (function () {
    var self = {};
    self.pagePms = ['roleReadPms', 'roleCreatePms', 'roleUpdatePms'];
    self.roleListPath = '/role/list/roleList';
    self.roleCreatePath = '/role/create/roleCreate';
    self.roleEditPath = '/role/edit/roleEdit';
    self.getDefListOpt = function () {
        return $.lHelper.getListPageOpt({
            sortBy: 'name',
            order: 'ASC'
        });
    };
    self.bdPermissionListSelect = function (formDom) {
        var dPermissionListSelect = formDom.find('#permissionList');
        var oaData = [];
        var pagePms = $.tSysVars.pagePms;
        $.each(pagePms, function (pms, description) {
            var item = {
                name: description,
                val: pms
            };
            oaData.push(item);
        });

        var opt = {
            oaData: oaData,
            multiple: true,
            maxShow: 5
        };
        formDom.dPermissionListSelect = dPermissionListSelect.mSelectPicker(opt);
    };
    self.setCrumbs = function () {
        $.mCrumbs.regCrumb('roleList', 'pRole.list.pageTitle', function () {
            $.lUtil.goPage(self.roleListPath);
        });
        $.mCrumbs.regCrumb('roleCreate', 'pRole.create.pageTitle', function () {
            $.lUtil.goPage(self.roleCreatePath);
        });
        $.mCrumbs.regCrumb('roleEdit', 'pRole.edit.pageTitle');
    };
    return self;
})();


$.tPageInfo[$.pRole.roleListPath] = {
    title: 'pRole.list.pageTitle',
    initFn: function () {
        $('#roleListPage').pRoleList();
    }
};

$.tPageInfo[$.pRole.roleCreatePath] = {
    title: 'pRole.create.pageTitle',
    initFn: function () {
        $.pRole.setCrumbs();
        $.mCrumbs.disable('roleCreate');
        $.mCrumbs.unRegCrumb('roleEdit');
        $.mCrumbs.render();
        $('#roleCreatePage').pRoleCreate();
    }
};

$.tPageInfo[$.pRole.roleEditPath] = {
    title: 'pRole.edit.pageTitle',
    initFn: function (opt) {
        $.pRole.setCrumbs();
        $.mCrumbs.disable('roleEdit');
        $.mCrumbs.render();
        $('#roleEditPage').pRoleEdit(opt);
    }
};

$.pRoleListOpt = $.pRole.getDefListOpt();

$.lEventEmitter.hookEvent('befLogin', 'pRole', function () {
    $.pRoleListOpt = $.pRole.getDefListOpt();
});