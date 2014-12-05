$.fn.pEwalletEdit = function () {
    var self = this;
    if (!$.lUtil.goIndexIfAuthPmsFailed('eWalletEditPms')) {
        return self;
    }
    (function dSearchDiv() {
        var dSearchDiv = self.find('#searchDiv');
        var searchEwallet = function () {
            var searchEwalletId = dSearchEwalletIdInput.val();
            if (!searchEwalletId) {
                return;
            }
            dInfoBlock.pEwalletInfo(searchEwalletId);
        };
        var dSearchEwalletIdInput = (function () {
            var dSearchEwalletIdInput = dSearchDiv.find('#searchEwalletIdInput');
            dSearchEwalletIdInput
                .mInputRestrict('int')
                .onPressEnter(function () {
                    searchEwallet();
                });
            return dSearchEwalletIdInput;
        })();
        (function dSearchEwalletSubmitBtn() {
            var dSearchEwalletSubmitBtn = dSearchDiv.find('#searchEwalletSubmitBtn');
            dSearchEwalletSubmitBtn.mBtn('submit', function () {
                searchEwallet();
            });
            return dSearchEwalletSubmitBtn;
        })();
        return dSearchDiv;
    })();
    var dInfoBlock = (function () {
        var dInfoBlock = self.find('#infoBlock');
        return dInfoBlock.hide();
    })();
    return self;
};

