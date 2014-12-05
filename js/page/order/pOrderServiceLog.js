$.fn.pOrderServiceLogBlock = function (oOrderDetail) {
    var self = this;
    var orderServiceLogPageOpt = $.lHelper.getListPageOpt();
    (function dCreateServiceLogLink() {
        var dCreateServiceLogLink = self.find('#createServiceLogLink');
        dCreateServiceLogLink
            .action('click', function (e) {
                dOrderServiceLogCreate.cleanOrderServiceLogCreate();
            })
            .lClass('basic-link')
            .lHref('#orderServiceLogCreate')
            .mFancybox();
        return dCreateServiceLogLink;
    })();
    (function dOrderServiceLogRefreshLink() {
        var dOrderServiceLogRefreshLink = self.find('#orderServiceLogRefreshLink');
        return dOrderServiceLogRefreshLink.action('click', function () {
            dOrderServiceLogListFn();
        });
    })();
    var dOrderServiceLogListFn = function () {
        var dOrderServiceLogList = self.find('#orderServiceLogList');
        var orderTransactionId = oOrderDetail.orderTransactionId;
        var oOrderServiceLogList = null;
        orderServiceLogPageOpt.orderTransactionId = orderTransactionId;
        $.ajax.orderServiceLog.getOrderServiceLogListAJ(orderServiceLogPageOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oOrderServiceLogList = result;
            })
        });
        (function oaOrderServiceLog() {
            var oaOrderServiceLog = oOrderServiceLogList.results;
            var dOrderServiceLogListTable = dOrderServiceLogList.find('#orderServiceLogListTable');
            dOrderServiceLogListTable.mListTable(oaOrderServiceLog, function (oOrderServiceLog) {
                return tmd.pOrderServiceLog(oOrderServiceLog);
            }, function (index, oOrderServiceLog, dEachDom) {
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html((orderServiceLogPageOpt.startPage * orderServiceLogPageOpt.pageSize) + index + 1);
                })();
            });

            return dOrderServiceLogListTable;
        })();
        (function dOrderServiceLogPagination() {
            var dOrderServiceLogPagination = dOrderServiceLogList.find('#orderServiceLogPagination');
            var startPage = oOrderServiceLogList.currentPageNumber;
            var pageSize = oOrderServiceLogList.pageSize;
            var totalCount = oOrderServiceLogList.totalCount;
            var totalPage = oOrderServiceLogList.totalPages;

            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    orderServiceLogPageOpt.startPage = page;
                    orderServiceLogPageOpt.pageSize = pageSize;
                    dOrderServiceLogListFn();
                }
            };
            dOrderServiceLogPagination = dOrderServiceLogPagination.mPagination(opt);
            return dOrderServiceLogPagination;
        })();
        return dOrderServiceLogList;
    };
    var dOrderServiceLogList = dOrderServiceLogListFn();
    var dOrderServiceLogCreate = (function () {
        var dOrderServiceLogCreate = self.find('#orderServiceLogCreate');
        (function dOrderServiceLogCreateSubmitBtn() {
            var dOrderServiceLogCreateSubmitBtn = dOrderServiceLogCreate.find('#orderServiceLogCreateSubmitBtn');
            dOrderServiceLogCreateSubmitBtn.mBtn('submit', function () {
                var pass = dOrderServiceLogCreate.checkForm();
                if (!pass) {
                    return;
                }
                var orderId = oOrderDetail.orderId;
                var orderTransactionId = oOrderDetail.orderTransactionId;
                var type = 'manual';
                var orderServiceLogCreateOpt = $.lForm.coverToModel(dOrderServiceLogCreate, {
                    extendModel: {
                        type: type,
                        orderId: orderId,
                        orderTransactionId: orderTransactionId
                    }
                });
                var mOrderServiceLogCreate = tmd.pOrderServiceLogCreate(orderServiceLogCreateOpt);
                $.ajax.orderServiceLog.createOrderServiceLogAJ(mOrderServiceLogCreate, function (res) {
                    $.mNtfc.showMsgAftCreate(res, function () {
                        dOrderServiceLogListFn();
                    });
                    $.mFancybox.close();
                });
            });
            return dOrderServiceLogCreateSubmitBtn;
        })();
        (function dOrderServiceLogCreateCleanBtn() {
            var dOrderServiceLogCreateCleanBtn = dOrderServiceLogCreate.find('#orderServiceLogCreateCleanBtn');
            dOrderServiceLogCreateCleanBtn.mBtn('clean', function () {
                $.lForm.clean(dOrderServiceLogCreate);
            });
            return dOrderServiceLogCreateCleanBtn;
        })();
        var dMemo = (function () {
            return dOrderServiceLogCreate.find('#memo').height(100);
        })();
        (function createChecker() {
            dOrderServiceLogCreate.mFormChecker();
            dOrderServiceLogCreate.addRequired(dMemo);
        })();
        dOrderServiceLogCreate.cleanOrderServiceLogCreate = function () {
            $.lForm.clean(dOrderServiceLogCreate);
            dOrderServiceLogCreate.removeCheckerClass();
        };
        return dOrderServiceLogCreate.hide();
    })();
    (function setCollapser() {
        var dOrderServiceLogTitle = self.find('#orderServiceLogTitle');
        var collapserOpt = {
            ifShowIcon: true,
            defaultShow: true,
            closeOthers: false
        };
        dOrderServiceLogTitle.mCollapser2(dOrderServiceLogList, collapserOpt);
    })();
    return self;
};