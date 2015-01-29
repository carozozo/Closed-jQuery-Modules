/**
 * The form-checker module
 * v.2.0
 * @author Caro.Huang
 */


/**
 * validate the form-value that register
 *
 * OPT
 * onBlur: bool (default: false) if show error when blur
 * usePlaceHolder: bool (default: true) if use placeHolder
 * useTip: bool (default: true) if use tooltip
 * focusTarget: DOM/string (default: null) focus target when error, will focus first error-DOM if not set
 *
 * FN
 * addRequired: register to check val if empty
 * removeRequired: cancel register to check val if empty
 * addNum: register to check val if num type
 * removeNum: cancel register to check val if num type
 * addInt: register to check val if int type
 * removeInt: cancel register to check val if int type
 * addEmail: register to check val if email type
 * removeEmail: cancel register to check val if email type
 * addEqual: register to check val if equal to target val
 * removeEqual: cancel register to check val if equal to target val
 * addMinLength: register to check val if no less than min length
 * removeMinLength: cancel register to check val if no less than min length
 * removeCheckerClass: remove all class by form-checker
 * checkForm: start check form, and return bool
 *
 * RETURN
 * mFormCheckerPass - the result after checked
 *
 * @param [opt]
 * @returns {$.fn}
 */
$.fn.mFormChecker = function (opt) {
    var self = this;
    var langPathRoot = 'mFormChecker.';
    // save the reg dom for each check type
    var daRequired = [];
    var daNum = [];
    var daInt = [];
    var daEmail = [];
    var daEqualSource = [];
    var daEqualTarget = [];
    var daMinLengthSource = [];
    var daMinLength = [];
//    var mFormCheckerPass = false;
    // the default options
    var onBlur = false;
    var usePlaceHolder = true;
    var useTip = true;
    var sBlurEventRoot = 'blur.mFormChecker.';
    if (opt) {
        onBlur = opt.onBlur === true;
        usePlaceHolder = opt.usePlaceHolder !== false;
        useTip = opt.useTip !== false;
    }
    var setPlaceHolder = function (dom) {
        var setMsg = function () {
            var sLang = '';
            $.each(dom.checkerLangPath, function (i, langPath) {
                var lang = '';
                if ($.lHelper.isFn(langPath)) {
                    lang = langPath();
                } else {
                    lang = $.lLang.parseLanPath(langPath);
                }
                if (sLang) {
                    sLang += ', ';
                }
                sLang += lang;
            });
            dom.attr('placeholder', sLang);
        };
        if (!dom.is('input')) {
            return;
        }
        setMsg();
        $.lEventEmitter.hookEvent('befSwitchLang', 'mFormChecker', setMsg, {
            source: dom
        });
    };
    var setToolTip = function (dom) {
        var setMsg = function () {
            var sLang = '';
            $.each(dom.checkerLangPath, function (i, langPath) {
                var lang = '';
                if ($.lHelper.isFn(langPath)) {

                    lang = langPath();
                } else {
                    lang = $.lLang.parseLanPath(langPath);
                }
                if (sLang) {
                    sLang += ', ';
                }
                sLang += lang;
            });
            // remove tooltip first
            dom.tooltip('destroy');
            // set new tooltip
            if (sLang) {
                dom.lTitle(sLang).tooltip();
            }
        };
        setMsg();
        $.lEventEmitter.hookEvent('befSwitchLang', 'mFormChecker2', setMsg, {
            source: dom
        });
    };
    var setLangPath = function (dom, key, langPath) {
        !dom.checkerLangPath && (dom.checkerLangPath = {});
        dom.checkerLangPath[key] = langPath

    };
    var removeLangPathByKey = function (dom, key) {
        if (!dom.checkerLangPath) {
            return;
        }
        delete dom.checkerLangPath[key];
    };
    var setTip = function (dom) {
        if (!dom.checkerLangPath) {
            return;
        }
        if (usePlaceHolder) {
            setPlaceHolder(dom);
        }
        if (useTip) {
            setToolTip(dom);
        }
    };
    /**
     * check the required-type
     * @param [dom]
     * @returns {boolean}
     */
    var checkRequired = function (dom) {
        var pass = true;
        var check = function (dom) {
            var val = dom.getVal();
            var sClass = 'check-form-required';
            if (!val && val !== 0) {
                dom.lClass(sClass);
                pass = false;
                return;
            }
            dom.removeClass(sClass);
        };
        if (dom) {
            check(dom);
        } else {
            $.each(daRequired, function (i, dom) {
                check(dom);
            });
        }
        return pass;
    };
    /**
     * check val if num
     * @param [dom]
     * @returns {boolean}
     */
    var checkNum = function (dom) {
        var pass = true;
        var check = function (dom) {
            var val = dom.val().trim();
            var sClass = 'check-form-num';
            if (val && !$.lStr.isNumeric(val)) {
                dom.lClass(sClass);
                pass = false;
                return;
            }
            dom.removeClass(sClass);
        };
        if (dom) {
            check(dom);
        } else {
            $.each(daNum, function (i, dom) {
                check(dom);
            });
        }
        return pass;
    };
    /**
     * check val if int
     * @param [dom]
     * @returns {boolean}
     */
    var checkInt = function (dom) {
        var pass = true;
        var check = function (dom) {
            var val = dom.val().trim();
            var sClass = 'check-form-int';
            if (val && !$.lStr.isInt(val)) {
                dom.lClass(sClass);
                pass = false;
                return;
            }
            dom.removeClass(sClass);
        };
        if (dom) {
            check(dom);
        } else {
            $.each(daInt, function (i, dom) {
                check(dom);
            });
        }
        return pass;
    };
    /**
     * check the email-type
     * @param [dom]
     * @returns {boolean}
     */
    var checkEmail = function (dom) {
        var pass = true;
        var check = function (dom) {
            var val = dom.val().trim();
            var sClass = 'check-form-email';
            if (val && !$.lStr.isEmail(val)) {
                dom.lClass(sClass);
                pass = false;
                return;
            }
            dom.removeClass(sClass);
        };
        if (dom) {
            check(dom);
        } else {
            $.each(daEmail, function (i, dom) {
                check(dom);
            });
        }
        return pass;
    };
    /**
     * check if equal val
     * @param [opt]
     * @returns {boolean}
     */
    var checkEqual = function (opt) {
        var pass = true;
        var check = function (opt) {
            var src = opt.src;
            var tar = opt.tar;
            var srcVal = src.val().trim();
            var tarVal = tar.val().trim();
            var sClass = 'check-form-equal';
            if (srcVal != tarVal) {
                src.lClass(sClass);
                pass = false;
                return;
            }
            src.removeClass(sClass);
        };
        if (opt) {
            check(opt);
        } else {
            $.each(daEqualSource, function (i, dom) {
                var target = daEqualTarget[i];
                var opt = {
                    src: dom,
                    tar: target
                };
                check(opt);
            });
        }
        return pass;
    };
    /**
     * check if no less than min length
     * @param [opt]
     * @returns {boolean}
     */
    var checkMinLength = function (opt) {
        var pass = true;
        var check = function (opt) {
            var src = opt.src;
            var minLength = opt.minLength;
            var srcVal = src.val().trim();
            var valLength = srcVal.length;
            var sClass = 'check-form-minLength';

            if (valLength > 0 && valLength < minLength) {
                src.lClass(sClass);
                pass = false;
                return;
            }
            src.removeClass(sClass);
        };
        if (opt) {
            check(opt);
        } else {
            $.each(daMinLengthSource, function (i, src) {
                var minLength = daMinLength[i];
                var opt = {
                    src: src,
                    minLength: minLength
                };
                check(opt);
            });
        }
        return pass;


    };

    self.addRequired = function (aDom) {
        var aDom = $.lHelper.coverToArr(aDom);
        var subLangPath = langPathRoot + 'required';
        $.each(aDom, function (i, dom) {
            if (daRequired.indexOf(dom) > -1) {
                return;
            }
            setLangPath(dom, 'required', subLangPath);
            daRequired.push(dom);
            if (onBlur) {
                dom.action(sBlurEventRoot + 'required', function () {
                    checkRequired(dom);
                });
            }
            setTip(dom);
        });
    };
    self.removeRequired = function (aDom) {
        aDom = $.lHelper.coverToArr(aDom);
        $.each(aDom, function (i, dom) {
            var indexInSource = daRequired.indexOf(dom);
            if (indexInSource < 0) {
                return;
            }
            $.lArr.removeByIndex(daRequired, indexInSource);
            dom.off(sBlurEventRoot + 'required');
            removeLangPathByKey(dom, 'required');
            // reset tip after removeLangPath
            setTip(dom);
        });
    };
    self.addNum = function (aDom) {
        aDom = $.lHelper.coverToArr(aDom);
        var subLangPath = langPathRoot + 'num';
        $.each(aDom, function (i, dom) {
            if (daNum.indexOf(dom) > -1) {
                return;
            }
            setLangPath(dom, 'num', subLangPath);
            daNum.push(dom);
            if (onBlur) {
                dom.action(sBlurEventRoot + 'num', function () {
                    checkNum(dom);
                });
            }
            setTip(dom);
        });
    };
    self.removeNum = function (aDom) {
        aDom = $.lHelper.coverToArr(aDom);
        $.each(aDom, function (i, dom) {
            var indexInSource = daNum.indexOf(dom);
            if (indexInSource < 0) {
                return;
            }
            $.lArr.removeByIndex(daNum, indexInSource);
            dom.off(sBlurEventRoot + 'num');
            removeLangPathByKey(dom, 'num');
            setTip(dom);
        });
    };
    self.addInt = function (aDom) {
        aDom = $.lHelper.coverToArr(aDom);
        var subLangPath = langPathRoot + 'int';
        $.each(aDom, function (i, dom) {
            if (daInt.indexOf(dom) > -1) {
                return;
            }
            setLangPath(dom, 'int', subLangPath);
            daInt.push(dom);
            if (onBlur) {
                dom.action(sBlurEventRoot + 'int', function () {
                    checkInt(dom);
                });
            }
            setTip(dom);
        });
    };
    self.removeInt = function (aDom) {
        aDom = $.lHelper.coverToArr(aDom);
        $.each(aDom, function (i, dom) {
            var indexInSource = daInt.indexOf(dom);
            if (daInt.indexOf(dom) < 0) {
                return;
            }
            $.lArr.removeByIndex(daInt, indexInSource);
            dom.off(sBlurEventRoot + 'int');
            removeLangPathByKey(dom, 'int');
            setTip(dom);
        });
    };
    self.addEmail = function (aDom) {
        aDom = $.lHelper.coverToArr(aDom);
        var subLangPath = langPathRoot + 'email';
        $.each(aDom, function (i, dom) {
            if (daEmail.indexOf(dom) > -1) {
                return;
            }
            setLangPath(dom, 'email', subLangPath);
            daEmail.push(dom);
            if (onBlur) {
                dom.action(sBlurEventRoot + 'email', function () {
                    checkEmail(dom);
                });
            }
            setTip(dom);
        });
    };
    self.removeEmail = function (aDom) {
        aDom = $.lHelper.coverToArr(aDom);
        $.each(aDom, function (i, dom) {
            var indexInSource = daEmail.indexOf(dom);
            if (indexInSource < 0) {
                return;
            }
            $.lArr.removeByIndex(daEmail, indexInSource);
            dom.off(sBlurEventRoot + 'email');
            removeLangPathByKey(dom, 'email');
            setTip(dom);
        });
    };
    self.addEqual = function (dom, tarDom, tarName) {
        if (daEqualSource.indexOf(dom) > -1) {
            return;
        }
        setLangPath(dom, 'equal', getEqualLang);
        daEqualSource.push(dom);
        daEqualTarget.push(tarDom);
        if (onBlur) {
            dom.action(sBlurEventRoot + 'equal', function () {
                var opt = {
                    src: dom,
                    tar: tarDom
                };
                checkEqual(opt);
            });
        }
        function getEqualLang() {
            // ex. tarName()='password/密码/密碼'
            var sTarName = $.lHelper.executeIfFn(tarName);
            var equalLangFn = $.lLang.parseLanPath(langPathRoot + 'equal');
            return equalLangFn(sTarName);
        }

        setTip(dom);
    };
    self.removeEqual = function (aDom) {
        aDom = $.lHelper.coverToArr(aDom);
        $.each(aDom, function (i, dom) {
            var indexInSource = daEqualSource.indexOf(dom);
            if (indexInSource < 0) {
                return;
            }
            $.lArr.removeByIndex(daEqualSource, indexInSource);
            $.lArr.removeByIndex(daEqualTarget, indexInSource);
            dom.off(sBlurEventRoot + 'equal');
            removeLangPathByKey(dom, 'equal');
            setTip(dom);
        });
    };
    self.addMinLength = function (aDom, minLength) {
        aDom = $.lHelper.coverToArr(aDom);
        $.each(aDom, function (i, dom) {
            if (daMinLengthSource.indexOf(dom) > -1) {
                return;
            }
            setLangPath(dom, 'minLength', getMinLengthLangFn);
            daMinLengthSource.push(dom);
            daMinLength.push(minLength);
            if (onBlur) {
                dom.action(sBlurEventRoot + 'minLength', function () {
                    var opt = {
                        src: dom,
                        minLength: minLength
                    };
                    checkMinLength(opt);
                });
            }

            setTip(dom);
        });
        function getMinLengthLangFn() {
            var minLengthLangFn = $.lLang.parseLanPath(langPathRoot + 'minLength');
            return minLengthLangFn(minLength);
        }
    };
    self.removeMinLength = function (aDom) {
        aDom = $.lHelper.coverToArr(aDom);
        $.each(aDom, function (i, dom) {
            var indexInSource = daMinLengthSource.indexOf(dom);
            if (indexInSource < 0) {
                return;
            }
            $.lArr.removeByIndex(daMinLengthSource, indexInSource);
            $.lArr.removeByIndex(daMinLength, indexInSource);
            dom.off(sBlurEventRoot + 'minLength');
            removeLangPathByKey(dom, 'minLength');
            setTip(dom);
        });
    };
    self.removeCheckerClass = function () {
        self.find('[class*=check-form-]').removeClass(function (i, sClass) {
            return (sClass.match(/\bcheck-form-\S+/g) || []).join(' ');
        });
    };
    // TODO
    self.checkForm = function () {
        var pass = true;
        var aCheckFn = [checkRequired, checkNum, checkInt, checkEqual, checkMinLength];
        $.each(aCheckFn, function (index, fn) {
            if (!fn()) {
                pass = false;
            }
        });
//        mFormCheckerPass = pass;
        self.mFormCheckerPass = pass;
        return pass;
    };
//    self.mFormCheckerPass = mFormCheckerPass;
    self.removeCheckerClass();
    return self;
};