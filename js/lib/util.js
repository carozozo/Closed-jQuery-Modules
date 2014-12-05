/**
 * The util lib about web page handle
 * @author Caro.Huang
 */

$.lUtil = (function () {
    var self = {};

    /**
     * check user if logon
     * @returns {boolean}
     */
    self.isLogon = function () {
        // if user not logon $.tSysVars.userInfo = false
        return $.tSysVars.userInfo !== false;
    };

    /**
     * check permission if in user's permissions
     * @param pms
     * @returns {boolean}
     */
    self.authUserPms = function (pms) {
        var userPms = $.tSysVars.userPms;
        if (!userPms) {
            return false;
        }
        // user has super admin permission
        if (userPms.indexOf('superAdminPms') > -1) {
            return true;
        }
        if ($.lHelper.isStr(pms) || $.lHelper.isNum(pms)) {
            pms = [pms];
        }
        var ret = false;
        $.each(pms, function (i, eachPms) {
            if (userPms.indexOf(eachPms) > -1) {
                ret = true;
            }
        });
        return ret;
    };

    /**
     * auth user's permissions and go index page if no passed
     * @param pms
     * @returns {boolean}
     */
    self.goIndexIfAuthPmsFailed = function (pms) {
        if (!self.authUserPms(pms)) {
            self.goIndexPage();
            return false;
        }
        return true;
    };

    /**
     * check all DOM with attr [pms]
     * if user's permissions not including [pms] value, remove DOM
     */
    self.checkPms = function (target) {
        target = $.lStr.toDom(target);
        if (target) {
            target = target.find('[pms]');
        } else {
            target = $('[pms]');
        }
        target.each(function (i, dom) {
            dom = $(dom);
            var pms = dom.lPms();
            pms = pms.split(',');
            if (!self.authUserPms(pms)) {
                dom.remove();
            }
        });
    };

    /**
     * get preview page (by cookie)
     * should like:{page:xxx,vars:xxx}
     * @returns {*}
     */
    self.getPreviewPage = function () {
        return $.lCookie.get('previewPage');
    };

    /**
     * set preview page (by cookie)
     * @param page
     * @param [vars]
     */
    self.setPreviewPage = function (page, vars) {
        var oPreviewPage = {
            page: page,
            vars: vars
        };

        // emit custom even
        var emitObj = {previewPage: oPreviewPage};
        if ($.lEventEmitter.emitEvent('befSetPreviewPage', emitObj) === false) {
            return;
        }
        $.lCookie.set('previewPage', oPreviewPage);
        $.tSysVars.previewPage = oPreviewPage;
        // emit custom even
        $.lEventEmitter.emitEvent('aftSetPreviewPage', emitObj);
    };

    /**
     * login user
     * @param userName
     * @param pwd
     * @param sucFn
     * @param errFn
     */
    self.login = function (userName, pwd, sucFn, errFn) {
        // emit custom even
        var emitObj = {userName: userName};
        if ($.lEventEmitter.emitEvent('befLogin', emitObj) === false) {
            return;
        }
        var opt = {
            userName: userName,
            pwd: pwd
        };
        $.ajax.main.loginAJ(opt, function (res) {
            // emit custom even
            if ($.lEventEmitter.emitEvent('aftLogin', emitObj) === false) {
                return;
            }
            $.lAjax.parseRes(res, function (result) {
                // refresh system-vars
                $.tSysVars = $.lObj.cloneObj(result);
                sucFn = $.lHelper.executeIfFn(sucFn, result);
                if (sucFn === false) {
                    // exit if sucFn return false
                    return;
                }
                var oPreviewPage = $.tSysVars.previewPage;
                var page = oPreviewPage.page;
                var vars = oPreviewPage.vars;
                self.getPageSwitchBody(page, {vars: vars});
            }, function (result) {
                $.lHelper.executeIfFn(errFn, result);
            });
        });
    };
    /**
     * logout user and delete uid, pms property
     * @param [sucFn]
     * @param [errFn]
     */
    self.logout = function (sucFn, errFn) {
        var $self = this;
        // in case repeat-called
        if ($self.isLogouting) {
            return;
        }
        $self.isLogouting = true;
        // emit custom even
        if ($.lEventEmitter.emitEvent('befLogout') === false) {
            return;
        }
        $.lAjax.abortRunningAjax();
        $.ajax.main.logoutAJ(function (res) {
            // emit custom even
            if ($.lEventEmitter.emitEvent('aftLogout') === false) {
                return;
            }
            $.lAjax.parseRes(res, function (result) {
                // refresh system-vars
                $.tSysVars = result;
                sucFn = $.lHelper.executeIfFn(sucFn, result);
                if (sucFn === false) {
                    // exit if sucFn return false
                    return;
                }
                var oPreviewPage = $.tSysVars.previewPage;
                var page = oPreviewPage.page;
                self.getPageSwitchBody(page, {setPreviewPage: false}, function () {
                    $self.isLogouting = false;
                });
            }, function (result) {
                $.lHelper.executeIfFn(errFn, result);
            });
        });
    };

    /**
     * get page content
     * @param page
     * @param [tplType]
     * @param [tplModel]
     */
    self.getPageHtml = function (page, tplType, tplModel) {
        var sHtml = '';
        var opt = {
            page: page,
            tplType: tplType,
            tplModel: tplModel
        };
        console.log('page=',page)
        console.log('opt=',opt)
        $.ajax.main.getPageAJ(opt, function (res) {
            $.lAjax.parseRes(res, function (html) {
                sHtml = html;
            });
        });
        return sHtml;
    };

    /**
     * get page content and switch to page
     * OPT
     * target: DOM/str (default: null) - the target that content input to
     * tplType: str (default: empty) - the template-type
     * tplModel: obj (default: null) - the model for template
     *
     * @param page
     * @param [opt]
     * @param [cb]
     */
    self.getPageSwitch = function (page, opt, cb) {
        var getPageOpt = {};
        if (opt) {
            getPageOpt.page = page;
            getPageOpt.tplType = opt.tplType || 'empty';
            getPageOpt.tplModel = opt.tplModel || null;
        }
        // abort running ajax first, then get page and switch
        $.lAjax.abortRunningAjax();
        $.ajax.main.getPageAsyncAJ(getPageOpt, function (res) {
            $.lAjax.parseRes(res, function (html) {
                $.tSysVars.nowPage = page;
                self.switchHtml(html, opt, cb);
            });
        });
    };

    /**
     * convenience setting for only get page content and input to target
     * @param page
     * @param target
     * @param [cb]
     */
    self.getPageSwitchTarget = function (page, target, cb) {
        var tplOpt = {
            target: target
        };
        self.getPageSwitch(page, tplOpt, cb);
    };

    /**
     * convenience settings of $.lUtil.getPageSwitch
     * target = #body
     * tplType = 'content' ( the template including header and footer )
     *
     * OPT
     * vars: obj (default: {}) - page-variables
     * setPreviewPage: bool (default: true) - if set PreviewPage
     *
     * @param page
     * @param [opt]
     * @param [cb]
     */
    self.getPageSwitchBody = function (page, opt, cb) {
        var dBody = $('body');
        var setPreviewPage = true;
        var emitObj = {page: page};
        var vars = {};
        var tplOpt = {
            tplType: 'content',
            target: dBody
        };

        if ($.lHelper.isFn(opt)) {
            cb = opt;
            opt = null;
        }
        else if ($.lHelper.isObj(opt)) {
            vars = opt.vars || vars;
            setPreviewPage = opt.setPreviewPage !== false;
        }

        // emit custom even
        if ($.lEventEmitter.emitEvent('befBodySwitch', emitObj) === false) {
            return;
        }

        self.getPageSwitch(page, tplOpt, function () {
            $.init.start();
            if (setPreviewPage) {
                self.setPreviewPage(page, vars);
            }
            cb && cb();
            // emit custom even
            $.lEventEmitter.emitEvent('aftBodySwitch', emitObj);
        });
    };

    /**
     * convenience settings of $.lUtil.getPageSwitchTarget
     * target = #container
     *
     * OPT
     * vars: obj (default: {}) - page-variables
     * setPreviewPage: bool (default: true) - if set PreviewPage
     *
     * @param page
     * @param [opt]
     * @param [cb]
     */
    self.getPageSwitchContainer = function (page, opt, cb) {
        var dContainer = $('#container');
        var setPreviewPage = true;
        var emitObj = {page: page};
        var vars = {};

        if ($.lHelper.isFn(opt)) {
            cb = opt;
            opt = null;
        }
        else if ($.lHelper.isObj(opt)) {
            vars = opt.vars || vars;
            setPreviewPage = opt.setPreviewPage !== false;
        }

        // emit custom even
        if ($.lEventEmitter.emitEvent('befContainerSwitch', emitObj) === false) {
            return;
        }

        self.getPageSwitchTarget(page, dContainer, function () {
            $.lLang.switchLang(dContainer);
            if (setPreviewPage) {
                self.setPreviewPage(page, vars);
            }
            cb && cb();
            $.lEventEmitter.emitEvent('aftContainerSwitch', emitObj)
        });
    };

    /**
     * convenience settings of $.lUtil.getPageSwitchContainer
     * use pageId to get $.tPageInfo that set, then go and init page
     *
     * @param page
     * @param [vars]
     */
    self.goPage = function (page, vars) {
        var pageInfo = $.tPageInfo[page];
        // title is lang-path
        var title = pageInfo.title;
        var initFn = pageInfo.initFn;
        var opt = {
            vars: vars
        };
        self.getPageSwitchContainer(page, opt, function () {
            initFn && initFn(vars);
            $('title').lSetLang(title);
        });
    };

    /**
     * go Index-page by switch-container
     */
    self.goIndexPage = function () {
        var indexPage = $.tSysVars.indexPage;
        self.goPage(indexPage);
    };

    /**
     * switch page with fade animation
     * OPT
     * target: DOM/str (default: $('body')) - the target that html code input
     * @param html
     * @param [opt]
     * @param [cb]
     */
    self.switchHtml = function (html, opt, cb) {
        var target = $('body');
        if ($.lHelper.isFn(opt)) {
            cb = opt;
            opt = null;
        }
        if (opt) {
            target = opt.target || target;
            target = $.lStr.toDom(target);
        }

        target.fadeOut(function () {
            target.html(html);
            self.checkPms(target);
            target.fadeIn();
            setTimeout(function () {
                cb && cb();
            }, 1);
        });
    };

    self.showLoading = function () {
        $.fancybox.helpers.overlay.open({
            parent: 'body',
            closeClick: false
        });
        $.fancybox.showLoading();
    };

    self.hideLoading = function () {
        $.fancybox.helpers.overlay.close();
        $.fancybox.hideLoading();
    };

    return self;
})();