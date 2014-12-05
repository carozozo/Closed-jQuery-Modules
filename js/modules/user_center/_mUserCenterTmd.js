/**
 * the user create model
 * @author Caro.Huang
 */

tmd.mUserCenter = {};

tmd.mUserCenter.userUpdate = function () {
    var obj = {};
    var oUserInfo = $.tSysVars.userInfo;
    obj.uid = oUserInfo.uid;
    obj.userName = oUserInfo.userName;
    obj.pwd = null;
    obj.email = null;
    obj.displayName = null;
    obj.roleId = oUserInfo.roleJ.roleId;
    obj.status = oUserInfo.status;
    return obj;
};