$.fn.pOrderFollowUp = function (oOrderFollowUp) {
    var self = this;
    oOrderFollowUp = tmd.pOrderFollowUp(oOrderFollowUp);
    var setBtnAction = function (dBtn, key) {
        dBtn.mConfirmBox({
            bottomAlign: 'center',
            boxMsg: function () {
                var langPath = 'pOrder.followUp.confirmContentFn';
                var langFn = $.lLang.parseLanPath(langPath);
                return langFn(key);
            },
            btnYesFn: function () {
                oOrderFollowUp[key] = !oOrderFollowUp[key];
                updateFollowUp(function (result) {
                    createServiceLog(key);
                    setBtnByStatus(dBtn, result[key]);
                });
            }
        });
    };
    var createServiceLog = function (key) {
        oOrderFollowUp.type = 'orderFollowUp';
        oOrderFollowUp.memo = '[Follow-Up] Change ' + key.toUpperCase() + ' to ' + oOrderFollowUp[key];
        var mOrderServiceLogCreate = tmd.pOrderServiceLogCreate(oOrderFollowUp);
        $.ajax.orderServiceLog.createOrderServiceLogAJ(mOrderServiceLogCreate, function (res) {
        });
    };
    var setBtnByStatus = function (dBtn, status) {
        dBtn.lClass('btn');
        if (status) {
            dBtn.lClass('btn-warning');
            dBtn.removeClass('btn-default');
        } else {
            dBtn.removeClass('btn-warning');
            dBtn.lClass('btn-default');
        }
    };
    var updateFollowUp = function (cb) {
        $.ajax.orderFollowUp.updateOrderFollowUpAsyncAJ(oOrderFollowUp, function (res) {
            $.lAjax.parseRes(res, function (result) {
                cb(result);
            });
        });
    };
    (function dHdeskBtn() {
        var dHdeskBtn = self.find('#hdeskBtn');
        setBtnByStatus(dHdeskBtn, oOrderFollowUp.hdesk);
        setBtnAction(dHdeskBtn, 'hdesk');
        return dHdeskBtn;
    })();
    (function dOpsBtn() {
        var dOpsBtn = self.find('#opsBtn');
        setBtnByStatus(dOpsBtn, oOrderFollowUp.ops);
        setBtnAction(dOpsBtn, 'ops');
        return dOpsBtn;
    })();
    (function dFinBtn() {
        var dFinBtn = self.find('#finBtn');
        setBtnByStatus(dFinBtn, oOrderFollowUp.fin);
        setBtnAction(dFinBtn, 'fin');
        return dFinBtn;
    })();
    (function dRmBtn() {
        var dRmBtn = self.find('#rmBtn');
        setBtnByStatus(dRmBtn, oOrderFollowUp.rm);
        setBtnAction(dRmBtn, 'rm');
        return dRmBtn;
    })();
    (function setStyle() {
        self.lClass('basic-block').css({
            'background-color': $.lColorStyle.getColor('gray')
        });
    }());
    return self;
};