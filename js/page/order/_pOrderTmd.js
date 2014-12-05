tmd.pOrder = function (data) {
    return $.lObj.cloneObj(data);
};

tmd.pOrderTransaction = function (data) {
    var obj = $.lObj.cloneObj(data);

    (function setOrderNo() {
        // set orderNo from self first ( will be replaced with obj.aggregate.orders if exists)
        obj.orderNo = obj.orderTransactionNo.slice(0, -2);
    })();

    (function setPaymentDeadline() {
        var paymentDeadline = data.paymentDeadline;
        if (paymentDeadline) {
            obj.paymentDeadline = $.lDateTime.formatDateTime(paymentDeadline, 'dateTime');
        }
    })();

    (function setRecordCreatedAt() {
        var recordCreatedAt = data.recordCreatedAt;
        if (recordCreatedAt) {
            obj.recordCreatedAt = $.lDateTime.formatDateTime(recordCreatedAt, 'dateTime');
        }
    })();

    (function setRecordModifiedAt() {
        var recordModifiedAt = data.recordModifiedAt;
        if (recordModifiedAt) {
            obj.recordModifiedAt = $.lDateTime.formatDateTime(recordModifiedAt, 'dateTime');
        }
    })();

    (function setPaymentAmountFull() {
        var paymentAmount = data.paymentAmount;
        var paymentCurrencyCode = data.paymentCurrencyCode;
        obj.paymentAmountFull = $.lStr.formatMoney(paymentAmount, {
            prefix: paymentCurrencyCode
        });
    })();

    (function setOrderTranxId() {
        // Note: orderTransaction.orderTransactionId is primary-key for DB
        // real-orderTransactionId is last-2-charts from orderTransaction.orderTransactionNo
        var orderTransactionNo = data.orderTransactionNo;
        if (!orderTransactionNo) {
            return;
        }
        obj.orderTranxId = orderTransactionNo.slice(-2);
    })();

    (function setContact() {
        var oContact = data.contact;
        if (!oContact) {
            return;
        }
        var email = oContact.email ? oContact.email : '';
        var personName = oContact.personName ? oContact.personName : '';
        var personTitle = oContact.personTitle ? oContact.personTitle : '';
        var phoneAreaCode = oContact.phoneAreaCode ? oContact.phoneAreaCode : '';
        var phoneCountryCode = oContact.phoneCountryCode ? oContact.phoneCountryCode : '';
        var phoneNumber = oContact.phoneNumber ? oContact.phoneNumber : '';

        var contactPerson = personTitle + '. ' + personName;
        var contactPhone = $.lHelper.composePhoneNum(phoneCountryCode, phoneAreaCode, phoneNumber);
        obj.contactEmail = (email) ? email : '';
        obj.contactPerson = contactPerson;
        obj.contactPhone = contactPhone;
        obj.oContact = oContact;
    })();

    (function setAggregate() {
        var oAggregate = data.aggregate;
        if (!oAggregate) {
            return;
        }

        (function setOrders() {
            var oaOrder = oAggregate.orders;
            if (!oaOrder) {
                return;
            }
            var oOrder = oaOrder[0];
            var memberInfo = oOrder.memberInfo;
            // set memberNo,companyNo,teamNo to data
            obj = $.extend(obj, memberInfo);
            obj.orderNo = oOrder.orderNo;
            obj.isTesting = oOrder.isTesting;
            obj.oOrder = oOrder;
        })();

        (function setPayments() {
            var oaPayment = oAggregate.payments;
            var paymentReferences = [];
            if (!oaPayment) {
                return;
            }
            // descending order by paymentId
            oaPayment.sortByObjKey('paymentId', false);
            $.each(oaPayment, function (i, oPayment) {
                oPayment = tmd.pPayment(oPayment);
                var paymentStatus = oPayment.paymentStatus;

                (function setLastPaymentFailedTime() {
                    // get create-time at last failed-payment
                    if (paymentStatus === 'Failed' && !obj.lastPaymentFailedTime) {
                        obj.lastPaymentFailedTime = oPayment.recordCreatedAt;
                    }
                })();

                (function setPaymentSuccessTime() {
                    // get create-time at last success-payment
                    if (paymentStatus === 'Success' && !obj.paymentSuccessTime) {
                        obj.paymentSuccessTime = oPayment.recordCreatedAt;
                    }
                })();

                (function setPaymentReferences() {
                    var paymentReference = oPayment.paymentReference;
                    paymentReferences.push(paymentReference);
                })();

                (function getMappingTransaction() {
                    oPayment.oaPaymentTransaction = [];
                    var paymentId = oPayment.paymentId;
                    var oaPaymentTransaction = oAggregate.paymentTransactions;
                    var aPaymentMethod = [];
                    if (!oaPaymentTransaction) {
                        return;
                    }
                    $.each(oaPaymentTransaction, function (i, oPaymentTransaction) {
                        oPaymentTransaction = tmd.pPaymentTransaction(oPaymentTransaction);
                        var tranxPaymentId = oPaymentTransaction.paymentId;
                        var tranxPaymentMethod = oPaymentTransaction.paymentMethod;
                        if (paymentId === tranxPaymentId) {
                            oPayment.oaPaymentTransaction.push(oPaymentTransaction);
                            aPaymentMethod.pushNoDuplicate(tranxPaymentMethod);
                        }
                    });
                    oPayment.paymentMethods = aPaymentMethod.join(',');
                })();
                oaPayment[i] = oPayment;
            });
            paymentReferences = paymentReferences.join(',');
            obj.paymentReferences = paymentReferences;
            obj.oaPayment = oaPayment;
        })();

        (function setTravelers() {
            var oaTraveler = oAggregate.travelers;
            if (!oaTraveler) {
                return;
            }
            $.each(oaTraveler, function (i, oTraveler) {
                oaTraveler[i] = tmd.pOrderTraveler(oTraveler);
            });
            obj.oaTraveler = oaTraveler;
        })();

        (function setLineItems() {
            var oaLineItem = oAggregate.lineItems;
            if (!oaLineItem) {
                return;
            }
            $.each(oaLineItem, function (i, oLineItem) {
                var lineItemId = oLineItem.lineItemId;
                (function setMappingProduct() {
                    var oaProduct = oAggregate.products;
                    $.each(oaProduct, function (i, oProduct) {
                        var productLineItemId = oProduct.lineItemId;
                        if (productLineItemId === lineItemId) {
                            oProduct = tmd.pOrderProduct(oProduct);
                            oLineItem.productId = oProduct.productId;
                            oLineItem.productStatus = oProduct.productStatus;
                            oLineItem.supplierConfirmationCode = oProduct.supplierConfirmationCode;
                            oLineItem.oEventName = (oProduct.eventName) ? oProduct.eventName : null;
                            oLineItem.scheduleDate = (oProduct.scheduleDate) ? oProduct.scheduleDate : '';
                            oLineItem.oScheduleName = (oProduct.scheduleName) ? oProduct.scheduleName : '';
                            oLineItem.oServiceClassName = (oProduct.serviceClassName) ? oProduct.serviceClassName : null;
                            oLineItem.oServicePolicy = (oProduct.servicePolicy) ? oProduct.servicePolicy : null;
                            oLineItem.oTravelglobalPolicy = (oProduct.travelglobalPolicy) ? oProduct.travelglobalPolicy : null;
                            oLineItem.oaEventFare = (oProduct.oaEventFare) ? oProduct.oaEventFare : null;
                            oLineItem.oProduct = oProduct;
                            return false;
                        }
                        return true;
                    });
                })();

                (function setLineItem() {
                    oLineItem = tmd.pOrderLineItem(oLineItem);
                    (function setEventName() {
                        var oEventName = oLineItem.oEventName;
                        if (!oEventName) {
                            return;
                        }
                        // set event-name with locality
                        $.lLang.coverLocality(oEventName);
                        // add locality-obj to tla
                        tla['oEventName' + lineItemId] = oEventName;
                    })();

                    (function setScheduleName() {
                        var oScheduleName = oLineItem.oScheduleName;
                        if (!oScheduleName) {
                            return;
                        }
                        $.lLang.coverLocality(oScheduleName);
                        tla['oScheduleName' + lineItemId] = oScheduleName;
                    })();

                    (function setServiceClassName() {
                        var oServiceClassName = oLineItem.oServiceClassName;
                        if (!oServiceClassName) {
                            return;
                        }
                        $.lLang.coverLocality(oServiceClassName);
                        tla['oServiceClassName' + lineItemId] = oServiceClassName;
                    })();

                    (function setServicePolicy() {
                        var oServicePolicy = oLineItem.oServicePolicy;
                        if (!oServicePolicy) {
                            return;
                        }
                        $.lLang.coverLocality(oServicePolicy);
                        tla['oServicePolicy' + lineItemId] = oServicePolicy;
                    })();

                    (function setTravelglobalPolicy() {
                        var oTravelglobalPolicy = oLineItem.oTravelglobalPolicy;
                        if (!oTravelglobalPolicy) {
                            return;
                        }
                        $.lLang.coverLocality(oTravelglobalPolicy);
                        tla['oTravelglobalPolicy' + lineItemId] = oTravelglobalPolicy;
                    })();

                    // set changed-oLineItem to oaLinItem
                    oaLineItem[i] = oLineItem;
                })();
            });
            obj.oaLineItem = oaLineItem;
        })();
    })();
    return obj;
};

