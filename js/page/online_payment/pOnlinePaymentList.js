$.fn.pOnlinePaymentList = function () {
    var self = this;
    var pageSizeName = 'onlinePaymentListPageSize';
    var pageSize = $.lCookie.get(pageSizeName);
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pOnlinePayment.pagePms)) {
        return self;
    }
    if (pageSize) {
        $.pOnlinePaymentListOpt.pageSize = pageSize;
    }
    var dOnlinePaymentListFn = function () {
        var dList = self.find('#list');
        var oOnlinePaymentList = null;
        $.ajax.payment.getCreditCardPaymentInstructionByCriteriaAJ($.pOnlinePaymentListOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oOnlinePaymentList = $.lObj.cloneObj(result);
            });
        });
        $.lConsole.log('oOnlinePaymentList=', oOnlinePaymentList);
        if (!oOnlinePaymentList) {
            return dList;
        }
        (function dListTable() {
            var oaOnlinePayment = oOnlinePaymentList.results;
            var dListTable = self.find('#listTable');
            dListTable.mListTable(oaOnlinePayment, function (oOnlinePayment) {
                return tmd.pOnlinePayment(oOnlinePayment);
            }, function (index, oOnlinePayment, dEachDom) {
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html(($.pOnlinePaymentListOpt.startPage * $.pOnlinePaymentListOpt.pageSize) + index + 1);
                })();
                (function setStatus() {
                    var dOrderTransactionStatus = dEachDom.find('.orderTransactionStatus');
                    var orderTransactionStatus = oOnlinePayment.orderTransactionStatus;
                    var orderTransactionStatusLangPath = 'common.orderTransactionStatusOpt.' + orderTransactionStatus;
                    if (!orderTransactionStatus || orderTransactionStatus.toUpperCase() !== 'GATEWAY_TIMEOUT') {
                        dOrderTransactionStatus.lSetLang(orderTransactionStatusLangPath);
                        return;
                    }
                    var dOrderStatusLink = $.lDom.createLink('', function () {
                        var opt = $.lObj.cloneObj(oOnlinePayment);
                        opt.successCb = function () {
                            dOnlinePaymentListFn();
                        };
                        dOnlinePaymentEdit.pOnlinePaymentEdit(opt);
                        dOnlinePaymentEdit.showOnlinePaymentEdit();
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
            var startPage = oOnlinePaymentList.currentPageNumber;
            var pageSize = oOnlinePaymentList.pageSize;
            var totalCount = oOnlinePaymentList.totalCount;
            var totalPage = oOnlinePaymentList.totalPages;
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    $.pOnlinePaymentListOpt.startPage = page;
                    $.pOnlinePaymentListOpt.pageSize = pageSize;
                    $.lCookie.set(pageSizeName, pageSize);
                    dOnlinePaymentListFn();
                }
            };
            dPagination = dPagination.mPagination(opt);
            return dPagination;
        })();
        return dList;
    };
    var dOnlinePaymentEdit = (function () {
        var dOnlinePaymentEdit = self.find('#onlinePaymentEdit').hide();
        return dOnlinePaymentEdit;
    })();
    (function dSearch() {
        var dSearch = self.find('#search');
        var searchFn = function () {
            $.pOnlinePaymentListOpt.startPage = 0;
            var mSearch = $.lForm.coverToModel(dSearch);
            $.extend($.pOnlinePaymentListOpt, mSearch);
            dOnlinePaymentListFn();
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
            dOrderTransactionStatuses.val($.pOnlinePaymentListOpt.orderTransactionStatuses);
        })();
        (function dSearchBtnFn() {
            var dSearchBtn = dSearch.find('#searchBtn');
            dSearchBtn.mBtn('search', function () {
                searchFn();
            });
            return dSearchBtn;
        })();
        (function dResetBtnFn() {
            var dResetBtn = dSearch.find('#resetBtn');
            dResetBtn.mBtn('clean', function () {
                $.lForm.clean(dSearch);
            });
            return dResetBtn;
        })();
        $.lModel.mapDom($.pOnlinePaymentListOpt, dSearch);
        return dSearch;
    })();
    dOnlinePaymentListFn();
    return self;
};