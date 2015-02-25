/**
 * The module that can auto create DOM by object
 * v1.2
 * @author Caro.Huang
 */

/**
 * auto cover object value to created-Dom
 * OPT
 * aKeyPath: arr (default: first-keys in obj) - the obj get by keyPath that you want cover to DOM
 * dom: DOM (default: text-DOM) - the DOM that value place
 * appendTarget: DOM (default: null) - if set appendTarget, the created-Dom will append to
 * appendType: str (default: 'append') - the append-type by jQuery (append/prepend/before/after)
 * forceCover: bool (default: true) - if still create dom when value is not basic-value(int/str...)
 *
 * RETURN
 * getDomValObj: fn - that you can get all values in created-DOM with object-format
 * dMain : DOM - the container to place created-DOM
 * domMap : obj - the object that tell you where the created-DOM is (by keyPath)
 *
 * EX.
 * obj={
 *  a:{
 *      en:'This is Eng',
 *      cn:'這是簡中',
 *      hk:'這是繁中'
 *  },
 *  b:{
 *      en2:'This is Eng2',
 *      cn2:'這是簡中2',
 *      hk2:'這是繁中2'
 *  },
 *  c:{
 *      d:{
 *          en3:'This is Eng3',
 *          cn3:'這是簡中3',
 *          hk3:'這是繁中3'
 *      }
 *  }
 * };
 * $.mDataToDom(obj,function(dClone,keyPath,key){
 *  // dClone will be textarea-DOM
 *  // keyPath = a/b
 *  // key = en/cn/hk/en2/cn2/hk2
 * });
 * => will create 6 DOM
 *
 * $.mDataToDom(obj,null,{
 *  aKeyPath:['a','c.d']
 * });
 * => will create 6 DOM by [obj.a] and [obj.c.d]
 * @param obj
 * @param mapFn
 * @param opt
 * @returns {$|jQuery}
 */
$.mDataToDom = function (obj, mapFn, opt) {
    var self = this;
    var selfId = 'mDataToDom';
    var dMain = $('<div></div>').addClass(selfId + 'Main');
    var objClone = $.extend({}, obj);
    var domMap = {};

    var aKeyPath = $.lObj.getKeysInObj(obj, 1);
    var dom = $('<textarea></textarea>');
    var appendTarget = null;
    var appendType = 'append';
    var forceCover = true;
    if (opt) {
        aKeyPath = opt.aKeyPath || aKeyPath;
        dom = opt.dom || dom;
        appendTarget = opt.appendTarget || appendTarget;
        appendType = $.lHelper.isAppendType(opt.appendType) ? opt.appendType : appendType;
        forceCover = opt.forceCover !== false;
    }
    $.each(aKeyPath, function (i, keyPath) {
        var subObj = {};
        var domObj = {};
        var preKey = '';
        var aKey = keyPath.split('.');
        $.each(aKey, function (i, eachKey) {
            subObj = subObj[eachKey] || objClone[eachKey];
            if (!$.lHelper.isObj(subObj)) {
                return;
            }
            $.each(subObj, function (subKey, subVal) {
                if (!$.lHelper.isBasicVal(subVal)) {
                    if (forceCover) subObj[subKey] = '';
                    else delete subObj[subKey];
                }
            });
            if (!preKey) {
                domObj = domMap[eachKey] = domMap[eachKey] || {};
            } else {
                domObj = domMap[preKey][eachKey] = domMap[preKey][eachKey] || {};
            }
            preKey = eachKey;
        });
        $.lDataObj.getDomObj(subObj, dom, function (dClone, key, val) {
            dClone.addClass(selfId)
                .attr('domKeyPath', keyPath)
                .attr('domKey', key)
                .attr('domVal', val)
                .setVal(val);
            dClone.domKeyPath = keyPath;
            dClone.domKey = key;
            dClone.domVal = val;
            dMain.append(dClone);
            domObj[key] = dClone;
            appendTarget && appendTarget[appendType](dMain);
            mapFn && mapFn(dClone, keyPath, key);
        });
    });
    self.getDomValObj = function () {
        var getObjVal = function (obj) {
            var retObj = {};
            if (!$.lHelper.isObj(obj)) {
                return retObj;
            }
            $.each(obj, function (key, val) {
                if ($.lHelper.isDom(val)) {
                    retObj[key] = val.getVal();
                    return;
                }
                retObj[key] = getObjVal(val);
            });
            return retObj;
        };
        return getObjVal(domMap);
    };
    self.dMain = dMain;
    self.domMap = domMap;
    return self;
};