// save the localities language
var tla = {};

// save the model
var tmd = {};

// save system-variables after $.init.getSysVars
$.tSysVars = (function () {
    var tSysVars = {};
    tSysVars.hostName = window.location.hostname;
    return tSysVars;
})();

/**
 * save page-info
 * ex.
 * $.tPageInfo['/index']={
 *  title: 'common.Home',
 *  initFn: function(){ ... }
 * }
 * @type {{}}
 */
$.tPageInfo = {};

$.init = (function () {
    var aFn = [];
    var self = function (fn, order) {
        var opt = {
            order: order,
            fn: fn
        };
        aFn.push(opt);
    };

    /**
     * run the init fns by order
     */
    self.start = function () {
        // sort the reg aFn by order
        aFn.sortByObjKey('order');
        $.each(aFn, function (index, obj) {
            var fn = obj.fn;
            $.lHelper.executeIfFn(fn);
        });
        self.initPage();
    };

    /**
     * get vars from system
     */
    self.getSysVars = function () {
        $.ajax.main.getVarsAJ(function (res) {
            $.lAjax.parseRes(res, function (result) {
                $.lConsole.log('getSysVars =', result);
                $.extend($.tSysVars, result);
            });
        });
    };

    /**
     * init page
     */
    self.initPage = function () {
        // init preview-page
        var oPreviewPage = $.tSysVars.previewPage;
        var page = oPreviewPage.page;
        var vars = oPreviewPage.vars;
        var oPageInfo = $.tPageInfo[page];
        // title is lang-path
        var title = oPageInfo.title;
        var initFn = oPageInfo.initFn;
        $('title').lSetLang(title);
        initFn(vars);
    };

    return self;
})();

// start when document ready
$(function () {
    $.lAjax.setupAjax();
    // set-timeout is used for [not be cached by browser]
    setTimeout(function () {
        $.init.getSysVars();
        var oPreviewPage = $.tSysVars.previewPage;
        var page = oPreviewPage.page;
        $.lUtil.getPageSwitchBody(page, {setPreviewPage: false});
    }, 50);
});