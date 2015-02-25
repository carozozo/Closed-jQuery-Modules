/**
 * The text-shorter module
 * v1.2
 * @author Caro.Huang
 */


/**
 * the text-shorter to short cut long content, use [ bootstrap-popovers ] to show origin content
 * please read [ http://getbootstrap.com/javascript/#popovers ]
 *
 * OPT
 * maxLength: int (default: 20) - max charts to show
 * forceShort: bool (default: false) - force short even content not longer than maxLength
 * showFull: bool (default: true) - if show full content with tip
 * clickShow: bool (default: false) - show tip by click, otherwise by mouse over
 *
 * popovers-OPT
 * placement: top | bottom | left | right | auto (default: 'right') - the tip side (base on popover options)
 * html: bool (default: true) - if html-content
 * title: str (default: '')
 * content: str (default: DOM-content) - if not-set , will auto get DOM-content
 *
 * Fn
 * showFullTip: show full content with tip
 * hideFullTip: hide full content with tip
 *
 * @param [opt]
 * @returns {*}
 */
$.fn.mTextShorter = function (opt) {
    var aSelf = [];
    this.each(function (i, dom) {
        var self = $(dom);
        var shortContent = '';
        var aPlacement = ['top' , 'bottom' , 'left' , 'right' , 'auto'];

        var maxLength = 20;
        var forceShort = false;
        var showFull = true;
        var placement = 'right';
        var clickShow = false;
        var html = true;
        var title = '';
        var content = self.html();
        var sContentText = self.text();
        if (opt) {
            maxLength = opt.maxLength ? opt.maxLength : maxLength;
            forceShort = opt.forceShort === true;
            showFull = opt.showFull !== false;
            maxLength = opt.maxLength ? opt.maxLength : maxLength;
            placement = (aPlacement.indexOf(opt.placement) > -1) ? opt.placement : placement;
            clickShow = opt.clickShow === true;
            html = opt.html !== false;
            title = opt.title || title;
            content = opt.content || content;
        }
        self.showFullTip = function () {
            if (self.dShortLink) {
                self.dShortLink.popover('show');
            }
        };
        self.hideFullTip = function () {
            if (self.dShortLink) {
                self.dShortLink.popover('hide');
            }
        };
        self.removeTip = function () {
            self.popover('destroy');
        };
        if (content.length > maxLength || forceShort) {
            shortContent = sContentText.slice(0, maxLength) + '...';
            self.dShortLink = (function () {
                var dShortLink = new $('<span></span>').lClass('mTextShorterLink basic-link');
                dShortLink.html(shortContent);
                if (showFull) {
                    content = $.lStr.wrapToBr(content);
                    var popOpt = {
                        placement: placement,
                        content: content,
                        title: title,
                        html: html
                    };

                    if (!clickShow) {
                        popOpt.trigger = 'hover';
                    } else {
                        popOpt.trigger = 'click';
                    }
                    dShortLink.popover(popOpt);
                }
                return dShortLink;
            })();
            self.empty().append(self.dShortLink);
        }
        aSelf.push(self);
    });
    if (this.length < 2) {
        aSelf = aSelf[0];
    }
    return aSelf;
};