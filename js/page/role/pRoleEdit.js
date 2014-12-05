$.fn.pRoleEdit = function (pageOpt) {
    var self = this;
    var roleId = pageOpt.roleId;
    var oRole = null;
    if (!$.lUtil.goIndexIfAuthPmsFailed('roleUpdatePms')) {
        return self;
    }
    $.ajax.role.getRoleByIdAJ(roleId, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oRole = $.lObj.cloneObj(result);
        })
    });
    if (!oRole) {
        return self;
    }
    oRole = tmd.pRole(oRole);
    $.lConsole.log('oRole=', oRole);
    var setForm = function () {
        dForm.removeCheckerClass();
        $.lModel.mapDom(oRole, dForm);
        // set the permissionIdList to select-DOM
        var aPermissionId = [];
        $.each(oRole.permissionList, function (i, oPermission) {
            var permissionId = oPermission.permissionId;
            aPermissionId.push(permissionId);
        });
        dForm.dPermissionListSelect.val(aPermissionId);
    };
    var dForm = (function () {
        var dForm = self.find('form');
        var dRoleId = (function () {
            var dRoleId = dForm.find('#roleId');
            return dRoleId;
        })();
        var dName = (function () {
            var dName = dForm.find('#name');
            dName
                .mInputRestrict({allowSpace: true})
                .focus();
            return dName;
        })();
        var dDescription = (function () {
            var dDescription = dForm.find('#description');
            return dDescription;
        })();
        (function dSubmitBtn() {
            var dSubmitBtn = dForm.find('#submitBtn');
            dSubmitBtn.mBtn('submit', function () {
                var pass = dForm.checkForm();
                if (!pass) {
                    return;
                }
                var mRoleUpdate = $.lObj.cloneObj(oRole);
                dForm.mapModel(mRoleUpdate, function () {
                    $.ajax.role.updateRoleAJ(mRoleUpdate, function (res) {
                        $.mNtfc.showMsgAftUpdate(res, function () {
                            $.lUtil.goPage($.pRole.roleListPath);
                        }, function err(result) {
                            var msg = $.lLang.parseLanPath('pRole.edit.resMsg.' + result);
                            if (msg) {
                                $.mNtfc.show(msg, 'wng');
                                return false;
                            }
                            return true;
                        });
                    });
                });
            });
            return dSubmitBtn;
        })();
        (function dRevertBtn() {
            var dRevertBtn = dForm.find('#revertBtn');
            dRevertBtn.mBtn('revert', setForm);
            return dRevertBtn;
        })();
        (function dReturnBtn() {
            var dReturnBtn = dForm.find('#returnBtn');
            dReturnBtn.mBtn('return', function () {
                $.lUtil.goPage($.pRole.roleListPath);
            });
            return dReturnBtn;
        })();
        dForm = dForm.mFormChecker();
        dForm.addRequired([dRoleId, dName, dDescription]);
        // build permission list select-DOM, and set to dForm.dPermissionListSelect
        $.pRole.bdPermissionListSelect(dForm);
        return dForm;
    })();
    setForm();
    return self;
};