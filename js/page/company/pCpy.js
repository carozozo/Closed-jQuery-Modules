$.pCpy = (function () {
    var self = {};
    self.pagePms = ['cpyReadPms', 'cpyEditPms', 'cpyEwalletReadPms', 'cpyEwalletEditPms'];
    self.cpyListPath = '/company/list/cpyList';
    self.cpyProfilePath = '/company/profile/cpyProfile';
    self.cpyStaffListPath = '/company/staffList/cpyStaffList';
    self.cpyEwalletPath = '/company/ewallet/cpyEwallet';
    self.getDefListOpt = function () {
        return $.lHelper.getListPageOpt();
    };
    self.setCrumbs = function (opt) {
        $.mCrumbs.regCrumb('cpyList', 'pCpy.list.pageTitle', function () {
            $.lUtil.goPage(self.cpyListPath);
        });
        $.mCrumbs.regCrumb('cpyProfile', 'pCpy.profile.pageTitle', function () {
            $.lUtil.goPage(self.cpyProfilePath, opt);
        });
        $.mCrumbs.regCrumb('cpyStaffList', 'pCpy.staffList.pageTitle', function () {
            $.lUtil.goPage(self.cpyStaffListPath, opt);
        });
        $.mCrumbs.regCrumb('cpyEwallet', 'pCpy.eWallet.pageTitle', function () {
            $.lUtil.goPage(self.cpyEwalletPath, opt);
        });
    };
    return self;
})();

$.tPageInfo[$.pCpy.cpyListPath] = {
    title: 'pCpy.list.pageTitle',
    initFn: function () {
        $('#cpyListPage').pCpyList();
    }
};

$.tPageInfo[$.pCpy.cpyProfilePath] = {
    title: 'pCpy.profile.pageTitle',
    initFn: function (opt) {
        $.pCpy.setCrumbs(opt);
        $.mCrumbs.disable('cpyProfile');
        $.mCrumbs.render();
        $('#profilePage').pCpyProfile(opt);
    }
};

$.tPageInfo[$.pCpy.cpyStaffListPath] = {
    title: 'pCpy.staffList.pageTitle',
    initFn: function (opt) {
        $.pCpy.setCrumbs(opt);
        $.mCrumbs.disable('cpyStaffList');
        $.mCrumbs.render();
        $('#cpyStaffListPage').pCpyStaffList(opt);
    }
};

$.tPageInfo[$.pCpy.cpyEwalletPath] = {
    title: 'pCpy.eWallet.pageTitle',
    initFn: function (opt) {
        $.pCpy.setCrumbs(opt);
        $.mCrumbs.disable('cpyEwallet');
        $.mCrumbs.render();
        $('#ewalletPage').pCpyEwallet(opt);
    }
};

$.pCpyListOpt = $.pCpy.getDefListOpt();