/**
 * The lib about web page handle
 * @author Caro.Huang
 */

$.lPage = (function () {
    var self = {};
    var _oPageInfo = {};
    var _oIndexPageInfo = {};
    var _oLoginPageInfo = {};
    var getIndexPageInfo = function () {
        return  _oIndexPageInfo;
    };
    var setIndexPageInfo = function (page, pageOpt) {
        if (!page)
            return;
        page = $.lStr.addHead(page, '/');
        _oIndexPageInfo = {
            page: page,
            pageOpt: pageOpt
        };
    };
    var getLoginPageInfo = function () {
        return _oLoginPageInfo;
    };
    var setLoginPageInfo = function (page, pageOpt) {
        if (!page)
            return;
        page = $.lStr.addHead(page, '/');
        _oLoginPageInfo = {
            page: page,
            pageOpt: pageOpt
        };
    };
    var getPreviewPageInfo = function () {
        if (!$.lUtil.isLogon()) {
            return getLoginPageInfo();
        }
        var oIndexPage = getIndexPageInfo();
        var oPreviewPage = $.lCookie.get('previewPage');
        if (!oPreviewPage || !$.lHelper.isObj(oPreviewPage) || !oPreviewPage.page) {
            return oIndexPage;
        }
        var page = oPreviewPage.page;
        if (self.checkedPrevewPage === page) {
            return oPreviewPage;
        }
        // page is .html file that under /templates
        page = $.lStr.addHead(page, '/');
        page = $.lStr.addHead(page, 'templates');
        page = $.lStr.addTail(page, '.html');
        $.ajax.main.ifFileExistsAJ({
            filePath: page
        }, function (res) {
            $.lAjax.parseRes(res, function (result) {
                // result is bool for file-exists
                if (!result) {
                    oPreviewPage = oIndexPage;
                    return;
                }
                self.checkedPrevewPage = oPreviewPage.page;
            }, function () {
                // get error
                oPreviewPage = oIndexPage;
            });
        });
        return oPreviewPage;
    };
    var setPreviewPageInfo = function (page, pageOpt) {
        // TODO 新增排除機制
        page = $.lStr.addHead(page, '/');
        if (page === self.getLoginPage()) {
            return;
        }
        var oPreviewPage = {
            page: page,
            pageOpt: pageOpt
        };
        // emit custom even
        var emitObj = {previewPage: oPreviewPage};
        if ($.lEventEmitter.emitEvent('befSetPreviewPage', emitObj) === false) {
            return;
        }

        $.lCookie.set('previewPage', oPreviewPage);
        $.tSysVars.previewPage = oPreviewPage;
        self.setPageOpt(page, pageOpt, {
            ifReset: true
        });
        // emit custom even
        $.lEventEmitter.emitEvent('aftSetPreviewPage', emitObj);
    };
    var getPageDefOpt = function (page) {
        var oPageInfo = self.getPageInfo(page);
        if (!oPageInfo || !oPageInfo.pageDefOpt) {
            return null;
        }
        // pageDefOpt is obj , must clone to prevent modified by other fn
        return $.lObj.cloneObj(oPageInfo.pageDefOpt);
    };
    var setPageOptToDef = function (page) {
        // pageDefOpt is obj , must clone to prevent modified by other fn
        var pageDefOpt = getPageDefOpt(page);
        self.setPageOpt(page, pageDefOpt, {
            ifReset: true
        });
        return pageDefOpt;
    };
    var initPage = function (oPageInfo) {
        var pageOpt = oPageInfo.pageOpt;
        // pageInfo.title is lang-path
        var titleLangPath = oPageInfo.title;
        var initFn = oPageInfo.initFn;
        var webTitle = $.tCfg.webTitle || '';
        var setTitle = function () {
            var title = $.lLang.parseLanPath(titleLangPath);
            $('title').html(webTitle + ' - ' + title);
        };
        $.lEventEmitter.hookEvent('aftSwitchLang', 'page', setTitle);
        setTitle();
        pageOpt = pageOpt || oPageInfo.pageOpt;
        initFn && initFn(pageOpt);
    };

    self.getIndexPage = function () {
        return  _oIndexPageInfo.page;
    };
    self.getLoginPage = function () {
        return  _oLoginPageInfo.page;
    };
    self.getPreviewPage = function () {
        var oPreviewPageInfo = getPreviewPageInfo();
        return oPreviewPageInfo && oPreviewPageInfo.page;
    };
    /**
     * get page-option including basic-list-opt
     * @param pageSizeName
     * @param [extendOpt]
     * @returns {{startPage: number, pageSize: number}}
     */
    self.getPageListOpt = function (pageSizeName, extendOpt) {
        var pageSize = 10;
        if (pageSizeName) {
            pageSizeName = $.lStr.addTail(pageSizeName, 'PageSize');
            pageSize = $.lCookie.get(pageSizeName) || 10;
        }
        var pageOpt = {
            startPage: 0,
            pageSize: pageSize
        };
        if (extendOpt) {
            $.extend(pageOpt, extendOpt);
        }
        return pageOpt
    };
    /**
     * set page-size by cookie with page-sizeName
     * @param pageSizeName
     * @param pageSize
     */
    self.setPageSize = function (pageSizeName, pageSize) {
        pageSizeName = $.lStr.addTail(pageSizeName, 'PageSize');
        $.lCookie.set(pageSizeName, pageSize);
    };
    self.getPageInfo = function (page) {
        return  _oPageInfo[page] || null;
    };
    self.setPageInfo = function (page, opt) {
        var pms = opt.pms;
        var title = opt.title;
        var pageOpt = opt.opt;
        var pageDefOpt = $.lObj.cloneObj(pageOpt);
        var fn = opt.fn;

        if (opt.setIndex) {
            setIndexPageInfo(page, pageOpt);
        }
        else if (opt.setLogin) {
            setLoginPageInfo(page, pageOpt);
        }

        _oPageInfo[page] = {
            pagePms: pms,
            title: title,
            pageOpt: pageOpt,
            pageDefOpt: pageDefOpt,
            initFn: fn
        };
    };
    self.getPageOpt = function (page) {
        var oPageInfo = self.getPageInfo(page);
        return oPageInfo && oPageInfo.pageOpt;
    };
    self.setPageOpt = function (page, pageOpt, opt) {
        var oPageInfo = self.getPageInfo(page);
        var ifReset = false;
        if (opt) {
            ifReset = opt.ifReset === true;
        }
        if (ifReset && pageOpt) {
            oPageInfo.pageOpt = pageOpt;
            return;
        }
        oPageInfo.pageOpt = $.lObj.extendObj(oPageInfo.pageOpt, pageOpt);
    };
    self.goPage = function (page, pageOpt, opt, cb) {
        var oPageInfo = self.getPageInfo(page);
        if (!oPageInfo) {
            self.goIndexPage();
            return;
        }
        var pagePms = oPageInfo.pagePms;
        if (pagePms && !$.lUtil.authUserPms(pagePms)) {
            self.goIndexPage();
            return;
        }
        var sTarget = 'Container';
        var dTarget = $('#container');
        var tplOpt = {
            target: dTarget
        };
        var runInit = false;
        var goBody = false;
        var emitObj = {page: page};
        if ($.lHelper.isFn(opt)) {
            cb = opt;
            opt = null;
        }
        else if ($.lHelper.isObj(opt)) {
            goBody = opt.goBody === true;
        }
        if (goBody) {
            sTarget = 'Body';
            dTarget = $('body');
            tplOpt.tplType = 'content';
            runInit = true;
        }
        tplOpt.target = dTarget;

        // emit custom even
        if ($.lEventEmitter.emitEvent('bef' + sTarget + 'Switch', emitObj) === false) {
            return;
        }
        $.lUtil.getPageSwitch(page, tplOpt, function () {
            if (runInit) {
                $.init.startInit();
            } else {
                $.lLang.switchLang(dTarget);
            }
            setPreviewPageInfo(page, pageOpt);
            self.setPageOpt(page, pageOpt, {
                ifReset: true
            });
            initPage(oPageInfo);
            cb && cb();
            $.lEventEmitter.emitEvent('aft' + sTarget + 'Switch', emitObj);
        });
    };
    self.goIndexPage = function (opt, cb) {
        var previewPage = self.getPreviewPage();
        var indexPage = self.getIndexPage();
        if (indexPage === previewPage) {
            return;
        }
        var oIndexPage = getIndexPageInfo();
        var page = oIndexPage.page;
        var pageOpt = oIndexPage.pageOpt;
        self.goPage(page, pageOpt, opt, cb);
    };
    /**
     * go preview-page
     * OPT
     * goBody: bool (default: true) - if replace all html in $('body')
     * byDefault: bool (default: false) - if switch page by default-pageOpt
     * @param [opt]
     * @param [cb]
     */
    self.goPreViewPage = function (opt, cb) {
        var goBody = true;
        var byDefault = false;
        if (opt) {
            goBody = opt.goBody !== false;
            byDefault = opt.byDefault == true;
        }
        var oPreviewPage = getPreviewPageInfo();
        var page = oPreviewPage.page;
        var pageOpt = oPreviewPage.pageOpt;
        if (byDefault) {
            pageOpt = setPageOptToDef(page);
        }
        self.goPage(page, pageOpt, {
            goBody: goBody
        }, cb);
    };
    /**
     * go page by default-pageOpt
     * @param page
     * @param [opt]
     * @param [cb]
     */
    self.goPageByDefault = function (page, opt, cb) {
        var pageDefOpt = setPageOptToDef(page);
        self.goPage(page, pageDefOpt, opt, cb);
    };
    self.getPageDefOpt = getPageDefOpt;
    return self;
})();