tmd.pOrderProduct = function (data) {
    var obj = $.lObj.cloneObj(data);

    (function setScheduleDate() {
        var scheduleDate = data.scheduleDate;
        if (scheduleDate) {
            obj.scheduleDate = $.lDateTime.formatDateTime(scheduleDate, 'ddd, DD MMM, YYYY');
        }
    })();

    (function setRecordCreatedAt() {
        var recordCreatedAt = data.recordCreatedAt;
        if (recordCreatedAt) {
            obj.recordCreatedAt = $.lDateTime.formatDateTime(recordCreatedAt, 'dateTime');
        }
    })();

    (function setRecordUpdatedAt() {
        var recordModifiedAt = data.recordModifiedAt;
        if (recordModifiedAt) {
            obj.recordModifiedAt = $.lDateTime.formatDateTime(recordModifiedAt, 'dateTime');
        }
    })();

    (function setEventFares() {
        var oaEventFare = obj.eventFares;
        if (!oaEventFare) {
            obj.quantity = 0;
            return;
        }
        var lineItemQuantity = 0;
        $.each(oaEventFare, function (i, oEventFare) {
            oEventFare = tmd.pOrderEventFare(oEventFare);
            oaEventFare[i] = oEventFare;
            lineItemQuantity += (oEventFare.quantity) ? oEventFare.quantity : 0;
        });
        obj.quantity = lineItemQuantity;
        obj.oaEventFare = oaEventFare;
    })();

    return obj;
};

