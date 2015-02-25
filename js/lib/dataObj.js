/**
 * The helper for trans data in object
 * @author Caro.Huang
 */

$.lDataObj = (function () {
    var self = {};

    self.getPriceObj = function (obj, opt) {
        var salePrice = obj.salePrice || 0;
        var surcharge = obj.surcharge || 0;
        var tax = obj.tax || 0;
        var total = salePrice + surcharge + tax;
        var formatMoneyOpt = {
            currency: (obj.currencyCode || obj.currency)
        };
        var format = 'int';
        var hideEmpty = false;
        var brackets = false;
        if (opt) {
            format = opt.format || format;
            hideEmpty = opt.hideEmpty === true;
            brackets = opt.brackets === true;
        }
        var formatPrice = function (price, subOpt) {
            var format2 = format;
            var hideEmpty2 = hideEmpty;
            var brackets2 = brackets;
            if (subOpt) {
                format2 = (subOpt.format !== undefined) ? subOpt.format : format2;
                hideEmpty2 = (subOpt.hideEmpty !== undefined) ? subOpt.hideEmpty : hideEmpty2;
                brackets2 = (subOpt.brackets !== undefined) ? subOpt.brackets : brackets2;
            }
            price = parseFloat(price) || 0;
            if (price == 0 && hideEmpty2) {
                return '';
            }
            price = $.lStr.formatMoney(price, format2, formatMoneyOpt);
            if (brackets2) {
                price = '(' + price + ')';
            }
            return price;
        };

        obj.getPrice = function () {
            var total = 0;
            $.each(arguments, function (i, arg) {
                total += parseFloat(obj[arg]) || 0;
            });
            return total;
        };
        obj.getTotalPrice = function () {
            return total;
        };
        obj.getPriceFull = function () {
            var subOpt = null;
            var total = 0;
            $.each(arguments, function (i, arg) {
                if ($.lHelper.isObj(arg)) {
                    subOpt = arg;
                }
                total += parseFloat(obj[arg]) || 0;
            });
            return formatPrice(total, subOpt);
        };
        obj.getTotalPriceFull = function (subOpt) {
            return formatPrice(total, subOpt);
        };
        obj.formatPrice = formatPrice;
        return obj;
    };
    /**
     * merge obj2 to obj1, when has same value with assigned-key
     * EX
     * obj1 = {a: 1, b: 2, e: 5};
     * obj2 = {a: 'aa', b: 2, c: 3, d: 4};
     * extendDataByMapping(obj1 ,obj2 , 'b')
     * => obj1.b === obj2.b
     * => result = {a: 'aa', b: 2, c: 3, d: 4, e: 5};
     *
     * EX2
     * obj1 = {a: 1, b: 2, e: 5};
     * obj2 = {a: 'aa', b: 2, c: 3, d: 1};
     * extendDataByMapping(obj1 ,obj2 , 'a', 'd')
     * => obj1.a === obj2.d
     * => result = {a: 'aa', b: 2, c: 3, d: 1, e: 5};
     *
     * EX3
     * arr1 = [{a: 1, b: 2, e: 5}, {a: 3, b: 2, e: 6}]
     * arr2 = [{a: 'aa', b: 4, c: 3, d: 3}, {a: 'bb', b: 2, c: 3, d: 1}]
     * extendDataByMapping(arr1 ,arr2 , 'a', 'd')
     * => arr1[0] mapping to arr2[1], arr1[1] mapping to arr2[0]
     * => result = [{a: 'bb', b: 2, c: 3, d: 1, e: 5}, {a: 'aa', b: 4, c: 3, d: 3, e: 6}];
     *
     * EX4
     * arr1 = [{a: 1, b: 2, e: 5}, {a: 3, b: 2, e: 6}]
     * arr2 = [{a: 'aa', b: 4, c: 3, d: 3}, {a: 'bb', b: 2, c: 1, d: 2}]
     * extendDataByMapping(arr1 ,arr2 , ['a','b'], ['c','d'])
     * => mapping if (obj[a] in arr1) === (obj[c] in arr2) && (obj[b] in arr1) === (obj[d] in arr2)
     * => arr1[0] mapping to arr2[1], arr1[1] no mapping
     * => arr1 = [{a: 'bb', b: 2, c: 1, d: 2, e: 5}, {a: 3, b: 2, e: 6}];
     *
     * @param oArr1
     * @param oArr2
     * @param aKey1
     * @param [aKey2]
     */
    self.extendDataByMapping = function (oArr1, oArr2, aKey1, aKey2) {
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
        $.lHelper.isObj(oArr1) && (oArr1 = [oArr1]);
        $.lHelper.isObj(oArr2) && (oArr2 = [oArr2]);
        $.lHelper.isStr(aKey1) && (aKey1 = [aKey1]);
        $.lHelper.isStr(aKey2) && (aKey2 = [aKey2]);
        $.each(oArr1, function (i, obj1) {
            $.each(oArr2, function (j, obj2) {
                var arr1 = assignedFormat(obj1, aKey1);
                var arr2 = assignedFormat(obj2, aKey2);
                if (!$.lHelper.hasSameValInObj(arr1, arr2)) {
                    return true;
                }
                oArr[i] = $.lObj.extendObj(obj1, obj2);
                return false;
            });
        });
        return oArr;
    };

    /**
     * OPT
     * keys: string/string-arr (default: keys in obj) - the keys that you want create dom
     * forceCover: bool(default: true) - if still create dom when value is not basic-value(int/str...)
     *
     * EX.
     * obj={a:'content1',b:'content2',c:{}}
     * getDomObj(obj,$('<div></div>'));
     * or
     * getDomObj(obj,$('<div></div>'),null,{
     *  keys:'a,b'
     * });
     * => will create DOM - $('<div>content1</div>') and $('<div>content2</div>')
     * => domMap = {a:DOM, b:DOM}
     *
     * EX2.
     * getDomObj(obj,$('<div></div>'),null,{
     *  keys:'a'
     * });
     * or
     * getDomObj(obj,$('<div></div>'),null,{
     *  keys:['a']
     * });
     * => domMap = {a:DOM}
     *
     * RETURN
     * domMap: the map of DOM
     * getValMapFromDom: get the value from DOM, and cover to domMap
     * @param obj
     * @param dom
     * @param [mapFn]
     * @param [opt]
     * @returns {{}}
     */
    self.getDomObj = function (obj, dom, mapFn, opt) {
        var self = {};
        if (!$.lHelper.isObj(obj) || !$.lHelper.isDom(dom)) {
            return self;
        }
        var domMap = {};
        var keys = $.lObj.getKeysInObj(obj);
        var forceCover = true;
        if (opt) {
            keys = opt.keys || keys;
            forceCover = opt.forceCover !== false;
        }
        if ($.lHelper.isStr(keys)) {
            keys = $.lStr.splitStr(keys, ',');
        }

        $.each(keys, function (i, key) {
            var val = obj[key];
            if (!$.lHelper.isBasicVal(val)) {
                if (forceCover) val = '';
                else return;
            }
            var dClone = dom.clone();
            domMap[key] = dClone;
            dClone.setVal(val);
            mapFn && mapFn(dClone, key, val);
        });
        self.domMap = domMap;
        self.getValMapFromDom = function () {
            var obj = {};
            $.each(domMap, function (key, dom) {
                obj[key] = dom.getVal();
            });
            return obj;
        };
        return self;
    };
    return self;
})();