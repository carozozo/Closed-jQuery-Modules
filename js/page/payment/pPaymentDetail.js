$.fn.pPaymentDetail = function (pageOpt) {
    var self = this;
    var dPaymentDetailListFn = function () {
        var dList = self.find('#list');
        var oPaymentOrderTransactionList = null;
        $.ajax.payment.getPaymentOrderTransactionListAJ(pageOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oPaymentOrderTransactionList = $.lObj.cloneObj(result);
            });
        });
        $.lConsole.log('oPaymentOrderTransactionList=', oPaymentOrderTransactionList);
        if (!oPaymentOrderTransactionList) {
            return dList;
        }
        (function dListTable() {
            var oaPaymentOrderTransaction = oPaymentOrderTransactionList.results;
            var dListTable = self.find('#listTable');
            dListTable.mListTable(oaPaymentOrderTransaction, null, function (i, oPaymentOrderTransaction) {
                oaPaymentOrderTransaction[i] = tmd.pPaymentOrderTransaction(oPaymentOrderTransaction);
            });

            return dListTable;
        })();
        (function dPagination() {
            var dPagination = self.find('#pagination');
            var startPage = oPaymentOrderTransactionList.currentPageNumber;
            var pageSize = oPaymentOrderTransactionList.pageSize;
            var totalCount = oPaymentOrderTransactionList.totalCount;
            var totalPage = oPaymentOrderTransactionList.totalPages;
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    pageOpt.startPage = page;
                    pageOpt.pageSize = pageSize;
                    dPaymentDetailListFn();
                }
            };
            dPagination = dPagination.mPagination(opt);
            return dPagination;
        })();
        return dList;
    };
    dPaymentDetailListFn();
    return self;
};