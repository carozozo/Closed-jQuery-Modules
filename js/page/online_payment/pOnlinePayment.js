$.pOnlinePayment = (function () {
    var self = {};
    self.pagePms = ['onlinePaymentEditPms'];
    self.onlinePaymentListPath = '/online_payment/list/onlinePaymentList';
    self.getDefListOpt = function () {
        return $.lHelper.getListPageOpt({
            sortDir: 'DESC',
            paymentGatewayIds: 'ECPG',
            orderTransactionStatuses: 'GATEWAY_TIMEOUT'
        });
    };
    return self;
})();

$.tPageInfo[$.pOnlinePayment.onlinePaymentListPath] = {
    title: 'pOnlinePayment.list.pageTitle',
    initFn: function () {
        $('#onlinePaymentListPage').pOnlinePaymentList();
    }
};

$.pOnlinePaymentListOpt = $.pOnlinePayment.getDefListOpt();

$.lEventEmitter.hookEvent('befLogin', 'pOnlinePayment', function () {
    $.pOnlinePaymentListOpt = $.pOnlinePayment.getDefListOpt();
});