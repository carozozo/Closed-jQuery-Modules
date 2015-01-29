/**
 * The base lib for DOM
 * @author Caro.Huang
 */

$.fn.isVisible = function () {
    return this.is(':visible');
};
$.fn.isHidden = function () {
    return !this.is(':visible');
};
$.fn.isEmpty = function () {
    return !$.trim(this.html());
};
/**
 * get / set DOM id
 * @param [sId]
 * @returns {*}
 */
$.fn.lId = function (sId) {
    if (sId !== undefined) {
        this.attr('id', sId);
        return this;
    }
    return this.attr('id');
};
/**
 * get / set DOM class
 * @param [sClass]
 * @returns {*}
 */
$.fn.lClass = function (sClass) {
    if (sClass !== undefined) {
        this.addClass(sClass);
        return this;
    }
    return this.attr('class');
};
/**
 * get / set DOM title
 * @param [sTitle]
 * @returns {*}
 */
$.fn.lTitle = function (sTitle) {
    if (sTitle !== undefined) {
        this.attr('title', sTitle);
        return this;
    }
    return this.attr('title');
};
/**
 * get / set DOM type
 * @param [sType]
 * @returns {*}
 */
$.fn.lType = function (sType) {
    if (sType !== undefined) {
        this.attr('type', sType);
        return this;
    }
    return this.attr('type');
};
/**
 * get / set DOM src
 * @param [sSrc]
 * @returns {*}
 */
$.fn.lSrc = function (sSrc) {
    if (sSrc !== undefined) {
        this.attr('src', sSrc);
        return this;
    }
    return this.attr('src');
};
/**
 * get / set DOM href
 * @param [sHref]
 * @returns {*}
 */
$.fn.lHref = function (sHref) {
    if (sHref !== undefined) {
        this.attr('href', sHref);
        return this;
    }
    return this.attr('href');
};
/**
 * get / set [pms] attr in DOM for $.lUtil.checkPms
 */
$.fn.lPms = function (pms) {
    if (pms) {
        this.attr('pms', pms);
        return this;
    }
    return this.attr('pms');
};
/**
 * get / set [set-lan] attr in DOM for $.lLang.switchLang
 * OPT
 * printErr: bool (default: true) - if set attr when lang not exists
 *
 * @param sLangPath
 * @param [opt]
 * @returns {*}
 */
$.fn.lSetLang = function (sLangPath, opt) {
    var printErr = true;
    if (opt) {
        printErr = opt.printErr !== false;
    }
    if ($.lHelper.isStr(sLangPath)) {
        var lang = $.lLang.parseLanPath(sLangPath, opt);
        if (!lang && !printErr) {
            return this;
        }
        this.attr('set-lan', sLangPath);
        $.lHelper.isStr(lang) && this.html(lang);
        return this;
    }
    return this.attr('set-lan');
};
/**
 * set the [on] event without duplicate firing
 * @param eve
 * @param fn
 */
$.fn.action = function (eve, fn) {
    this.off(eve).on(eve, function (e) {
        e.preventDefault();
        e.stopPropagation();
        return fn(e);
    });
    return this;
};
/**
 * enable the DOM
 */
$.fn.enable = function () {
    this.prop('disabled', false);
    return this;
};
/**
 * disable the DOM
 */
$.fn.disable = function () {
    this.prop('checked', true);
    return this;
};
$.fn.setChecked = function (bool) {
    bool = bool == true ? bool : false;
    this.prop('checked', bool);
    return this;
};
$.fn.isChecked = function () {
    return this.is(':checked');
};
/**
 * get DOM value
 * @returns {*}
 */
$.fn.getVal = function () {
    var val;
    if (this.is('input') || this.is('select') || this.is('textarea')) {
        val = this.val();
    }
    else {
        val = this.text();
    }
    if ($.lHelper.isStr(val)) {
        val = val.trim();
    }
    return val;
};
/**
 * set val to DOM
 * @param val
 */
$.fn.setVal = function (val) {
    if (this.is('input')) {
        var type = this.attr('type');
        switch (type) {
            case'radio':
                $.each(this, function (i, dom) {
                    dom = $(dom);
                    if (dom.val() == val) {
                        dom.prop('checked', true);
                    }
                });
                break;
            case'checkbox':
                if (this.val() == val) {
                    this.prop('checked', true);
                }
                break;
            default :
                this.val(val);
                break;
        }
        return this;
    }
    if (this.is('select') || this.is('textarea')) {
        this.val(val);
        return this;
    }
    var fmt = this.attr('fmt');
    switch (fmt) {
        case 'dateTime':
            val = $.lDateTime.formatDateTime(val, 'dateTime');
            break;
        case 'date':
            val = $.lDateTime.formatDateTime(val, 'date');
            break;
        case 'weekDate':
            val = $.lDateTime.formatDateTime(val, 'weekDate');
            break;
        case 'weekDateTime':
            val = $.lDateTime.formatDateTime(val, 'weekDateTime');
            break;
        case 'monthDay':
            val = $.lDateTime.formatDateTime(val, 'monthDay');
            break;
        case 'money':
            val = $.lStr.formatMoney(val, 'int');
            break;
        case 'sMoney':
            val = $.lStr.formatMoney(val, 'sInt');
            break;
        default :
            break;
    }
    this.html(val);
    return this;
};
$.fn.getTagName = function () {
    return this.prop('tagName');
};
/**
 * get DOM's whole-html
 * @returns {*}
 */
