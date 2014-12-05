$.pMember = (function () {
    var self = {};
    self.pagePms = ['memReadPms', 'memEditPms'];
    self.memberListPath = '/member/list/memberList';
    self.memberDetailPath = '/member/detail/memberDetail';
    self.memTravelerDetailPath = '/member/detail/memberTravelerDetail';
    self.getDefListOpt = function () {
        return $.lHelper.getListPageOpt({
            sortBy: 'recordCreatedAt',
            sortDir: 'DESC'
        });
    };
    self.setCrumbs = function (opt) {
        $.mCrumbs.regCrumb('memberList', 'pMember.list.pageTitle', function () {
            $.lUtil.goPage(self.memberListPath);
        });
        $.mCrumbs.regCrumb('memberDetail', 'pMember.detail.pageTitle', function () {
            $.lUtil.goPage(self.memberDetailPath, opt);
        });
        $.mCrumbs.regCrumb('memTravelerDetail', 'common.TravelerProfile');
    };
    return self;
})();


$.tPageInfo[$.pMember.memberListPath] = {
    title: 'pMember.list.pageTitle',
    initFn: function () {
        $('#memberListPage').pMemberList();
    }
};

$.tPageInfo[$.pMember.memberDetailPath] = {
    title: 'pMember.detail.pageTitle',
    initFn: function (opt) {
        $.pMember.setCrumbs(opt);
        $.mCrumbs.disable('memberDetail');
        $.mCrumbs.unRegCrumb('memTravelerDetail');
        $.mCrumbs.render();
        $('#detailPage').pMemberDetail(opt);
    }
};

$.tPageInfo[$.pMember.memTravelerDetailPath] = {
    title: 'common.TravelerProfile',
    initFn: function (opt) {
        $.pMember.setCrumbs(opt);
        $.mCrumbs.disable('memTravelerDetail');
        $.mCrumbs.render();
        $('#travelerDetailPage').pMemberTravelerDetail(opt);
    }
};

$.pMeListOpt = $.pMember.getDefListOpt();

$.lEventEmitter.hookEvent('befLogin', 'pMember', function () {
    $.pMeListOpt = $.pMember.getDefListOpt();
});