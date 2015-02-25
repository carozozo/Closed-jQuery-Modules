/**
 * The cookie lib
 * please refer [https://github.com/carhartl/jquery-cookie]
 * @author Caro.Huang
 */

$.lCookie = (function () {
    var self = {};
    var getHost = function () {
        return $.lSysVar.getSysVar('host') || 'localhost';
    };

    /**
     * get cookie value by key
     * @param key
     * @returns {*}
     */
    self.get = function (key) {
        var host = getHost();
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
        var host = getHost();
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