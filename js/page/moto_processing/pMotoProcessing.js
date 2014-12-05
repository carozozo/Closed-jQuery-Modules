$.pMotoProcessing = (function () {
    var self = {};
    self.pagePms = ['motoEditPms'];
    self.motoProcessingListPath = '/moto_processing/list/motoProcessingList';
    self.getDefListOpt = function () {
        return $.lHelper.getListPageOpt({
            sortDir: 'DESC',
            paymentGatewayIds: 'MOTO',
            orderTransactionStatuses: 'PENDING_AUTHORIZE'
        });
    };
    return self;
})();

$.tPageInfo[$.pMotoProcessing.motoProcessingListPath] = {
    title: 'pMotoProcessing.list.pageTitle',
    initFn: function () {
        $('#motoProcessingListPage').pMotoProcessingList();
    }
};

$.pMotoProcessingListOpt = $.pMotoProcessing.getDefListOpt();

$.lEventEmitter.hookEvent('befLogin', 'pMotoProcessing', function () {
    $.pMotoProcessingListOpt = $.pMotoProcessing.getDefListOpt();
});