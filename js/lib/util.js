/**
 * The util lib
 * @author Caro.Huang
 */

$.lUtil = (function () {
    var self = {};

    /**
     * check user if logon
     * @returns {boolean}
     */
    self.isLogon = function () {
        // if user not logon $.tSysVars.userInfo = null
        return self.getUserInfo();
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
     * get user-info obj
     * @returns {*}
     */
    self.getUserInfo = function () {
        return  $.tSysVars.userInfo;
    };
    /**
     * set user-info
     * @param oUserInfo
     */
    self.setUserInfo = function (oUserInfo) {
        if ($.lHelper.isObj(oUserInfo)) {
            $.tSysVars.userInfo = oUserInfo;
        }
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
                $.tSysVars.updateSysVars(result);
                sucFn = $.lHelper.executeIfFn(sucFn, result);
                if (sucFn === false) {
                    // exit if sucFn return false
                    return;
                }
                $.lPage.goPreViewPage({
                    byDefault: true
                });
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
                $.tSysVars.updateSysVars(result);
                sucFn = $.lHelper.executeIfFn(sucFn, result);
                if (sucFn === false) {
                    // exit if sucFn return false
                    return;
                }
                $.lPage.goPreViewPage(null, function () {
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
        var optForGetPage = {};
        if (opt) {
            optForGetPage.page = page;
            optForGetPage.tplType = opt.tplType || 'empty';
            optForGetPage.tplModel = opt.tplModel || null;
        }
        // abort running ajax first, then get page and switch
        $.lAjax.abortRunningAjax();
        $.ajax.main.getPageAsyncAJ(optForGetPage, function (res) {
            $.lAjax.parseRes(res, function (html) {
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
     * 之後要由 $.lPage.goPage 取代
     * @param page
     * @param [pageOpt]
     */
    self.goPage = function (page, pageOpt) {
        $.lPage.goPage(page, pageOpt);
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