$.fn.pEwalletInfo = function (eWalletId) {
    var self = this;
    var oEwallet = null;
    var opt = {
        ewalletId: eWalletId
    };
    $.ajax.eWallet.getEwalletByIdAJ(opt, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oEwallet = $.lObj.cloneObj(result);
        }, function (result) {
            var code = result.code;
            if (!code) {
                return;
            }
            code = code.toUpperCase();
            if (code === 'EWALLET.NOT_EXIST') {
                var langPath = 'pEwallet.edit.notExist';
                var msg = $.lLang.parseLanPath(langPath);
                $.mNtfc.show(msg, 'wng');
            }
        });
    });
    if (!oEwallet) {
        return self.hide();
    }
    $.lConsole.log('oEwallet=', oEwallet);
    var currencyCode = oEwallet.currencyCode;
    var creditLimit = oEwallet.creditLimit;
    var creditBalance = oEwallet.creditBalance;
    var cashBalance = oEwallet.cashBalance;
    (function dEditBtnsBlock() {
        var dEditBtnsBlock = self.find('#editBtnsBlock');
        var langPathRoot = 'pEwallet.edit.';
        (function dAddCreditLimitBtn() {
            var dAddCreditLimitBtn = dEditBtnsBlock.find('#addCreditLimitBtn');
            var langPath = langPathRoot + 'AddCreditLimit';
            var opt = {
                title: $.lDom.createLangSpan(langPath)
            };
            dAddCreditLimitBtn.mBtn('save', opt, function () {
                var opt = {
                    eWalletId: eWalletId,
                    currencyCode: currencyCode,
                    creditLimit: creditLimit,
                    successCb: function () {
                        self.pEwalletInfo(eWalletId);
                    }
                };
                dAddCreditLimit
                    .pEwalletAddCreditLimit(opt)
                    .showEwalletAddCreditLimit();
            });
            return dAddCreditLimitBtn;
        })();
        (function dReduceCreditLimitBtn() {
            var dReduceCreditLimitBtn = dEditBtnsBlock.find('#reduceCreditLimitBtn');
            var langPath = langPathRoot + 'ReduceCreditLimit';
            var opt = {
                title: $.lDom.createLangSpan(langPath)
            };
            dReduceCreditLimitBtn.mBtn('open', opt, function () {
                var opt = {
                    eWalletId: eWalletId,
                    currencyCode: currencyCode,
                    creditLimit: creditLimit,
                    successCb: function () {
                        self.pEwalletInfo(eWalletId);
                    }
                };
                dReduceCreditLimit
                    .pEwalletReduceCreditLimit(opt)
                    .showEwalletReduceCreditLimit();
            });
            if (creditLimit <= 0) {
                dReduceCreditLimitBtn.disable();
            }
            else {
                dReduceCreditLimitBtn.enable();
            }
            return dReduceCreditLimitBtn;
        })();
        (function dDepositCashBtn() {
            var dDepositCashBtn = dEditBtnsBlock.find('#depositCashBtn');
            var langPath = langPathRoot + 'DepositCash';
            var opt = {
                title: $.lDom.createLangSpan(langPath)
            };
            dDepositCashBtn.mBtn('save', opt, function () {
                var opt = {
                    eWalletId: eWalletId,
                    currencyCode: currencyCode,
                    creditBalance: creditBalance,
                    cashBalance: cashBalance,
                    successCb: function () {
                        self.pEwalletInfo(eWalletId);
                    }
                };
                dDepositCashDiv
                    .pEwalletDepositCash(opt)
                    .showEwalletDepositCash();
            });
            return dDepositCashBtn;
        })();
        (function dWithdrawCashBtn() {
            var dWithdrawCashBtn = dEditBtnsBlock.find('#withdrawCashBtn');
            var langPath = langPathRoot + 'WithdrawCash';
            var opt = {
                title: $.lDom.createLangSpan(langPath)
            };
            dWithdrawCashBtn.mBtn('open', opt, function () {
                var opt = {
                    eWalletId: eWalletId,
                    currencyCode: currencyCode,
                    cashBalance: cashBalance,
                    successCb: function () {
                        self.pEwalletInfo(eWalletId);
                    }
                };
                dWithdrawCashDiv
                    .pEwalletWithdrawCash(opt)
                    .showEwalletWithdrawCash();
            });
            if (cashBalance <= 0) {
                dWithdrawCashBtn.disable();
            }
            else {
                dWithdrawCashBtn.enable();
            }
            return dWithdrawCashBtn;
        })();
        return dEditBtnsBlock;
    })();
    (function dSummaryBlock() {
        var dSummaryBlock = self.find('#summaryBlock');
        (function dSummaryTable() {
            var dSummaryTable = self.find('#summaryTable');
            $.lModel.mapDom(oEwallet, dSummaryTable);
            dSummaryTable.find('.money').formatContentToMoney('sInt');
            return dSummaryTable;
        })();
        return dSummaryBlock;
    })();
    (function dTranxListBlock() {
        var dTranxListBlock = self.find('#tranxListBlock');
        dTranxListBlock.pEwalletTranxList(eWalletId);
        return dTranxListBlock;
    })();
    var dAddCreditLimit = (function () {
        var dAddCreditLimit = self.find('#addCreditLimitDiv');
        return dAddCreditLimit.hide();
    })();
    var dReduceCreditLimit = (function () {
        var dReduceCreditLimit = self.find('#reduceCreditLimitDiv');
        return dReduceCreditLimit.hide();
    })();
    var dDepositCashDiv = (function () {
        var dDepositCashDiv = self.find('#depositCashDiv');
        return dDepositCashDiv.hide();
    })();
    var dWithdrawCashDiv = (function () {
        var dWithdrawCashDiv = self.find('#withdrawCashDiv');
        return dWithdrawCashDiv.hide();
    })();
    return self.hide().fadeIn();
};

