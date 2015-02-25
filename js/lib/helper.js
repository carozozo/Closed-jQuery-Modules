/**
 * The helper of common fns
 * @author Caro.Huang
 */

$.lHelper = (function () {
    var self = {};

    self.isBool = function (arg) {
        return $.type(arg) === 'boolean';
    };
    self.isStr = function (arg) {
        return $.type(arg) === 'string';
    };
    self.isNum = function (arg) {
        return $.type(arg) === 'number';
    };
    self.isFn = function (arg) {
        return $.type(arg) === 'function';
    };
    self.isObj = function (arg) {
        return $.type(arg) === 'object';
    };
    self.isArr = function (arg) {
        return $.type(arg) === 'array';
    };
    self.isBasicVal = function (arg) {
        return self.isBool(arg) || self.isStr(arg) || self.isNum(arg);
    };
    /**
     * check if value is empty ({}/[]/undefined/null/'')
     * @param val
     * @returns {boolean}
     */
    self.isEmptyVal = function (val) {
        if (self.isObj(val)) {
            return $.lObj.getObjLength(val) < 1;
        }
        if (self.isArr(val)) {
            return val.length < 1;
        }
        return !val && val !== 0;
    };
    self.isTrue = function (arg) {
        return arg === true || arg === 'true' || arg == 1;
    };
    self.notFalse = function (arg) {
        return arg !== false || arg !== 'false' || arg !== 0;
    };
    /**
     * execute if first-argument is function
     * ex.
     * executeIfFn(fn,arg1,arg2,...)
     * will return value as fn(arg1,arg2,...)
     * @returns {*}
     */
    self.executeIfFn = function () {
        var fn = null;
        var otherArgs = [];
        $.each(arguments, function (i, arg) {
            if (self.isFn(arg)) {
                fn = arg;
                return;
            }
            otherArgs.push(arg);
        });
        if (self.isFn(fn)) {
            fn = fn.apply(fn, otherArgs);
        }
        return fn;
    };
    self.composePhoneNum = function (countryCode, areaCode, phoneNumber) {
        countryCode = self.isStr(countryCode) ? '+' + countryCode : '';
        areaCode = self.isStr(areaCode) ? areaCode : '';
        phoneNumber = self.isStr(phoneNumber) ? phoneNumber : '';
        var arr = [countryCode,areaCode,phoneNumber];
        return arr.join(' ');
    };
    self.getPaymentMethodByCode = function (paymentMethodCode) {
        paymentMethodCode = $.lStr.upperStr(paymentMethodCode);
        switch (paymentMethodCode) {
            case 'VSA':
                return 'Visa';
            case 'MST':
                return 'Master';
            case 'AMX':
                return 'Visa';
            case 'American Express':
                return 'Visa';
            case 'EWT':
                return 'eWallet';
        }
        return paymentMethodCode;
    };
    self.getPaymentTypeByCode = function (paymentMethodCode) {
        paymentMethodCode = $.lStr.upperStr(paymentMethodCode);
        switch (paymentMethodCode) {
            case 'EWT':
                return 'eWallet';
            case 'VSA':
            case 'MST':
            case 'AMX':
                return 'creditCard';
        }
        return 'others';
    };
    self.coverToArr = function (arg) {
        if (self.isArr(arg)) {
            return arg;
        }
        return [arg];
    };
    self.coverToInt = function (arg, opt) {
        var force = true;
        var int = parseInt(arg);
        if (opt) {
            force = opt.force !== false;
        }
        if (self.isEmptyVal(int) && !force) {
            return arg;
        }
        int = int || 0;
        return int;
    };
    self.coverToObj = function (arg, opt) {
        var force = true;
        if (self.isObj(arg)) return arg;
        if (opt) {
            force = opt.force !== false;
        }
        if ($.lStr.isJson(arg)) {
            return JSON.parse(arg);
        }
        if (force) {
            return {};
        }
        return arg;
    };
    /**
     * check if has same value with assigned-key in obj
     * EX
     * obj1 = {a: 1, b: 2};
     * obj2 = {a: 'a', b: 1, c: 3, d: 4};
     * hasSameValInObj([obj1, 'a'], [obj2, 'b']) => compare obj1[a] === obj2[b] => true
     * hasSameValInObj([obj1, 'a'], [obj2, 'b', 'c']) => compare obj1[a] === obj2[b] => true
     * hasSameValInObj(obj1, obj2, 'a'); => compare obj1[a] === obj2[a] => false
     * hasSameValInObj(obj1, obj2, 'd'); => compare obj1[d] === obj2[d] => false
     * @param arr1
     * @param arr2
     * @param [key]
     * @returns {boolean}
     */
    self.hasSameValInObj = function (arr1, arr2, key) {
        var validate = true;
        var getObjAndKeys = function (arr) {
            // arr assign-format should like [obj,key1,key2...]
            // validate will be false if arr not match the assign-format
            var obj = {};
            var aKey = [];
            $.each(arr, function (i, arg) {
                if (i === 0) {
                    if (self.isObj(arg)) {
                        obj = arg;
                        return true;
                    }
                    validate = false;
                    return validate;
                }
                if (self.isStr(arg)) {
                    aKey.push(arg);
                    return true;
                }
                validate = false;
                return validate;
            });
            return {
                obj: obj,
                aKey: aKey
            };
        };
        // ex. arr1 = [{a: 1, b: 2}, 'a'], arr1 = [{a: 1, b: 1, c: 3, d: 4}, 'b']
        // => compare arr1[a] === arr2[b]
        validate = self.isArr(arr1) && self.isArr(arr2) && arr1.length <= arr2.length;
        if (!validate) {
            // ex. arr1 = {a: 1, b: 2}, arr2 = {a: 1, b: 1, c: 3, d: 4}, key = 'a'
            // compare arr1[a] === arr2[a]
            validate = self.isObj(arr1) && self.isObj(arr2) && self.isStr(key);
            if (!validate) {
                return validate;
            }
            // cover arguments to assign-format
            arr1 = [arr1, key];
            arr2 = [arr2, key];
        }
        var objAndKeys = getObjAndKeys(arr1);
        if (!validate) {
            // arr1 not match the assign-format
            return validate;
        }
        var obj1 = objAndKeys.obj;
        var aKey1 = objAndKeys.aKey;
        objAndKeys = getObjAndKeys(arr2);
        if (!validate) {
            // arr2 not match the assign-format
            return validate;
        }
        var obj2 = objAndKeys.obj;
        var aKey2 = objAndKeys.aKey;
        $.each(aKey1, function (i, key1) {
            var key2 = aKey2[i];
            if (!$.lObj.keyInObj(obj1, key1) || !$.lObj.keyInObj(obj2, key2)) {
                validate = false;
                return false;
            }
            var val1 = obj1[key1];
            var val2 = obj2[key2];
            if (val1 !== val2) {
                validate = false;
                return false;
            }
            return true;
        });
        return validate;
    };

    self.isDom = function (arg) {
        return self.isObj(arg) && arg.jquery && arg.length && arg.length > 0;
    };
    self.coverToDom = function (arg) {
        if(self.isDom(arg)){
            return arg;
        }
        if (self.isStr(arg)) {
            return $('#' + arg);
        }
        return arg;
    };
    self.isPressEnter = function (e) {
        var code = e.keyCode || e.which;
        return code === 13;
    };
    self.isAppendType = function (type) {
        var aAppendType = ['append', 'prepend', 'after', 'before'];
        return aAppendType.indexOf(type) > -1;
    };
    self.getMaxIndexZ = function () {
        var highest = -999;
        $('*').each(function () {
            var current = parseInt($(this).css('z-index'), 10);
            if (current && highest < current) highest = current;
        });
        return highest;
    };
    /**
     * TODO 可能合併到 $.lPage
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
    return self;
})();