$.fn.pOrderList = function () {
    var self = this;
    var pageSizeName = 'orderListPageSize';
    var pageSize = $.lCookie.get(pageSizeName);
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pOrder.pagePms)) {
        return self;
    }
    if (pageSize) {
        $.pOrderListOpt.pageSize = pageSize;
    }
    var dOrderListFn = function () {
        var dList = self.find('#list');
        var oOrderTransactionList = null;
        $.ajax.orderTransaction.getOrderTransactionListAJ($.pOrderListOpt, function (res) {
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
            var orderTransactionIds = [];
            var oaOrderFollowUp = [];
            $.each(oaOrderTransaction, function (i, oOrderTransaction) {
                oaOrderTransaction[i] = tmd.pOrderTransaction(oOrderTransaction);
                // for getting member info
                var memberNo = oaOrderTransaction[i].memberNo;
                memberNos.pushNoDuplicate(memberNo);
                // for getting follow-up
                var orderTransactionId = oaOrderTransaction[i].orderTransactionId;
                orderTransactionIds.push(orderTransactionId);
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

            (function getOrderFollowUpList() {
                orderTransactionIds = orderTransactionIds.join(',');
                var opt = {
                    orderTransactionIds: orderTransactionIds
                };
                $.ajax.orderFollowUp.getOrderFollowUpListAJ(opt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        oaOrderFollowUp = result.results;
                    });
                });
            })();

            dListTable.mListTable(oaOrderTransaction, null, function (index, oOrderTransaction, dEachDom) {
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html(($.pOrderListOpt.startPage * $.pOrderListOpt.pageSize) + index + 1);
                })();
                (function setOrderNoLink() {
                    var dOrderNo = dEachDom.find('.orderNo');
                    var orderNo = oOrderTransaction.orderNo;
                    var orderTransactionId = oOrderTransaction.orderTransactionId;
                    var dOrderNoLink = $.lDom.createLink(orderNo, function () {
                        var opt = {
                            orderTransactionId: orderTransactionId
                        };
                        $.lUtil.goPage($.pOrder.orderDetailPath, opt);
                    });
                    dOrderNo.html(dOrderNoLink);
                })();
                (function setIsTesting() {
                    var dIsTesting = dEachDom.find('.isTesting');
                    var isTesting = oOrderTransaction.isTesting;
                    var langPath = 'common.No';
                    if (isTesting) {
                        langPath = 'common.Yes';
                        dIsTesting.lClass('basic-color-green');
                    }
                    dIsTesting.lSetLang(langPath);
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
                    });
                })();
                (function setOrderFollowUp() {
                    var orderTransactionId = oOrderTransaction.orderTransactionId;
                    var dHdesk = dEachDom.find('.hdesk');
                    var dOps = dEachDom.find('.ops');
                    var dFin = dEachDom.find('.fin');
                    var dRm = dEachDom.find('.rm');
                    $.each(oaOrderFollowUp, function (i, oOrderFollowUp) {
                        var fuOrderTransactionId = oOrderFollowUp.orderTransactionId;
                        if (orderTransactionId === fuOrderTransactionId) {
                            if (oOrderFollowUp.hdesk) {
                                dHdesk.append(dCheckMarkImgFn());
                            }
                            if (oOrderFollowUp.ops) {
                                dOps.append(dCheckMarkImgFn());
                            }
                            if (oOrderFollowUp.fin) {
                                dFin.append(dCheckMarkImgFn());
                            }
                            if (oOrderFollowUp.rm) {
                                dRm.append(dCheckMarkImgFn());
                            }
                        }
                    });
                    function dCheckMarkImgFn() {
                        return $.lDom.createImg('/img/common/icon_checkmark_02_black.png', 10, 10);
                    }
                })();
            });
            return dListTable;
        })();
        (function dPagination() {
            var dPagination = self.find('#pagination');
            // API-returned diff from before, transform what we need
            var startPage = $.pOrderListOpt.startPage;
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
                    $.pOrderListOpt.startPage = page;
                    $.pOrderListOpt.pageSize = pageSize;
                    $.lCookie.set(pageSizeName, pageSize);
                    dOrderListFn();
                }
            };
            dPagination = dPagination.mPagination(opt);
            return dPagination;
        })();
        return dList;
    };
    var searchFn = function () {
        $.pOrderListOpt.startPage = 0;
        $.pOrderListOpt.orderTransactionIds = null;
        var mSearch = $.lForm.coverToModel(dSearch);
        var mFullSearch = $.lForm.coverToModel(dFullSearch);
        $.extend($.pOrderListOpt, mSearch, mFullSearch);
        (function setListOptByOrderTranxStatus() {
            var orderTranxStatus = dFullSearch.dOrderTranxStatus.val();
            $.pOrder.setListOptByOrderTranxStatus(orderTranxStatus);
        })();
        var followUpStatus = $.pOrderListOpt.followUpStatus;
        if (followUpStatus) {
            // get orderTransactionIds in order-follow-Up, then get search order-list
            var orderTransactionIds = [];
            var opt = {};
            opt[followUpStatus] = true;
            $.ajax.orderFollowUp.getOrderFollowUpListAJ(opt, function (res) {
                $.lAjax.parseRes(res, function (result) {
                    var oaOrderFollowUp = result.results;
                    $.each(oaOrderFollowUp, function (i, oOrderFollowUp) {
                        var orderTransactionId = oOrderFollowUp.orderTransactionId;
                        orderTransactionIds.push(orderTransactionId);
                    });
                });
                orderTransactionIds = orderTransactionIds.join(',');
                $.pOrderListOpt.orderTransactionIds = orderTransactionIds;
                dOrderListFn();
            });
            return;
        }
        dOrderListFn();
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
        dSearch.dSearchBtnSpan = (function dSearchBtnSpanFn() {
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
        $.lModel.mapDom($.pOrderListOpt, dSearch);
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
        dFullSearch.dOrderTranxStatus = (function () {
            var dOrderTranxStatus = dFullSearch.find('#orderTranxStatus');
            return dOrderTranxStatus;
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
        $.lModel.mapDom($.pOrderListOpt, dFullSearch, function () {
            (function setOrderTranxStatus() {
                if ($.pOrderListOpt.pendingFulfillmentView === 1) {
                    dFullSearch.dOrderTranxStatus.val('pendingFulfillment');
                }
                else if ($.pPaymentListOpt.pendingBookingConfirmationView === 1) {
                    dFullSearch.dOrderTranxStatus.val('pendingBookingConfirmation');
                }
            })();
        });
        return dFullSearch;
    })();
    var dOrderList = dOrderListFn();
    dSearchLink.mCollapser(dFullSearch, {
        append: 'before',
        appendTarget: dOrderList.dListTable,
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