$.fn.pEwalletTranxList = function (eWalletId) {
    var pageOpt = $.lHelper.getListPageOpt({
        ewalletIds: eWalletId
    });
    var self = this;
    (function dTranxListDivFn() {
        var dTranxListDiv = self.find('#tranxListDiv');
        var oTranxList = null;
        $.ajax.eWalletTransaction.getTransactionListAJ(pageOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oTranxList = $.lObj.cloneObj(result);
            });
        });
        $.lConsole.log('oTranxList=', oTranxList);
        if (!oTranxList) {
            return dTranxListDiv;
        }
        (function dTranxListTable() {
            var oaTranx = oTranxList.results;
            var dTranxListTable = self.find('#tranxListTable');
            dTranxListTable.mListTable(oaTranx, null, function (index, oData, dEachDom) {
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html((pageOpt.startPage * pageOpt.pageSize) + index + 1);
                })();

                (function formatDateTime() {
                    dEachDom.find('.recordUpdatedAt').formatContentToDateTime('dateTime');
                })();

                (function formatMoney() {
                    dEachDom.find('.money').formatContentToMoney('int');
                })();
            });
            return dTranxListTable;
        })();
        (function dPagination() {
            var dPagination = self.find('#pagination');
            var startPage = oTranxList.currentPageNumber;
            var pageSize = oTranxList.pageSize;
            var totalCount = oTranxList.totalCount;
            var totalPage = oTranxList.totalPages;
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    pageOpt.startPage = page;
                    pageOpt.pageSize = pageSize;
                    dTranxListDivFn();
                }
            };
            dPagination = dPagination.mPagination(opt);
            return dPagination;
        })();
        return dTranxListDiv;
    })();
    return self;
};

$.fn.pEwalletAddCreditLimit = function (pageOpt) {
    var self = this;
    var eWalletId = pageOpt.eWalletId;
    var creditLimit = pageOpt.creditLimit;
    var currencyCode = pageOpt.currencyCode;
    var successCb = pageOpt.successCb;
    var setDefaultMode = function () {
        dPreviewAddCreditLimit.dNewCreditLimitAdd.empty();
        dAddCreditLimitAmount
            .enable()
            .val('');
        dAddCreditLimitCheckBtn
            .disable()
            .fadeIn();
        dAddCreditLimitSubmitBtn.hide();
    };
    var setCheckMode = function () {
        var newCreditLimit = getNewCreditLimit();
        newCreditLimit = $.lStr.formatMoney(newCreditLimit, 'int');
        dPreviewAddCreditLimit.dNewCreditLimitAdd.html(newCreditLimit);
        dAddCreditLimitAmount.disable();
        dAddCreditLimitSubmitBtn.fadeIn();
        dAddCreditLimitCheckBtn.hide();
    };
    var getNewCreditLimit = function () {
        var amount = dAddCreditLimitAmount.getRealValue();
        return creditLimit + amount;
    };
    var dPreviewAddCreditLimit = (function () {
        var dPreviewAddCreditLimit = self.find('#previewAddCreditLimit');
        (function dOriginCreditLimitAdd() {
            var dOriginCreditLimitAdd = dPreviewAddCreditLimit.find('#originCreditLimitAdd');
            var formatted = $.lStr.formatMoney(creditLimit, 'int');
            dOriginCreditLimitAdd.html(formatted);
            return dPreviewAddCreditLimit.find('#originCreditLimitAdd');
        })();
        dPreviewAddCreditLimit.dNewCreditLimitAdd = (function () {
            return dPreviewAddCreditLimit.find('#newCreditLimitAdd');
        })();
        return dPreviewAddCreditLimit;
    })();
    var dAddCreditLimitAmount = (function () {
        var dAddCreditLimitAmount = self.find('#addCreditLimitAmount');
        dAddCreditLimitAmount
            .mInputRestrict('money')
            .on('keyup.dAddCreditLimitAmount', function () {
                var amount = dAddCreditLimitAmount.getRealValue();
                if (amount) {
                    var newCreditLimit = getNewCreditLimit();
                    var maxCreditLimit = 99999999;
                    if (newCreditLimit > maxCreditLimit) {
                        var maxAmount = maxCreditLimit - creditLimit;
                        maxAmount = $.lStr.formatMoney(maxAmount, 'int');
                        dAddCreditLimitAmount.val(maxAmount);
                    }
                    dAddCreditLimitCheckBtn.enable();
                }
                else {
                    dAddCreditLimitCheckBtn.disable();
                }
            });
        return dAddCreditLimitAmount;
    })();
    var dAddCreditLimitCheckBtn = (function () {
        var dAddCreditLimitCheckBtn = self.find('#addCreditLimitCheckBtn');
        dAddCreditLimitCheckBtn.mBtn('confirm', function () {
            setCheckMode();
        });
        return dAddCreditLimitCheckBtn;
    })();
    var dAddCreditLimitSubmitBtn = (function dAddCreditLimitSubmitBtnFn() {
        var dAddCreditLimitSubmitBtn = self.find('#addCreditLimitSubmitBtn');
        dAddCreditLimitSubmitBtn.mBtn('submit', function () {
            var amount = dAddCreditLimitAmount.getRealValue();
            var opt = {
                ewalletId: eWalletId,
                currencyCode: currencyCode,
                amount: amount,
                currentCreditLimit: creditLimit
            };
            $.ajax.eWallet.addCreditLimitAsyncAJ(opt, function (res) {
                $.mNtfc.showMsgAftUpdate(res, function () {
                    successCb && successCb();
                });
            });
            $.mNtfc.showSendingMsg();
            $.mFancybox.close();
        });
        return dAddCreditLimitSubmitBtn.hide();
    })();
    (function dAddCreditLimitSubmitBtn() {
        var dAddCreditLimitSubmitBtn = self.find('#addCreditLimitCancelBtn');
        dAddCreditLimitSubmitBtn.mBtn('cancel', function () {
            if (dAddCreditLimitCheckBtn.isHidden()) {
                setDefaultMode();
                return;
            }
            $.mFancybox.close();
        });
        return dAddCreditLimitSubmitBtn;
    })();
    setDefaultMode();
    self.showEwalletAddCreditLimit = function () {
        $.mFancybox.open(self);
    };
    return self;
};

