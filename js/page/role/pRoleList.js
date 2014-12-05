$.fn.pRoleList = function () {
    var self = this;
    var pageSizeName = 'roleListPageSize';
    var pageSize = $.lCookie.get(pageSizeName);
    var oRoleList = null;
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pRole.pagePms)) {
        return self;
    }
    if (pageSize) {
        $.pRoleListOpt.pageSize = pageSize;
    }
    $.ajax.role.getRoleListAJ($.pRoleListOpt, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oRoleList = $.lObj.cloneObj(result);
        });
    });
    $.lConsole.log('oRoleList=', oRoleList);
    if (!oRoleList) {
        return self;
    }
    (function dCreateBtn() {
        var dCreateBtn = self.find('#createBtn');
        dCreateBtn.mBtn('create', function () {
            $.lUtil.goPage($.pRole.roleCreatePath);
        });
        return dCreateBtn;
    })();
    (function dRoleListTable() {
        var oaRole = oRoleList.results;
        var dRoleListTable = self.find('#roleListTable');
        dRoleListTable.mListTable(oaRole, function (oRole) {
            return tmd.pRole(oRole);
        }, function (index, oRole, dEachDom) {
            (function setIndex() {
                var dIndex = dEachDom.find('.index');
                dIndex.html(($.pRoleListOpt.startPage * $.pRoleListOpt.pageSize) + index + 1);
            })();
            (function setUpdateBtn() {
                var dUpdateBtn = dEachDom.find('.updateBtn');
                var roleId = oRole.roleId;
                dUpdateBtn.mBtn('edit', function () {
                    var roleOpt = {
                        roleId: roleId
                    };
                    $.lUtil.goPage($.pRole.roleEditPath, roleOpt);
                });
            })();
            (function setPermission() {
                var dPermissions = dEachDom.find('.permissions');
                var sPermission = '';
                var oaPermission = oRole.permissionList;
                var textShorterOpt = {
                    clickShow: true,
                    maxLength: 50
                };
                $.each(oaPermission, function (i, oPermission) {
                    var permissionId = oPermission.permissionId;
                    if (i > 0) {
                        sPermission += ', ';
                    }
                    sPermission += permissionId;
                });
                dPermissions.html(sPermission).mTextShorter(textShorterOpt);
            })();
        });
        return dRoleListTable;
    })();
    (function dPagination() {
        var dPagination = self.find('#pagination');
        var startPage = oRoleList.currentPageNumber;
        var pageSize = oRoleList.pageSize;
        var totalCount = oRoleList.totalCount;
        var totalPage = oRoleList.totalPages;
        var opt = {
            startPage: startPage,
            pageSize: pageSize,
            totalCount: totalCount,
            totalPage: totalPage,
            clickFn: function (page, pageSize) {
                $.pRoleListOpt.startPage = page;
                $.pRoleListOpt.pageSize = pageSize;
                $.lCookie.set(pageSizeName, pageSize);
                self.pRoleList();
            }
        };
        dPagination = dPagination.mPagination(opt);
        return dPagination;
    })();
    return self;
};