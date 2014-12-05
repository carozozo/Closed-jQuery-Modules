$.fn.pPaymentList = function () {
    var self = this;
    var pageSizeName = 'paymentListPageSize';
    var pageSize = $.lCookie.get(pageSizeName);
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pPayment.pagePms)) {
        return self;
    }
    if (pageSize) {
        $.pPaymentListOpt.pageSize = pageSize;
    }
    var dPaymentListFn = function () {
        var dList = self.find('#list');
        var oOrderTransactionList = null;
        $.pPaymentListOpt.resources = 'order,payment,paymentTransaction';
        $.ajax.orderTransaction.getOrderTransactionListAJ($.pPaymentListOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oOrderTransactionList = $.lObj.cloneObj(result);
            });
        });
        $.lConsole.log('oOrderTransactionList=', oOrderTransactionList);
        if (!oOrderTransactionList) {
            return dList;
        }
        dList.dListTable = (function () {
            var oaOrderTransaction = oOrderTransactionList.results;
            var dListTable = self.find('#listTable');
            var memberNos = [];
            var oaMember = [];
            $.each(oaOrderTransaction, function (i, oOrderTransaction) {
                oaOrderTransaction[i] = tmd.pOrderTransaction(oOrderTransaction);
                // for getting member info
                var memberNo = oaOrderTransaction[i].memberNo;
                memberNos.pushNoDuplicate(memberNo);
            });
            (function getMembersInfo() {
                memberNos = memberNos.join(',');
                var opt = {
                    memberNos: memberNos
                };
                $.ajax.member.getMemberListAJ(opt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        oaMember = result.results;
                    });
                });
                $.each(oaMember, function (index, oMember) {
                    oaMember[index] = tmd.pMember(oMember);
                });
            })();
            dListTable.mListTable(oaOrderTransaction, null, function (index, oOrderTransaction, dEachDom) {
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html(($.pPaymentListOpt.startPage * $.pPaymentListOpt.pageSize) + index + 1);
                })();
                (function setUserInfo() {
                    var dUserName = dEachDom.find('.userName');
                    var dRoleName = dEachDom.find('.roleName');
                    var dTeamName = dEachDom.find('.teamName');
                    var dCompanyName = dEachDom.find('.companyName');
                    var memberNo = oOrderTransaction.memberNo;
                    $.each(oaMember, function (i, oMember) {
                        var memberNoInMemberInfo = oMember.memberNo;
                        if (memberNoInMemberInfo === memberNo) {
                            var userName = oMember.userName;
                            var roleName = oMember.roleName;
                            var teamName = oMember.teamName;
                            var companyName = oMember.companyName;
                            dUserName.html(userName);
                            dRoleName.html(roleName);
                            dTeamName.html(teamName);
                            dCompanyName.html(companyName);
                        }
                    })
                })();
                (function setLastPaymentStatus() {
                    var dLastPaymentStatus = dEachDom.find('.lastPaymentStatus');
                    var lastPaymentStatus = oOrderTransaction.lastPaymentStatus;
                    if (!lastPaymentStatus) {
                        return;
                    }
                    lastPaymentStatus = lastPaymentStatus.toUpperCase();
                    var langPath = 'common.paymentStatusOpt.' + lastPaymentStatus;
                    var dLangSpan = $.lDom.createLangSpan(langPath);
                    dLastPaymentStatus.html(dLangSpan);
                })();
                (function setDetailBtn() {
                    var dDetailBtn = dEachDom.find('.detailBtn');
                    var paymentReferences = oOrderTransaction.paymentReferences;
                    if (!paymentReferences) {
                        dDetailBtn.hide();
                    }
                    // Note: oPayment.paymentReference = oPaymentOrderTransaction.paymentId in paymentDetail page
                    dDetailBtn.mBtn('detail', function () {
                        var opt = {
                            paymentIds: paymentReferences
                        };
                        $.lUtil.goPage($.pPayment.paymentDetailPath, opt);
                    });
                })();
                return dListTable;
            });
            return dListTable;
        })();
        (function dPagination() {
            var dPagination = self.find('#pagination');
            // API-returned diff from before, transform what we need
            var startPage = $.pPaymentListOpt.startPage;
            var pageSize = oOrderTransactionList.size;
            var totalCount = oOrderTransactionList.total;
            var totalPage = Math.floor(totalCount / pageSize);
            var remainder = (totalCount % pageSize);
            if (remainder) {
                totalPage++;
            }
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    $.pPaymentListOpt.startPage = page;
                    $.pPaymentListOpt.pageSize = pageSize;
                    $.lCookie.set(pageSizeName, pageSize);
                    dPaymentListFn();
                }
            };
            dPagination = dPagination.mPagination(opt);
            return dPagination;
        })();
        return dList;
    };
    var searchFn = function () {
        $.pPaymentListOpt.startPage = 0;
        var mSearch = $.lForm.coverToModel(dSearch);
        var mFullSearch = $.lForm.coverToModel(dFullSearch);
        (function setListOptByPaymentStatus() {
            var paymentStatus = dFullSearch.dPaymentStatus.val();
            $.pPayment.setListOptWithPaymentStatus(paymentStatus);
        })();
        $.extend($.pPaymentListOpt, mSearch, mFullSearch);
        dPaymentListFn();
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
        $.lModel.mapDom($.pPaymentListOpt, dSearch);
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
        dFullSearch.dPaymentStatus = (function () {
            var dPaymentStatus = dFullSearch.find('#paymentStatus');
            return dPaymentStatus;
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

        $.lModel.mapDom($.pPaymentListOpt, dFullSearch, function () {
            (function setPaymentStatus() {
                if ($.pPaymentListOpt.pendingPaymentView === 1) {
                    if ($.pPaymentListOpt.containsPendingPayment === 0) {
                        dFullSearch.dPaymentStatus.val('pendingPayment');
                    }
                    else if ($.pPaymentListOpt.containsPendingPayment === 1) {
                        dFullSearch.dPaymentStatus.val('pendingPaymentConfirmation');
                    }
                }
            })();
        });
        return dFullSearch;
    })();
    var dPaymentList = dPaymentListFn();
    dSearchLink.mCollapser(dFullSearch, {
        append: 'before',
        appendTarget: dPaymentList.dListTable,
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