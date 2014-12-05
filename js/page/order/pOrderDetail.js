$.fn.pOrderDetail = function (pageOpt) {
    var self = this;
    var oOrderDetail = null;
    var collapserOpt = {
        ifShowIcon: true,
        defaultShow: true,
        closeOthers: false
    };
    pageOpt.resources = 'order,lineItem,payment,paymentTransaction,traveler,product,source';
    $.ajax.orderTransaction.getOrderTransactionByOrderTransactionIdAJ(pageOpt, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oOrderDetail = $.lObj.cloneObj(result);
        });
    });
    if (!oOrderDetail) {
        return self;
    }
    oOrderDetail = tmd.pOrderTransaction(oOrderDetail);
    $.lConsole.log('oOrderDetail=', oOrderDetail);
    (function dOrderDetailTitle() {
        var dOrderDetailTitle = self.find('#orderDetailTitle');
        var isShow = true;
        dOrderDetailTitle
            .action('click', function () {
                if (isShow) {
                    $.mCollapser.hideAllCollapser();
                    isShow = false;
                } else {
                    $.mCollapser.showAllCollapser();
                    isShow = true;
                }
            })
            .lClass('basic-link');
        return dOrderDetailTitle;
    })();
    (function dFollowUpBlock() {
        var dFollowUpBlock = self.find('#followUpBlock');
        (function init() {
            var dHeaderBottom = $('#headerBottom');
            dFollowUpBlock.appendTo(dHeaderBottom);
            $.lEventEmitter.hookEvent('befContainerSwitch', 'dFollowUpBlock', function () {
                dFollowUpBlock.remove();
            }, {
                source: dFollowUpBlock
            });

            var orderTransactionId = oOrderDetail.orderTransactionId;
            var oOrderFollowUp = oOrderDetail;
            var opt = {
                orderTransactionIds: orderTransactionId
            };
            $.ajax.orderFollowUp.getOrderFollowUpListAJ(opt, function (res) {
                $.lAjax.parseRes(res, function (result) {
                    if (result.results && result.results.length > 0) {
                        oOrderFollowUp = result.results[0];
                    }
                });
            });
            dFollowUpBlock.pOrderFollowUp(oOrderFollowUp);
        })();
        return dFollowUpBlock;
    })();
    (function dPendingListBlock() {
        var dPendingListBlock = self.find('#pendingListBlock');
        var dPendingListTitle = (function () {
            return dPendingListBlock.find('#pendingListTitle');
        })();
        var pendingListDiv = (function () {
            var pendingListDiv = dPendingListBlock.find('#pendingListDiv');
            var tryGetOrderTransaction = function (status, dParentDiv) {
                var listOpt = {};
                listOpt[status + 'View'] = 1;
                $.ajax.orderTransaction.getOrderTransactionListAsyncAJ(listOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        if (result.total < 1) {
                            return;
                        }
                        var oaOrderTransaction = result.results;
                        $.each(oaOrderTransaction, function (i, oOrderTransaction) {
                            oOrderTransaction = tmd.pOrderTransaction(oOrderTransaction);
                            var orderNo = oOrderTransaction.orderNo;
                            var orderTransactionId = oOrderTransaction.orderTransactionId;
                            var dOrderNo = $('<span></span>').html(orderNo);
                            if (orderNo !== oOrderDetail.orderNo) {
                                dOrderNo = $.lDom.createLink(orderNo, function () {
                                    var opt = {
                                        orderTransactionId: orderTransactionId
                                    };
                                    $.lUtil.goPage($.pOrder.orderDetailPath, opt);
                                });
                            }
                            dParentDiv.append(dOrderNo);
                            if (i < oaOrderTransaction.length - 1) {
                                dParentDiv.append(' | ');
                            }
                        });
                    });
                });
            };
            (function dPendingBookingConfirmationListDiv() {
                var dPendingBookingConfirmationListDiv = pendingListDiv.find('#pendingBookingConfirmationListDiv');
                tryGetOrderTransaction('pendingBookingConfirmation', dPendingBookingConfirmationListDiv);
                return dPendingBookingConfirmationListDiv;
            })();
            (function dPendingFulfillmentListDiv() {
                var dPendingFulfillmentListDiv = pendingListDiv.find('#pendingFulfillmentListDiv');
                tryGetOrderTransaction('pendingFulfillment', dPendingFulfillmentListDiv);
                return dPendingFulfillmentListDiv;
            })();
            return pendingListDiv;
        })();
        dPendingListTitle.mCollapser(pendingListDiv, collapserOpt);
        return dPendingListBlock;
    })();
    (function dSourceBlock() {
        var dSourceBlock = self.find('#sourceBlock');
        var dSourceTitle = (function () {
            return dSourceBlock.find('#sourceTitle');
        })();
        var dSourceTable = (function () {
            var dSourceTable = dSourceBlock.find('#sourceTable');
            $.lModel.mapDom(oOrderDetail, dSourceTable, function () {
            });
            return dSourceTable;
        })();
        dSourceTitle.mCollapser(dSourceTable, collapserOpt);
        return dSourceBlock;
    })();
    (function dSummaryBlock() {
        var dSummaryBlock = self.find('#summaryBlock');
        var dSummaryTitle = (function () {
            var dSummaryTitle = dSummaryBlock.find('#summaryTitle');
            var dOrderNo = (function () {
                var dOrderNo = dSummaryBlock.find('#orderNo');
                var orderNo = oOrderDetail.orderNo;
                dOrderNo.html(orderNo);
                return dOrderNo;
            })();
            dSummaryTitle.dOrderNo = dOrderNo;
            return dSummaryTitle;
        })();
        var dSummaryDiv = dSummaryDivFn();
        dSummaryTitle.mCollapser(dSummaryDiv, collapserOpt);
        return dSummaryBlock;


        function dSummaryDivFn() {
            var dSummaryDiv = dSummaryBlock.find('#summaryDiv');
            (function dSummaryTable() {
                var dSummaryTable = dSummaryDiv.find('#summaryTable');
                $.lModel.mapDom(oOrderDetail, dSummaryTable, function () {
                    var lastPaymentStatus = oOrderDetail.lastPaymentStatus;
                    (function setLastPaymentStatus() {
                        var dLastPaymentStatus = dSummaryTable.find('#lastPaymentStatus');
                        if (!lastPaymentStatus) {
                            return;
                        }
                        lastPaymentStatus = lastPaymentStatus.toUpperCase();
                        var paymentStatusLangPath = 'common.processStatusOpt.' + lastPaymentStatus;
                        dLastPaymentStatus.lSetLang(paymentStatusLangPath);
                    })();
                });
                return dSummaryTable;
            })();
            (function dPaymentsBlock() {
                var dPaymentsBlock = dSummaryDiv.find('#paymentsBlock');
                dPaymentsBlock.dPaymentListTable = (function () {
                    var dPaymentListTable = dPaymentsBlock.find('#paymentListTable');
                    var oaPayment = oOrderDetail.oaPayment;
                    dPaymentListTable.mListTable(oaPayment, null, function (inedx, oPayment, dEachDom) {
                        (function setPaymentStatus() {
                            var dPaymentStatus = dEachDom.find('.paymentStatus');
                            var paymentStatus = oPayment.paymentStatus;

                            if (!paymentStatus) {
                                return;
                            }
                            var paymentStatusLangPath = 'common.processStatusOpt.' + paymentStatus.toUpperCase();
                            dPaymentStatus.lSetLang(paymentStatusLangPath);
                        })();
                        (function setPaymentDetailBtn() {
                            var dPaymentDetailBtn = dEachDom.find('.paymentDetailBtn');
                            dPaymentDetailBtn
                                .action('click.dPaymentDetailBtn', function () {
                                    var oaPaymentTransaction = oPayment.oaPaymentTransaction;
                                    dPaymentTransactionsBlock.pPaymentTransactionsBlock(oaPaymentTransaction);
                                })
                                .mBtn('detail')
                                .lHref('#paymentTransactionsBlock')
                                .mFancybox();
                        })();
                    });
                    return dPaymentListTable;
                })();
                return dPaymentsBlock;
            })();
            var dPaymentTransactionsBlock = (function () {
                return dSummaryDiv.find('#paymentTransactionsBlock').hide();
            })();
            return dSummaryDiv;
        }
    })();
    (function dTravelersBlock() {
        var dTravelersBlock = self.find('#travelersBlock');
        var dTravelersTitle = (function () {
            return dTravelersBlock.find('#travelersTitle');
        })();
        var dTravelerListTable = (function dTravelerListTableFn() {
            var dTravelerListTable = dTravelersBlock.find('#travelerListTable');
            var oaTraveler = oOrderDetail.oaTraveler;
            dTravelerListTable.mListTable(oaTraveler, null, function (index, oTraveler, dEachDom) {
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html(index + 1);
                    // set indexInList for #lineItemListTable
                    oTraveler.indexInList = index + 1;
                })();
            });
            return dTravelerListTable;
        })();
        dTravelersTitle.mCollapser(dTravelerListTable, collapserOpt);
        return dTravelersBlock;
    })();
    (function dLineItemsBlock() {
        var dLineItemsBlock = self.find('#lineItemsBlock');
        var dLineItemsTitle = (function () {
            return dLineItemsBlock.find('#lineItemsTitle');
        })();
        var dLineItemListTable = (function () {
            var dLineItemListTable = dLineItemsBlock.find('#lineItemListTable');
            var oaLineItem = oOrderDetail.oaLineItem;
            dLineItemListTable.mListTable(oaLineItem, null, function (index, oLineItem, dEachDom) {
                var lineItemId = oLineItem.lineItemId;
                var oaEventFare = oLineItem.oaEventFare;
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html(index + 1);
                })();
                (function setEventName() {
                    var dEventName = dEachDom.find('.evenName');
                    var oEventName = oLineItem.oEventName;
                    if (!oEventName) {
                        return;
                    }
                    dEventName.lSetLang('oEventName' + lineItemId);
                })();
                (function setScheduleName() {
                    var dScheduleName = dEachDom.find('.scheduleName');
                    var oScheduleName = oLineItem.oScheduleName;
                    if (!oScheduleName) {
                        return;
                    }
                    dScheduleName.lSetLang('oScheduleName' + lineItemId);
                })();
                (function setServiceClassName() {
                    var dServiceClassName = dEachDom.find('.serviceClassName');
                    var oServiceClassName = oLineItem.oServiceClassName;
                    if (!oServiceClassName) {
                        return;
                    }
                    dServiceClassName.lSetLang('oServiceClassName' + lineItemId);
                })();
                (function setMappingTraveler() {
                    var dMappingTravelerIndex = dEachDom.find('.mappingTravelerIndex');
                    var linImtemId = oLineItem.lineItemId;
                    var oaTraveler = oOrderDetail.oaTraveler;
                    var mappingTravelerIndex = [];
                    if (!oaTraveler) {
                        return;
                    }
                    $.each(oaTraveler, function (i, oTraveler) {
                        var linItemIdInTraveler = oTraveler.lineItemId;
                        var indexInList = oTraveler.indexInList;
                        if (linItemIdInTraveler === linImtemId) {
                            mappingTravelerIndex.push(indexInList);
                        }
                    });
                    mappingTravelerIndex = mappingTravelerIndex.join(',');
                    dMappingTravelerIndex.html(mappingTravelerIndex);
                })();
                (function setProductStatusLink() {
                    var dProductStatus = dEachDom.find('.productStatus');
                    var productStatus = oLineItem.productStatus;
                    var productId = oLineItem.productId;
                    var supplierConfirmationCode = oLineItem.supplierConfirmationCode;
                    var successFn = function () {
                        self.pOrderDetail(pageOpt);
                    };
                    var opt = {
                        productId: productId,
                        supplierConfirmationCode: supplierConfirmationCode,
                        successCb: successFn
                    };

                    (function setToPendingLink() {
                        if (productStatus !== 'PendingBookingConfirmation' && productStatus !== 'PendingFulfillment') {
                            return;
                        }
                        var dProductStatusLink = $.lDom.createLink(productStatus, function () {
                            dEventProductToPendingDocEdit.pEventProductToPendingDocEdit(opt);
                        });
                        dProductStatusLink
                            .lHref('#eventProductToPendingDocEdit')
                            .mFancybox();
                        dProductStatus.html(dProductStatusLink);
                    })();

                    (function setToCompleteLink() {
                        if (productStatus !== 'PendingDocProduction') {
                            return;
                        }
                        var dProductStatusLink = $.lDom.createLink(productStatus, function () {
                            dEventProductToCompleteEdit.pEventProductToCompleteEdit(opt);
                        });
                        dProductStatusLink
                            .lHref('#eventProductToCompleteEdit')
                            .mFancybox();
                        dProductStatus.html(dProductStatusLink);
                    })();
                })();
                (function setTravelglobalPolicy() {
                    var dTravelglobalPolicy = dEachDom.find('.travelglobalPolicy');
                    var oTravelglobalPolicy = oLineItem.oTravelglobalPolicy;
                    var textShorterOpt = {
                        clickShow: true,
                        maxLength: 10,
                        placement: 'left'
                    };
                    if (!oTravelglobalPolicy) {
                        return;
                    }
                    dTravelglobalPolicy
                        .lSetLang('oTravelglobalPolicy' + lineItemId)
                        .mTextShorter(textShorterOpt);
                    // after switch-lang, short-text again
                    $.lEventEmitter.hookEvent('aftSwitchLang', 'pOrderDetail', function () {
                        dTravelglobalPolicy.mTextShorter(textShorterOpt);
                    });
                })();
                (function setEventFares() {
                    var dGuestTypeName = dEachDom.find('.guestTypeName');
                    var dQuantity = dEachDom.find('.quantity');
                    var dCostPriceFull = dEachDom.find('.costPriceFull');
                    var dTaxPriceFull = dEachDom.find('.taxPriceFull');
                    var dSurchargePriceFull = dEachDom.find('.surchargePriceFull');
                    var dSalePriceFull = dEachDom.find('.salePriceFull');
                    var dTotalPriceFull = dEachDom.find('.totalPriceFull').empty();
                    if (!oaEventFare) {
                        return;
                    }
                    $.each(oaEventFare, function (i, oEventFare) {
                        (function setGuestTypeName() {
                            var oGuestTypeName = oEventFare.oGuestTypeName;
                            var eventFareId = oEventFare.eventFareId;
                            var dEventFareGuesTypeName = dTextColorDiv();
                            if (!oGuestTypeName) {
                                return;
                            }
                            dEventFareGuesTypeName.lSetLang('oGuestTypeName' + eventFareId);
                            dGuestTypeName.append(dEventFareGuesTypeName);
                        })();
                        (function setQuantity() {
                            var quantity = oEventFare.quantity;
                            var dEventFareQuantity = dTextColorDiv();
                            if (!quantity) {
                                return;
                            }
                            dEventFareQuantity.html(quantity);
                            dQuantity.append(dEventFareQuantity);
                        })();
                        (function setCostPriceFull() {
                            var costPriceFull = oEventFare.costPriceFull;
                            var dEventFareCostPriceFull = dTextColorDiv();
                            if (!costPriceFull) {
                                return;
                            }
                            dEventFareCostPriceFull.html(costPriceFull);
                            dCostPriceFull.append(dEventFareCostPriceFull);
                        })();
                        (function setTaxPriceFull() {
                            var taxPriceFull = oEventFare.taxPriceFull;
                            var dEventFareTaxPriceFull = dTextColorDiv();
                            if (!taxPriceFull) {
                                return;
                            }
                            dEventFareTaxPriceFull.html(taxPriceFull);
                            dTaxPriceFull.append(dEventFareTaxPriceFull);
                        })();
                        (function setSurchargePriceFull() {
                            var surchargePriceFull = oEventFare.surchargePriceFull;
                            var dEventFareSurchargePriceFull = dTextColorDiv();
                            if (!surchargePriceFull) {
                                return;
                            }
                            dEventFareSurchargePriceFull.html(surchargePriceFull);
                            dSurchargePriceFull.append(dEventFareSurchargePriceFull);
                        })();
                        (function setSalePriceFull() {
                            var salePriceFull = oEventFare.salePriceFull;
                            var dEventFareSalePriceFull = dTextColorDiv();
                            if (!salePriceFull) {
                                return;
                            }
                            dEventFareSalePriceFull.html(salePriceFull);
                            dSalePriceFull.append(dEventFareSalePriceFull);
                        })();
                        (function setTotalPriceFull() {
                            var totalPriceFull = oEventFare.totalPriceFull;
                            var dEventFareTotalPriceFull = dTextColorDiv();
                            if (!totalPriceFull) {
                                return;
                            }
                            dEventFareTotalPriceFull.html(totalPriceFull);
                            dTotalPriceFull.append(dEventFareTotalPriceFull);
                        })();

                        function dTextColorDiv() {
                            var dDiv = $('<div></div>');
                            if (i % 2 === 0) {
                                dDiv.lClass('basic-color-red');
                            }
                            else {
                                dDiv.lClass('basic-color-blue');
                            }
                            return dDiv;
                        }
                    });
                })();
            });
            return dLineItemListTable;
        })();
        var dEventProductToPendingDocEdit = (function () {
            return self.find('#eventProductToPendingDocEdit').hide();
        })();
        var dEventProductToCompleteEdit = (function () {
            return self.find('#eventProductToCompleteEdit').hide();
        })();
        dLineItemsTitle.mCollapser(dLineItemListTable, collapserOpt);
        return dLineItemsBlock;
    })();
    (function dContactBlock() {
        var dContactBlock = self.find('#contactBlock');
        var dContactTitle = (function () {
            return dContactBlock.find('#contactTitle');
        })();
        var dContactTable = (function () {
            var dContactTable = dContactBlock.find('#contactTable');
            $.lModel.mapDom(oOrderDetail, dContactTable, function () {
            });
            return dContactTable;
        })();
        dContactTitle.mCollapser(dContactTable, collapserOpt);
        return dContactBlock;
    })();
    (function dOrderServiceLogBlock() {
        return self.find('#orderServiceLogBlock').pOrderServiceLogBlock(oOrderDetail);
    })();
    (function dOrderDocBlock() {
        return self.find('#orderDocBlock').pOrderDocBlock(oOrderDetail);
    })();
    return self;
};

