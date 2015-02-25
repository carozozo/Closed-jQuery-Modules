/**
 * The confirm-box module
 * v2.1
 * @author Caro.Huang
 */


/**
 * create a confirm-box for DOM, this is basic from [3rd-party jquery.fancybox]
 * please reference [http://fancyapps.com/fancybox/]
 * the variable [opt] also support fancybox if opt.showInWindow = true
 *
 * OPT
 * showInWindow: bool (default: true) - if show confirm-box with fancybox
 * hideSelf - bool (default: true) - if hide-self when box-showing
 * boxTitle: str/fn (default: '')
 * boxMsg: str/fn (default: '')
 * fontSizeTop: int (default: 3) - title size by bootstrap <h> 1~6
 * fontSizeMain: int (default: 4) - msg size by bootstrap <h> 1~6
 * fontSizeBottom: int (default: 4) - msg size by bootstrap <h> 1~6
 * topAlign: right/center/left (default: 'left') - the text-align of Top
 * mainAlign: right/center/left (default: 'left') - the text-align of Main
 * bottomAlign: right/center/left (default: 'right') - the text-align of Bottom
 * btnYes: bool (default: true) - if set confirm-btn
 * btnNo: bool (default: true) - if set cancel-btn
 * btnYesMsg: str (default: '') - set custom-msg in confirm-btn
 * btnNoMsg: str (default: '') - set custom-msg in cancel-btn
 * btnYesFn: fn (default: null) - set click-Fn for confirm-btn, won't close box if return false
 * btnNoFn: fn (default: null) - set click-Fn for cancel-btn, won't close box if return false
 * target: DOM/str (default: self-DOM) - the confirm-box will append-after to target
 * boxStyle: obj (default: {}) - the css of conform box
 *
 * Callback-OPT
 * onBoxReady: fn (default: null) - fn before after box setting ready
 * befShowBox: fn (default: null) - fn before show box, will cancel if fn return false
 * aftShowBox: fn (default: null) - fn after show box
 * befHideBox: fn (default: null) - fn before hide box, will cancel if fn return false
 * aftHideBox: fn (default: null) - fn after hide box
 *
 * DOM
 * confirmBox
 * dConfirmTop
 * dConfirmMain
 * dConfirmBottom
 * dConfirmTitle
 * dConfirmMsg
 * dConfirmBtnYes
 * dConfirmBtnNo
 *
 * FN
 * showBox - show confirm box
 * hideBox - hide confirm box
 *
 * @param [opt]
 */