$.fn.pEwalletReduceCreditLimit = function (pageOpt) {
    var self = this;
    var eWalletId = pageOpt.eWalletId;
    var currencyCode = pageOpt.currencyCode;
    var creditLimit = pageOpt.creditLimit;
    var successCb = pageOpt.successCb;
    var setDefaultMode = function () {
        dPreviewReduceCreditLimit.dNewCreditLimitReduce.empty();
        dReduceCreditLimitAmount
            .enable()
            .val('');
        dReduceCreditLimitCheckBtn
            .disable()
            .fadeIn();
        dReduceCreditLimitSubmitBtn.hide();
    };
    var setCheckMode = function () {
        var newCreditLimit = getNewCreditLimit();
        newCreditLimit = $.lStr.formatMoney(newCreditLimit, 'int');
        dPreviewReduceCreditLimit.dNewCreditLimitReduce.html(newCreditLimit);
        dReduceCreditLimitAmount.disable();
        dReduceCreditLimitSubmitBtn.fadeIn();
        dReduceCreditLimitCheckBtn.hide();
    };
    var getNewCreditLimit = function () {
        var amount = dReduceCreditLimitAmount.getRealValue();
        return creditLimit - amount;
    };
    var dPreviewReduceCreditLimit = (function () {
        var dPreviewReduceCreditLimit = self.find('#previewReduceCreditLimit');
        dPreviewReduceCreditLimit.dOriginCreditLimitReduce = (function dOriginCreditLimitReduce() {
            var dOriginCreditLimitReduce = dPreviewReduceCreditLimit.find('#originCreditLimitReduce');
            var creditLimitFormatted = $.lStr.formatMoney(creditLimit, 'int');
            dOriginCreditLimitReduce.html(creditLimitFormatted);
            return dOriginCreditLimitReduce;
        })();
        dPreviewReduceCreditLimit.dNewCreditLimitReduce = (function () {
            return dPreviewReduceCreditLimit.find('#newCreditLimitReduce');
        })();
        return dPreviewReduceCreditLimit;
    })();
    var dReduceCreditLimitAmount = (function () {
        var dReduceCreditLimitAmount = self.find('#reduceCreditLimitAmount');
        dReduceCreditLimitAmount
            .mInputRestrict('money')
            .on('keyup.dAddCreditLimitAmount', function () {
                var amount = dReduceCreditLimitAmount.getRealValue();
                if (amount) {
                    dReduceCreditLimitCheckBtn.enable();
                    if (amount > creditLimit) {
                        var creditLimitMoney = $.lStr.formatMoney(creditLimit);
                        dReduceCreditLimitAmount.val(creditLimitMoney);
                    }
                    return;
                }
                dReduceCreditLimitCheckBtn.disable();
            });
        return dReduceCreditLimitAmount;
    })();
    var dReduceCreditLimitCheckBtn = (function dReduceCreditLimitCheckBtnFn() {
        var dReduceCreditLimitCheckBtn = self.find('#reduceCreditLimitCheckBtn');
        dReduceCreditLimitCheckBtn.mBtn('confirm', function () {
            setCheckMode();
        });
        return dReduceCreditLimitCheckBtn;
    })();
    var dReduceCreditLimitSubmitBtn = (function () {
        var dReduceCreditLimitSubmitBtn = self.find('#reduceCreditLimitSubmitBtn');
        dReduceCreditLimitSubmitBtn.mBtn('submit', function () {
            var amount = dReduceCreditLimitAmount.getRealValue();
            var opt = {
                ewalletId: eWalletId,
                currencyCode: currencyCode,
                amount: amount,
                currentCreditLimit: creditLimit
            };
            $.ajax.eWallet.reduceCreditLimitAsyncAJ(opt, function (res) {
                $.mNtfc.showMsgAftUpdate(res, function () {
                    successCb && successCb();
                });
            });
            $.mNtfc.showSendingMsg();
            $.mFancybox.close();
        });
        return dReduceCreditLimitSubmitBtn.hide();
    })();
    (function dReduceCreditLimitSubmitBtn() {
        var dReduceCreditLimitSubmitBtn = self.find('#reduceCreditLimitCancelBtn');
        dReduceCreditLimitSubmitBtn.mBtn('cancel', function () {
            if (dReduceCreditLimitCheckBtn.isHidden()) {
                setDefaultMode();
                return;
            }
            $.mFancybox.close();
        });
        return dReduceCreditLimitSubmitBtn;
    })();
    setDefaultMode();
    self.showEwalletReduceCreditLimit = function () {
        $.mFancybox.open(self);
    };
    return self;
};

