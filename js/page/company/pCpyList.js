$.fn.pCpyList = function () {
    var self = this;
    var pageSizeName = 'cpyListPageSize';
    var pageSize = $.lCookie.get(pageSizeName);
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pCpy.pagePms)) {
        return self;
    }
    if (pageSize) {
        $.pCpyListOpt.pageSize = pageSize;
    }
    var dCpyListFn = function () {
        var dList = self.find('#list');
        var oCpyList = null;
        $.ajax.company.getCompanyListAJ($.pCpyListOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oCpyList = $.lObj.cloneObj(result);
            });
        });
        $.lConsole.log('oCpyList=', oCpyList);
        if (!oCpyList) {
            return dList;
        }
        dList.dListTable = (function () {
            var oaCpy = oCpyList.results;
            var dListTable = self.find('#listTable');
            dListTable.mListTable(oaCpy, function (oCpy) {
                return tmd.pCompany(oCpy);
            }, function (index, oCpy, dEachDom) {
                var cpyId = oCpy.companyId;
                var cpyOpt = {
                    companyId: cpyId
                };
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html(($.pCpyListOpt.startPage * $.pCpyListOpt.pageSize) + index + 1);
                })();
                (function setIsTesting() {
                    var dIsTesting = dEachDom.find('.isTesting');
                    var isTesting = oCpy.isTesting;
                    var setToYes = function () {
                        dIsTesting
                            .lClass('basic-color-green')
                            .lSetLang('common.Yes');
                    };
                    if (isTesting === true) {
                        setToYes();
                        return;
                    }
                    var isTestingLangSpan = $.lDom.createLangSpan('common.No');
                    var isTestingLink = $.lDom.createLink(isTestingLangSpan);
                    var boxMsgSpan = (function () {
                        var msgSpan = $('<span></span>');
                        var langSpan = $.lDom.createLangSpan('pCpy.list.ChangeToDemoAccount');
                        msgSpan.append(langSpan).append('?');
                        return msgSpan;
                    })();
                    isTestingLink.mConfirmBox({
                        boxMsg: boxMsgSpan,
                        btnYesFn: function () {
                            var opt = $.lObj.cloneObj(oCpy);
                            opt.isTesting = true;
                            $.ajax.company.updateCompanyAJ(opt, function (res) {
                                $.mNtfc.showMsgAftUpdate(res, function () {
                                    setToYes();
                                });
                            });
                        }
                    });
                    dIsTesting.html(isTestingLink);
                })();
                (function setEwalletLink() {
                    var dEwalletSettingsType = dEachDom.find('.ewalletSettingsType');
                    var ewalletSettingsType = oCpy.ewalletSettingsType;
                    var langSpan = $.lDom.createLangSpan('common.eWalletTypeOpt.' + ewalletSettingsType);
                    dEwalletSettingsType.html(langSpan);
                    if (!$.lUtil.authUserPms(['cpyEwalletReadPms', 'cpyEwalletEditPms'])) {
                        return;
                    }
                    langSpan = $.lDom.createLink(langSpan, function () {
                        $.lUtil.goPage($.pCpy.cpyEwalletPath, cpyOpt);
                    });
                    dEwalletSettingsType.html(langSpan);
                })();
                (function setCreditLimit() {
                    var dCreditLimit = dEachDom.find('.creditLimit');
                    dCreditLimit.appendLoadingImg();
                    setTimeout(function () {
                        $.ajax.company.getCompanyEwalletForListAsyncAJ(cpyOpt, function (res) {
                            $.lAjax.parseRes(res, function (result) {
                                var creditLimit = result.creditLimit;
                                creditLimit = $.lStr.formatMoney(creditLimit, 'int');
                                dCreditLimit.html(creditLimit);
                            }, function () {
                                dCreditLimit.html('');
                            });
                        });
                    }, index * 100);
                })();
                (function setProfileLink() {
                    var dName = dEachDom.find('.name');
                    var link = $.lDom.createLink(dName.html(), function () {
                        $.lUtil.goPage($.pCpy.cpyProfilePath, cpyOpt);
                    });
                    dName.empty().append(link);
                })();
                (function setStaffBtn() {
                    var dCompanyStaffListBtn = dEachDom.find('.companyStaffListBtn');
                    var langPath = 'pCpy.staffList.pageTitle';
                    // customize btn-title
                    var opt = {
                        title: $.lDom.createLangSpan(langPath)
                    };
                    dCompanyStaffListBtn.mBtn('detail', opt, function () {
                        $.lUtil.goPage($.pCpy.cpyStaffListPath, cpyOpt);
                    });
                })();
            });

            return dListTable;
        })();
        (function dPagination() {
            var dPagination = dList.find('#pagination');
            var startPage = oCpyList.currentPageNumber;
            var pageSize = oCpyList.pageSize;
            var totalCount = oCpyList.totalCount;
            var totalPage = oCpyList.totalPages;
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    $.pCpyListOpt.startPage = page;
                    $.pCpyListOpt.pageSize = pageSize;
                    $.lCookie.set(pageSizeName, pageSize);
                    dCpyListFn();
                }
            };
            dPagination.mPagination(opt);
            return dPagination;
        })();
        return dList;
    };
    var searchFn = function () {
        $.pCpyListOpt.startPage = 0;
        var mSearch = $.lForm.coverToModel(dSearch);
        var mFullSearch = $.lForm.coverToModel(dFullSearch);
        $.extend($.pCpyListOpt, mSearch, mFullSearch);
        dCpyListFn();
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
        $.lModel.mapDom($.pCpyListOpt, dFullSearch);
        return dFullSearch;
    })();
    var dCpyList = dCpyListFn();
    dSearchLink.mCollapser(dFullSearch, {
        append: 'before',
        appendTarget: dCpyList.dListTable,
        beforeShow: function () {
            dSearch.dSearchSpan1.children().appendTo(dFullSearch.dFullSearchSpan1);
            dSearch.dSearchBtnSpan.children().appendTo(dFullSearch.dFullSearchBtnSpan);
        },
        afterHide: function () {
            dFullSearch.dFullSearchSpan1.children().appendTo(dSearch.dSearchSpan1).hide().fadeIn();
            dFullSearch.dFullSearchBtnSpan.children().appendTo(dSearch.dSearchBtnSpan).hide().fadeIn();
        }
    });
    return self;
};