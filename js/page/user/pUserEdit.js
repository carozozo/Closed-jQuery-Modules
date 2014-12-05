$.fn.pUserEdit = function (pageOpt) {
    var self = this;
    var uid = pageOpt.uid;
    var oUser = null;
    if (!$.lUtil.goIndexIfAuthPmsFailed('userUpdatePms')) {
        return self;
    }

    $.ajax.user.getUserByIdAJ(uid, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oUser = $.lObj.cloneObj(result);
        })
    });
    if (!oUser) {
        return self;
    }
    oUser = tmd.pUser(oUser);
    $.lConsole.log('oUser=', oUser);
    var setForm = function setForm() {
        // after createChecker dForm has mFormChecker-mFormChecker
        dForm.removeCheckerClass();
        $.lForm.clean(dForm);
        // auto mapping the value to form-Dom
        $.lModel.mapDom(oUser, dForm);
    };
    var dForm = (function () {
        var dForm = self.find('form');
        var dUid = (function () {
            var dUid = dForm.find('#uid');
            return dUid;
        })();
        var dUserName = (function () {
            var dUserName = dForm.find('#userName');
            dUserName
                .mInputRestrict()
                .focus();
            return dUserName;
        })();
        var dPwd = (function () {
            var dPwd = dForm.find('#pwd');
            dPwd.mInputRestrict('textNum');
            return dPwd;
        })();
        var dCheckPwd = (function () {
            var dCheckPwd = dForm.find('#checkPwd');
            dCheckPwd.mInputRestrict();
            return dCheckPwd;
        })();
        var dEmail = (function () {
            var dEmail = dForm.find('#email');
            dEmail.mInputRestrict('email');
            return dEmail;
        })();
        var dDisplayName = (function () {
            var dDisplayName = dForm.find('#displayName');
            dDisplayName.mInputRestrict('textNum', {
                allow: '.'
            });
            return dDisplayName;
        })();
        var dRoleId = (function () {
            var dRoleId = dForm.find('#roleId');
            return dRoleId;
        })();
        var dStatus = (function () {
            var dStatus = dForm.find('#status');
            return dStatus;
        })();
        (function dSubmitBtn() {
            var dSubmitBtn = dForm.find('#submitBtn');
            dSubmitBtn.mBtn('submit', function () {
                var pass = dForm.checkForm();
                if (!pass) {
                    return;
                }
                var mUserEdit = $.lObj.cloneObj(oUser);
                mUserEdit.pwd = null;
                dForm.mapModel(mUserEdit, function () {
                    $.ajax.user.updateUserAJ(mUserEdit, function (res) {
                        $.mNtfc.showMsgAftUpdate(res, function () {
                            $.lUtil.goPage($.pUser.userListPath);
                        }, function err(result) {
                            var msg = $.lLang.parseLanPath('pUser.edit.resMsg.' + result);
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
                $.lUtil.goPage($.pUser.userListPath);
            });
            return dReturnBtn;
        })();

        dForm = dForm.mFormChecker();
        dForm.addRequired([dUid, dUserName, dDisplayName, dRoleId, dStatus]);
        dForm.addMinLength(dPwd, 8);
        dForm.addEmail(dEmail);
        dForm.addEqual(dCheckPwd, dPwd, function () {
            return  $.lLang.parseLanPath('pUser.edit.ChangePwd');
        });
        // build the select-DOM
        $.pUser.bdRoleListSelect(dForm);
        return dForm;
    })();
    setForm();
    return self;
};