/**
 * The lib for system-variable
 * @author Caro.Huang
 */

$.lSysVar = (function () {
    var self = {};
    var location = window.location;
    var sysVars = {
        host: location.host,
        hostName: location.hostname
    };

    self.updateSysVars = function (obj) {
        $.extend(sysVars, obj);
        console.log('sysVars =', sysVars);
    };
    /**
     * get vars from system
     */
    self.getSysVars = function () {
        $.ajax.main.getVarsAJ(function (res) {
            $.lAjax.parseRes(res, function (result) {
                self.updateSysVars(result);
            });
        });
    };
    self.getSysVar = function (key) {
        if (!key) {
            return sysVars;
        }
        return sysVars[key] || null;
    };
    self.setSysVar = function (key, val) {
        sysVars[key] = val;
    };
    return self;
})();