tmd.pOrderTraveler = function (data) {
    return  $.lObj.cloneObj(data);
};

tmd.pOrderLineItem = function (data) {
    var obj = $.lObj.cloneObj(data);
    (function setTotalPrice() {
        var oDisplayPrice = data.displayPrice;
        if (!oDisplayPrice) {
            return;
        }
        var currencyCode = oDisplayPrice.currencyCode;
        var salePrice = oDisplayPrice.salePrice;
        obj.totalPriceFull = $.lStr.formatMoney(salePrice, {
            prefix: currencyCode
        });
    })();
    return obj;
};

tmd.pOrderEventFare = function (data) {
    var obj = $.lObj.cloneObj(data);
    var quantity = data.quantity;
    (function setSalePrice() {
        var oDisplayPrice = data.displayPrice;
        var currencyCode = oDisplayPrice.currencyCode;
        var salePrice = oDisplayPrice.salePrice;
        var surcharge = oDisplayPrice.surcharge;
        var tax = oDisplayPrice.tax;
        var each = (salePrice + surcharge + tax);
        var total = each * quantity;
        obj.salePriceFull = $.lStr.formatMoney(salePrice, {
            prefix: currencyCode
        });
        obj.surchargePriceFull = $.lStr.formatMoney(surcharge, {
            prefix: currencyCode
        });
        obj.taxPriceFull = $.lStr.formatMoney(tax, {
            prefix: currencyCode
        });
        obj.eachPriceFull = $.lStr.formatMoney(each, {
            prefix: currencyCode
        });
        obj.totalPriceFull = $.lStr.formatMoney(total, {
            prefix: currencyCode
        });
    })();

    (function setOriginalPrice() {
        var oOriginalPrice = data.originalPrice;
        var currencyCode = oOriginalPrice.currencyCode;
        var costPrice = oOriginalPrice.costPrice;
        obj.costPriceFull = $.lStr.formatMoney(costPrice, {
            prefix: currencyCode
        });
    })();

    (function setGuestTypeName() {
        var oGuestTypeName = data.guestTypeName;
        var eventFareId = data.eventFareId;
        if (!oGuestTypeName) {
            return;
        }
        $.lLang.coverLocality(oGuestTypeName);
        tla['oGuestTypeName' + eventFareId] = oGuestTypeName;
        obj.oGuestTypeName = oGuestTypeName;
    })();
    return obj;
};

