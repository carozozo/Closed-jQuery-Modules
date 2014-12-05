$.pOrder = (function () {
    var self = {};
    self.pagePms = ['orderEditPms'];
    self.orderListPath = '/order/list/orderList';
    self.orderDetailPath = '/order/detail/orderDetail';
    self.getDefListOpt = function () {
        return $.lHelper.getListPageOpt({
            resources: 'order',
            sort: 'orderTransactionId',
            sortDir: 'DESC'
        });
    };
    self.setListOptByOrderTranxStatus = function (status) {
        switch (status) {
            case 'pendingFulfillment':
                $.pOrderListOpt.pendingFulfillmentView = 1;
                delete $.pOrderListOpt.pendingBookingConfirmationView;
                break;
            case 'pendingBookingConfirmation':
                $.pOrderListOpt.pendingBookingConfirmationView = 1;
                delete $.pOrderListOpt.pendingFulfillmentView;
                break;
            default :
                delete $.pOrderListOpt.pendingFulfillmentView;
                delete $.pOrderListOpt.pendingBookingConfirmationView;
                break
        }
    };
    self.setCrumbs = function (opt) {
        $.mCrumbs.regCrumb('orderList', 'pOrder.list.pageTitle', function () {
            $.lUtil.goPage(self.orderListPath);
        });
        $.mCrumbs.regCrumb('orderDetail', 'pOrder.detail.pageTitle', function () {
            $.lUtil.goPage(self.orderDetailPath, opt);
        });
    };
    return self;
})();

$.tPageInfo[$.pOrder.orderListPath] = {
    title: 'pOrder.list.pageTitle',
    initFn: function () {
        $('#orderListPage').pOrderList();
    }
};

$.tPageInfo[$.pOrder.orderDetailPath] = {
    title: 'pOrder.detail.pageTitle',
    initFn: function (opt) {
        $.pOrder.setCrumbs(opt);
        $.mCrumbs.disable('orderDetail');
        $.mCrumbs.render();
        $('#orderDetailPage').pOrderDetail(opt);
    }
};

$.pOrderListOpt = $.pOrder.getDefListOpt();

$.lEventEmitter.hookEvent('befLogin', 'pOrder', function () {
    $.pOrderListOpt = $.pOrder.getDefListOpt();
});