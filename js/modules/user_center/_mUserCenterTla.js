/**
 * the l18n with user center module
 * @author Caro.Huang
 */

tla.mUserCenter = {};
tla.mUserCenter.en_us = {
    Greeting: function (displayName) {
        return 'Hello ' + displayName;
    },
    UserInfo: {
        title: 'User Info',
        Role: 'Role',
        ChangePwd: 'Change Password',
        CheckPwd: 'Check Password',
        resMsg: {
            1007: 'User name exist',
            5101: 'Record not found'
        }
    },
    Logout: 'Logout'
};

tla.mUserCenter.zh_cn = {
    Greeting: function (displayName) {
        return '您好 ' + displayName;
    },
    UserInfo: {
        title: '个人资料',
        Role: '身份',
        ChangePwd: '修改密码',
        CheckPwd: '确认密码',
        resMsg: {
            1007: '使用者名称已存在',
            5101: '资料不存在'
        }
    },
    Logout: '登出'
};

tla.mUserCenter.zh_tw = {
    Greeting: function (displayName) {
        return '您好 ' + displayName;
    },
    UserInfo: {
        title: '個人資料',
        Role: '身份',
        ChangePwd: '修改密碼',
        CheckPwd: '確認密碼',
        resMsg: {
            1007: '使用者名稱已存在',
            5101: '資料不存在'
        }
    },
    Logout: '登出'
};