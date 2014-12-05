$.pPaymentException = (function () {
    var self = {};
    self.pagePms = ['paymentExceptionEditPms'];
    self.paymentExceptionListPath = '/payment_exception/list/paymentExceptionList';
    self.getDefListOpt = function () {
        return $.lHelper.getListPageOpt({
            sortDir: 'DESC',
            isHandled: 'N'
        });
    };
    return self;
})();

$.tPageInfo[$.pPaymentException.paymentExceptionListPath] = {
    title: 'pPaymentException.list.pageTitle',
    initFn: function () {
        $('#paymentExceptionListPage').pPaymentExceptionList();
    }
};

$.pPaymentExceptionListOpt = $.pPaymentException.getDefListOpt();

$.lEventEmitter.hookEvent('befLogin', 'pPaymentException', function () {
    $.pPaymentExceptionListOpt = $.pPaymentException.getDefListOpt();
});