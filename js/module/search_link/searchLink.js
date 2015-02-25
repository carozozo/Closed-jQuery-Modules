/**
 * The search-link module
 * v1.0
 * @author Caro.Huang
 */

/**
 * create search-type for link
 * @param [opt]
 * @param [clickFn]
 * @returns {$.fn}
 */
$.fn.mSearchLink = function (opt, clickFn) {
    var self = this;
    var pic = true;
    var link = true;
    var selfId = 'mSearchLink';
    if ($.lHelper.isFn(opt)) {
        clickFn = opt;
        opt = null;
    }
    if (opt) {
        pic = opt.pic !== false;
        link = opt.link !== false;
        clickFn = opt.clickFn;
    }
    self.empty().lClass('text-primary');
    (function appendPic() {
        if (!pic) {
            return;
        }
        var dPick = $('<span></span>')
            .lClass('glyphicon glyphicon-search');
        self.append(dPick);
    })();
    (function appendLink() {
        if (!link) {
            return;
        }
        var dLink = $('<span></span>').lSetLang('common.AdvancedSearch');
        self.append(dLink);
    })();
    if ($.lHelper.isFn(clickFn)) {
        self.on('click.' + selfId, clickFn);
    }
    return self;
};