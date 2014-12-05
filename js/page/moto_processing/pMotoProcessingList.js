$.fn.pMotoProcessingList = function () {
    var self = this;
    var pageSizeName = 'motoListPageSize';
    var pageSize = $.lCookie.get(pageSizeName);
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pMotoProcessing.pagePms)) {
        return self;
    }
    if (pageSize) {
        $.pMotoProcessingListOpt.pageSize = pageSize;
    }
    var dMotoProcessingListFn = function () {
        var dList = self.find('#list');
        var oMotoProcessingList = null;
        $.ajax.payment.getCreditCardPaymentInstructionByCriteriaAJ($.pMotoProcessingListOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oMotoProcessingList = $.lObj.cloneObj(result);
            });
        });
        $.lConsole.log('oMotoProcessingList=', oMotoProcessingList);
        if (!oMotoProcessingList) {
            return dList;
        }
        (function dListTable() {
            var oaMotoProcessing = oMotoProcessingList.results;
            var dListTable = self.find('#listTable');
            dListTable.mListTable(oaMotoProcessing, function (oMotoProcessing) {
                return tmd.pMotoProcessing(oMotoProcessing);
            }, function (index, oMotoProcessing, dEachDom) {
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html(($.pMotoProcessingListOpt.startPage * $.pMotoProcessingListOpt.pageSize) + index + 1);
                })();
                (function setStatus() {
                    var dOrderTransactionStatus = dEachDom.find('.orderTransactionStatus');
                    var orderTransactionStatus = oMotoProcessing.orderTransactionStatus;
                    var orderTransactionStatusLangPath = 'common.orderTransactionStatusOpt.' + orderTransactionStatus;
                    if (!orderTransactionStatus || orderTransactionStatus.toUpperCase() !== 'PENDING_AUTHORIZE') {
                        dOrderTransactionStatus.lSetLang(orderTransactionStatusLangPath);
                        return;
                    }
                    var dOrderStatusLink = $.lDom.createLink('', function () {
                        // use oMotoProcessing as options for edit
                        var opt = $.lObj.cloneObj(oMotoProcessing);
                        opt.successCb = function () {
                            dMotoProcessingListFn();
                        };
                        dCreditCardPaymentEdit.pCreditCardPaymentEdit(opt);
                        dCreditCardPaymentEdit.showCreditCardPaymentEdit();
                    });
                    dOrderStatusLink.lSetLang(orderTransactionStatusLangPath);

                    dOrderTransactionStatus.html(dOrderStatusLink);
                })();
                (function shortRemark() {
                    var dRemark = dEachDom.find('.remark');
                    var textShorterOpt = {
                        clickShow: true,
                        maxLength: 5
                    };
                    dRemark.mTextShorter(textShorterOpt);
                })();
            });
            return dListTable;
        })();
        (function dPagination() {
            var dPagination = self.find('#pagination');
            var startPage = oMotoProcessingList.currentPageNumber;
            var pageSize = oMotoProcessingList.pageSize;
            var totalCount = oMotoProcessingList.totalCount;
            var totalPage = oMotoProcessingList.totalPages;
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    $.pMotoProcessingListOpt.startPage = page;
                    $.pMotoProcessingListOpt.pageSize = pageSize;
                    $.lCookie.set(pageSizeName, pageSize);
                    dMotoProcessingListFn();
                }
            };
            dPagination = dPagination.mPagination(opt);
            return dPagination;
        })();
        return dList;
    };
    var dCreditCardPaymentEdit = (function () {
        var dCreditCardPaymentEdit = self.find('#creditCardPaymentEdit');
        return dCreditCardPaymentEdit.hide();
    })();
    (function dSearch() {
        var dSearch = self.find('#search');
        var searchFn = function () {
            $.pMotoProcessingListOpt.startPage = 0;
            var mSearch = $.lForm.coverToModel(dSearch);
            $.extend($.pMotoProcessingListOpt, mSearch);
            dMotoProcessingListFn();
        };
        (function dSearchInputs() {
            var dSearchInputs = dSearch.find(':input');
            dSearchInputs.onPressEnter(function () {
                searchFn();
            });
            return dSearchInputs;
        })();
        (function dOrderTransactionStatuses() {
            var dOrderTransactionStatuses = dSearch.find('#orderTransactionStatuses');
            var orderTransactionStatusOpt = $.lDom.createLangSpanAuto('common.orderTransactionStatusOpt');
            dOrderTransactionStatuses.mSelect(orderTransactionStatusOpt, {
                zeroOption: true,
                zeroTitle: $.lDom.createLangSpan('common.All')
            });
            return dOrderTransactionStatuses.val($.pMotoProcessingListOpt.orderTransactionStatuses);
        })();
        (function dSearchBtn() {
            var dSearchBtn = dSearch.find('#searchBtn');
            dSearchBtn.mBtn('search', function () {
                searchFn();
            });
            return dSearchBtn;
        })();
        (function dResetBtn() {
            var dResetBtn = dSearch.find('#resetBtn');
            dResetBtn.mBtn('clean', function () {
                $.lForm.clean(dSearch);
            });
            return dResetBtn;
        })();
        $.lModel.mapDom($.pMotoProcessingListOpt, dSearch);
        return dSearch;
    })();
    dMotoProcessingListFn();
    return self;
};