$.fn.mConfirmBox = function (opt) {
    var self = this;
    var selfId = 'mConfirmBox';
    var aAlign = ['right', 'center', 'left'];
    var showInWindow = true;
    var showTopLine = true;
    var hideSelf = true;
    var boxTitle = '';
    var boxMsg = '';
    var fontSizeTop = 3;
    var fontSizeMain = 4;
    var fontSizeBottom = 4;
    var topAlign = aAlign[2];
    var mainAlign = aAlign[2];
    var bottomAlign = aAlign[0];
    var btnYes = true;
    var btnNo = true;
    var btnYesMsg = '';
    var btnNoMsg = '';
    var btnYesFn = null;
    var btnNoFn = null;
    var target = self;
    var boxStyle = {};
    var fancyBoxOpt = {};
    // callback fn
    var onBoxReady = null;
    var befShowBox = null;
    var aftShowBox = null;
    var befHideBox = null;
    var aftHideBox = null;
    if (opt) {
        showInWindow = opt.showInWindow !== false;
        showTopLine = opt.showTopLine !== false;
        hideSelf = opt.hideSelf !== false;
        boxTitle = opt.boxTitle || boxTitle;
        fontSizeTop = opt.fontSizeTop || fontSizeTop;
        fontSizeMain = opt.fontSizeMain || fontSizeMain;
        fontSizeBottom = opt.fontSizeBottom || fontSizeBottom;
        boxMsg = opt.boxMsg || boxMsg;
        topAlign = (aAlign.indexOf(opt.topAlign) > -1) ? opt.topAlign : topAlign;
        mainAlign = (aAlign.indexOf(opt.mainAlign) > -1) ? opt.mainAlign : mainAlign;
        bottomAlign = (aAlign.indexOf(opt.bottomAlign) > -1) ? opt.bottomAlign : bottomAlign;
        btnYes = opt.btnYes !== false;
        btnNo = opt.btnNo !== false;
        btnYesMsg = opt.btnYesMsg || btnYesMsg;
        btnNoMsg = opt.btnNoMsg || btnNoMsg;
        btnYesFn = opt.btnYesFn || btnYesFn;
        btnNoFn = opt.btnNoFn || btnNoFn;
        target = opt.target || target;
        boxStyle = opt.boxStyle || boxStyle;
        onBoxReady = opt.onBoxReady || onBoxReady;
        befShowBox = opt.befShowBox || befShowBox;
        aftShowBox = opt.aftShowBox || aftShowBox;
        befHideBox = opt.befHideBox || befHideBox;
        aftHideBox = opt.aftHideBox || aftHideBox;
    }
    var setBox = function () {
        (function setTitle() {
            if (!boxTitle) {
                return;
            }
            var title = $.lHelper.executeIfFn(boxTitle);
            dConfirmTitle.html(title);
            dConfirmTop.append(dConfirmTitle);
        })();
        (function setMsg() {
            if (!boxMsg) {
                return;
            }
            var msg = $.lHelper.executeIfFn(boxMsg);
            dConfirmMsg.html(msg);
            dConfirmMain.append(dConfirmMsg);
        })();
        (function setBtn() {
            if (!btnYes || !btnNo) {
                return;
            }
            if (btnYes) {
                if (btnYesMsg) {
                    btnYesMsg = $.lHelper.executeIfFn(btnYesMsg);
                    dConfirmBtnYes.html(btnYesMsg);
                }
                dConfirmBottom.append(dConfirmBtnYes);
            }
            if (btnNo) {
                if (btnNoMsg) {
                    btnNoMsg = $.lHelper.executeIfFn(btnNoMsg);
                    dConfirmBtnNo.html(btnNoMsg);
                }
                dConfirmBottom.append(dConfirmBtnNo);
            }
        })();
        if (dConfirmTop.isEmpty()) {
            dConfirmTop.hide();
        }
        if (dConfirmMain.isEmpty()) {
            dConfirmMain.hide();
        }
        if (dConfirmBottom.isEmpty()) {
            dConfirmBottom.hide();
        }
    };
    var showBox = function () {
        setBox();
        if (showInWindow) {
            $.mFancybox.open(dConfirmBox);
            return;
        }
        if (befShowBox && befShowBox() === false) {
            return;
        }
        if (hideSelf) {
            self.fadeOut(show);
        } else {
            show();
        }

        function show() {
            target.after(dConfirmBox);
            dConfirmBox.fadeIn(function () {
                aftShowBox && aftShowBox();
            });
        }
    };
    var hideBox = function () {
        if (showInWindow) {
            $.mFancybox.close();
            return;
        }
        if (befHideBox && befHideBox() === false) {
            return;
        }
        dConfirmBox.fadeOut(function () {
            if (aftHideBox && aftHideBox() === false) {
                return;
            }
            self.fadeIn();
        });
    };
    var dBody = $('body');
    var dConfirmBox = (function () {
        if (!this.boxNumber) {
            this.boxNumber = 1;
        } else {
            this.boxNumber++;
        }
        var dConfirmBox = $('<div></div>')
            .lClass(selfId)
            .lId(selfId + this.boxNumber)
            .css({
                'margin': '5px'
            })
            .hide();

        (function setBoxStyle() {
            var boxCss = {
                'min-width': 200
            };
            if (boxStyle) {
                $.extend(boxCss, boxStyle);
            }
            dConfirmBox.css(boxCss);
        })();

        return dConfirmBox;
    })();
    var dConfirmTop = (function () {
        var dConfirmTop = $('<h' + fontSizeTop + '></h' + fontSizeTop + '>')
            .lId(selfId + 'Top')
            .lClass('text-' + topAlign)
            .css({
                'padding': 5,
                'margin-bottom': 10
            });
        if (showTopLine) {
            dConfirmTop.css({
                'border-bottom': '3px solid',
                'border-bottom-color': $.lStyle.getColor('gray', 2)
            });
        }
        return dConfirmTop;
    })();
    var dConfirmMain = (function () {
        return $('<h' + fontSizeMain + '></h' + fontSizeMain + '>')
            .lId(selfId + 'Main')
            .lClass('text-' + mainAlign)
            .css({
                'padding': '5px 0 5px 0'
            });
    })();
    var dConfirmBottom = (function () {
        return $('<h' + fontSizeBottom + '></h' + fontSizeBottom + '>')
            .lId(selfId + 'Bottom')
            .lClass('text-' + bottomAlign)
            .css({
                'padding': '5px 0 5px 0'
            });
    })();
    var dConfirmTitle = (function () {
        return $('<span></span>')
            .lId(selfId + 'Title')
            .lClass('text-success');
    })();
    var dConfirmMsg = (function () {
        return $('<span></span>')
            .lId(selfId + 'Msg')
            .lClass('basic-color-gray');
    })();
    var dConfirmBtnYes = (function () {
        var dConfirmBtnYes = $('<button></button>')
            .lType('button')
            .lClass(selfId + 'Btn')
            .lId(selfId + 'BtnYes');
        dConfirmBtnYes.mBtn('confirm', function () {
            if (btnYesFn && btnYesFn() === false) {
                return;
            }
            hideBox();
        });
        return dConfirmBtnYes;
    })();
    var dConfirmBtnNo = (function () {
        var dConfirmBtnNo = $('<button></button>')
            .lType('button')
            .lClass(selfId + 'Btn')
            .lId(selfId + 'BtnNo');
        dConfirmBtnNo.mBtn('cancel', function () {
            if (btnNoFn && btnNoFn() === false) {
                return;
            }
            hideBox();
        });
        return dConfirmBtnNo;
    })();

    if (showInWindow) {
        if (opt) {
            $.extend(fancyBoxOpt, opt);
        }
        if (befShowBox) {
            fancyBoxOpt.beforeLoad = function () {
                return befShowBox();
            };
        }
        if (aftShowBox) {
            fancyBoxOpt.afterShow = function () {
                aftShowBox();
            };
        }
        if (befHideBox) {
            fancyBoxOpt.beforeClose = function () {
                return befHideBox();
            };
        }
        if (aftHideBox) {
            fancyBoxOpt.afterClose = function () {
                aftHideBox();
            };
        }
    }
    (function setContainer() {
        dConfirmBox
            .append(dConfirmTop)
            .append(dConfirmMain)
            .append(dConfirmBottom);
    })();
    self.action('click.' + selfId, function () {
        showBox();
    });
    dBody.append(dConfirmBox);
    onBoxReady && onBoxReady();

    self.dConfirmBox = dConfirmBox;
    self.dConfirmTop = dConfirmTop;
    self.dConfirmMain = dConfirmMain;
    self.dConfirmBottom = dConfirmBottom;
    self.dConfirmTitle = dConfirmTitle;
    self.dConfirmMsg = dConfirmMsg;
    self.dConfirmBtnYes = dConfirmBtnYes;
    self.dConfirmBtnNo = dConfirmBtnNo;
    self.showBox = showBox;
    self.hideBox = hideBox;
    return self;
};