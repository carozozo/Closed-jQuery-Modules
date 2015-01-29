/**
 * The cookie lib
 * please refer [https://github.com/carhartl/jquery-cookie]
 * @author Caro.Huang
 */

$.lCookie = (function () {
    var self = {};
    var host = $.tSysVars.host || 'host';
    /**
     * get cookie value by key
     * @param key
     * @returns {*}
     */
    self.get = function (key) {
        if (key) {
            key = host + '-' + key;
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
        key = host + '-' + key;
        $.cookie(key, val);
    };

    return self;
})();