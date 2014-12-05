$.fn.pMemberList = function () {
    var self = this;
    var pageSizeName = 'memberListPageSize';
    var pageSize = $.lCookie.get(pageSizeName);
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pMember.pagePms)) {
        return self;
    }
    if (pageSize) {
        $.pMeListOpt.pageSize = pageSize;
    }
    var dMemberListFn = function () {
        var dList = self.find('#list');
        var oMemberList = null;
        $.ajax.member.getMemberListAJ($.pMeListOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oMemberList = $.lObj.cloneObj(result);
            });
        });
        $.lConsole.log('oMemberList=', oMemberList);
        if (!oMemberList) {
            return dList;
        }
        dList.dListTable = (function () {
            var oaMember = oMemberList.results;
            var dListTable = self.find('#listTable');
            dListTable.mListTable(oaMember, function (oMember) {
                return tmd.pMember(oMember);
            }, function (index, oMember, dEachDom) {
                (function setTextShorter() {
                    var dCompanyName = dEachDom.find('.companyName');
                    var dDisplayName = dEachDom.find('.displayName');
                    var dEmail = dEachDom.find('.email');
                    var textShorterOpt = {
                        maxLength: 20
                    };
                    dCompanyName.mTextShorter(textShorterOpt);
                    dDisplayName.mTextShorter(textShorterOpt);
                    dEmail.mTextShorter(textShorterOpt);
                })();
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html(($.pMeListOpt.startPage * $.pMeListOpt.pageSize) + index + 1);
                })();
                (function setCpyProfileLink() {
                    if (!$.lUtil.authUserPms(['cpyReadPms', 'cpyEditPms'])) {
                        return;
                    }
                    var dName = dEachDom.find('.companyName');
                    var companyId = oMember.companyId;
                    var link = $.lDom.createLink(dName.html(), function () {
                        var cpyOpt = {
                            companyId: companyId
                        };
                        $.lUtil.goPage($.pCpy.cpyProfilePath, cpyOpt);
                    });
                    dName.empty().append(link);
                })();
                (function setMemberDetailLink() {
                    var dMemberNo = dEachDom.find('.memberNo');
                    var memberId = oMember.memberId;
                    var link = $.lDom.createLink(dMemberNo.html(), function () {
                        var memberOpt = {
                            memberId: memberId
                        };
                        $.lUtil.goPage($.pMember.memberDetailPath, memberOpt);
                    });
                    dMemberNo.empty().append(link);
                })();
                (function setIsTesting() {
                    var dIsTesting = dEachDom.find('.isTesting');
                    var isTesting = oMember.isTesting;
                    var langPath = 'common.No';
                    if (isTesting) {
                        langPath = 'common.Yes';
                        dIsTesting.lClass('basic-color-green');
                    }
                    dIsTesting.lSetLang(langPath);
                })();
                (function setMemberStatus() {
                    var dMemberStatus = dEachDom.find('.memberStatus');
                    var memberStatus = oMember.memberStatus;
                    dMemberStatus.lSetLang('pMember.list.status.' + memberStatus);
                })();
                // TODO pre-write
                (function setExportTamsBtn() {
                    var dExportTamsBtn = dEachDom.find('.exportTamsBtn');
                    var exportTampBtnTitle = $.lDom.createLangSpan('pMember.list.exportTampBtn.title');
                    dExportTamsBtn.mBtn('upload', {
                        title: exportTampBtnTitle
                    }, function () {
                        $.ajax.tamsProfile.createCustomerAJ(oMember, function (res) {
                            $.lAjax.parseRes(res, function () {
                                var msg = $.lLang.parseLanPath('pMember.list.resMsg.exportSuccess');
                                $.mNtfc.show(msg, 'suc');
                            }, function (result) {
                                var code = result.code;
                                var msg = $.lLang.parseLanPath('pMember.list.resMsg')[code];
                                $.mNtfc.show(msg, 'wng');
                            })
                        });
                    });
                })();
            });
            return dListTable;
        })();
        (function dPagination() {
            var dPagination = self.find('#pagination');
            var startPage = oMemberList.currentPageNumber;
            var pageSize = oMemberList.pageSize;
            var totalCount = oMemberList.totalCount;
            var totalPage = oMemberList.totalPages;
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    $.pMeListOpt.startPage = page;
                    $.pMeListOpt.pageSize = pageSize;
                    $.lCookie.set(pageSizeName, pageSize);
                    dMemberListFn();
                }
            };
            dPagination = dPagination.mPagination(opt);
            return dPagination;
        })();
        return dList;
    };
    var searchFn = function () {
        $.pMeListOpt.startPage = 0;
        var mSearch = $.lForm.coverToModel(dSearch);
        var mFullSearch = $.lForm.coverToModel(dFullSearch);
        $.extend($.pMeListOpt, mSearch, mFullSearch);
        dMemberListFn();
    };
    var dSearch = (function () {
        var dSearch = self.find('#search');
        (function dSearchInputs() {
            var dSearchInputs = dSearch.find(':input');
            dSearchInputs.onPressEnter(function () {
                searchFn();
            });
            return dSearchInputs;
        })();
        dSearch.dSearchSpan1 = (function () {
            var dSearchSpan1 = dSearch.find('#searchSpan1');
            return dSearchSpan1;
        })();
        dSearch.dSearchSpan2 = (function () {
            var dSearchSpan2 = dSearch.find('#searchSpan2');
            return dSearchSpan2;
        })();
        dSearch.dSearchBtnSpan = (function () {
            var dSearchBtnSpan = dSearch.find('#searchBtnSpan');
            (function dSearchBtn() {
                var dSearchBtn = dSearchBtnSpan.find('#searchBtn');
                dSearchBtn.mBtn('search', function () {
                    searchFn();
                });
                return dSearchBtn;
            })();
            (function dResetBtn() {
                var dResetBtn = dSearch.find('#resetBtn');
                dResetBtn.mBtn('clean', function () {
                    $.lForm.clean(dSearch);
                    $.lForm.clean(dFullSearch);
                });
                return dResetBtn;
            })();
            return dSearchBtnSpan;
        })();
        $.lModel.mapDom($.pCpyListOpt, dSearch);
        return dSearch;
    })();
    var dSearchLink = (function () {
        var dSearchLink = self.find('#searchLink');
        return dSearchLink;
    })();
    var dFullSearch = (function () {
        var dFullSearch = self.find('#fullSearch');
        (function dSearchInputs() {
            var dSearchInputs = dFullSearch.find(':input');
            dSearchInputs.onPressEnter(function () {
                searchFn();
            });
            return dSearchInputs;
        })();
        dFullSearch.dFullSearchSpan1 = (function () {
            var dFullSearchSpan1 = dFullSearch.find('#fullSearchSpan1');
            return dFullSearchSpan1;
        })();
        dFullSearch.dFullSearchSpan2 = (function () {
            var dFullSearchSpan2 = dFullSearch.find('#fullSearchSpan2');
            return dFullSearchSpan2;
        })();
        dFullSearch.dFullSearchBtnSpan = (function () {
            var dFullSearchBtnSpan = dFullSearch.find('#fullSearchBtnSpan');
            return dFullSearchBtnSpan;
        })();
        (function dCreatedFrom() {
            var dCreatedFrom = dFullSearch.find('#createdFrom');
            dCreatedFrom.mDatepicker({maxDate: '0'});
            return dCreatedFrom;
        })();
        (function dCreatedTo() {
            var now = $.lDateTime.formatDateTime();
            var dCreatedTo = dFullSearch.find('#createdTo');
            dCreatedTo.mDatepicker({maxDate: '0'});
            dCreatedTo.val(now).mDatepicker({maxDate: '0'});
            return dCreatedTo;
        })();
        $.lModel.mapDom($.pMeListOpt, dFullSearch);
        return dFullSearch;
    })();
    var dMemberList = dMemberListFn();
    dSearchLink.mCollapser(dFullSearch, {
        append: 'before',
        appendTarget: dMemberList.dListTable,
        beforeShow: function () {
            dSearch.dSearchSpan1.children().appendTo(dFullSearch.dFullSearchSpan1);
            dSearch.dSearchSpan2.children().appendTo(dFullSearch.dFullSearchSpan2);
            dSearch.dSearchBtnSpan.children().appendTo(dFullSearch.dFullSearchBtnSpan);
        },
        afterHide: function () {
            dFullSearch.dFullSearchSpan1.children().appendTo(dSearch.dSearchSpan1).hide().fadeIn();
            dFullSearch.dFullSearchSpan2.children().appendTo(dSearch.dSearchSpan2).hide().fadeIn();
            dFullSearch.dFullSearchBtnSpan.children().appendTo(dSearch.dSearchBtnSpan).hide().fadeIn();
        }
    });
    return self;
};