/**
 * the user create model
 * @author Caro.Huang
 */

$.tMod.mUserCenter = {};

$.tMod.mUserCenter.userUpdate = function () {
    var obj = {};
    var oUserInfo = $.lUtil.getUserInfo();
    obj.uid = oUserInfo.uid;
    obj.userName = oUserInfo.userName;
    obj.pwd = null;
    obj.email = null;
    obj.displayName = null;
    obj.roleId = oUserInfo.roleJ.roleId;
    obj.status = oUserInfo.status;
    return obj;
};