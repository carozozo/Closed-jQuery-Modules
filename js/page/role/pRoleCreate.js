$.fn.pRoleCreate = function () {
    var self = this;
    if (!$.lUtil.goIndexIfAuthPmsFailed('roleCreatePms')) {
        return self;
    }
    var cleanForm = function () {
        $.lForm.clean(dForm);
        dForm.dPermissionListSelect.deselectAll();
        dForm.removeCheckerClass();
    };
    var dForm = (function () {
        var dForm = self.find('form');
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
                var mRoleCreate = $.lForm.coverToModel(dForm);
                $.ajax.role.createRoleAJ(mRoleCreate, function (res) {
                    $.mNtfc.showMsgAftCreate(res, function () {
                        cleanForm();
                    }, function err(result) {
                        var msg = $.lLang.parseLanPath('pRole.create.resMsg.' + result);
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
                $.lUtil.goPage($.pRole.roleListPath);
            });
            return dReturnBtn;
        })();
        dForm = dForm.mFormChecker();
        dForm.addRequired([dName, dDescription]);
        // build permission list select-DOM
        $.pRole.bdPermissionListSelect(dForm);
        return dForm;
    })();
    return self;
};