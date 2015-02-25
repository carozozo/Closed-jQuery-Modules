/**
 * The user center module
 * v2.0
 * @author Caro.Huang
 */

$.init(function () {
    $.mUserCenter();
});

/**
 * user center web ui, only show user name and logout so far
 */
$.mUserCenter = function () {
    var self = {};
    var selfId = 'mUserCenter';
    var langPathRoot = selfId + '.';
    var greetingLangFn = $.lLang.parseLanPath(langPathRoot + 'Greeting');
    var dUserInfo = (function () {
        var selfId = 'mUserInfo';
        var dUserInfo = $('<div></div>').lId(selfId);
        var dUserInfoLangPathRoot = langPathRoot + 'UserInfo.';
        if (!$.lUtil.isLogon()) {
            $.lEventEmitter.unHookEvent('aftSwitchLang', selfId);
            return null;
        }
        // get html code
        if (!dUserInfo.pageHtml) {
            dUserInfo.pageHtml = $.lPage.getPageHtml('m_user_center/userInfo', {
                ifSwitch: false,
                async: false
            });
        }
        dUserInfo.html(dUserInfo.pageHtml);
        var setForm = function () {
            formChecker.removeCheckerClass();
            $.lForm.clean(dForm);
            var oUserInfo = $.lUtil.getUserInfo();
            // auto mapping the value to form-Dom
            $.lModel.mapDom(oUserInfo, dForm, function () {
                if (oUserInfo && oUserInfo.roleJ && oUserInfo.roleJ.name)
                    dForm.find('#roleName').setVal(oUserInfo.roleJ.name);
            });
        };
        var dForm = dUserInfo.find('form');
        var dPwd = (function aa() {
            var opt = {
                maxLength: 30
            };
            var dPwd = dForm.find('#pwd');
            dPwd.mInputRestrict('textNum', opt);
            return dPwd;
        })();
        var dCheckPwd = (function () {
            var dCheckPwd = dForm.find('#checkPwd');
            dCheckPwd.mInputRestrict();
            return dCheckPwd;
        })();
        var dEmail = (function () {
            var dEmail = dForm.find('#email');
            dEmail.mInputRestrict('email');
            return dEmail;
        })();
        var dDisplayName = (function () {
            var dDisplayName = dForm.find('#displayName');
            dDisplayName.mInputRestrict('textNum');
            return dDisplayName;
        })();
        (function dSubmitBtn() {
            var dSubmitBtn = dForm.find('#submitBtn');
            dSubmitBtn.mBtn('submit', function () {
                var pass = formChecker.checkForm();
                if (!pass) {
                    return;
                }
                var opt = $.tMod.mUserCenter.userUpdate();
                dForm.mapModel(opt, function () {
                    $.ajax.user.updateUserAndSetInfoAJ(opt, function (res) {
                        $.mNtfc.showMsgAftUpdate(res, function (result) {
                            // result is updated user info
                            $.lUtil.setUserInfo(result);
                            var greetingLang = greetingLangFn(dDisplayName.val());
                            var dTabTitle = $.mNav.getTabTitle('userCenter');
                            dTabTitle.html(greetingLang);
                            dUserInfo.close();
                        }, function (result) {
                            var msg = $.lLang.parseLanPath(dUserInfoLangPathRoot + 'resMsg.' + result);
                            if (msg) {
                                $.mNtfc.show(msg, 'wng');
                                return false;
                            }
                            return true;
                        });
                    });
                });
            });
            return dSubmitBtn;
        })();
        (function dRevertBtn() {
            var dRevertBtn = dForm.find('#revertBtn');
            dRevertBtn.mBtn('revert', setForm);
            return dRevertBtn;
        })();

        var formChecker = (function () {
            var formChecker = $.mFormChecker({
                useTip: false
            });
            formChecker.addRequired([dDisplayName]);
            formChecker.addMinLength(dPwd, 8);
            formChecker.addEmail(dEmail);
            formChecker.addEqual(dCheckPwd, dPwd, function () {
                return  $.lLang.parseLanPath(dUserInfoLangPathRoot + 'ChangePwd');
            });
            return formChecker;
        })();
        (function setHook() {
            // change dialog-ui title when switch lang
            $.lEventEmitter.hookEvent('aftSwitchLang', selfId, function () {
                var title = $.lLang.parseLanPath(dUserInfoLangPathRoot + 'title');
                dUserInfo.dialog('option', 'title', title);
            });
        })();
        (function setDialog() {
            var title = $.lLang.parseLanPath(dUserInfoLangPathRoot + 'title');
            dUserInfo.dialog({
                position: { my: 'center center', at: 'center center'},
                modal: true,
                resizable: false,
                dialogClass: selfId,
                title: title,
                autoOpen: false,
                show: 'fade'
            });
        })();
        $.lLang.setLang(dUserInfo);
        setForm();
        dUserInfo.open = function () {
            dUserInfo.dialog('open');
        };
        dUserInfo.close = function () {
            dUserInfo.dialog('close');
        };
        return dUserInfo;
    })();
    (function init() {
        // setup UserCenter DOM by $.mNav
        var userInfoItem = {
            id: 'userInfoLink',
            iconId: 'edit',
            titleLangPath: langPathRoot + 'UserInfo.title',
            click: function () {
                dUserInfo.open();
            }
        };
        var logoutItem = {
            id: 'logoutLink',
            iconId: 'log-out',
            titleLangPath: langPathRoot + 'Logout',
            click: $.lUtil.logout
        };
        var opt = {
            side: 'right',
            dropDownItems: [userInfoItem, logoutItem],
            title: function () {
                var oUserInfo = $.lUtil.getUserInfo();
                return greetingLangFn(oUserInfo.displayName);
            },
            inLogged: true
        };
        $.mNav.regNav('userCenter', opt);
    })();
    self.dUserInfo = dUserInfo;
    return self;
};