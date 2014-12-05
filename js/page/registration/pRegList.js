$.fn.pRegList = function () {
    var self = this;
    var pageSizeName = 'regListPageSize';
    var pageSize = $.lCookie.get(pageSizeName);
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pReg.pagePms)) {
        return self;
    }
    if (pageSize) {
        $.pRegListOpt.pageSize = pageSize;
    }
    var dRegListFn = function () {
        var dList = self.find('#list');
        var oRegList = null;
        $.ajax.registrations.getRegistrationListAJ($.pRegListOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oRegList = result;
            });
        });
        $.lConsole.log('oRegList=', oRegList);
        if (!oRegList) {
            return dList;
        }
        var dRegDetail = (function () {
            var dRegDetail = self.find('#detail');
            return dRegDetail.hide();
        })();
        dList.dListTable = (function () {
            var oaReg = oRegList.results;
            var dListTable = self.find('#listTable');
            dListTable.mListTable(oaReg, function (oReg) {
                return tmd.pReg(oReg);
            }, function (index, oReg, dEachDom) {
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html(($.pRegListOpt.startPage * $.pRegListOpt.pageSize) + index + 1);
                })();
                (function setTextShorter() {
                    dEachDom.find('.companyName, .companyWebsite').mTextShorter({clickShow: true, maxLength: 25});
                })();
                (function setStatus() {
                    var dStatus = dEachDom.find('.status');
                    var langPath = 'pReg.list.status.' + status;
                    dStatus.lSetLang(langPath);
                })();
                (function setDetailButton() {
                    var dDetailBtn = dEachDom.find('.detailBtn');
                    dDetailBtn
                        .mBtn('detail', function () {
                            dRegDetail.pRegDetail(oReg);
                            $.mFancybox.open(dRegDetail);
                        })
                        .lHref('#detail');
                })();
                (function setApproveButton() {
                    var dApproveBtn = dEachDom.find('.approveBtn');
                    var status = oReg.status;
                    var registrationId = oReg.registrationId;
                    if (status == 'Approved' || status == 'Rejected') {
                        dApproveBtn.hide();
                        return;
                    }
                    dApproveBtn.mBtn('approve', function approveBtnAct() {
                        var approveOpt = {
                            registrationId: registrationId
                        };
                        $.lUtil.goPage($.pReg.regApprovePath, approveOpt);
                    });
                })();
            });
            return dListTable;
        })();
        (function dPagination() {
            var dPagination = self.find('#pagination');
            var pageSize = oRegList.pageSize;
            var startPage = oRegList.currentPageNumber;
            var totalCount = oRegList.totalCount;
            var totalPage = oRegList.totalPages;
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    $.pRegListOpt.startPage = page;
                    $.pRegListOpt.pageSize = pageSize;
                    $.lCookie.set(pageSizeName, pageSize);
                    dRegListFn();
                }
            };
            return dPagination.mPagination(opt);
        })();
        return dList;
    };
    var searchFn = function () {
        $.pRegListOpt.startPage = 0;
        var mSearch = $.lForm.coverToModel(dSearch);
        var mFullSearch = $.lForm.coverToModel(dFullSearch);
        $.extend($.pRegListOpt, mSearch, mFullSearch);
        dRegListFn();
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
                dSearchBtn.mBtn('search', searchFn);
                return dSearchBtn;
            })();
            (function dResetBtn() {
                var dResetBtn = dSearch.find('#resetBtn');
                dResetBtn.mBtn('clean', function () {
                    $.lForm.clean(dSearch);
                    $.lForm.clean(dFullSearch);
                    dFullSearch.dAgencyBusinessTypes.deselectAll();
                    dFullSearch.dCountryCodes.deselectAll();
                });
                return dResetBtn;
            })();
            return dSearchBtnSpan;
        })();
        $.lModel.mapDom($.pRegListOpt, dSearch);
        return dSearch;
    })();
    var dSearchLink = (function () {
        var dSearchLink = self.find('#searchLink');
        return dSearchLink;
    })();
    var dFullSearch = (function () {
        var dFullSearch = self.find('#fullSearch');
        var createSelectOption = function (dom, oaData, multi, max) {
            var multiple = (multi != null) ? multi : true;
            var maxShow = (max != null) ? max : 5;
            var opt = {
                oaData: oaData,
                multiple: multiple,
                maxShow: maxShow
            };
            dom.mSelectPicker(opt);
        };
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
        (function dStatus() {
            var dStatus = dFullSearch.find('#status');
            if ($.pRegListOpt.status) {
                dStatus.focus();
            }
            return dStatus;
        })();
        (function dAgencyBusinessTypes() {
            var dAgencyBusinessTypes = dFullSearch.find('#agencyBusinessTypes');
            var agencyBusinessTypesOpt = $.lDom.createLangSpanAuto('common.agencyBusinessTypesOpt');
            createSelectOption(dAgencyBusinessTypes, agencyBusinessTypesOpt, true, 2);
            dAgencyBusinessTypes.val($.pRegListOpt.agencyBusinessTypes);
            return dAgencyBusinessTypes;
        })();
        (function dCountryCodes() {
            var dCountryCodes = dFullSearch.find('#countryCodes');
            var countryCodesOpt = $.lDom.createLangSpanAuto('common.countryCodesOpt');
            createSelectOption(dCountryCodes, countryCodesOpt);
            dCountryCodes.val($.pRegListOpt.countryCodes);
            return dCountryCodes;
        })();
        $.lModel.mapDom($.pRegListOpt, dFullSearch);
        return dFullSearch;
    })();
    var dRegList = dRegListFn();
    dSearchLink.mCollapser(dFullSearch, {
        append: 'before',
        appendTarget: dRegList.dListTable,
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

$.fn.pRegDetail = function (opt) {
    var self = this;
    var oRegDetail = null;
    opt = {registrationId: opt.registrationId};

    $.ajax.registrations.getRegDetailAJ(opt, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oRegDetail = $.lObj.cloneObj(result);
        });
    });
    $.lConsole.log('oRegDetail=', oRegDetail);
    if (!oRegDetail) {
        return self;
    }
    (function dRegDetailTable() {
        var dRegDetailTable = self.find('#detailTable');
        // auto mapping the value to table-Dom
        $.lModel.mapDom(oRegDetail.registration, dRegDetailTable);
        if (oRegDetail.registration.submittedAt) {
            dRegDetailTable.find('.submittedAt').html($.lDateTime.formatDateTime(oRegDetail.registration.submittedAt, 'dateTime'));
        }
        dRegDetailTable.find('#companyName, #companyWebsite, #companyCountryCode, #companyAddress')
            .mTextShorter({clickShow: true, maxLength: 50});
    })();
    (function setListDom() {
        // auto mapping the value to form-Dom
        self.find('.regContactTr:first').mListDom(oRegDetail.regContact);
    })();
    return self;
};