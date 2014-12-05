/**
 * The object lib
 * @author Caro.Huang
 */

$.lObj = (function () {
    var self = {};

    /**
     * get the obj val by mapping path
     * ex.
     * obj = { obj1: { obj2: { got: 'you got it', no: 'no you not', fn: function fn(){} } } };
     * parsePath(obj,'obj1.obj2.got') will return 'you got it'
     * parsePath(obj,'obj1.obj2.fn') will return function fn
     * @param obj
     * @param str
     * @returns {string}
     */
    self.parsePath = function (obj, str) {
        // ex. str = 'userLogin.login'
        var aEach = str.split('.');
        var rObj = '';
        // ex. aEach = [userLogin, login]
        $.each(aEach, function (i, val) {
            if (i == 0) {
                rObj = obj[val];
                return;
            }
            rObj = rObj[val];
        });
        return rObj;
    };

    /**
     * get the length of an object
     * @param obj
     * @returns {Number}
     */
    self.getObjLength = function (obj) {
        return Object.keys(obj).length;
    };

    self.cloneObj = function (obj) {
        return $.extend(true, {}, obj);
    };

    /**
     * extend obj base on jquery $.extend, but no modify origin obj
     * @param obj1
     * @param obj2
     * @returns {*}
     */
    self.extendObj = function (obj1, obj2) {
        var obj = $.extend(true, {}, obj1);
        return $.extend(true, obj, obj2);
    };

    return self;
})();