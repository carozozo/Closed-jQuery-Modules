/**
 * dashboard module
 * others page-module can register some information to dashboard
 * and link to self page
 */

$.pDashboard = (function () {
    var self = {};
    self.dashboardPath = '/dashboard/dashboard';
    self.aDashboardFn = {};
    self.regDashboard = function (groupName, groupTitle, fn) {
        self.aDashboardFn[groupName] = {
            groupName: groupName,
            groupTitle: groupTitle,
            fn: fn
        };
    };

    var img = $.lDom.createImg('/img/logo/logo_travelglobal_02.png', 200).lClass('basic-link');
    $.mNav.regNavHeader(img, function () {
        if (!$.lUtil.isLogon()) {
            return;
        }
        $.lUtil.goPage(self.dashboardPath);
    });

    return self;
})();

$.tPageInfo[$.pDashboard.dashboardPath] = {
    title: 'common.Home',
    initFn: function () {
        $('#dashboard').pDashboardPage();
    }
};