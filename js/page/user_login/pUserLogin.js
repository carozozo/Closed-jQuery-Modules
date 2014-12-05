$.pUserLogin = {};
$.pUserLogin.userLoginPath = '/login';

$.tPageInfo[$.pUserLogin.userLoginPath] = {
    title: 'pUserLogin.Login',
    initFn: function () {
        $('#userLogin').pUserLogin();
    }
};

$.fn.pUserLogin = function () {
    var self = this;
    var login = function () {
        var userName = dUserName.val();
        var pwd = dPwd.val();
        userName && $.lUtil.login(userName, pwd, function () {
                // get the remember-id last time
                var rememberId = $.lCookie.get('rememberId');
                // set remember id if box-checked
                setRememberId();
                // user is not remembered before, or no remembered user
                if ((rememberId && userName !== rememberId) || !rememberId) {
                    var indexPage = $.tSysVars.indexPage;
                    // set index page as preview-page
                    $.lUtil.setPreviewPage(indexPage);
                    // refresh system-vars
                    $.init.getSysVars();
                    $.lUtil.getPageSwitchBody(indexPage);
                    return false;
                }
                return true;
            },
            function (result) {
                var code = result.code;
                if (code === '1000' || code === 'disable') {
                    dUserName.focus().select();
                } else if (code === '1001') {
                    dPwd.focus().val('');
                }
                var msg = $.lLang.parseLanPath('pUserLogin.resMsg')[code];
                $.mNtfc.show(msg, 'wng');
                return false;
            }
        );
    };
    var setRememberId = function () {
        var rememberId = '';
        if (dRememberId.prop('checked')) {
            rememberId = dUserName.val();
        }
        $.lCookie.set('rememberId', rememberId);
    };
    var dUserName = (function () {
        var dUserName = self.find('#userName');
        dUserName.onPressEnter(function () {
            login();
        });
        return dUserName;
    })();
    var dPwd = (function () {
        var dPwd = self.find('#pwd');
        dPwd.onPressEnter(function () {
            login();
        });
        return dPwd;
    })();
    var dRememberId = (function () {
        var dRememberId = self.find('#rememberId');
        return dRememberId;
    })();
    (function dSubmit() {
        var dSubmit = self.find('#submit');
        dSubmit.action('click', function () {
            login();
        });
        return dSubmit;
    })();
    (function init() {
        var rememberId = $.lCookie.get('rememberId');
        if (rememberId) {
            dUserName.val(rememberId);
            dPwd.focus();
            dRememberId.prop('checked', true);
        } else {
            dUserName.focus();
        }
    })();
    return self;
};