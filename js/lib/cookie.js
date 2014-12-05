/**
 * The cookie lib
 * please refer [https://github.com/carhartl/jquery-cookie]
 * @author Caro.Huang
 */

$.lCookie = (function () {
    var self = {};

    /**
     * get cookie value by key
     * @param key
     * @returns {*}
     */
    self.get = function (key) {
        if (key) {
            var cookie = $.cookie(key);
            try {
                return JSON.parse(cookie);
            } catch (exc) {
                return cookie;
            }
        }
        return $.cookie;
    };

    /**
     * set value to cookie
     * @param key
     * @param val
     */
    self.set = function (key, val) {
        if ($.lHelper.isObj(val) || $.lHelper.isArr(val)) {
            try {
                val = JSON.stringify(val);
            } catch (e) {
                console.error('$.lCookie.set: ', e);
                console.error('key=', key);
                console.error('val=', val);
            }
        }
        $.cookie(key, val);
    };

    return self;
})();