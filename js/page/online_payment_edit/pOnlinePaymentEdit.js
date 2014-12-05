$.fn.pOnlinePaymentEdit = function (pageOpt) {
    var self = this;
    (function dValidatePwdDiv() {
        var dValidatePwdDiv = self.find('#validatePwdDiv');
        var authPwd = function () {
            var pwd = dValidatePwd.val();
            var opt = {
                pwd: pwd
            };
            $.ajax.main.authPwdAJ(opt, function (res) {
                $.lAjax.parseRes(res, function () {
                    dValidatePwdDiv.hide();
                    dOnlinePaymentEditDiv.fadeIn();
                    $.mFancybox.update();
                }, function (result) {
                    var code = result.code;
                    var msg = $.lLang.parseLanPath('pOnlinePaymentEdit.resMsg.' + code);
                    if (msg) {
                        $.mNtfc.afterTo(msg, dValidatePwd, 'wng');
                        return false;
                    }
                    return true;
                });
            });
        };
        var dValidatePwd = (function () {
            var dValidatePwd = dValidatePwdDiv.find('#validatePwd');
            dValidatePwd.onPressEnter(function () {
                authPwd();
            });
            return dValidatePwd;
        })();
        (function dValidatePwdBtn() {
            var dValidatePwdBtn = dValidatePwdDiv.find('#validatePwdBtn');
            dValidatePwdBtn.mBtn('submit', function () {
                authPwd();
            });
        })();
        $.lForm.clean(dValidatePwdDiv);
        return dValidatePwdDiv.show();
    })();
    var dOnlinePaymentEditDiv = (function () {
        var dOnlinePaymentEditDiv = self.find('#onlinePaymentEditDiv');
        var merchantTransactionId = pageOpt.merchantTransactionId;
        var inputOpt = {
            forceUpper: true,
            allow: ''
        };
        var setAuthorizeMode = function () {
            dCheckBtn.disable();
            dPaymentStatusEditorInpDiv.show();
        };
        var setCancelMode = function () {
            dCheckBtn.enable();
            dPaymentStatusEditorInpDiv.hide();
        };
        var setDefaultMode = function () {
            dOnlinePaymentEditDiv.removeCheckerClass();
            dPaymentStatusSelect.enable();
            dAuthorizationCode.val('').enable();
            dAccountNo.val('').enable();
            dRemark.val('').enable();
            dCheckBtn.show();
            dSubmitBtn.hide();
            checkAuthorizeInp();
        };
        var setConfirmMode = function () {
            dOnlinePaymentEditDiv.removeCheckerClass();
            dPaymentStatusSelect.disable();
            dAuthorizationCode.disable();
            dAccountNo.disable();
            dRemark.disable();
            dCheckBtn.hide();
            dSubmitBtn.show();
        };
        var checkAuthorizeInp = function () {
            var orderStatus = dPaymentStatusSelect.val();
            var authorizationCode = dAuthorizationCode.val();
            var accountNo = dAccountNo.val();
            if (orderStatus === 'Cancel' || (authorizationCode && accountNo)) {
                dCheckBtn.enable();
            }
            else {
                dCheckBtn.disable();
            }
        };
        var dPaymentStatusSelect = (function () {
            var dPaymentStatusSelect = dOnlinePaymentEditDiv.find('#paymentStatusSelect');
            var authorizeLangPath = 'common.Authorize';
            var cancelLangPath = 'common.Cancel';
            var oaPaymentStatus = [
                { name: $.lDom.createLangSpan(authorizeLangPath), val: 'Authorize'},
                { name: $.lDom.createLangSpan(cancelLangPath), val: 'Cancel'}
            ];
            dPaymentStatusSelect
                .mSelect(oaPaymentStatus)
                .action('change.pOnlinePaymentEdit', function () {
                    var selectedStatus = dPaymentStatusSelect.val();
                    setDefaultMode();
                    if (selectedStatus === 'Authorize') {
                        setAuthorizeMode();
                    }
                    else if (selectedStatus === 'Cancel') {
                        setCancelMode();
                    }
                });
            return dPaymentStatusSelect;
        })();
        var dAuthorizationCode = (function () {
            var dAuthorizationCode = dOnlinePaymentEditDiv.find('#authorizationCode');
            dAuthorizationCode
                .mInputRestrict('basic', inputOpt)
                .action('keyup.pOnlinePaymentEdit', function () {
                    checkAuthorizeInp();
                });
            return dAuthorizationCode;
        })();
        var dAccountNo = (function () {
            var dAccountNo = dOnlinePaymentEditDiv.find('#accountNo');
            dAccountNo
                .mInputRestrict('basic', inputOpt)
                .action('keyup.pOnlinePaymentEdit', function () {
                    checkAuthorizeInp();
                });
            return dAccountNo;
        })();
        var dRemark = (function () {
            return dOnlinePaymentEditDiv.find('#remark');
        })();
        var dCheckBtn = (function () {
            var dCheckBtn = dOnlinePaymentEditDiv.find('#checkBtn');
            dCheckBtn.mBtn('confirm', function () {
                var pass = dOnlinePaymentEditDiv.checkForm();
                if (!pass) {
                    return;
                }
                setConfirmMode();
            });
            return dCheckBtn;
        })();
        var dSubmitBtn = (function () {
            var dSubmitBtn = dOnlinePaymentEditDiv.find('#submitBtn');
            dSubmitBtn.mBtn('submit', function () {
                // get result after dCreditCardPaymentEditDiv.checkForm() by dCheckBtn
                var checkerResult = dOnlinePaymentEditDiv.mFormCheckerPass;
                if (!checkerResult) {
                    dSubmitBtn.confirm = false;
                    return;
                }
                var selectedStatus = dPaymentStatusSelect.val();
                var remark = dRemark.val();
                var opt = {
                    merchantTransactionId: merchantTransactionId,
                    remark: remark
                };
                var successCb = pageOpt.successCb;
                var errorCb = pageOpt.errorCb;
                if (selectedStatus === 'Cancel') {
                    $.ajax.payment.cancelCreditCardPaymentInstructionAJ(opt, function (res) {
                        $.mNtfc.showMsgAftUpdate(res, successCb, errorCb);
                    });
                }
                else if (selectedStatus === 'Authorize') {
                    opt.authorizationCode = dAuthorizationCode.val();
                    opt.accountNo = dAccountNo.val();
                    $.ajax.payment.authorizeCreditCardPaymentInstructionAJ(opt, function (res) {
                        $.mNtfc.showMsgAftUpdate(res, successCb, errorCb);
                    });
                }
                $.mFancybox.close();
            });
            return dSubmitBtn;
        })();
        (function dCancelBtn() {
            var dCancelBtn = dOnlinePaymentEditDiv.find('#cancelBtn');
            dCancelBtn.mBtn('cancel', function () {
                if (dSubmitBtn.isVisible()) {
                    setDefaultMode();
                    return;
                }
                $.mFancybox.close();
            });
            return dCancelBtn;
        })();
        var dPaymentStatusEditorInpDiv = (function () {
            return  dOnlinePaymentEditDiv.find('.paymentStatusEditorInpDiv');
        })();
        (function createChecker() {
            dOnlinePaymentEditDiv.mFormChecker();
            dOnlinePaymentEditDiv.addMinLength([
                dAccountNo
            ], 10);
            dOnlinePaymentEditDiv.addMinLength([
                dAuthorizationCode
            ], 6);
        })();
        setDefaultMode();
        setAuthorizeMode();
        return dOnlinePaymentEditDiv.hide();
    })();
    $.lModel.mapDom(pageOpt, self);
    self.showOnlinePaymentEdit = function () {
        $.mFancybox.open(self);
    };
    return self;
};