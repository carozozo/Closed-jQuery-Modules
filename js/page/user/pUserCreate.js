$.fn.pUserCreate = function () {
    var self = this;
    if (!$.lUtil.goIndexIfAuthPmsFailed('userCreatePms')) {
        return self;
    }
    var cleanForm = function () {
        $.lForm.clean(dForm);
        dForm.removeCheckerClass();
    };
    var dForm = (function () {
        var dForm = self.find('form');
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
        (function dSubmitBtn() {
            var dSubmitBtn = dForm.find('#submitBtn');
            dSubmitBtn.mBtn('submit', function () {
                var pass = dForm.checkForm();
                if (!pass) {
                    return;
                }
                var mUserCreate = $.lForm.coverToModel(dForm);
                $.ajax.user.createUserAJ(mUserCreate, function (res) {
                    $.mNtfc.showMsgAftCreate(res, function () {
                        cleanForm();
                    }, function err(result) {
                        var msg = $.lLang.parseLanPath('pUser.create.resMsg.' + result);
                        if (msg) {
                            $.mNtfc.show(msg, 'wng');
                            return false;
                        }
                        return true;
                    });
                });
            });
            return dSubmitBtn;
        })();
        (function dCleanBtn() {
            var dCleanBtn = dForm.find('#cleanBtn');
            dCleanBtn.mBtn('clean', function () {
                cleanForm();
            });
            return dCleanBtn;
        })();
        (function dReturnBtn() {
            var dReturnBtn = dForm.find('#returnBtn');
            dReturnBtn.mBtn('return', function () {
                $.lUtil.goPage($.pUser.userListPath);
            });
            return dReturnBtn;
        })();

        dForm = dForm.mFormChecker();
        dForm.addRequired([dUserName, dPwd, dDisplayName]);
        dForm.addMinLength(dPwd, 8);
        dForm.addEmail(dEmail);
        dForm.addEqual(dCheckPwd, dPwd, function () {
            return  $.lLang.parseLanPath('common.Password');
        });
        // build the select-DOM
        $.pUser.bdRoleListSelect(dForm);
        return dForm;
    })();
    return self;
};