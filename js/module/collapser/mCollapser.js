/**
 * The collapse module
 * v1.6
 * @author Caro.Huang
 */

$.mCollapser = (function () {
    var self = {};
    self.index = 0;
    self.selfId = 'mCollapser';
    self.sourceName = self.selfId + 'Source';
    self.targetName = self.selfId + 'Target';
    self.contentName = self.selfId + 'Content';
    self.showAllCollapser = function () {
        $.each($('.' + self.sourceName), function (i, dom) {
            var showCollapserFn = $(dom).data('showCollapser');
            showCollapserFn();
        });
    };
    self.hideAllCollapser = function () {
        $.each($('.' + self.sourceName), function (i, dom) {
            var hideCollapserFn = $(dom).data('hideCollapser');
            hideCollapserFn();
        });
    };
    return self;
})();

/**
 * build collapse for DOM / tr-DOM
 * OPT
 * ifShowIcon: bool (default: false) - if show icon on source-link(self)
 * iconInHead: bool (default: true) - icon place in head of source-link, otherwise place in tail
 * closeOthers: bool (default: true) - close others collapse when DOM clicked (in same level)
 * cursor: string (default: 'pointer') - DOM cursor
 * append: 'append'/'prepend'/'after'/'before' (default:'after') - the content is append/prepend/after/before DOM (as jQuery)
 * appendTarget: str/DOM (default: null) - append to target-DOM if set
 * disableToggle: bool (default: false) - click DOM will do nothing if true
 * defaultShow: bool (default: false) - show content after built-collapse
 * beforeShow: fn (default: null) - fire fn before show
 * beforeHide: fn (default: null) - fire fn before hide
 * afterShow: fn (default: null) - fire fn after show
 * afterHide: fn (default: null) - fire fn after hide
 *
 * FN
 * toggleCollapser
 * showCollapser
 * hideCollapser
 * hideOthersCollapser
 * @param content
 * @param [opt]
 * @returns {$.fn}
 */
$.fn.mCollapser = function (content, opt) {
    var self = this;
    var dIconUp = (function () {
        return $.lDom.createIcon('chevron-up').css({
            'font-size': '65%'
        });
    })();
    var dIconDown = (function () {
        return $.lDom.createIcon('chevron-down').css({
            'font-size': '65%'
        });
    })();
    var aAppend = ['append', 'prepend', 'after', 'before'];
    var collapserIndex = $.mCollapser.index;
    var selfId = $.mCollapser.selfId;
    var dCollapserClass = selfId;
    var dCollapserIndexClass = dCollapserClass + collapserIndex;
    var sourceClass = $.mCollapser.sourceName;
    var sourceIndexClass = sourceClass + collapserIndex;
    var targetClass = $.mCollapser.targetName;
    var targetIndexClass = targetClass + collapserIndex;
    var contentClass = $.mCollapser.contentName;
    var contentId = contentClass + collapserIndex;
    var toggleCollapser = function () {
        if (closeOthers) {
            hideOthersCollapser();
        }
        if (dCollapseContent.is(':hidden')) {
            showCollapser();
        } else {
            hideCollapser();
        }
    };
    var showIconUp = function () {
        if (!ifShowIcon) {
            return;
        }
        dIconDown.remove();
        if (iconInHead) {
            self.prepend(dIconUp);
            return;
        }
        self.append(dIconUp);
    };
    var showIconDown = function () {
        if (!ifShowIcon) {
            return;
        }
        dIconUp.remove();
        if (iconInHead) {
            self.prepend(dIconDown);
            return;
        }
        self.append(dIconDown);
    };
    var showCollapser = function () {
        beforeShow && beforeShow();
        showIconDown();
        dCollapser.show();
        dCollapseContent.slideDown(function () {
            afterShow && afterShow();
        });
    };
    var hideCollapser = function () {
        beforeHide && beforeHide();
        showIconUp();
        dCollapseContent.slideUp(function () {
            dCollapser.hide();
            afterHide && afterHide();
        });
    };
    var hideOthersCollapser = function () {
        $.each($('.' + dCollapserClass), function (i, dEachCollapser) {
            dEachCollapser = $(dEachCollapser);
            // not same dCollapse
            if (dCollapser.get(0) !== dEachCollapser.get(0)) {
                dEachCollapser.find('.' + contentClass).slideUp(function () {
                    dEachCollapser.hide();
                });
            }
        });
    };
    var ifShowIcon = false;
    var iconInHead = true;
    var closeOthers = true;
    var cursor = 'pointer';
    var append = 'after';
    var appendTarget = self;
    var disableToggle = false;
    var defaultShow = false;
    var beforeShow = null;
    var beforeHide = null;
    var afterShow = null;
    var afterHide = null;
    if (opt) {
        ifShowIcon = opt.ifShowIcon == true;
        iconInHead = opt.iconInHead !== false;
        closeOthers = opt.closeOthers !== false;
        cursor = (opt.cursor) ? opt.cursor : 'pointer';
        append = (aAppend.indexOf(opt.append) > -1) ? opt.append : 'after';
        appendTarget = opt.appendTarget ? opt.appendTarget : appendTarget;
        disableToggle = opt.disableToggle === true;
        defaultShow = opt.defaultShow === true;
        beforeShow = opt.beforeShow ? opt.beforeShow : beforeShow;
        beforeHide = opt.beforeHide ? opt.beforeHide : beforeHide;
        afterShow = opt.afterShow ? opt.afterShow : afterShow;
        afterHide = opt.afterHide ? opt.afterHide : afterHide;
        appendTarget = $.lHelper.coverToDom(appendTarget);
    }
    var dCollapseContent = (function () {
        return $('<div></div>')
            .lClass(contentClass)
            .lClass(contentId)
            .html(content);
    })();
    var dCollapser = (function () {
        var dCollapser = null;
        if (appendTarget.is('tr')) {
            var tdLength = appendTarget.find('td').length;
            dCollapser = $('<tr></tr>');
            var collapseTd = $('<td></td>');
            collapseTd.attr('colspan', tdLength).html(dCollapseContent);
            dCollapser.append(collapseTd);
        } else {
            dCollapser = $('<div></div>');
            dCollapser.append(dCollapseContent);
        }
        dCollapser
            .css({
                'padding': '10px'
            })
            .lClass(dCollapserClass)
            .lClass(dCollapserIndexClass);
        return dCollapser;
    })();

    self
        .lClass(sourceClass)
        .lClass(sourceIndexClass);
    appendTarget
        .lClass(targetClass)
        .lClass(targetIndexClass);
    appendTarget[append](dCollapser);
    if (!disableToggle) {
        self.css('cursor', cursor);
        self.action('click.' + selfId, toggleCollapser);
    }
    if (!defaultShow) {
        dCollapser.hide();
        dCollapseContent.hide();
    }
    if (dCollapser.isHidden()) {
        showIconUp();
    }
    else {
        showIconDown();
    }
    $.mCollapser.index++;
    self.dCollapser = dCollapser;
    self.toggleCollapser = toggleCollapser;
    self.showCollapser = showCollapser;
    self.hideCollapser = hideCollapser;
    self.hideOthersCollapser = hideOthersCollapser;
    self.data('showCollapser', showCollapser);
    self.data('hideCollapser', hideCollapser);
    return self;
};