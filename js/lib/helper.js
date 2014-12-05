/**
 * The helper of common fns
 * @author Caro.Huang
 */

$.lHelper = (function () {
    var self = {};

    /**
     * check if str
     * @param arg
     * @returns {boolean}
     */
    self.isBool = function (arg) {
        return $.type(arg) === 'boolean';
    };

    /**
     * check if str
     * @param arg
     * @returns {boolean}
     */
    self.isStr = function (arg) {
        return $.type(arg) === 'string';
    };

    /**
     * check if num
     * @param arg
     * @returns {boolean}
     */
    self.isNum = function (arg) {
        return $.type(arg) === 'number';
    };

    /**
     * check if fn
     * @param arg
     * @returns {boolean}
     */
    self.isFn = function (arg) {
        return $.type(arg) === 'function';
    };

    /**
     * check if obj
     * @param arg
     * @returns {boolean}
     */
    self.isObj = function (arg) {
        return $.type(arg) === 'object';
    };

    /**
     * check if arr
     * @param arg
     * @returns {boolean}
     */
    self.isArr = function (arg) {
        return $.type(arg) === 'array';
    };

    /**
     * check if DOM
     * @param dom
     * @returns {boolean|.ajaxSettings.flatOptions.context|*|jQuery.ajaxSettings.flatOptions.context|context|o.fn.context}
     */
    self.isDom = function (dom) {
        return $.lHelper.isObj(dom) && dom.jquery && dom.length && dom.length > 0;
    };

    /**
     * check if key-press [Enter]
     * @param e
     * @returns {boolean}
     */
    self.isPressEnter = function (e) {
        var code = e.keyCode || e.which;
        return code === 13;
    };

    /**
     * execute if first-argument is function
     * ex.
     * $.lHelper.executeIfFn(fn,arg1,arg2,...)
     * will return value as fn(arg1,arg2,...)
     * @returns {*}
     */
    self.executeIfFn = function () {
        var tar = null;
        var otherArgs = [];
        $.each(arguments, function (i, arg) {
            if (i === 0) {
                tar = arg;
            }
            else {
                otherArgs.push(arg);
            }
        });
        if (self.isFn(tar)) {
            tar = tar.apply(tar, otherArgs);
        }
        return tar;
    };

    /**
     * return page-option with default setting
     * @param [pageOpt]
     * @returns {{startPage: number, pageSize: number}}
     */
    self.getListPageOpt = function (pageOpt) {
        var defaultOpt = {
            startPage: 0,
            pageSize: 10
        };
        if (pageOpt) {
            $.extend(defaultOpt, pageOpt);
        }
        return defaultOpt
    };

    self.composePhoneNum = function (countryCode, areaCode, phoneNumber) {
        var phoneNum = (countryCode) ? '+' + countryCode + ' ' : '';
        phoneNum += (areaCode) ? areaCode + ' ' : '';
        phoneNum += (phoneNumber) ? phoneNumber : '';
        return phoneNum;
    };

    self.getPaymentMethodByCode = function (payMethodCode) {
        payMethodCode = payMethodCode.toUpperCase();
        if (payMethodCode === 'VSA') {
            return 'Visa';
        }
        else if (payMethodCode === 'MST') {
            return 'Master';
        }
        else if (payMethodCode === 'AMX') {
            return 'American Express';
        }
        else if (payMethodCode === 'EWT') {
            return 'eWallet';
        }
        return payMethodCode;
    };

    self.coverToFormData = function (opt) {
        var formData = new FormData();
        $.each(opt.uploadFiles, function (key, val) {
            formData.append('uploadFile' + key, val);
        });
        $.each(opt, function (key, val) {
            if (key === 'uploadFiles') {
                return;
            }
            formData.append(key, val);
        });
        return formData;
    };

    self.getMaxIndexZ = function () {
        var highest = -999;
        $('*').each(function () {
            var current = parseInt($(this).css('z-index'), 10);
            if (current && highest < current) highest = current;
        });
        return highest;
    };

    return self;
})();