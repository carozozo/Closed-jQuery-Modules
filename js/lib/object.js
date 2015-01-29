/**
 * The object lib
 * @author Caro.Huang
 */

$.lObj = (function () {
    var self = {};
    /**
     * change obj string-value by key, will change-all if aKey is empty
     * support-type: upper/lower/upperFirst
     *
     * OPT
     * useClone: if use cloned obj for not replacing original obj
     * aKey can be separated-str/arr
     * @param obj
     * @param type
     * @param [aKey]
     * @param [opt]
     * @returns {*}
     */
    var changeStrValByObjKey = function (obj, type, aKey, opt) {
        var aType = ['upper', 'lower', 'upperFirst'];
        if (!$.lHelper.isObj(obj) || aType.indexOf(type) < 0) {
            return obj;
        }
        var objRet = obj;
        var useClone = false;
        if (opt) {
            useClone = opt.useClone === true;
        }
        if (useClone) {
            objRet = self.cloneObj(obj);
        }
        aKey = aKey || self.getKeysInObj(objRet);
        aKey = $.lStr.splitStr(aKey, ',');
        $.each(aKey, function (i, key) {
            if (!self.keyInObj(objRet, key)) {
                return;
            }
            var val = objRet[key];
            switch (type) {
                case 'upper':
                    objRet[key] = $.lStr.upperStr(val);
                    break;
                case 'lower':
                    objRet[key] = $.lStr.lowerStr(val);
                    break;
                case 'upperFirst':
                    objRet[key] = $.lStr.upperFirst(val);
                    break;
            }
        });
        return objRet;
    };

    /**
     * get the length of an object
     * @param obj
     * @returns {Number}
     */
    self.getObjLength = function (obj) {
        return Object.keys(obj).length;
    };
    /**
     * extend obj similar jQuery $.extend, but no modify original obj
     * @param obj1
     * @param obj2
     * @returns {*}
     */
    self.extendObj = function (obj1, obj2) {
        var obj = $.extend(true, {}, obj1);
        return $.extend(true, obj, obj2);
    };
    self.cloneObj = function (obj) {
        return $.extend(true, {}, obj);
    };
    /**
     * replace key in object
     * OPT
     * useClone: if use cloned obj for not replacing original obj
     *
     * EX1
     * var obj = {a:1, b:2};
     * $.lObj.replaceObjKey(obj, 'a', 'c');
     * => obj = {c:1, b:2}
     *
     * EX2
     * var obj1 = {a:1, b:2};
     * var obj2 = $.lObj.replaceObjKey(obj, 'a','c',{useClone:true});
     * => obj1 = {a:1, b:2};
     * => obj2 = {c:1, b:2}
     *
     * @param obj
     * @param oldKey
     * @param newKey
     * @param [opt]
     * @returns {*}
     */
    self.replaceObjKey = function (obj, oldKey, newKey, opt) {
        var objRet = obj;
        var useClone = false;
        if (opt) {
            useClone = opt.useClone === true;
        }
        if (useClone) {
            objRet = self.cloneObj(obj);
        }
        if (objRet.hasOwnProperty(oldKey)) {
            objRet[newKey] = objRet[oldKey];
            delete objRet[oldKey];
        }
        return objRet;
    };
    /**
     * replace key in object by keyMaps
     * OPT is same as [$.lObj.replaceObjKey]
     *
     * EX1
     * var obj = {a:1, b:2};
     * $.lObj.replaceObjKey(obj, [['a', 'c'],['b', 'd']]);
     * => obj = {c:1, d:2}
     *
     * EX2
     * var obj1 = {a:1, b:2};
     * var obj2 = $.lObj.replaceObjKey(obj, [['a', 'c'],['b', 'd']],{useClone:true});
     * => obj1 = {a:1, b:2};
     * => obj2 = {c:1, d:2}
     *
     * @param obj
     * @param aKeyMap
     * @param [opt]
     * @returns {*}
     */
    self.replaceObjKeys = function (obj, aKeyMap, opt) {
        $.each(aKeyMap, function (i, keyMap) {
            var oldKey = keyMap[0];
            var newKey = keyMap[1];
            obj = self.replaceObjKey(obj, oldKey, newKey, opt);
        });
        return obj;
    };
    self.upperCaseByObjKey = function (obj, aKey, opt) {
        changeStrValByObjKey(obj, 'upper', aKey, opt);
        return obj;
    };
    self.lowerCaseByObjKey = function (obj, aKey, opt) {
        changeStrValByObjKey(obj, 'lower', aKey, opt);
        return obj;
    };
    self.upperFirstByObjKey = function (obj, aKey, opt) {
        changeStrValByObjKey(obj, 'upperFirst', aKey, opt);
        return obj;
    };
    /**
     * check if key exists in obj
     * EX
     * a= { key1: 1, key2: 2};
     * $.lObj.keyInObj(a, 'key1') => true
     * $.lObj.keyInObj(a, ['key1','key2']) => true
     * $.lObj.keyInObj(a, ['key1','key3']) => false
     *
     * @param obj
     * @param aKey
     * @returns {boolean}
     */
    self.keyInObj = function (obj, aKey) {
        var pass = true;
        aKey = $.lHelper.coverToArr(aKey);
        $.each(aKey, function (i, key) {
            if (!obj.hasOwnProperty(key)) {
                pass = false;
                return false;
            }
            return true;
        });
        return pass;
    };
    /**
     * get keys in obj, and get all if level = 0
     * EX.
     * obj={a:'1', b:'2', c:'3', obj1:{ aa:'4',bb:'5'}}
     * $.lObj.getKeysInObj(obj);
     * =>['a','b','c','obj1']
     * $.lObj.getKeysInObj(obj,0);
     * =>['a','b','c','obj1','aa','bb']
     * @param obj
     * @param [levelLimit]
     * @returns {Array}
     */
    self.getKeysInObj = function (obj, levelLimit) {
        var arr = [];
        if (!$.lHelper.isObj(obj)) {
            return arr;
        }
        var levelCount = 0;
        var getKey = function (obj) {
            levelCount++;
            $.each(obj, function (key, val) {
                if (levelLimit > 0 && levelCount > levelLimit) {
                    return;
                }
                arr.push(key);
                if ($.lHelper.isObj(val)) {
                    getKey(val);
                }
            });
            levelCount--;
        };
        obj = obj || {};
        levelLimit = (levelLimit > -1) ? levelLimit : 1;
        getKey(obj);
        return arr;
    };
    self.joinInObj = function (obj, aKey, symble) {
        var arr = [];
        aKey = $.lHelper.coverToArr(aKey);
        $.each(aKey, function (i, key) {
            $.lArr.pushNoEmpty(arr, obj[key]);
        });
        return arr.join(symble);
    };
    return self;
})();