$.fn.pPaymentTransactionsBlock = function (oaPaymentTranx) {
    var self = this;
    (function dPaymentTransactionListTable() {
        var dPaymentTransactionListTable = self.find('#paymentTransactionListTable');
        dPaymentTransactionListTable.mListTable(oaPaymentTranx, null, function (inedx, oPaymentTranx, dEachDom) {
            (function setPaymentTransactionStatus() {
                var dPaymentTransactionStatus = dEachDom.find('.paymentTransactionStatus');
                var paymentTransactionStatus = oPaymentTranx.paymentTransactionStatus;
                var dPaymentTransactionStatusLangPath = 'common.orderTransactionStatusOpt.' + paymentTransactionStatus;
                dPaymentTransactionStatus.lSetLang(dPaymentTransactionStatusLangPath);
            })();
        });
        return dPaymentTransactionListTable;
    })();
    return self;
};

$.fn.pEventProductToPendingDocEdit = function (opt) {
    var self = this;
    var supplierConfirmationCode = opt.supplierConfirmationCode;
    var dSupplierConfirmationCode = (function () {
        var dSupplierConfirmationCode = self.find('#supplierConfirmationCode');
        dSupplierConfirmationCode.mInputRestrict('basic');
        return dSupplierConfirmationCode.val(supplierConfirmationCode);
    })();
    (function dSubmitToPendingDocBtn() {
        var dSubmitToPendingDocBtn = self.find('#submitToPendingDocBtn');
        dSubmitToPendingDocBtn.mBtn('submit', function () {
            var pass = self.checkForm();
            if (!pass) {
                return;
            }
            // opt should has productId
            opt.supplierConfirmationCode = dSupplierConfirmationCode.val();
            $.ajax.orderEventProduct.confirmFulfillmentByProductIdAsyncAJ(opt, function (res) {
                $.lAjax.parseRes(res, function () {
                    var successCb = opt.successCb;
                    successCb && successCb();
                });
            });
            $.mFancybox.close();
        });
    })();
    (function createChecker() {
        self.mFormChecker();
        self.addRequired(dSupplierConfirmationCode);
        self.addMinLength(dSupplierConfirmationCode, 6);
    })();
    return self;
};

$.fn.pEventProductToCompleteEdit = function (opt) {
    var self = this;
    (function dSubmitToCompleteBtn() {
        var dSubmitToCompleteBtn = self.find('#submitToCompleteBtn');
        dSubmitToCompleteBtn.mBtn('submit', function () {
            // opt should has productId
            $.ajax.orderEventProduct.confirmDocProductionByProductIdAsyncAJ(opt, function (res) {
                $.lAjax.parseRes(res, function () {
                    var successCb = opt.successCb;
                    successCb && successCb();
                });
            });
            $.mFancybox.close();
        });
    })();
    return self;
};