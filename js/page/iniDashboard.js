/**
 * register dashboard
 * @author Caro.Huang
 */

$.init(function () {
    if (!$.lUtil.isLogon()) {
        return;
    }
    (function setRegistrationDashboard() {
        var regEditPms = $.lUtil.authUserPms('regEditPms');
        if (!regEditPms) {
            return;
        }
        var groupName = 'registration';
        var dGroupTitle = $.lDom.createLangSpan('pReg.RegistrationSummary');
        $.pDashboard.regDashboard(groupName, dGroupTitle, function (dGroupDashboard) {
            (function setUnprocessed() {
                var goPath = $.pReg.regListPath;
                var dLangSpan = $.lDom.createLangSpan('pReg.list.status.Unprocessed');
                var dLangSpanHtml = dLangSpan.getHtml();
                $.ajax.registrations.getRegistrationListAsyncAJ({'status': 'Unprocessed'}, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        var totalCount = result.totalCount;
                        var linkContent = dLangSpanHtml + ': ' + totalCount;
                        dGroupDashboard.setLink(linkContent, function () {
                            $.pRegListOpt.status = 'Unprocessed';
                            $.pRegListOpt.startPage = 0;
                            $.lUtil.goPage(goPath);
                        });
                    });
                });
            })();
            (function setProcessing() {
                var goPath = $.pReg.regListPath;
                var dLangSpan = $.lDom.createLangSpan('pReg.list.status.Processing');
                var dLangSpanHtml = dLangSpan.getHtml();
                $.ajax.registrations.getRegistrationListAsyncAJ({'status': 'Processing'}, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        var totalCount = result.totalCount;
                        var linkContent = dLangSpanHtml + ': ' + totalCount;
                        dGroupDashboard.setLink(linkContent, function () {
                            $.pRegListOpt.status = 'Processing';
                            $.pRegListOpt.startPage = 0;
                            $.lUtil.goPage(goPath);
                        });
                    });
                });
            })();
        });
    })();

    (function setPaymentDashboard() {
        var paymentEditPms = $.lUtil.authUserPms('paymentEditPms');
        var onlinePaymentEditPms = $.lUtil.authUserPms('onlinePaymentEditPms');
        var paymentExceptionEditPms = $.lUtil.authUserPms('paymentExceptionEditPms');
        if (!paymentEditPms && !onlinePaymentEditPms && !paymentExceptionEditPms) {
            return;
        }
        var groupName = 'payment';
        var dGroupTitle = $.lDom.createLangSpan('pPayment.PaymentSummary');
        $.pDashboard.regDashboard(groupName, dGroupTitle, function (dGroupDashboard) {
            (function setPendingPayment() {
                if (!paymentEditPms) {
                    return;
                }
                var goPath = $.pPayment.paymentListPath;
                var status = 'pendingPayment';
                var listOpt = {
                    pendingPaymentView: 1,
                    containsPendingPayment: 0
                };
                $.ajax.orderTransaction.getOrderTransactionListAsyncAJ(listOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        var totalCount = result.total;
                        var name = $.lStr.upperFirst(status);
                        name = $.lStr.insertBlankBefUpper(name);
                        var linkContent = name + ': ' + totalCount;
                        dGroupDashboard.setLink(linkContent, function () {
                            $.pPayment.setListOptWithPaymentStatus(status);
                            $.pPaymentListOpt.startPage = 0;
                            $.lUtil.goPage(goPath);
                        });
                    });
                });
            })();
            (function setPendingPaymentConfirmation() {
                if (!paymentEditPms) {
                    return;
                }
                var goPath = $.pPayment.paymentListPath;
                var status = 'pendingPaymentConfirmation';
                var listOpt = {
                    pendingPaymentView: 1,
                    containsPendingPayment: 1
                };
                $.ajax.orderTransaction.getOrderTransactionListAsyncAJ(listOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        var totalCount = result.total;
                        var name = $.lStr.upperFirst(status);
                        name = $.lStr.insertBlankBefUpper(name);
                        var linkContent = name + ': ' + totalCount;
                        dGroupDashboard.setLink(linkContent, function () {
                            $.pPayment.setListOptWithPaymentStatus(status);
                            $.pPaymentListOpt.startPage = 0;
                            $.lUtil.goPage(goPath);
                        });
                    });
                });
            })();
            (function setPendingAuthorize() {
                if (!onlinePaymentEditPms) {
                    return;
                }
                var goPath = $.pMotoProcessing.motoProcessingListPath;
                var dLangSpan = $.lDom.createLangSpan('common.orderTransactionStatusOpt.PENDING_AUTHORIZE');
                var dLangSpanHtml = dLangSpan.getHtml();
                $.pMotoProcessingListOpt = $.pMotoProcessing.getDefListOpt();
                $.ajax.payment.getCreditCardPaymentInstructionByCriteriaAsyncAJ($.pMotoProcessingListOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        var totalCount = result.totalCount;
                        var linkContent = dLangSpanHtml + ': ' + totalCount;
                        dGroupDashboard.setLink(linkContent, function () {
                            $.lUtil.goPage(goPath);
                        });
                    });
                });
            })();
            (function setGatewayTimeout() {
                if (!onlinePaymentEditPms) {
                    return;
                }
                var goPath = $.pOnlinePayment.onlinePaymentListPath;
                var dLangSpan = $.lDom.createLangSpan('common.orderTransactionStatusOpt.GATEWAY_TIMEOUT');
                var dLangSpanHtml = dLangSpan.getHtml();
                $.pOnlinePaymentListOpt = $.pOnlinePayment.getDefListOpt();
                $.ajax.payment.getCreditCardPaymentInstructionByCriteriaAsyncAJ($.pOnlinePaymentListOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        var totalCount = result.totalCount;
                        var linkContent = dLangSpanHtml + ': ' + totalCount;
                        dGroupDashboard.setLink(linkContent, function () {
                            $.lUtil.goPage(goPath);
                        });
                    });
                });
            })();
            (function setPaymentException() {
                if (!paymentExceptionEditPms) {
                    return;
                }
                var goPath = $.pPaymentException.paymentExceptionListPath;
                var dLangSpan = $.lDom.createLangSpan('pPaymentException.ExceptionalPaymentHandle');
                var dLangSpanHtml = dLangSpan.getHtml();
                $.pPaymentExceptionListOpt = $.pPaymentException.getDefListOpt();
                $.ajax.paymentException.getExceptionTransactionListAsyncAJ($.pPaymentExceptionListOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        var totalCount = result.totalCount;
                        var linkContent = dLangSpanHtml + ': ' + totalCount;
                        dGroupDashboard.setLink(linkContent, function () {
                            $.lUtil.goPage(goPath);
                        });
                    });
                });
            })();
        });
    })();

    (function setOrderDashboard() {
        var orderEditPms = $.lUtil.authUserPms('orderEditPms');
        if (!orderEditPms) {
            return;
        }
        var groupName = 'order';
        var dGroupTitle = $.lDom.createLangSpan('pOrder.OrderSummary');
        $.pDashboard.regDashboard(groupName, dGroupTitle, function (dGroupDashboard) {
            (function setPendingFulfillment() {
                var goPath = $.pOrder.orderListPath;
                var status = 'pendingFulfillment';
                var listOpt = {};
                var name = $.lStr.upperFirst(status);
                name = $.lStr.insertBlankBefUpper(name);
                listOpt[status + 'View'] = 1;
                $.ajax.orderTransaction.getOrderTransactionListAsyncAJ(listOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        var totalCount = result.total;
                        var linkContent = name + ': ' + totalCount;
                        dGroupDashboard.setLink(linkContent, function () {
                            $.pOrder.setListOptByOrderTranxStatus('pendingFulfillment');
                            $.pOrderListOpt.startPage = 0;
                            $.lUtil.goPage(goPath);
                        });
                    });
                });
            })();
            (function setPendingBookingConfirmation() {
                var goPath = $.pOrder.orderListPath;
                var status = 'pendingBookingConfirmation';
                var listOpt = {};
                var name = $.lStr.upperFirst(status);
                name = $.lStr.insertBlankBefUpper(name);
                listOpt[status + 'View'] = 1;
                $.ajax.orderTransaction.getOrderTransactionListAsyncAJ(listOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        var totalCount = result.total;
                        var linkContent = name + ': ' + totalCount;
                        dGroupDashboard.setLink(linkContent, function () {
                            $.pOrder.setListOptByOrderTranxStatus(status);
                            $.pOrderListOpt.startPage = 0;
                            $.lUtil.goPage(goPath);
                        });
                    });
                });
            })();
        });
    })();
});