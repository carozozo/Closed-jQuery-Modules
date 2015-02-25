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
        return self.getUserInfo();
    };
    /**
     * check permission if in user's permissions
     * @param pms
     * @returns {boolean}
     */
    self.authUserPms = function (pms) {
        var userPms = $.lSysVar.getSysVar('userPms');
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
        target = $.lHelper.coverToDom(target);
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
        return $.lSysVar.getSysVar('userInfo');
    };
    /**
     * set user-info
     * @param oUserInfo
     */
    self.setUserInfo = function (oUserInfo) {
        if (!$.lHelper.isObj(oUserInfo)) return;
        $.lSysVar.setSysVar('userInfo', oUserInfo);
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
                $.lSysVar.updateSysVars(result);
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
     * logout user
     */
    self.logout = function () {
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
            $self.isLogouting = false;
            location.reload(true);
            $.lAjax.parseRes(res, function () {
            }, function () {
                $.lConsole.log('$.lUtil.logout error');
            });
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