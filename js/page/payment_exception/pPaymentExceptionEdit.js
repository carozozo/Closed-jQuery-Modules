$.fn.pPaymentExceptionEdit = function (pageOpt) {
    var self = this;
    var dRemark = (function () {
        return self.find('#remark');
    })();
    var setDefaultMode = function () {
        dRemark.enable();
        dPaymentExceptionCheckBtn.show();
        dPaymentExceptionSubmitBtn.hide();
    };
    var setConfirmMode = function () {
        dRemark.disable();
        dPaymentExceptionCheckBtn.hide();
        dPaymentExceptionSubmitBtn.show();
    };
    var setDefault = function () {
        self.removeCheckerClass();
        $.lForm.clean(self);
        setDefaultMode();
    };
    var dPaymentExceptionCheckBtn = (function () {
        var dPaymentExceptionCheckBtn = self.find('#paymentExceptionCheckBtn');
        dPaymentExceptionCheckBtn.mBtn('confirm', function () {
            var pass = self.checkForm();
            if (!pass) {
                return;
            }
            setConfirmMode();
        });
        return dPaymentExceptionCheckBtn;
    })();
    var dPaymentExceptionSubmitBtn = (function () {
        var dPaymentExceptionSubmitBtn = self.find('#paymentExceptionSubmitBtn');
        dPaymentExceptionSubmitBtn.mBtn('submit', function () {
            self.mapModel(pageOpt);
            var successCb = pageOpt.successCb;
            var errorCb = pageOpt.errorCb;
            $.ajax.paymentException.updateExceptionTransactionAJ(pageOpt, function (res) {
                $.mNtfc.showMsgAftUpdate(res, successCb, errorCb);
                $.mFancybox.close();
            });
        });
        return dPaymentExceptionSubmitBtn.hide();
    })();
    (function dPaymentExceptionCancelBtn() {
        var dPaymentExceptionCancelBtn = self.find('#paymentExceptionCancelBtn');
        dPaymentExceptionCancelBtn.mBtn('cancel', function () {
            if (dPaymentExceptionSubmitBtn.isVisible()) {
                setDefaultMode();
                return;
            }
            $.mFancybox.close();
        });
        return dPaymentExceptionCancelBtn;
    })();
    (function setFormChecker() {
        self.mFormChecker();
        self.addRequired([dRemark]);
    })();
    self.setDefault = setDefault;
    self.showPaymentExceptionEdit = function () {
        setDefault();
        $.mFancybox.open(self);
    };
    return self.show();
};