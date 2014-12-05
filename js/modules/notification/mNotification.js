/**
 * The notification module
 * v2.0
 * @author Caro.Huang
 */

$.mNtfc = (function () {
    var self = {};
    var defStatus = 'info';
    var defDelay = 2000;

    /**
     * notification msg box
     * @param msg
     * @param status
     * @returns {*|jQuery}
     */
    var dNtfcBoxFn = function (msg, status) {
        var dNtfcBox = $('<div/>')
        var msgDiv = $('<div/>').lClass('mNtfcMsg');
        var statusClass = 'alert-info';
        dNtfcBox
            .append(msgDiv)
            .setIndexZ()
            .lClass('text-center mNtfcBox alert')
            .css({
                // over-write .alert style
                'margin-bottom': 0,
                'width': '100%',
                'opacity': 0.8
            })
            .hide();

        /**
         * set msg to box
         * @param msg
         */
        dNtfcBox.msg = function (msg) {
            msgDiv.html(msg)
        };
        /**
         * set status to box
         * @param status
         */
        dNtfcBox.status = function (status) {
            var oStatus = {suc: 'success', inf: 'info', wng: 'warning', dng: 'danger'};
            if (status && oStatus[status]) {
                statusClass = 'alert-' + oStatus[status];
            }
            dNtfcBox.lClass(statusClass);
        };
        /**
         * set msg/status
         * @param msg
         * @param status
         */
        dNtfcBox.set = function (msg, status) {
            dNtfcBox.msg(msg);
            dNtfcBox.status(status);
        };
        /**
         * show msg box
         * @param iDelay
         */
        dNtfcBox.showNtfcBox = function (iDelay) {
            iDelay = iDelay || 0;
            dNtfcBox.slideDown(function () {
                if (iDelay) {
                    dNtfcBox.delay(iDelay).slideUp(function () {
                        dNtfcBox.remove();
                    });
                }
            });
        };
        /**
         * hide msg box
         * @param iDelay
         */
        dNtfcBox.hideNtfcBox = function (iDelay) {
            iDelay = iDelay || 0;
            dNtfcBox.delay(iDelay).stop().slideUp(function () {
                dNtfcBox.remove();
            });
        };
        dNtfcBox.msgDiv = msgDiv;
        dNtfcBox.set(msg, status);
        return dNtfcBox;
    };

    /**
     * show the notification on window-top
     */
    self.show = function () {
        var msg = arguments[0];
        var status = defStatus;
        var iDelay = defDelay;
        var opt = {};
        var dHeaderBottom = $('#headerBottom');

        $.each(arguments, function (i, eachVar) {
            if (i == 0)
                return;
            if ($.lHelper.isNum(eachVar)) {
                iDelay = eachVar;
            }
            else if ($.lHelper.isStr(eachVar)) {
                status = eachVar;
            }
            else if ($.lHelper.isObj(eachVar)) {
                opt = eachVar;
            }
        });

        if (opt) {
            status = opt.status || status;
            iDelay = (opt.iDelay !== undefined) ? opt.iDelay : iDelay;
        }

        var dNtfcBox = dNtfcBoxFn(msg, status);
        dHeaderBottom.find('.mNtfcBox').remove();
        dHeaderBottom.prepend(dNtfcBox);
        dNtfcBox.showNtfcBox(iDelay);
        return dNtfcBox;
    };

    /**
     * show notification before target
     * @param msg
     * @param target
     * @returns {*|jQuery}
     */
    self.beforeTo = function (msg, target) {
        var status = defStatus;
        var iDelay = defDelay;
        var opt = null;
        $.each(arguments, function (i, eachVar) {
            if (i < 2)
                return;
            if ($.lHelper.isNum(eachVar)) {
                iDelay = eachVar;
            } else if ($.lHelper.isStr(eachVar)) {
                status = eachVar;
            } else if ($.lHelper.isObj(eachVar)) {
                opt = eachVar;
            }
        });

        if (opt) {
            status = opt.status || status;
            iDelay = (opt.iDelay !== undefined) ? opt.iDelay : iDelay;
        }

        var dNtfcBox = dNtfcBoxFn(msg, status);
        target.prevAll('.mNtfcBox').remove();
        target.before(dNtfcBox);
        // replace the origin .alert style
        dNtfcBox.css('padding', '5');
        dNtfcBox.showNtfcBox(iDelay);
        return dNtfcBox;
    };

    /**
     * show notification after target
     * @param msg
     * @param target
     * @returns {*|jQuery}
     */
    self.afterTo = function (msg, target) {
        var status = defStatus;
        var iDelay = defDelay;
        var opt = null;
        $.each(arguments, function (i, eachVar) {
            if (i < 2)
                return;
            if ($.lHelper.isNum(eachVar)) {
                iDelay = eachVar;
            } else if ($.lHelper.isStr(eachVar)) {
                status = eachVar;
            } else if ($.lHelper.isObj(eachVar)) {
                opt = eachVar;
            }
        });

        if (opt) {
            status = opt.status || status;
            iDelay = (opt.iDelay !== undefined) ? opt.iDelay : iDelay;
        }

        var dNtfcBox = dNtfcBoxFn(msg, status);
        target.nextAll('.mNtfcBox').remove();
        target.after(dNtfcBox);
        // replace the origin .alert style
        dNtfcBox.css('padding', '5');
        dNtfcBox.showNtfcBox(iDelay);
        return dNtfcBox;
    };

    /**
     * convenient show msg for create
     * will not show msg, if callback-fn return false
     * @param res
     * @param [sucCb]
     * @param [errCb]
     */
    self.showMsgAftCreate = function (res, sucCb, errCb) {
        var successMsg = $.lLang.parseLanPath('common.CreateSuccess');
        var errorMsg = $.lLang.parseLanPath('common.CreateFail');
        $.lAjax.parseRes(res, function (result) {
            if (sucCb && sucCb(result) === false) {
                return;
            }
            self.show(successMsg, 'suc');
        }, function (result) {
            $.lConsole.log('$.mNtfc.showMsgAftCreate get error:', result);
            if (errCb && errCb(result) === false) {
                return;
            }
            self.show(errorMsg, 'wng');
        });
    };

    /**
     * convenient show msg for update
     * will not show msg, if callback-fn return false
     * @param res
     * @param [sucCb]
     * @param [errCb]
     */
    self.showMsgAftUpdate = function (res, sucCb, errCb) {
        var successMsg = $.lLang.parseLanPath('common.UpdateSuccess');
        var errorMsg = $.lLang.parseLanPath('common.UpdateFail');
        $.lAjax.parseRes(res, function (result) {
            if (sucCb && sucCb(result) === false) {
                return;
            }
            self.show(successMsg, 'suc');
        }, function (result) {
            $.lConsole.log('$.mNtfc.showMsgAftUpdate get error:', result);
            if (errCb && errCb(result) === false) {
                return;
            }
            self.show(errorMsg, 'wng');
        });
    };

    /**
     * convenient show msg for delete
     * will not show msg, if callback-fn return false
     * @param res
     * @param [sucCb]
     * @param [errCb]
     */
    self.showMsgAftDelete = function (res, sucCb, errCb) {
        var successMsg = $.lLang.parseLanPath('common.DeleteSuccess');
        var errorMsg = $.lLang.parseLanPath('common.DeleteFail');
        $.lAjax.parseRes(res, function (result) {
            if (sucCb && sucCb(result) === false) {
                return;
            }
            self.show(successMsg, 'suc');
        }, function (result) {
            $.lConsole.log('$.mNtfc.showMsgAftDelete get error:', result);
            if (errCb && errCb(result) === false) {
                return;
            }
            self.show(errorMsg, 'wng');
        });
    };

    /**
     * convenient show 'Sending Data' msg
     * @param [opt]
     */
    self.showSendingMsg = function (opt) {
        var langPath = 'common.SendingData';
        var lang = $.lLang.parseLanPath(langPath);
        self.show(lang, opt);
    };

    return self;
})();