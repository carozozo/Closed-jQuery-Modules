$.pReg = (function () {
    var self = {};
    self.pagePms = ['regReadPms', 'regEditPms'];
    self.regListPath = '/registration/list/regList';
    self.regApprovePath = '/registration/approve/regApprove';
    self.getDefListOpt = function () {
        return $.lHelper.getListPageOpt({
            sortDir: 'DESC'
        });
    };
    self.setCrumbs = function () {
        $.mCrumbs.regCrumb('regList', 'pReg.list.pageTitle', function () {
            $.lUtil.goPage(self.regListPath);
        });
        $.mCrumbs.regCrumb('regApprove', 'pReg.approve.pageTitle');
    };
    return self;
})();


$.tPageInfo[$.pReg.regListPath] = {
    title: 'pReg.list.pageTitle',
    initFn: function () {
        $('#regListPage').pRegList();
    }
};

$.tPageInfo[$.pReg.regApprovePath] = {
    title: 'pReg.approve.pageTitle',
    initFn: function (opt) {
        $.pReg.setCrumbs();
        $.mCrumbs.render();
        $('#approvePage').pRegApprove(opt);
    }
};

$.pRegListOpt = $.pReg.getDefListOpt();

$.lEventEmitter.hookEvent('befLogin', 'pReg', function () {
    $.pRegListOpt = $.pReg.getDefListOpt();
});