$.fn.getHtml = function () {
    var div = $('<div></div>');
    div.append(this.clone());
    var html = div.html();
    div.remove();
    return html;
};
/**
 * auto mapping DOM val to model with same key
 * ex.
 * $('#form').mapModel(modelObj,function(){
 *   do_something;
 * });
 * @param model
 * @param cb
 */
$.fn.mapModel = function (model, cb) {
    var self = this;
    // find each key in model, and put the mapping DOM value
    $.each(model, function (key) {
        var dom = self.find('#' + key);
        if (dom.length > 0) {
            model[key] = dom.getVal();
        }
    });
    cb && cb();
};
/**
 * set z-index
 * @returns {$.fn}
 */
$.fn.setIndexZ = function (zIndex) {
    if (zIndex) {
        this.css('z-index', zIndex);
        return this;
    }
    var indexZ = $.lHelper.getMaxIndexZ();
    this.css('z-index', ++indexZ);
    return this;
};
/**
 * append loading img do DOM
 */
$.fn.appendLoadingImg = function () {
    $.each(this, function (i, dom) {
        dom = $(dom);
        var img = $.lDom.createLoadingImg();
        dom.append(img);
    });
};
/**
 * slide effect to show
 * @param [direction]
 * @param [duration]
 * @param [cb]
 * @returns {*}
 */
$.fn.slideShow = function (direction, duration, cb) {
    if ($.lHelper.isFn(direction)) {
        cb = direction;
        direction = null;
    }
    if ($.lHelper.isFn(duration)) {
        cb = duration;
        duration = null;
    }
    direction = direction || 'left';
    $.each(this, function (i, dom) {
        dom = $(dom);
        dom.show('slide', {direction: direction}, duration, function () {
            cb && cb();
        });
    });
};
/**
 * slide effect to hide
 * @param [direction]
 * @param [duration]
 * @param cb
 * @returns {*}
 */
$.fn.slideHide = function (direction, duration, cb) {
    if ($.lHelper.isFn(direction)) {
        cb = direction;
        direction = null;
    }
    if ($.lHelper.isFn(duration)) {
        cb = duration;
        duration = null;
    }
    direction = direction || 'left';
    $.each(this, function (i, dom) {
        dom = $(dom);
        dom.hide('slide', {direction: direction}, duration, function () {
            cb && cb();
        });
    });
};
/**
 * toggle slide effect
 * @param direction
 * @param [duration]
 * @param cb
 * @returns {*}
 */
$.fn.slideToggle = function (direction, duration, cb) {
    if ($.lHelper.isFn(direction)) {
        cb = direction;
        direction = null;
    }
    if ($.lHelper.isFn(duration)) {
        cb = duration;
        duration = null;
    }
    direction = direction || 'left';
    $.each(this, function (i, dom) {
        dom = $(dom);
        dom.toggle('slide', {direction: direction}, duration, function () {
            cb && cb();
        });
    });
};
/**
 * fire fn if press Enter when focus on dom
 * @param fn
 * @param [nameSpace]
 */
$.fn.onPressEnter = function (fn, nameSpace) {
    $.each(this, function (i, dom) {
        var actionName = 'keyup';
        if (nameSpace) {
            actionName += '.' + nameSpace;
        }
        dom = $(dom);
        dom.on(actionName, function (e) {
            if ($.lHelper.isPressEnter(e)) {
                fn && fn();
            }
        });
    });
};

$.lDom = (function () {
    var self = {};

    /**
     * create link-DOM
     * @param content
     * @param [href] str|fn
     * @returns {*|jQuery|HTMLElement}
     */
    self.createLink = function (content, href) {
        var dA = $('<a></a>');
        dA.append(content);
        if ($.lHelper.isFn(href)) {
            dA.action('click', href);
        }
        if ($.lHelper.isStr(href)) {
            dA.lHref(href);
        }
        dA.css('cursor', 'pointer');
        return dA;
    };
    /**
     * create span with [set-lan] attribute
     * @param langPath
     * @returns {*|jQuery|HTMLElement}
     */
    self.createLangSpan = function (langPath) {
        var dSpan = $('<span></span>');
        dSpan.lSetLang(langPath);
        return dSpan;
    };
    /**
     * return obj-arr with span-DOM that include [set-lan] attribute
     * @param langPath
     * @returns {Array}
     */
    self.createLangSpanAuto = function (langPath) {
        var spanList = [];
        var lang = $.lLang.parseLanPath(langPath);

        if ($.lHelper.isObj(lang)) {
            $.each(lang, function (key) {
                var eachLangPath = langPath + '.' + key;
                spanList.push({
                    val: key,
                    name: self.createLangSpanAuto(eachLangPath)
                });
            });
        } else {
            spanList = self.createLangSpan(langPath);
        }
        return spanList;
    };
    /**
     * create loading img
     * @param [width]
     * @param [height]
     * @returns {*}
     */
    self.createLoadingImg = function (width, height) {
        width = width || 20;
        height = height || 20;
        return self.createImg('/img/loading.gif', width, height).lClass('loadingImg');
    };
    /**
     * create img
     * @param src
     * @param [width]
     * @param [height]
     * @returns {*|jQuery}
     */
    self.createImg = function (src, width, height) {
        var img = $('<img/>').lSrc(src);
        if (width) {
            img.css('width', width);
        }
        if (height) {
            img.css('height', height);
        }
        return img;
    };
    /**
     * create bootstrap icon
     * @param type
     * @returns {*|jQuery}
     */
    self.createIcon = function (type) {
        return $('<span></span>').lClass('glyphicon').lClass('glyphicon-' + type);
    };

    return self;
})();