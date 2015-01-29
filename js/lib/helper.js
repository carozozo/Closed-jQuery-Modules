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
    self.isBasicVal = function (arg) {
        return self.isBool(arg) || self.isStr(arg) || self.isNum(arg);
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
     * @param arg
     * @returns {boolean|.ajaxSettings.flatOptions.context|*|jQuery.ajaxSettings.flatOptions.context|context|o.fn.context}
     */
    self.isDom = function (arg) {
        return self.isObj(arg) && arg.jquery && arg.length && arg.length > 0;
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
    self.isAppendType = function (type) {
        var aAppendType = ['append', 'prepend', 'after', 'before'];
        return aAppendType.indexOf(type) > -1;
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
        payMethodCode = $.lStr.upperStr(payMethodCode);
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
    self.checkPaymentTypeByCode = function (paymentMethodCode) {
        paymentMethodCode = $.lStr.upperStr(paymentMethodCode);
        if (paymentMethodCode === 'EWT') {
            return 'eWallet';
        }
        else if (paymentMethodCode === 'VSA' || paymentMethodCode === 'MST' || paymentMethodCode === 'AMX') {
            return 'creditCard';
        }
        else {
            return 'others';
        }
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
    /**
     * check if has same value with assigned-key in obj
     * EX
     * obj1 = {a: 1, b: 2};
     * obj2 = {a: 'a', b: 1, c: 3, d: 4};
     * $.lObj.hasSameValInObj([obj1, 'a'], [obj2, 'b']) => compare obj1[a] === obj2[b] => true
     * $.lObj.hasSameValInObj([obj1, 'a'], [obj2, 'b', 'c']) => compare obj1[a] === obj2[b] => true
     * $.lObj.hasSameValInObj(obj1, obj2, 'a'); => compare obj1[a] === obj2[a] => false
     * $.lObj.hasSameValInObj(obj1, obj2, 'd'); => compare obj1[d] === obj2[d] => false
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
    /**
     * merge obj2 to obj1, when has same value with assigned-key
     * EX
     * obj1 = {a: 1, b: 2, e: 5};
     * obj2 = {a: 'aa', b: 2, c: 3, d: 4};
     * $.lObj.extendObjByMapping(obj1 ,obj2 , 'b')
     * => obj1.b === obj2.b
     * => result = {a: 'aa', b: 2, c: 3, d: 4, e: 5};
     *
     * EX2
     * obj1 = {a: 1, b: 2, e: 5};
     * obj2 = {a: 'aa', b: 2, c: 3, d: 1};
     * $.lObj.extendObjByMapping(obj1 ,obj2 , 'a', 'd')
     * => obj1.a === obj2.d
     * => result = {a: 'aa', b: 2, c: 3, d: 1, e: 5};
     *
     * EX3
     * arr1 = [{a: 1, b: 2, e: 5}, {a: 3, b: 2, e: 6}]
     * arr2 = [{a: 'aa', b: 4, c: 3, d: 3}, {a: 'bb', b: 2, c: 3, d: 1}]
     * $.lObj.extendObjByMapping(arr1 ,arr2 , 'a', 'd')
     * => arr1[0] mapping to arr2[1], arr1[1] mapping to arr2[0]
     * => result = [{a: 'bb', b: 2, c: 3, d: 1, e: 5}, {a: 'aa', b: 4, c: 3, d: 3, e: 6}];
     *
     * EX4
     * arr1 = [{a: 1, b: 2, e: 5}, {a: 3, b: 2, e: 6}]
     * arr2 = [{a: 'aa', b: 4, c: 3, d: 3}, {a: 'bb', b: 2, c: 1, d: 2}]
     * $.lObj.extendObjByMapping(arr1 ,arr2 , ['a','b'], ['c','d'])
     * => mapping if (obj[a] in arr1) === (obj[c] in arr2) && (obj[b] in arr1) === (obj[d] in arr2)
     * => arr1[0] mapping to arr2[1], arr1[1] no mapping
     * => arr1 = [{a: 'bb', b: 2, c: 1, d: 2, e: 5}, {a: 3, b: 2, e: 6}];
     *
     * @param oArr1
     * @param oArr2
     * @param aKey1
     * @param [aKey2]
     */
    self.extendObjByMapping = function (oArr1, oArr2, aKey1, aKey2) {
        var oArr = [];
        var assignedFormat = function (obj, aKey) {
            // obj = {}, aKey = ['key1',key2] => [obj, key1, key2]
            var arr = [obj];
            $.each(aKey, function (i, key) {
                arr.push(key);
            });
            return arr;
        };
        if (!aKey2) {
            aKey2 = aKey1;
        }
        self.isObj(oArr1) && (oArr1 = [oArr1]);
        self.isObj(oArr2) && (oArr2 = [oArr2]);
        self.isStr(aKey1) && (aKey1 = [aKey1]);
        self.isStr(aKey2) && (aKey2 = [aKey2]);
        $.each(oArr1, function (i, obj1) {
            $.each(oArr2, function (j, obj2) {
                var arr1 = assignedFormat(obj1, aKey1);
                var arr2 = assignedFormat(obj2, aKey2);
                if (!self.hasSameValInObj(arr1, arr2)) {
                    return true;
                }
                oArr[i] = $.lObj.extendObj(obj1, obj2);
                return false;
            });
        });
        return oArr;
    };
    return self;
})();