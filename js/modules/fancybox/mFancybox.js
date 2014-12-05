/**
 * The module base from fancybox
 * please refer [http://fancyapps.com/fancybox/]
 * v1.0
 * @author Caro.Huang
 */

$.mFancybox = (function () {
    var self = {};
    self.open = function (group, opt) {
        var fancyOpt = {
            live: false,
            closeBtn: false
        };
        if ($.lHelper.isObj(opt)) {
            $.extend(fancyOpt, opt);
        }
        $.fancybox.open(group, fancyOpt);
    };
    self.close = function () {
        $.fancybox.close();
    };
    self.update = function () {
        $.fancybox.update();
    };
    self.toggle = function () {
        $.fancybox.toggle();
    };
    self.showLoading = function () {
        $.fancybox.showLoading();
    };
    self.hideLoading = function () {
        $.fancybox.hideLoading();
    };
    return self;
})();

$.fn.mFancybox = function (opt) {
    var self = this;
    var fancyOpt = {
        live: false,
        closeBtn: false
    };
    if ($.lHelper.isObj(opt)) {
        $.extend(fancyOpt, opt);
    }
    self.fancybox(fancyOpt);

    return self;
};