$.fn.pEwalletDepositCash = function (pageOpt) {
    // creditBalance = used credit
    // With deposit cash, reduce used-credit first then add to cashBalance if remaining-cash
    var self = this;
    var eWalletId = pageOpt.eWalletId;
    var currencyCode = pageOpt.currencyCode;
    var creditBalance = pageOpt.creditBalance;
    var cashBalance = pageOpt.cashBalance;
    var successCb = pageOpt.successCb;
    var setDefaultMode = function () {
        dPreviewDepositCash.dNewCashDeposit.empty();
        dPreviewDepositCash.dNewCreditBalanceDeposit.empty();
        dDepositCashAmount
            .enable()
            .val('');
        dDepositCashCheckBtn
            .disable()
            .fadeIn();
        dDepositCashSubmitBtn.hide();
    };
    var setCheckMode = function () {
        var newCreditBalance = getNewCreditBalance();
        newCreditBalance = (newCreditBalance > 0) ? newCreditBalance : 0;
        newCreditBalance = $.lStr.formatMoney(newCreditBalance, 'int');
        dPreviewDepositCash.dNewCreditBalanceDeposit.html(newCreditBalance);

        var newCashBalance = getNewCashBalance();
        newCashBalance = $.lStr.formatMoney(newCashBalance, 'int');
        dPreviewDepositCash.dNewCashDeposit.html(newCashBalance);
        dDepositCashAmount.disable();
        dDepositCashSubmitBtn.fadeIn();
        dDepositCashCheckBtn.hide();
    };
    var getNewCreditBalance = function () {
        var amount = dDepositCashAmount.getRealValue();
        return creditBalance - amount;
    };
    var getNewCashBalance = function () {
        var newCreditBalance = getNewCreditBalance();
        if (newCreditBalance < 0) {
            return cashBalance - newCreditBalance;
        }
        return cashBalance;
    };
    var dPreviewDepositCash = (function () {
        var dPreviewDepositCash = self.find('#previewDepositCash');
        (function dOriginCreditBalanceDeposit() {
            var dOriginCreditBalanceDeposit = dPreviewDepositCash.find('#originCreditBalanceDeposit');
            var formatted = $.lStr.formatMoney(creditBalance, 'int');
            dOriginCreditBalanceDeposit.html(formatted);
            return dOriginCreditBalanceDeposit;
        })();
        (function dOriginCashDeposit() {
            var dOriginCashDeposit = dPreviewDepositCash.find('#originCashDeposit');
            var formatted = $.lStr.formatMoney(cashBalance, 'int');
            dOriginCashDeposit.html(formatted);
            return dOriginCashDeposit;
        })();
        dPreviewDepositCash.dNewCreditBalanceDeposit = (function () {
            return dPreviewDepositCash.find('#newCreditBalanceDeposit');
        })();
        dPreviewDepositCash.dNewCashDeposit = (function () {
            return dPreviewDepositCash.find('#newCashDeposit');
        })();
        return dPreviewDepositCash;
    })();
    var dDepositCashAmount = (function () {
        var dDepositCashAmount = self.find('#depositCashAmount');
        dDepositCashAmount
            .mInputRestrict('money', {
                vMax: '99999999999.99'
            })
            .on('keyup.dDepositCashAmount', function () {
                var amount = dDepositCashAmount.getRealValue();
                if (amount) {
                    var newCashBalance = getNewCashBalance();
                    var maxCash = 99999999;
                    if (newCashBalance > maxCash) {
                        var maxAmount = maxCash - cashBalance + creditBalance;
                        maxAmount = $.lStr.formatMoney(maxAmount, 'int');
                        dDepositCashAmount.val(maxAmount);
                    }
                    dDepositCashCheckBtn.enable();
                }
                else {
                    dDepositCashCheckBtn.disable();
                }
            });
        return dDepositCashAmount;
    })();
    var dDepositCashCheckBtn = (function () {
        var dDepositCashCheckBtn = self.find('#depositCashCheckBtn');
        dDepositCashCheckBtn.mBtn('confirm', function () {
            setCheckMode();
        });
        return dDepositCashCheckBtn;
    })();
    var dDepositCashSubmitBtn = (function () {
        var dDepositCashSubmitBtn = self.find('#depositCashSubmitBtn');
        dDepositCashSubmitBtn.mBtn('submit', function () {
            var amount = dDepositCashAmount.getRealValue();
            var opt = {
                ewalletId: eWalletId,
                currencyCode: currencyCode,
                amount: amount
            };
            $.ajax.eWallet.depositCashAsyncAJ(opt, function (res) {
                $.mNtfc.showMsgAftUpdate(res, function () {
                    successCb && successCb();
                });
            });
            $.mNtfc.showSendingMsg();
            $.mFancybox.close();
        });
        return dDepositCashSubmitBtn.hide();
    })();
    (function dDepositCashSubmitBtn() {
        var dDepositCashSubmitBtn = self.find('#depositCashCancelBtn');
        dDepositCashSubmitBtn.mBtn('cancel', function () {
            if (dDepositCashCheckBtn.isHidden()) {
                setDefaultMode();
                return;
            }
            $.mFancybox.close();
        });
        return dDepositCashSubmitBtn;
    })();
    setDefaultMode();
    self.showEwalletDepositCash = function () {
        $.mFancybox.open(self);
    };
    return self;
};

