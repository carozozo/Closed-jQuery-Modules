/**
 * The block btn module
 * v1.0
 * @author Caro.Huang
 */


/**
 * create block btn style
 * @param [clickFn]
 */
$.fn.mBlockBtn = function (clickFn) {
    var selfId = 'mBlockBtn';
    $.each(this, function (i, dom) {
        var self = $(dom);
        self
            .lClass('blockBtn basic-block')
            .css('cursor', 'pointer')
            .on('mouseenter.' + selfId, function () {
                self.lClass('basic-block-in');
                self.removeClass('basic-block');
            })
            .on('mouseleave.' + selfId, function () {
                self.lClass('basic-block');
                self.removeClass('basic-block-in');
            });
        clickFn && self.on('click.' + selfId, clickFn);
    });
};