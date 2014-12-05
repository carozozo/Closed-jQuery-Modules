/**
 * The window lib about web page
 * @author Caro.Huang
 */

$(window).on('resize', function () {
    $.lWindow.setContainerMarginTop();
});
$.lEventEmitter.hookEvent('aftContainerSwitch', 'lWindow', function (e) {
    $.lWindow.setContainerMarginTop();
});
$.lWindow = (function () {
    var self = {};
    var defContainerMarginTop = 50;
    // set extra margin-top
    var containerMarginTop = defContainerMarginTop;
    self.setMarginTopVal = function (val) {
        val = parseInt(val);
        if (val < defContainerMarginTop) {
            containerMarginTop = defContainerMarginTop;
        }
        else {
            containerMarginTop = val;
        }
    };
    /**
     * set #container default top position relative #headerTop
     */
    self.setDefaultContainerMarginTop = function () {
        containerMarginTop = defContainerMarginTop;
        self.setContainerMarginTop();
    };
    /**
     * set #container top position relative #header
     */
    self.setContainerMarginTop = function () {
        var dHeaderTop = $('#headerTop');
        var dContainer = $('#container');
        var emitObj = {
            marginTop: containerMarginTop
        };
        if ($.lEventEmitter.emitEvent('befSetContainerMarginTop', emitObj) === false) {
            return;
        }
        dContainer.css({
            'margin-top': dHeaderTop.height() + containerMarginTop
        });
        $.lEventEmitter.emitEvent('aftSetContainerMarginTop', emitObj);
    };
    return self;
})();