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
     * OPT
     * keys: string/string-arr (default: keys in obj) - the keys that you want create dom
     * forceCover: bool(default: true) - if still create dom when value is not basic-value(int/str...)
     *
     * EX.
     * obj={a:'content1',b:'content2',c:{}}
     * $.lDataObj.dataObjToDom(obj,$('<div></div>'));
     * or
     * $.lDataObj.dataObjToDom(obj,$('<div></div>'),null,{
     *  keys:'a,b'
     * });
     * => will create DOM - $('<div>content1</div>') and $('<div>content2</div>')
     * => domMap = {a:DOM, b:DOM}
     *
     * EX2.
     * $.lDataObj.dataObjToDom(obj,$('<div></div>'),null,{
     *  keys:'a'
     * });
     * or
     * $.lDataObj.dataObjToDom(obj,$('<div></div>'),null,{
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