$.fn.pEwalletWithdrawCash = function (pageOpt) {
    var self = this;
    var eWalletId = pageOpt.eWalletId;
    var currencyCode = pageOpt.currencyCode;
    var cashBalance = pageOpt.cashBalance;
    var successCb = pageOpt.successCb;
    var setDefaultMode = function () {
        dPreviewWithdrawCash.dNewCashWithdraw.empty();
        dWithdrawCashAmount
            .enable()
            .val('');
        dWithdrawCashCheckBtn
            .disable()
            .fadeIn();
        dWithdrawCashSubmitBtn.hide();
    };
    var setCheckMode = function () {
        var newCashBalance = getNewCashBalance();
        newCashBalance = $.lStr.formatMoney(newCashBalance, 'int');
        dPreviewWithdrawCash.dNewCashWithdraw.html(newCashBalance);
        dWithdrawCashAmount.disable();
        dWithdrawCashSubmitBtn.fadeIn();
        dWithdrawCashCheckBtn.hide();
    };
    var getNewCashBalance = function () {
        var amount = dWithdrawCashAmount.getRealValue();
        return cashBalance - amount;
    };
    var dPreviewWithdrawCash = (function () {
        var dPreviewWithdrawCash = self.find('#previewWithdrawCash');
        (function dOriginCashWithdraw() {
            var dOriginCashWithdraw = dPreviewWithdrawCash.find('#originCashWithdraw');
            var formatted = $.lStr.formatMoney(cashBalance, 'int');
            dOriginCashWithdraw.html(formatted);
            return dOriginCashWithdraw;
        })();
        dPreviewWithdrawCash.dNewCashWithdraw = (function () {
            return dPreviewWithdrawCash.find('#newCashWithdraw');
        })();
        return dPreviewWithdrawCash;
    })();
    var dWithdrawCashAmount = (function () {
        var dWithdrawCashAmount = self.find('#withdrawCashAmount');
        dWithdrawCashAmount
            .mInputRestrict('money')
            .on('keyup.dWithdrawCashAmount', function () {
                var amount = dWithdrawCashAmount.getRealValue();
                if (amount) {
                    dWithdrawCashCheckBtn.enable();
                    if (amount > cashBalance) {
                        var cashBalanceMoney = $.lStr.formatMoney(cashBalance);
                        dWithdrawCashAmount.val(cashBalanceMoney);
                    }
                    return;
                }
                dWithdrawCashCheckBtn.disable();
            });
        return dWithdrawCashAmount;
    })();
    var dWithdrawCashCheckBtn = (function () {
        var dWithdrawCashCheckBtn = self.find('#withdrawCashCheckBtn');
        dWithdrawCashCheckBtn.mBtn('confirm', function () {
            setCheckMode();
        });
        return dWithdrawCashCheckBtn;
    })();
    var dWithdrawCashSubmitBtn = (function () {
        var dWithdrawCashSubmitBtn = self.find('#withdrawCashSubmitBtn');
        dWithdrawCashSubmitBtn.mBtn('submit', function () {
            var amount = dWithdrawCashAmount.getRealValue();
            var opt = {
                ewalletId: eWalletId,
                currencyCode: currencyCode,
                amount: amount
            };
            $.ajax.eWallet.withdrawCashAsyncAJ(opt, function (res) {
                $.mNtfc.showMsgAftUpdate(res, function () {
                    successCb && successCb();
                });
            });
            $.mNtfc.showSendingMsg();
            $.mFancybox.close();
        });
        return dWithdrawCashSubmitBtn.hide();
    })();
    (function dWithdrawCashSubmitBtn() {
        var dWithdrawCashSubmitBtn = self.find('#withdrawCashCancelBtn');
        dWithdrawCashSubmitBtn.mBtn('cancel', function () {
            if (dWithdrawCashCheckBtn.isHidden()) {
                setDefaultMode();
                return;
            }
            $.mFancybox.close();
        });
        return dWithdrawCashSubmitBtn;
    })();
    setDefaultMode();
    self.showEwalletWithdrawCash = function () {
        $.mFancybox.open(self);
    };
    return self;
};