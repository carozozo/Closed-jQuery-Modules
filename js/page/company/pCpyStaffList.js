$.fn.pCpyStaffList = function (pageOpt) {
    var self = this;
    var pageSizeName = 'cpyStaffListPageSize';
    var pageSize = $.lCookie.get(pageSizeName);
    var oCompany = null;
    var oStaffList = null;
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pCpy.pagePms)) {
        return self;
    }
    if (pageSize) {
        pageOpt.pageSize = pageSize;
    }
    $.ajax.company.getCompanyByIdAJ(pageOpt, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oCompany = $.lObj.cloneObj(result);
        });
    });
    $.lConsole.log('oCompany=', oCompany);
    if (!oCompany) {
        return self;
    }
    $.ajax.company.getMemberListByCompanyIdAJ(pageOpt, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oStaffList = $.lObj.cloneObj(result);
        });
    });
    $.lConsole.log('oStaffList=', oStaffList);
    if (!oStaffList) {
        return self;
    }
    (function dCpyName() {
        var cpyName = oCompany.name;
        var dCpyName = $('#cpyName');
        return dCpyName.html(cpyName);
    })();
    (function dCpyStaffListTable() {
        var oaStaff = oStaffList.results;
        var dCpyStaffListTable = self.find('#cpyStaffListTable');
        dCpyStaffListTable.mListTable(oaStaff, function (oStaff) {
            return tmd.pCompanyStaff(oStaff);
        }, function (index, oStaff, dEachDom) {
            (function setTeamName() {
                var dTeamName = dEachDom.find('.teamName');
                dTeamName.appendLoadingImg();
                setTimeout(function () {
                    // use oStaff as opt
                    $.ajax.team.getTeamByTeamIdAsyncAJ(oStaff, function (res) {
                        dTeamName.html('');
                        $.lAjax.parseRes(res, function (result) {
                            var teamName = result.name;
                            if (teamName) {
                                dTeamName.html(teamName);
                            }
                        });
                    });
                }, 100);
            })();
            (function setMemberNo() {
                var dMemberNo = dEachDom.find('.memberNo');
                var memberNo = oStaff.memberNo;
                if (memberNo && $.lUtil.authUserPms('memReadPms')) {
                    var memberId = oStaff.memberId;
                    var userLink = $.lDom.createLink(memberNo, function () {
                        var staffOpt = {
                            memberId: memberId
                        };
                        $.lUtil.goPage($.pMember.memberDetailPath, staffOpt);
                    });
                    dMemberNo.html(userLink);
                }
            })();
            (function setMemberStatus() {
                var dMemberStatus = dEachDom.find('.memberStatus');
                var memberStatus = oStaff.memberStatus;
                var langPath = 'common.' + memberStatus;
                dMemberStatus.lSetLang(langPath);
            })();
            (function setMemberAggregate() {
                setTimeout(function setMemberAggregate() {
                    var dUserName = dEachDom.find('.userName');
                    var dEmail = dEachDom.find('.email');
                    var dLastConnectedAt = dEachDom.find('.lastConnectedAt');
                    dUserName.appendLoadingImg();
                    dEmail.appendLoadingImg();
                    dLastConnectedAt.appendLoadingImg();
                    // use oStaff as opt
                    $.ajax.member.getMemberByIdAsyncAJ(oStaff, function (res) {
                        dUserName.html('');
                        dEmail.html('');
                        dLastConnectedAt.html('');
                        $.lAjax.parseRes(res, function (result) {
                            var userName = result.userName;
                            var email = result.email;
                            var lastConnectedAt = result.lastConnectedAt;
                            if (userName) {
                                dUserName.html(userName);
                            }
                            if (email) {
                                dEmail.html(email);
                            }
                            if (lastConnectedAt) {
                                lastConnectedAt = $.lDateTime.formatDateTime(lastConnectedAt, 'dateTime');
                                dLastConnectedAt.html(lastConnectedAt);
                            }
                        });
                    });
                }, 100);
            })();
        });

        return dCpyStaffListTable;
    })();
    (function dPagination() {
        var dPagination = self.find('#pagination');
        var startPage = oStaffList.currentPageNumber;
        var pageSize = oStaffList.pageSize;
        var totalCount = oStaffList.totalCount;
        var totalPage = oStaffList.totalPages;
        var opt = {
            startPage: startPage,
            pageSize: pageSize,
            totalCount: totalCount,
            totalPage: totalPage,
            clickFn: function (page, pageSize) {
                pageOpt.startPage = page;
                pageOpt.pageSize = pageSize;
                $.lCookie.set(pageSizeName, pageSize);
                self.pCpyStaffList(pageOpt);
            }
        };
        dPagination = dPagination.mPagination(opt);
        return dPagination;
    })();
    return self;
};