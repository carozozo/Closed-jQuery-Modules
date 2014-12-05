$.fn.pOrderDocBlock = function (oOrderDetail) {
    var self = this;
    var orderDocPageOpt = $.lHelper.getListPageOpt();
    // for get record and insert record to DB after send email/sms
    var orderId = oOrderDetail.orderId;
    var orderTransactionId = oOrderDetail.orderTransactionId;
    var orderDocOpt = {
        orderId: orderId,
        orderTransactionId: orderTransactionId
    };
    // for show sending msg
    var docTypeOptLangPathRoot = 'pOrder.detail.orderDocTypeOpt.';
    var sendingLangPath = 'common.Sending';
    var sentLangPath = 'pOrder.detail.WasQueuedForSending';
    var showSendingMsg = function (titleLangPath) {
        var titleLang = $.lLang.parseLanPath(titleLangPath);
        var sendingLang = $.lLang.parseLanPath(sendingLangPath);
        var msg = titleLang + ' ' + sendingLang;
        $.mNtfc.show(msg);
    };
    var showSentMsg = function (res, titleLangPath) {
        $.lAjax.parseRes(res, function () {
            var titleLang = $.lLang.parseLanPath(titleLangPath);
            var sentLang = $.lLang.parseLanPath(sentLangPath);
            var msg = titleLang + ' ' + sentLang;
            $.mNtfc.show(msg, 'suc');
        }, function () {
            var msg = $.lLang.parseLanPath('common.ServerError');
            $.mNtfc.show(msg, 'dng');
        });
    };
    var dOrderDocListFn = function () {
        var dOrderDocList = self.find('#orderDoclist');
        var orderTransactionId = oOrderDetail.orderTransactionId;
        var oOrderDocList = null;
        orderDocPageOpt.orderTransactionId = orderTransactionId;
        $.ajax.orderDocument.getOrderDocumentListAJ(orderDocPageOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oOrderDocList = result;
            })
        });
        $.lConsole.log('oOrderDocList=', oOrderDocList);
        if (!oOrderDocList) {
            return dOrderDocList;
        }
        (function dOrderDocListTable() {
            var oaOrderDoc = oOrderDocList.results;
            var hostName = $.tSysVars.hostName;
            var fileDirPath = oOrderDocList.fileDirPath;
            var dOrderDocListTable = dOrderDocList.find('#orderDocListTable');
            fileDirPath = $.lStr.replaceAll(fileDirPath, '\\', '/');
            fileDirPath = $.lStr.addHead($.lStr.addTail(fileDirPath, '/'), '/');
            dOrderDocListTable.mListTable(oaOrderDoc, function (oOrderDoc) {
                return tmd.pOrderDoc(oOrderDoc);
            }, function (index, oOrderDoc, dEachDom) {
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html((orderDocPageOpt.startPage * orderDocPageOpt.pageSize) + index + 1);
                })();
                (function setDescriptionLink() {
                    var dDocumentDescription = dEachDom.find('.documentDescription');
                    var status = oOrderDoc.status;
                    var documentType = oOrderDoc.documentType;
                    var documentDescription = oOrderDoc.documentDescription;
                    var viewLang = $.lDom.createLangSpan('common.Detail');
                    // documentType === 'receiptEmail' is for old version
                    if (status === 'success' && documentType === 'orderReceiptEmail' || documentType === 'receiptEmail') {
                        // documentDescription is fileName
//                        var fileUrl = 'http://' + host + ':' + port + fileDirPath + documentDescription;
                        var fileUrl = 'http://' + hostName + fileDirPath + documentDescription;
                        var documentDescriptionLink = $.lDom.createLink(viewLang, fileUrl);
                        documentDescriptionLink.attr('target', '_blank');
                        dDocumentDescription.html(documentDescriptionLink);
                        return;
                    }
                    if (status === 'success' && documentType === 'eTicketEmail') {
                        dDocumentDescription.empty();
                        viewLang = viewLang.getHtml();
                        var aDocumentDescription = documentDescription.split(';');
                        var aDocumentDescriptionLink = [];
                        $.each(aDocumentDescription, function (i, documentDescription) {
                            // documentDescription is fileName
//                            var fileUrl = 'http://' + host + ':' + port + fileDirPath + documentDescription;
                            var fileUrl = 'http://' + hostName + fileDirPath + documentDescription;
                            var documentDescriptionLink = $.lDom.createLink(viewLang + (i + 1), fileUrl);
                            documentDescriptionLink.attr('target', '_blank');
                            documentDescriptionLink = documentDescriptionLink.getHtml();
                            aDocumentDescriptionLink.push(documentDescriptionLink);
                        });
                        documentDescriptionLink = aDocumentDescriptionLink.join(',');
                        dDocumentDescription.append(documentDescriptionLink);
                    }
                })();
            });
            return dOrderDocListTable;
        })();
        (function dOrderDocPagination() {
            var dOrderDocPagination = dOrderDocList.find('#orderDocPagination');
            var startPage = oOrderDocList.currentPageNumber;
            var pageSize = oOrderDocList.pageSize;
            var totalCount = oOrderDocList.totalCount;
            var totalPage = oOrderDocList.totalPages;
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    orderDocPageOpt.startPage = page;
                    orderDocPageOpt.pageSize = pageSize;
                    dOrderDocListFn();
                }
            };
            dOrderDocPagination = dOrderDocPagination.mPagination(opt);
            return dOrderDocPagination;
        })();
        return dOrderDocList;
    };
    (function dOrderDocRefreshLink() {
        var dOrderDocRefreshLink = self.find('#orderDocRefreshLink');
        return dOrderDocRefreshLink.action('click', function () {
            dOrderDocListFn();
        });
    })();
    var dOrderDocList = dOrderDocListFn();

    (function dOrderDocCreate() {
        var dOrderDocCreate = self.find('#orderDocCreate');
        var dOrderDocTypeSelect = (function () {
            var dOrderDocTypeSelect = dOrderDocCreate.find('#orderDocTypeSelect');
            var orderDocTypeOpt = $.lDom.createLangSpanAuto('pOrder.detail.orderDocTypeOpt');
            var newOrderDocTypeOpt = [];
            var lastPaymentStatus = oOrderDetail.lastPaymentStatus;
            var orderTransactionStatus = oOrderDetail.orderTransactionStatus;
            // orderTransactionStatus queue should [PendingFulfillment -> PendingBookingConfirmation -> Completed]
//            var statusQueue = ['PendingFulfillment', 'PendingBookingConfirmation', 'Completed'];
            var statusQueue = ['PendingFulfillment', 'PendingDocProduction', 'Completed'];

            $.each(orderDocTypeOpt, function (i, obj) {
                var val = obj.val;
                if (lastPaymentStatus === 'Failed' && val.indexOf('paymentRejected') > -1) {
                    newOrderDocTypeOpt.push(obj);
                }
                else if (lastPaymentStatus === 'Success') {
                    if (val.indexOf('orderReceipt') > -1 || val.indexOf('paymentConfirmed') > -1 || val.indexOf('paymentRefund') > -1) {
                        newOrderDocTypeOpt.push(obj);
                    }
                    // orderTransactionStatus = PendingFulfillment or PendingBookingConfirmation or Completed
                    else if (statusQueue.indexOf(orderTransactionStatus) > -1 && val.indexOf('eTicket') > -1) {
                        newOrderDocTypeOpt.push(obj);
                    }

//                    // orderTransactionStatus = PendingFulfillment or PendingBookingConfirmation or Completed
//                    if (statusQueue.indexOf(orderTransactionStatus) > -1 && val.indexOf('orderReceipt') > -1) {
//                        newOrderDocTypeOpt.push(obj);
//                    }
//                    // orderTransactionStatus = PendingBookingConfirmation or Completed
//                    else if (statusQueue.indexOf(orderTransactionStatus) > 0 && (val.indexOf('paymentConfirmed') > -1 || val.indexOf('paymentRefund') > -1)) {
//                        newOrderDocTypeOpt.push(obj);
//                    }
//                    // orderTransactionStatus = Completed
//                    else if (statusQueue.indexOf(orderTransactionStatus) > 1 && val.indexOf('eTicket') > -1) {
//                        newOrderDocTypeOpt.push(obj);
//                    }
                }
                if (val.indexOf('customer') > -1) {
                    newOrderDocTypeOpt.push(obj);
                }
            });
            dOrderDocTypeSelect.mSelect(newOrderDocTypeOpt);
            return dOrderDocTypeSelect;
        })();
        (function dOrderDocCreateBtn() {
            var dOrderDocCreateBtn = dOrderDocCreate.find('#orderDocCreateBtn');
            dOrderDocCreateBtn.mBtn('create', function () {
                var orderDocType = dOrderDocTypeSelect.val();
                switch (orderDocType) {
                    case 'orderReceiptEmail':
                        dOrderReceiptEmailSender.setOrderReceiptEmailSender();
                        dOrderDocCreateBtn.lHref('#orderReceiptEmailSender');
                        $.mFancybox.open(dOrderDocCreateBtn);
                        break;
                    case 'paymentConfirmedEmail':
                        dPaymentConfirmedEmailSender.setPaymentConfirmedEmailSender();
                        dOrderDocCreateBtn.lHref('#paymentConfirmedEmailSender');
                        $.mFancybox.open(dOrderDocCreateBtn);
                        break;
                    case 'paymentRejectedEmail':
                        dPaymentRejectedEmailSender.setPaymentRejectedEmailSender();
                        dOrderDocCreateBtn.lHref('#paymentRejectedEmailSender');
                        $.mFancybox.open(dOrderDocCreateBtn);
                        break;
                    case 'eTicketEmail':
                        dEticketEmailSender.setEticketEmailSender();
                        dOrderDocCreateBtn.lHref('#eTicketEmailSender');
                        $.mFancybox.open(dOrderDocCreateBtn);
                        break;
                    case 'paymentRefundEmail':
                        dPaymentRefundEmailSender.setPaymentRefundEmailSender();
                        dOrderDocCreateBtn.lHref('#paymentRefundEmailSender');
                        $.mFancybox.open(dOrderDocCreateBtn);
                        break;
                    case 'orderReceiptSms':
                        dOrderReceiptSmsSender.setOrderReceiptSmsSenderDefault();
                        dOrderDocCreateBtn.lHref('#orderReceiptSmsSender');
                        $.mFancybox.open(dOrderDocCreateBtn);
                        break;
                    case 'paymentConfirmedSms':
                        dPaymentConfirmedSmsSender.setPaymentConfirmedSmsSenderDefault();
                        dOrderDocCreateBtn.lHref('#paymentConfirmedSmsSender');
                        $.mFancybox.open(dOrderDocCreateBtn);
                        break;
                    case 'paymentRejectedSms':
                        dPaymentRejectedSmsSender.setPaymentRejectedSmsSenderDefault();
                        dOrderDocCreateBtn.lHref('#paymentRejectedSmsSender');
                        $.mFancybox.open(dOrderDocCreateBtn);
                        break;
                    case 'eTicketSms':
                        dEticketSmsSender.setEtieketSmsSenderDefault();
                        dOrderDocCreateBtn.lHref('#eTicketSmsSender');
                        $.mFancybox.open(dOrderDocCreateBtn);
                        break;
                    case 'paymentRefundSms':
                        dPaymentRefundSmsSender.setPaymentRefundSmsSenderDefault();
                        dOrderDocCreateBtn.lHref('#paymentRefundSmsSender');
                        $.mFancybox.open(dOrderDocCreateBtn);
                        break;
                    case 'customerSms':
                        dCustomerSmsSender.setCustomerSmsSenderDefault();
                        dOrderDocCreateBtn.lHref('#customerSmsSender');
                        $.mFancybox.open(dOrderDocCreateBtn);
                        break;
                    default:
                }
            });
            return dOrderDocCreateBtn;
        })();
        return dOrderDocCreate;
    })();
    //    --------------------- Email -------------------------
    var dOrderReceiptEmailSender = (function () {
        var dOrderReceiptEmailSender = self.find('#orderReceiptEmailSender');
        var dOrderReceiptEmailSenderContactEmail = (function () {
            return dOrderReceiptEmailSender.find('#orderReceiptEmailSenderContactEmail');
        })();
        var dPreviewOrderReceiptEmailDiv = (function () {
            return dOrderReceiptEmailSender.find('#previewOrderReceiptEmailDiv');
        })();
        var dPreviewOrderReceiptDocDiv = (function () {
            return dOrderReceiptEmailSender.find('#previewOrderReceiptDocDiv');
        })();
        var dOrderReceiptEmailSenderSubmitBtn = (function () {
            var dOrderReceiptEmailSenderSubmitBtn = dOrderReceiptEmailSender.find('#orderReceiptEmailSenderSubmitBtn');
            dOrderReceiptEmailSenderSubmitBtn.mBtn('submit', function () {
                var pass = dOrderReceiptEmailSender.checkForm();
                if (!pass) {
                    return;
                }
                dOrderReceiptEmailSenderSubmitBtn.disable();
                var orderReceiptEmailSendOpt = $.lObj.extendObj(orderReceiptEmailOpt, orderDocOpt);
                var titleLangPath = docTypeOptLangPathRoot + 'orderReceiptEmail';
                orderReceiptEmailSendOpt.targetEmail = dOrderReceiptEmailSenderContactEmail.val();
                showSendingMsg(titleLangPath);
                $.ajax.orderDocument.sendOrderReceiptEmailAsyncAJ(orderReceiptEmailSendOpt, function (res) {
                    showSentMsg(res, titleLangPath);
                });
                $.mFancybox.close();
            });
            return dOrderReceiptEmailSenderSubmitBtn;
        })();
        var orderReceiptEmailOpt = tmd.pOrderReceiptEmailOpt(oOrderDetail);
        (function setChecker() {
            dOrderReceiptEmailSender.mFormChecker();
            dOrderReceiptEmailSender.addRequired(dOrderReceiptEmailSenderContactEmail);
            dOrderReceiptEmailSender.addEmail(dOrderReceiptEmailSenderContactEmail);
        })();
        dOrderReceiptEmailSender.setOrderReceiptEmailSender = function () {
            // orderTransactionId is used to get receipt-data
            orderReceiptEmailOpt.orderTransactionId = oOrderDetail.orderTransactionId;
            var contactEmail = oOrderDetail.contactEmail;
            $.ajax.orderDocument.getOrderReceiptEmailAJ(orderReceiptEmailOpt, function (res) {
                $.lAjax.parseRes(res, function (result) {
                    var emailHtml = result.emailHtml;
                    var receiptDocHtml = result.receiptDocHtml;
                    dPreviewOrderReceiptEmailDiv.html(emailHtml);
                    dPreviewOrderReceiptDocDiv.html(receiptDocHtml);
                });
            });
            dOrderReceiptEmailSenderContactEmail.val(contactEmail);
            dOrderReceiptEmailSender.removeCheckerClass();
            dOrderReceiptEmailSenderSubmitBtn.enable();
        };
        return dOrderReceiptEmailSender.hide();
    })();
    var dPaymentConfirmedEmailSender = (function () {
        var dPaymentConfirmedEmailSender = self.find('#paymentConfirmedEmailSender');
        var orderPaymentConfirmedEmailOpt = tmd.pOrderPaymentConfirmedEmailOpt(oOrderDetail);
        var dPaymentConfirmedEmailSenderContactEmail = (function () {
            return dPaymentConfirmedEmailSender.find('#paymentConfirmedEmailSenderContactEmail');
        })();
        var dPreviewPaymentConfirmedEmailDiv = (function () {
            return dPaymentConfirmedEmailSender.find('#previewPaymentConfirmedEmailDiv');
        })();
        var dPaymentConfirmedEmailSenderSubmitBtn = (function () {
            var dPaymentConfirmedEmailSenderSubmitBtn = dPaymentConfirmedEmailSender.find('#paymentConfirmedEmailSenderSubmitBtn');
            dPaymentConfirmedEmailSenderSubmitBtn.mBtn('submit', function () {
                var pass = dPaymentConfirmedEmailSender.checkForm();
                if (!pass) {
                    return;
                }
                dPaymentConfirmedEmailSenderSubmitBtn.disable();
                var orderPaymentConfirmedEmailSendOpt = $.lObj.extendObj(orderPaymentConfirmedEmailOpt, orderDocOpt);
                var titleLangPath = docTypeOptLangPathRoot + 'paymentConfirmedEmail';
                orderPaymentConfirmedEmailSendOpt.targetEmail = dPaymentConfirmedEmailSenderContactEmail.val();
                showSendingMsg(titleLangPath);
                $.ajax.orderDocument.sendPaymentConfirmedEmailAsyncAJ(orderPaymentConfirmedEmailSendOpt, function (res) {
                    showSentMsg(res, titleLangPath);
                });
                $.mFancybox.close();
            });
            return dPaymentConfirmedEmailSenderSubmitBtn;
        })();
        (function setChecker() {
            dPaymentConfirmedEmailSender.mFormChecker();
            dPaymentConfirmedEmailSender.addRequired(dPaymentConfirmedEmailSenderContactEmail);
            dPaymentConfirmedEmailSender.addEmail(dPaymentConfirmedEmailSenderContactEmail);
        })();
        dPaymentConfirmedEmailSender.setPaymentConfirmedEmailSender = function () {
            var contactEmail = oOrderDetail.contactEmail;
            $.ajax.orderDocument.getPaymentConfirmedEmailAJ(orderPaymentConfirmedEmailOpt, function (res) {
                $.lAjax.parseRes(res, function (result) {
                    var emailHtml = result.emailHtml;
                    dPreviewPaymentConfirmedEmailDiv.html(emailHtml);
                });
            });
            dPaymentConfirmedEmailSenderContactEmail.val(contactEmail);
            dOrderReceiptEmailSender.removeCheckerClass();
            dPaymentConfirmedEmailSenderSubmitBtn.enable();
        };
        return dPaymentConfirmedEmailSender.hide();
    })();
    var dPaymentRejectedEmailSender = (function () {
        var dPaymentRejectedEmailSender = self.find('#paymentRejectedEmailSender');
        var orderPaymentRejectedEmailOpt = tmd.pOrderPaymentRejectedEmailOpt(oOrderDetail);
        var dPaymentRejectedEmailSenderContactEmail = function () {
            return dPaymentRejectedEmailSender.find('#paymentRejectedEmailSenderContactEmail');
        }();
        var dPreviewPaymentRejectedEmailDiv = (function () {
            return dPaymentRejectedEmailSender.find('#previewPaymentRejectedEmailDiv');
        })();
        var dPaymentRejectedEmailSenderSubmitBtn = (function () {
            var dPaymentRejectedEmailSenderSubmitBtn = dPaymentRejectedEmailSender.find('#paymentRejectedEmailSenderSubmitBtn');
            dPaymentRejectedEmailSenderSubmitBtn.mBtn('submit', function () {
                var pass = dPaymentRejectedEmailSender.checkForm();
                if (!pass) {
                    return;
                }
                dPaymentRejectedEmailSenderSubmitBtn.disable();
                var orderPaymentRejectedEmailSendOpt = $.lObj.extendObj(orderPaymentRejectedEmailOpt, orderDocOpt);
                var titleLangPath = docTypeOptLangPathRoot + 'paymentRejectedEmail';
                orderPaymentRejectedEmailSendOpt.targetEmail = dPaymentRejectedEmailSenderContactEmail.val();
                showSendingMsg(titleLangPath);
                $.ajax.orderDocument.sendPaymentRejectedEmailAsyncAJ(orderPaymentRejectedEmailSendOpt, function (res) {
                    showSentMsg(res, titleLangPath);
                });
                $.mFancybox.close();
            });
            return dPaymentRejectedEmailSenderSubmitBtn;
        })();
        (function setChecker() {
            dPaymentRejectedEmailSender.mFormChecker();
            dPaymentRejectedEmailSender.addRequired(dPaymentRejectedEmailSenderContactEmail);
            dPaymentRejectedEmailSender.addEmail(dPaymentRejectedEmailSenderContactEmail);
        })();
        dPaymentRejectedEmailSender.setPaymentRejectedEmailSender = function () {
            var contactEmail = oOrderDetail.contactEmail;
            $.ajax.orderDocument.getPaymentRejectedEmailAJ(orderPaymentRejectedEmailOpt, function (res) {
                $.lAjax.parseRes(res, function (result) {
                    var emailHtml = result.emailHtml;
                    dPreviewPaymentRejectedEmailDiv.html(emailHtml);
                });
            });
            dPaymentRejectedEmailSenderContactEmail.val(contactEmail);
            dPaymentRejectedEmailSender.removeCheckerClass();
            dPaymentRejectedEmailSenderSubmitBtn.enable();
        };
        return dPaymentRejectedEmailSender.hide();
    })();
    var dEticketEmailSender = (function () {
        var dEticketEmailSender = self.find('#eTicketEmailSender');
        var orderEticketEmailOpt = tmd.pOrderEticketEmailOpt(oOrderDetail);
        var dEticketEmailSenderContactEmail = (function () {
            return  dEticketEmailSender.find('#eTicketEmailSenderContactEmail');
        })();
        var dEticketEmailSenderUploadFiles = (function () {
            var dEticketEmailSenderUploadFiles = dEticketEmailSender.find('#eTicketEmailSenderUploadFiles');
            dEticketEmailSenderUploadFiles.mInputFile();
            dEticketEmailSenderUploadFiles.checkVal = function () {
                if (!dEticketEmailSenderUploadFiles.val()) {
                    dEticketEmailSenderUploadFiles.dInputFileCover.lClass('basic-bg-red3');
                    return false;
                }
                return true;
            };
            dEticketEmailSenderUploadFiles.on('click.dEticketEmailSenderUploadFiles', function () {
                dEticketEmailSenderUploadFiles.dInputFileCover.removeClass('basic-bg-red3');
            });
            return dEticketEmailSenderUploadFiles;
        })();
        var dPreviewEticketEmailDiv = (function () {
            return  dEticketEmailSender.find('#previewEticketEmailDiv');
        })();
        var dEticketEmailSenderSubmitBtn = (function () {
            var dEticketEmailSenderSubmitBtn = dEticketEmailSender.find('#eTicketEmailSenderSubmitBtn');
            dEticketEmailSenderSubmitBtn.mBtn('submit', function () {
                var pass = dEticketEmailSender.checkForm();
                var pass2 = dEticketEmailSenderUploadFiles.checkVal();
                if (!pass || !pass2) {
                    return;
                }
                dEticketEmailSenderSubmitBtn.disable();
                var orderEticketEmailSendOpt = $.lObj.extendObj(orderEticketEmailOpt, orderDocOpt);
                var titleLangPath = docTypeOptLangPathRoot + 'eTicketEmail';
                var eTicketEmailSenderContactEmail = dEticketEmailSenderContactEmail.val();
                var uploadFiles = dEticketEmailSenderUploadFiles.val();
                orderEticketEmailSendOpt.targetEmail = eTicketEmailSenderContactEmail;
                orderEticketEmailSendOpt.uploadFiles = uploadFiles;
                showSendingMsg(titleLangPath);
                $.ajax.orderDocument.sendEticketEmailAsyncAJ(orderEticketEmailSendOpt, function (res) {
                    showSentMsg(res, titleLangPath);
                });
                $.mFancybox.close();
            });
            return dEticketEmailSenderSubmitBtn;
        })();
        (function setChecker() {
            dEticketEmailSender.mFormChecker();
            dEticketEmailSender.addRequired(dEticketEmailSenderContactEmail);
            dEticketEmailSender.addEmail(dEticketEmailSenderContactEmail);
        })();
        dEticketEmailSender.setEticketEmailSender = function () {
            var contactEmail = oOrderDetail.contactEmail;
            $.ajax.orderDocument.getEticketEmailAJ(orderEticketEmailOpt, function (res) {
                $.lAjax.parseRes(res, function (result) {
                    var emailHtml = result.emailHtml;
                    dPreviewEticketEmailDiv.html(emailHtml);
                });
            });
            $.lForm.clean(dEticketEmailSender);
            dEticketEmailSender.removeCheckerClass();
            dEticketEmailSenderContactEmail.val(contactEmail);
            dEticketEmailSenderSubmitBtn.enable();
            dEticketEmailSenderUploadFiles.cleanInputFile();
        };
        return dEticketEmailSender.hide();
    })();
    var dPaymentRefundEmailSender = (function () {
        var dPaymentRefundEmailSender = self.find('#paymentRefundEmailSender');
        var orderPaymentRefundEmailOpt = tmd.pOrderPaymentRefundEmailOpt(oOrderDetail);
        var dPaymentRefundEmailSenderContactEmail = (function () {
            return dPaymentRefundEmailSender.find('#paymentRefundEmailSenderContactEmail');
        })();
        var dPreviewPaymentRefundEmailDiv = (function () {
            return dPaymentRefundEmailSender.find('#previewPaymentRefundEmailDiv');
        })();
        var dPaymentRefundEmailSenderSubmitBtn = (function () {
            var dPaymentRefundEmailSenderSubmitBtn = dPaymentRefundEmailSender.find('#paymentRefundEmailSenderSubmitBtn');
            dPaymentRefundEmailSenderSubmitBtn.mBtn('submit', function () {
                var pass = dPaymentRefundEmailSender.checkForm();
                if (!pass) {
                    return;
                }
                dPaymentRefundEmailSenderSubmitBtn.disable();
                var orderPaymentRefundEmailSendOpt = $.lObj.extendObj(orderPaymentRefundEmailOpt, orderDocOpt);
                var titleLangPath = docTypeOptLangPathRoot + 'paymentRefundEmail';
                orderPaymentRefundEmailSendOpt.targetEmail = dPaymentRefundEmailSenderContactEmail.val();
                showSendingMsg(titleLangPath);
                $.ajax.orderDocument.sendPaymentRefundEmailAsyncAJ(orderPaymentRefundEmailSendOpt, function (res) {
                    showSentMsg(res, titleLangPath);
                });
                $.mFancybox.close();
            });
            return dPaymentRefundEmailSenderSubmitBtn;
        })();
        (function setChecker() {
            dPaymentRefundEmailSender.mFormChecker();
            dPaymentRefundEmailSender.addRequired(dPaymentRefundEmailSenderContactEmail);
            dPaymentRefundEmailSender.addEmail(dPaymentRefundEmailSenderContactEmail);
        })();
        dPaymentRefundEmailSender.setPaymentRefundEmailSender = function setPaymentRefundEmailSender() {
            var contactEmail = oOrderDetail.contactEmail;
            $.ajax.orderDocument.getPaymentRefundEmailAJ(orderPaymentRefundEmailOpt, function (res) {
                $.lAjax.parseRes(res, function (result) {
                    var emailHtml = result.emailHtml;
                    dPreviewPaymentRefundEmailDiv.html(emailHtml);
                });
            });
            dPaymentRefundEmailSenderContactEmail.val(contactEmail);
            dPaymentRefundEmailSender.removeCheckerClass();
            dPaymentRefundEmailSenderSubmitBtn.enable();
        };
        return dPaymentRefundEmailSender.hide();
    })();
    //    --------------------- SMS -------------------------
    var dOrderReceiptSmsSender = (function () {
        var dOrderReceiptSmsSender = self.find('#orderReceiptSmsSender');
        var orderReceiptSmsOpt = tmd.pOrderReceiptSmsOpt(oOrderDetail);
        var dOrderReceiptSmsPhone = (function () {
            var dOrderReceiptSmsPhone = dOrderReceiptSmsSender.find('#orderReceiptSmsPhone');
            dOrderReceiptSmsPhone.mInputRestrict('int');
            return dOrderReceiptSmsPhone;
        })();
        var dOrderReceiptSmsMsg = (function () {
            return dOrderReceiptSmsSender.find('#orderReceiptSmsMsg');
        })();
        (function dOrderReceiptSmsSenderSubmitBtn() {
            var dOrderReceiptSmsSenderSubmitBtn = dOrderReceiptSmsSender.find('#orderReceiptSmsSenderSubmitBtn');
            dOrderReceiptSmsSenderSubmitBtn.mBtn('submit', function () {
                var pass = dOrderReceiptSmsSender.checkForm();
                if (!pass) {
                    return;
                }
                var orderReceiptSmsSendOpt = $.lObj.extendObj(orderReceiptSmsOpt, orderDocOpt);
                var titleLangPath = docTypeOptLangPathRoot + 'orderReceiptSms';
                orderReceiptSmsSendOpt.phone = dOrderReceiptSmsPhone.val();
                showSendingMsg(titleLangPath);
                $.ajax.orderDocument.sendOrderReceiptSmsAJ(orderReceiptSmsSendOpt, function (res) {
                    showSentMsg(res, titleLangPath);
                });
                $.mFancybox.close();
            });
            return dOrderReceiptSmsSenderSubmitBtn;
        })();
        (function createChecker() {
            var aRequired = [ dOrderReceiptSmsPhone, dOrderReceiptSmsMsg ];
            dOrderReceiptSmsSender.mFormChecker();
            dOrderReceiptSmsSender.addRequired(aRequired);
        })();
        dOrderReceiptSmsSender.setOrderReceiptSmsSenderDefault = function () {
            $.lForm.clean(dOrderReceiptSmsSender);
            dOrderReceiptSmsSender.removeCheckerClass();
            (function setPhoneInput() {
                var contactPhone = oOrderDetail.contactPhone;
                contactPhone = $.lStr.replaceAll(contactPhone, '+', '');
                contactPhone = $.lStr.replaceAll(contactPhone, ' ', '');
                dOrderReceiptSmsPhone.val(contactPhone);
            })();
            (function getReceiptSmsMsgA() {
                $.ajax.orderDocument.getOrderReceiptSmsMsgAJ(orderReceiptSmsOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        dOrderReceiptSmsMsg.val(result);
                    }, function () {
                        $.mFancybox.close();
                    });
                });
            })();
        };
        return dOrderReceiptSmsSender.hide();
    })();
    var dPaymentConfirmedSmsSender = (function () {
        var dPaymentConfirmedSmsSender = self.find('#paymentConfirmedSmsSender');
        var dPaymentConfirmedSmsPhone = (function () {
            var dPaymentConfirmedSmsPhone = dPaymentConfirmedSmsSender.find('#paymentConfirmedSmsPhone');
            dPaymentConfirmedSmsPhone.mInputRestrict('int');
            return dPaymentConfirmedSmsPhone;
        })();
        var dPaymentConfirmedSmsMsg = (function dPaymentConfirmedSmsMsgFn() {
            return dPaymentConfirmedSmsSender.find('#paymentConfirmedSmsMsg');
        })();
        (function dPaymentConfirmSenderSubmitBtn() {
            var dPaymentConfirmSenderSubmitBtn = dPaymentConfirmedSmsSender.find('#paymentConfirmSenderSubmitBtn');
            dPaymentConfirmSenderSubmitBtn.mBtn('submit', function () {
                var pass = dPaymentConfirmedSmsSender.checkForm();
                if (!pass) {
                    return;
                }
                var paymentConfirmedSmsSendOpt = $.lObj.extendObj(paymentConfirmedSmsOpt, orderDocOpt);
                var titleLangPath = docTypeOptLangPathRoot + 'paymentConfirmedSms';
                paymentConfirmedSmsSendOpt.phone = dPaymentConfirmedSmsPhone.val();
                showSendingMsg(titleLangPath);
                $.ajax.orderDocument.sendPaymentConfirmedSmsAJ(paymentConfirmedSmsSendOpt, function (res) {
                    showSentMsg(res, titleLangPath);
                });
                $.mFancybox.close();
            });
            return dPaymentConfirmSenderSubmitBtn;
        })();
        var paymentConfirmedSmsOpt = tmd.pOrderPaymentConfirmedSmsOpt(oOrderDetail);
        (function createChecker() {
            var aRequired = [ dPaymentConfirmedSmsPhone, dPaymentConfirmedSmsMsg ];
            dPaymentConfirmedSmsSender.mFormChecker();
            dPaymentConfirmedSmsSender.addRequired(aRequired);
        })();
        dPaymentConfirmedSmsSender.setPaymentConfirmedSmsSenderDefault = function () {
            $.lForm.clean(dPaymentConfirmedSmsSender);
            dPaymentConfirmedSmsSender.removeCheckerClass();
            (function setPhoneInput() {
                var contactPhone = oOrderDetail.contactPhone;
                contactPhone = $.lStr.replaceAll(contactPhone, '+', '');
                contactPhone = $.lStr.replaceAll(contactPhone, ' ', '');
                dPaymentConfirmedSmsPhone.val(contactPhone);
            })();
            (function getEticketSmsMsgA() {
                $.ajax.orderDocument.getPaymentConfirmedSmsMsgAJ(paymentConfirmedSmsOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        dPaymentConfirmedSmsMsg.val(result);
                    }, function () {
                        $.mFancybox.close();
                    });
                });
            })();
        };
        return dPaymentConfirmedSmsSender.hide();
    })();
    var dPaymentRejectedSmsSender = (function () {
        var dPaymentRejectedSmsSender = self.find('#paymentRejectedSmsSender');
        var dPaymentRejectedSmsPhone = (function () {
            var dPaymentRejectedSmsPhone = dPaymentRejectedSmsSender.find('#paymentRejectedSmsPhone');
            dPaymentRejectedSmsPhone.mInputRestrict('int');
            return dPaymentRejectedSmsPhone;
        })();
        var dPaymentRejectedSmsMsg = (function () {
            return dPaymentRejectedSmsSender.find('#paymentRejectedSmsMsg');
        })();
        (function dPaymentRejectedSenderSubmitBtn() {
            var dPaymentRejectedSenderSubmitBtn = dPaymentRejectedSmsSender.find('#paymentRejectedSenderSubmitBtn');
            dPaymentRejectedSenderSubmitBtn.mBtn('submit', function () {
                var pass = dPaymentRejectedSmsSender.checkForm();
                if (!pass) {
                    return;
                }
                var paymentRejectedSmsSendOpt = $.lObj.extendObj(paymentRejectedSmsOpt, orderDocOpt);
                var titleLangPath = docTypeOptLangPathRoot + 'paymentRejectedSms';
                paymentRejectedSmsSendOpt.phone = dPaymentRejectedSmsPhone.val();
                showSendingMsg(titleLangPath);
                $.ajax.orderDocument.sendPaymentRejectedSmsAJ(paymentRejectedSmsSendOpt, function (res) {
                    showSentMsg(res, titleLangPath);
                });
                $.mFancybox.close();
            });
            return dPaymentRejectedSenderSubmitBtn;
        })();
        var paymentRejectedSmsOpt = tmd.pOrderPaymentRejectedSmsOpt(oOrderDetail);
        (function createChecker() {
            var aRequired = [ dPaymentRejectedSmsPhone, dPaymentRejectedSmsMsg ];
            dPaymentRejectedSmsSender.mFormChecker();
            dPaymentRejectedSmsSender.addRequired(aRequired);
        })();
        dPaymentRejectedSmsSender.setPaymentRejectedSmsSenderDefault = function () {
            $.lForm.clean(dPaymentRejectedSmsSender);
            dPaymentRejectedSmsSender.removeCheckerClass();
            (function setPhoneInput() {
                var contactPhone = oOrderDetail.contactPhone;
                contactPhone = $.lStr.replaceAll(contactPhone, '+', '');
                contactPhone = $.lStr.replaceAll(contactPhone, ' ', '');
                dPaymentRejectedSmsPhone.val(contactPhone);
            })();
            (function getEticketSmsMsgA() {
                $.ajax.orderDocument.getPaymentRejectedSmsMsgAJ(paymentRejectedSmsOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        dPaymentRejectedSmsMsg.val(result);
                    }, function () {
                        $.mFancybox.close();
                    });
                });
            })();
        };
        return dPaymentRejectedSmsSender.hide();
    })();
    var dEticketSmsSender = (function () {
        var dEticketSmsSender = self.find('#eTicketSmsSender');
        var dEticketSmsPhone = (function () {
            var dEticketSmsPhone = dEticketSmsSender.find('#eTicketSmsPhone');
            dEticketSmsPhone.mInputRestrict('int');
            return dEticketSmsPhone;
        })();
        var dEticketSmsMsg = (function () {
            return dEticketSmsSender.find('#eTicketSmsMsg');
        })();
        (function dEticketSmsSenderSubmitBtn() {
            var dEticketSmsSenderSubmitBtn = dEticketSmsSender.find('#eTicketSmsSenderSubmitBtn');
            var titleLangPath = docTypeOptLangPathRoot + 'eTicketSms';
            dEticketSmsSenderSubmitBtn.mBtn('submit', function () {
                var pass = dEticketSmsSender.checkForm();
                if (!pass) {
                    return;
                }
                var eticketSmsSendOpt = $.lObj.extendObj(eticketSmsOpt, orderDocOpt);
                eticketSmsSendOpt.phone = dEticketSmsPhone.val();
                showSendingMsg(titleLangPath);
                $.ajax.orderDocument.sendEticketSmsAJ(eticketSmsSendOpt, function (res) {
                    showSentMsg(res, titleLangPath);
                });
                $.mFancybox.close();
            });
            return dEticketSmsSenderSubmitBtn;
        })();
        var eticketSmsOpt = tmd.pOrderEticketSmsOpt(oOrderDetail);
        (function createChecker() {
            var aRequired = [ dEticketSmsPhone, dEticketSmsMsg ];
            dEticketSmsSender.mFormChecker();
            dEticketSmsSender.addRequired(aRequired);
        })();
        dEticketSmsSender.setEtieketSmsSenderDefault = function () {
            $.lForm.clean(dEticketSmsSender);
            dEticketSmsSender.removeCheckerClass();
            (function setPhoneInput() {
                var contactPhone = oOrderDetail.contactPhone;
                contactPhone = $.lStr.replaceAll(contactPhone, '+', '');
                contactPhone = $.lStr.replaceAll(contactPhone, ' ', '');
                dEticketSmsPhone.val(contactPhone);
            })();
            (function getEticketSmsMsgA() {
                $.ajax.orderDocument.getEticketSmsMsgAJ(eticketSmsOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        dEticketSmsMsg.val(result);
                    }, function () {
                        $.mFancybox.close();
                    });
                });
            })();
        };
        return dEticketSmsSender.hide();
    })();
    var dPaymentRefundSmsSender = (function () {
        var dPaymentRefundSmsSender = self.find('#paymentRefundSmsSender');
        var dPaymentRefundSmsPhone = (function () {
            var dPaymentRefundSmsPhone = dPaymentRefundSmsSender.find('#paymentRefundSmsPhone');
            dPaymentRefundSmsPhone.mInputRestrict('int');
            return dPaymentRefundSmsPhone;
        })();
        var dPaymentRefundSmsMsg = (function () {
            return dPaymentRefundSmsSender.find('#paymentRefundSmsMsg');
        })();
        (function dPaymentRefundSmsSenderSubmitBtn() {
            var dPaymentRefundSmsSenderSubmitBtn = dPaymentRefundSmsSender.find('#paymentRefundSmsSenderSubmitBtn');
            dPaymentRefundSmsSenderSubmitBtn.mBtn('submit', function () {
                var pass = dPaymentRefundSmsSender.checkForm();
                if (!pass) {
                    return;
                }
                var paymentRefundSmsSendOpt = $.lObj.extendObj(paymentRefundSmsOpt, orderDocOpt);
                var titleLangPath = docTypeOptLangPathRoot + 'paymentRefundSms';
                paymentRefundSmsSendOpt.phone = dPaymentRefundSmsPhone.val();
                showSendingMsg(titleLangPath);
                $.ajax.orderDocument.sendPaymentRefundSmsAJ(paymentRefundSmsSendOpt, function (res) {
                    showSentMsg(res, titleLangPath);
                });
                $.mFancybox.close();
            });
            return dPaymentRefundSmsSenderSubmitBtn;
        })();
        var paymentRefundSmsOpt = tmd.pOrderPaymentRefundSmsOpt(oOrderDetail);
        (function createChecker() {
            var aRequired = [ dPaymentRefundSmsPhone, dPaymentRefundSmsMsg ];
            dPaymentRefundSmsSender.mFormChecker();
            dPaymentRefundSmsSender.addRequired(aRequired);
        })();
        dPaymentRefundSmsSender.setPaymentRefundSmsSenderDefault = function () {
            $.lForm.clean(dPaymentRefundSmsSender);
            dPaymentRefundSmsSender.removeCheckerClass();
            (function setPhoneInput() {
                var contactPhone = oOrderDetail.contactPhone;
                contactPhone = $.lStr.replaceAll(contactPhone, '+', '');
                contactPhone = $.lStr.replaceAll(contactPhone, ' ', '');
                dPaymentRefundSmsPhone.val(contactPhone);
            })();
            (function getPaymentRefundSmsMsgA() {
                $.ajax.orderDocument.getPaymentRefundSmsMsgAJ(paymentRefundSmsOpt, function (res) {
                    $.lAjax.parseRes(res, function (result) {
                        dPaymentRefundSmsMsg.val(result);
                    }, function () {
                        $.mFancybox.close();
                    });
                });
            })();
        };
        return dPaymentRefundSmsSender.hide();
    })();
    var dCustomerSmsSender = (function () {
        var dCustomerSmsSender = self.find('#customerSmsSender');
        var dCustomerSmsPhone = (function () {
            var dCustomerSmsPhone = dCustomerSmsSender.find('#customerSmsPhone');
            dCustomerSmsPhone.mInputRestrict('int');
            return dCustomerSmsPhone;
        })();
        var dCustomerSmsMsg = (function () {
            return dCustomerSmsSender.find('#customerSmsMsg');
        })();
        (function dCustomerSmsSenderSubmitBtn() {
            var dCustomerSmsSenderSubmitBtn = dCustomerSmsSender.find('#customerSmsSenderSubmitBtn');
            dCustomerSmsSenderSubmitBtn.mBtn('submit', function () {
                var pass = dCustomerSmsSender.checkForm();
                if (!pass) {
                    return;
                }
                var customerSmsSendOpt = $.lObj.extendObj({}, orderDocOpt);
                var titleLangPath = docTypeOptLangPathRoot + 'customerSms';
                customerSmsSendOpt.phone = dCustomerSmsPhone.val();
                customerSmsSendOpt.msg = dCustomerSmsMsg.val();
                showSendingMsg(titleLangPath);
                $.ajax.orderDocument.sendCustomerSmsAJ(customerSmsSendOpt, function (res) {
                    showSentMsg(res, titleLangPath);
                });
                $.mFancybox.close();
            });
            return dCustomerSmsSenderSubmitBtn;
        })();
        (function dCustomerSmsSenderCleanBtn() {
            var dCustomerSmsSenderCleanBtn = dCustomerSmsSender.find('#customerSmsSenderCleanBtn');
            dCustomerSmsSenderCleanBtn.mBtn('clean', function () {
                $.lForm.clean(dCustomerSmsSender);
            });
            return dCustomerSmsSenderCleanBtn;
        })();
        (function createChecker() {
            var aRequired = [ dCustomerSmsPhone, dCustomerSmsMsg ];
            dCustomerSmsSender.mFormChecker();
            dCustomerSmsSender.addRequired(aRequired);
        })();
        dCustomerSmsSender.setCustomerSmsSenderDefault = function () {
            $.lForm.clean(dCustomerSmsSender);
            dCustomerSmsSender.removeCheckerClass();
            (function setPhoneInput() {
                var contactPhone = oOrderDetail.contactPhone;
                contactPhone = $.lStr.replaceAll(contactPhone, '+', '');
                contactPhone = $.lStr.replaceAll(contactPhone, ' ', '');
                dCustomerSmsPhone.val(contactPhone);
            })();
        };
        return dCustomerSmsSender.hide();
    })();
    (function setCollapser() {
        var dOrderDocTitle = self.find('#orderDocTitle');
        var collapserOpt = {
            ifShowIcon: true,
            defaultShow: true,
            closeOthers: false
        };
        dOrderDocTitle.mCollapser(dOrderDocList, collapserOpt);
    })();
    return self;
};