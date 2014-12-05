$.fn.pCreditCardPaymentEdit = function (pageOpt) {
    var self = this;
    (function dValidatePwdDiv() {
        var dValidatePwdDiv = self.find('#validatePwdDiv');
        var getCreditCardNo = function () {
            var validatePwd = dValidatePwd.val();
            if (!validatePwd) {
                return;
            }
            var merchantTransactionId = pageOpt.merchantTransactionId;
            var opt = {
                merchantTransactionIds: merchantTransactionId,
                validatePwd: validatePwd
            };
            $.ajax.payment.getCreditCardNoByMerchantTranxIdAJ(opt, function (res) {
                $.lAjax.parseRes(res, function (result) {
                    dValidatePwdDiv.hide();
                    dCreditCardPaymentEditDiv.find('#accountNo').html(result);
                    dCreditCardPaymentEditDiv.fadeIn();
                    $.mFancybox.update();
                }, function (result) {
                    var code = result.code;
                    var msg = $.lLang.parseLanPath('pCreditCardPaymentEdit.resMsg.' + code);
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
                getCreditCardNo();
            });
            return dValidatePwd;
        })();
        (function dValidatePwdBtn() {
            var dValidatePwdBtn = dValidatePwdDiv.find('#validatePwdBtn');
            dValidatePwdBtn.mBtn('submit', function () {
                getCreditCardNo();
            });
            return dValidatePwdBtn;
        })();
        $.lForm.clean(dValidatePwdDiv);
        return dValidatePwdDiv.show();
    })();
    var dCreditCardPaymentEditDiv = (function () {
        var dCreditCardPaymentEditDiv = self.find('#creditCardPaymentEditDiv');
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
            dCreditCardPaymentEditDiv.removeCheckerClass();
            dPaymentStatusSelect.enable();
            dAuthorizationCode.val('').enable();
            dTraceNo.val('').enable();
            dRemark.val('').enable();
            dCheckBtn.show();
            dSubmitBtn.hide();
            checkAuthorizeInp();
        };
        var setConfirmMode = function () {
            dCreditCardPaymentEditDiv.removeCheckerClass();
            dPaymentStatusSelect.disable();
            dAuthorizationCode.disable();
            dTraceNo.disable();
            dRemark.disable();
            dCheckBtn.hide();
            dSubmitBtn.show();
        };
        var checkAuthorizeInp = function () {
            var orderStatus = dPaymentStatusSelect.val();
            var authorizationCode = dAuthorizationCode.val();
            var traceNo = dTraceNo.val();
            if (orderStatus === 'Cancel' || (authorizationCode && traceNo)) {
                dCheckBtn.enable();
            }
            else {
                dCheckBtn.disable();
            }
        };
        var dPaymentStatusSelect = (function () {
            var dPaymentStatusSelect = dCreditCardPaymentEditDiv.find('#paymentStatusSelect');
            var authorizeLangPath = 'common.Authorize';
            var cancelLangPath = 'common.Cancel';
            var oaOrderStatus = [
                { name: $.lDom.createLangSpan(authorizeLangPath), val: 'Authorize'},
                { name: $.lDom.createLangSpan(cancelLangPath), val: 'Cancel'}
            ];
            dPaymentStatusSelect
                .mSelect(oaOrderStatus)
                .action('change.pCreditCardPaymentEdit', function () {
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
            var dAuthorizationCode = dCreditCardPaymentEditDiv.find('#authorizationCode');
            dAuthorizationCode
                .mInputRestrict('basic', inputOpt)
                .action('keyup.pCreditCardPaymentEdit', function () {
                    checkAuthorizeInp();
                });
            return dAuthorizationCode;
        })();
        var dTraceNo = (function () {
            var dTraceNo = dCreditCardPaymentEditDiv.find('#traceNo');
            dTraceNo
                .mInputRestrict('basic', inputOpt)
                .action('keyup.pCreditCardPaymentEdit', function () {
                    checkAuthorizeInp();
                });
            return dTraceNo;
        })();
        var dRemark = (function () {
            return dCreditCardPaymentEditDiv.find('#remark');
        })();
        var dCheckBtn = (function () {
            var dCheckBtn = dCreditCardPaymentEditDiv.find('#checkBtn');
            dCheckBtn.mBtn('confirm', function () {
                var pass = dCreditCardPaymentEditDiv.checkForm();
                if (!pass) {
                    return;
                }
                setConfirmMode();
            });
            return dCheckBtn;
        })();
        var dSubmitBtn = (function () {
            var dSubmitBtn = dCreditCardPaymentEditDiv.find('#submitBtn');
            dSubmitBtn.mBtn('submit', function () {
                // get result after dCreditCardPaymentEditDiv.checkForm() by dCheckBtn
                var checkerResult = dCreditCardPaymentEditDiv.mFormCheckerPass;
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
                    opt.traceNo = dTraceNo.val();
                    $.ajax.payment.authorizeCreditCardPaymentInstructionAJ(opt, function (res) {
                        $.mNtfc.showMsgAftUpdate(res, successCb, errorCb);
                    });
                }
                $.mFancybox.close();
            });
            return dSubmitBtn;
        })();
        (function dCancelBtn() {
            var dCancelBtn = dCreditCardPaymentEditDiv.find('#cancelBtn');
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
            return  dCreditCardPaymentEditDiv.find('.paymentStatusEditorInpDiv');
        })();
        (function createChecker() {
            dCreditCardPaymentEditDiv.mFormChecker();
            dCreditCardPaymentEditDiv.addMinLength([
                dAuthorizationCode,
                dTraceNo
            ], 6);
        })();
        setDefaultMode();
        setAuthorizeMode();
        return dCreditCardPaymentEditDiv.hide();
    })();
    $.lModel.mapDom(pageOpt, self);
    self.showCreditCardPaymentEdit = function () {
        $.mFancybox.open(self);
    };
    return self;
};