tmd.pOrderServiceLog = function (data) {
    var obj = $.lObj.cloneObj(data);
    (function setRecordCreatedAt() {
        var recordCreatedAt = data.recordCreatedAt;
        if (recordCreatedAt) {
            obj.recordCreatedAt = $.lDateTime.formatDateTime(recordCreatedAt, 'dateTime');
        }
    })();

    (function setRecordUpdatedAt() {
        var recordUpdatedAt = data.recordUpdatedAt;
        if (recordUpdatedAt) {
            obj.recordUpdatedAt = $.lDateTime.formatDateTime(recordUpdatedAt, 'dateTime');
        }
    })();
    return obj;
};

tmd.pOrderServiceLogCreate = function (data) {
    var obj = {};
    obj.memo = data.memo;
    obj.type = data.type;
    obj.orderId = data.orderId;
    obj.orderTransactionId = data.orderTransactionId;
    return obj;
};

tmd.pOrderDoc = function (data) {
    var obj = $.lObj.cloneObj(data);
    (function setRecordCreatedAt() {
        var recordCreatedAt = data.recordCreatedAt;
        if (recordCreatedAt) {
            obj.recordCreatedAt = $.lDateTime.formatDateTime(recordCreatedAt, 'dateTime');
        }
    })();

    (function setRecordUpdatedAt() {
        var recordUpdatedAt = data.recordUpdatedAt;
        if (recordUpdatedAt) {
            obj.recordUpdatedAt = $.lDateTime.formatDateTime(recordUpdatedAt, 'dateTime');
        }
    })();
    return obj;
};

tmd.pOrderReceiptEmailOpt = function (data) {
    var obj = {};
    obj.localeId = data.localeId;
    obj.orderNo = data.orderNo;
    return obj;
};

tmd.pOrderPaymentConfirmedEmailOpt = function (data) {
    var obj = {};
    obj.localeId = data.localeId;
    obj.orderNo = data.orderNo;
    return obj;
};

tmd.pOrderPaymentRejectedEmailOpt = function (data) {
    var obj = {};
    obj.localeId = data.localeId;
    obj.orderNo = data.orderNo;
    obj.paymentFailedTime = data.lastPaymentFailedTime;
    obj.paymentDeadline = data.paymentDeadline;
    return obj;
};

tmd.pOrderEticketEmailOpt = function (data) {
    var obj = {};
    obj.localeId = data.localeId;
    obj.orderNo = data.orderNo;
    return obj;
};

tmd.pOrderPaymentRefundEmailOpt = function (data) {
    var obj = {};
    obj.localeId = data.localeId;
    obj.orderNo = data.orderNo;
    return obj;
};

tmd.pOrderReceiptSmsOpt = function (data) {
    var obj = {};
    obj.localeId = data.localeId;
    obj.orderNo = data.orderNo;
    return obj;
};

tmd.pOrderPaymentConfirmedSmsOpt = function (data) {
    var obj = {};
    obj.localeId = data.localeId;
    obj.orderNo = data.orderNo;
    obj.paymentSuccessTime = data.paymentSuccessTime;
    return obj;
};

tmd.pOrderPaymentRejectedSmsOpt = function (data) {
    var obj = {};
    obj.localeId = data.localeId;
    obj.orderNo = data.orderNo;
    obj.paymentFailedTime = data.lastPaymentFailedTime;
    return obj;
};

tmd.pOrderEticketSmsOpt = function (data) {
    var obj = {};
    obj.localeId = data.localeId;
    obj.orderNo = data.orderNo;
    return obj;
};

tmd.pOrderPaymentRefundSmsOpt = function (data) {
    var obj = {};
    obj.localeId = data.localeId;
    obj.orderNo = data.orderNo;
    return obj;
};

tmd.pOrderFollowUp = function (data) {
    var obj = {};
    obj.orderId = data.orderId;
    obj.orderTransactionId = data.orderTransactionId;
    obj.status = (data.status) ? data.status.trim() : 'success';
    obj.hdesk = (data.hdesk) ? data.hdesk : false;
    obj.ops = (data.ops) ? data.ops : false;
    obj.fin = (data.fin) ? data.fin : false;
    obj.rm = (data.rm) ? data.rm : false;
    return obj;
};