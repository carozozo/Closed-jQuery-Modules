$.fn.pPaymentExceptionList = function () {
    var self = this;

    var dPaymentExceptionEdit = self.find('#paymentExceptionEdit').hide();
    var pageSizeName = 'paymentExceptionListPageSize';
    var pageSize = $.lCookie.get(pageSizeName);
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pPaymentException.pagePms)) {
        return self;
    }
    if (pageSize) {
        $.pPaymentExceptionListOpt.pageSize = pageSize;
    }
    var dPaymentExceptionListFn = function () {
        var dList = self.find('#list');
        var oPaymentExceptionList = null;
        $.ajax.paymentException.getExceptionTransactionListAJ($.pPaymentExceptionListOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oPaymentExceptionList = $.lObj.cloneObj(result);
            });
        });
        $.lConsole.log('oPaymentExceptionList=', oPaymentExceptionList);
        if (!oPaymentExceptionList) {
            return dList;
        }
        (function dListTable() {
            var oaPaymentException = oPaymentExceptionList.results;
            var dListTable = self.find('#listTable');
            dListTable.mListTable(oaPaymentException, function (oPaymentException) {
                return tmd.pPaymentException(oPaymentException);
            }, function (index, oPaymentException, dEachDom) {
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html(($.pPaymentExceptionListOpt.startPage * $.pPaymentExceptionListOpt.pageSize) + index + 1);
                })();
                (function setUpdateHandleLink() {
                    var dOrderTxnRefNo = dEachDom.find('.orderTxnRefNo');
                    var orderTxnRefNo = oPaymentException.orderTxnRefNo;
                    var handledBy = oPaymentException.handledBy;
                    if (handledBy || !orderTxnRefNo) {
                        return;
                    }
                    var dOrderTxnRefNoLink = $.lDom.createLink(orderTxnRefNo, function () {
                        var opt= $.lObj.cloneObj(oPaymentException);
                        opt.successCb = function () {
                            dPaymentExceptionListFn();
                        };
                        dPaymentExceptionEdit.pPaymentExceptionEdit(opt);
                        dPaymentExceptionEdit.showPaymentExceptionEdit();
                    });
                    dOrderTxnRefNo.html(dOrderTxnRefNoLink);
                })();
                (function setPresentPaymentStatus() {
                    var dPresentPaymentStatus = dEachDom.find('.presentPaymentStatus');
                    var presentPaymentStatus = oPaymentException.presentPaymentStatus;
                    if (!presentPaymentStatus) {
                        return;
                    }
                    var presentPaymentStatusLangPath = 'common.paymentStatusOpt' + presentPaymentStatus;
                    dPresentPaymentStatus.lSetLang(presentPaymentStatusLangPath);
                })();
                (function setPresentOrderTransactionStatus() {
                    var dPresentOrderTransactionStatus = dEachDom.find('.presentOrderTransactionStatus');
                    var presentOrderTransactionStatus = oPaymentException.presentOrderTransactionStatus;
                    if (!presentOrderTransactionStatus) {
                        return;
                    }
                    var presentOrderTransactionStatusLangPath = 'common.orderTransactionStatusOpt' + presentOrderTransactionStatus;
                    dPresentOrderTransactionStatus.lSetLang(presentOrderTransactionStatusLangPath);
                })();
                (function shortRemark() {
                    var dRemark = dEachDom.find('.remark');
                    var textShorterOpt = {
                        maxLength: 5,
                        placement: 'left'
                    };
                    dRemark.mTextShorter(textShorterOpt);
                })();
            });
            return dListTable;
        })();
        (function dPagination() {
            var dPagination = self.find('#pagination');
            var startPage = oPaymentExceptionList.currentPageNumber;
            var pageSize = oPaymentExceptionList.pageSize;
            var totalCount = oPaymentExceptionList.totalCount;
            var totalPage = oPaymentExceptionList.totalPages;
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    $.pPaymentExceptionListOpt.startPage = page;
                    $.pPaymentExceptionListOpt.pageSize = pageSize;
                    $.lCookie.set(pageSizeName, pageSize);
                    dPaymentExceptionListFn();
                }
            };
            dPagination = dPagination.mPagination(opt);
            return dPagination;
        })();
        return dList;
    };
    (function dSearch() {
        var dSearch = self.find('#search');
        var searchFn = function () {
            $.pPaymentExceptionListOpt.startPage = 0;
            var mSearch = $.lForm.coverToModel(dSearch);
            $.extend($.pPaymentExceptionListOpt, mSearch);
            dPaymentExceptionListFn();
        };
        (function dSearchInputs() {
            var dSearchInputs = dSearch.find(':input');
            dSearchInputs.onPressEnter(function () {
                searchFn();
            });
            return dSearchInputs;
        })();
        (function dIsHandled() {
            var dIsHandled = dSearch.find('#isHandled');
            var isHandledOpt = $.lDom.createLangSpanAuto('common.isHandledOpt');
            dIsHandled.mSelect(isHandledOpt, {
                zeroOption: true,
                zeroTitle: $.lDom.createLangSpan('common.All')
            });
            return dIsHandled;
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
        $.lModel.mapDom($.pPaymentExceptionListOpt, dSearch);
        return dSearch;
    })();
    dPaymentExceptionListFn();
    return self;
};