$.pPayment = (function () {
    var self = {};
    self.pagePms = ['paymentEditPms'];
    self.paymentListPath = '/payment/list/paymentList';
    self.paymentDetailPath = '/payment/detail/paymentDetail';
    self.getDefListOpt = function () {
        return $.lHelper.getListPageOpt({
            sort: 'orderTransactionId',
            sortDir: 'DESC'
        });
    };
    self.setListOptWithPaymentStatus = function (status) {
        switch (status) {
            case 'pendingPayment':
                $.pPaymentListOpt.pendingPaymentView = 1;
                $.pPaymentListOpt.containsPendingPayment = 0;
                break;
            case 'pendingPaymentConfirmation':
                $.pPaymentListOpt.pendingPaymentView = 1;
                $.pPaymentListOpt.containsPendingPayment = 1;
                break;
            default :
                delete $.pPaymentListOpt.pendingPaymentView;
                delete $.pPaymentListOpt.containsPendingPayment;
                break
        }
    };
    self.setCrumbs = function () {
        $.mCrumbs.regCrumb('paymentList', 'pPayment.list.pageTitle', function () {
            $.lUtil.goPage(self.paymentListPath);
        });
        $.mCrumbs.regCrumb('paymentDetail', 'pPayment.detail.pageTitle', function () {
            $.lUtil.goPage(self.paymentDetailPath);
        });
    };
    return self;
})();


$.tPageInfo[$.pPayment.paymentListPath] = {
    title: 'pPayment.list.pageTitle',
    initFn: function () {
        $('#paymentListPage').pPaymentList();
    }
};

$.tPageInfo[$.pPayment.paymentDetailPath] = {
    title: 'pPayment.detail.pageTitle',
    initFn: function (opt) {
        $.pPayment.setCrumbs();
        $.mCrumbs.disable('paymentDetail');
        $.mCrumbs.render();
        $('#paymentDetailPage').pPaymentDetail(opt);
    }
};

$.pPaymentListOpt = $.pPayment.getDefListOpt();

$.lEventEmitter.hookEvent('befLogin', 'pPayment', function () {
    $.pPaymentListOpt = $.pPayment.getDefListOpt();
});