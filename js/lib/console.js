/**
 * The console lib
 * @author Caro.Huang
 */

$.lConsole = (function () {
    var self = {};

    /**
     * print console.log if system-var [production] is false
     * @param title
     * @param [msg]
     */
    self.log = function (title, msg) {
        var isProduction = $.lSysVar.getSysVar('isProduction');
        if (isProduction) return;
        if (msg !== undefined) {
            console.log(title, msg);
            return;
        }
        console.log(title);
    };
    /**
     * print console.error if system-var [production] is false
     * @param title
     * @param [msg]
     */
    self.error = function (title, msg) {
        var isProduction = $.lSysVar.getSysVar('isProduction');
        if (isProduction) return;
        if (msg !== undefined) {
            console.error(title, msg);
            return;
        }
        console.error(title);
    };
    return self;
})();