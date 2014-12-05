$.fn.pCpyEwallet = function (pageOpt) {
    var self = this;
    var selfId = 'pCpyEwallet';
    var oEwallet = null;
    if (!$.lUtil.goIndexIfAuthPmsFailed(['cpyEwalletReadPms', 'cpyEwalletEditPms'])) {
        return self;
    }
    $.ajax.company.getCompanyEwalletAJ(pageOpt, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oEwallet = tmd.pCompanyEwallet(result);
        }, function (result) {
            var code = result.code;
            var sysMsg = result.message;
            var msg = $.lLang.parseLanPath('pCpy.resMsg')[code];
            if (sysMsg) {
                msg += '. ' + sysMsg;
            }
            $.mNtfc.show(msg, 'dng');
        });
    });
    $.lConsole.log('oEwallet=', oEwallet);
    if (!oEwallet) {
        return self;
    }
    var unitList = oEwallet.unitList;
    var eWalletCount = oEwallet.eWalletCount;
    var creditLimit = oEwallet.creditLimit;
//    var creditBalance = oEwallet.creditBalance;
    var creditRemain = oEwallet.creditRemain;
    var cashBalance = oEwallet.cashBalance;
    var oCpy = oEwallet.oCompany;
    // get vars from company-data-obj
    var cpyName = oCpy.name;
    // eWalletType = CompanywiseShared/TeamwiseShared/Individual
    var eWalletType = oCpy.ewalletSettingsType;
    var creditCurrencyCode = oCpy.creditCurrencyCode;
    (function formatEwallet() {
        // cover unit to {name:xxx,val:xxx}
        $.each(unitList, function (i, unit) {
            // used to set mSelect
            if (unit.ewalletId) {
                unit.val = unit.ewalletId;
            }
            if (oEwallet.unitType === 'member') {
                unit.name = unit.displayName;
            }
        });
    })();
    (function dOverview() {
        var dOverview = self.find('#overview');
        (function dInfoContainer() {
            var dInfoContainer = dOverview.find('#infoContainer');
            (function dCpyTitle() {
                var dCpyTitle = dInfoContainer.find('#cpyTitle');
                (function dCpyName() {
                    var dCpyName = dCpyTitle.find('#cpyName');
                    dCpyName.html(cpyName);
                    return dCpyName;
                })();
                (function dEwalletType() {
                    var dEwalletType = dInfoContainer.find('#eWalletType');
                    dEwalletType.lSetLang('common.eWalletTypeOpt.' + eWalletType);
                    return dEwalletType;
                })();
                (function dCreditCurrencyCode() {
                    var dCreditCurrencyCode = dInfoContainer.find('#creditCurrencyCode');
                    dCreditCurrencyCode.html(creditCurrencyCode);
                    return dCreditCurrencyCode;
                })();
                return dCpyTitle;
            })();
            (function dInfoTable() {
                var dInfoTable = dInfoContainer.find('#infoTable');
                $.lModel.mapDom(oEwallet, dInfoTable, function () {
                });
                dInfoTable.find('.money').formatContentToMoney('sInt');
                return dInfoTable;
            })();
            return dInfoContainer;
        })();
        (function dSummaryContainer() {
            var dSummaryContainer = dOverview.find('#summaryContainer');
            if (eWalletCount < 1) {
                dSummaryContainer.remove();
                return null;
            }
            var dSummaryContainerTitle = (function () {
                var dSummaryContainerTitle = dSummaryContainer.find('#summaryContainerTitle');
                dSummaryContainerTitle.dSummaryTableLink = (function () {
                    var dSummaryTableLink = dSummaryContainerTitle.find('#summaryTableLink');
                    return dSummaryTableLink;
                })();
                dSummaryContainerTitle.dSummaryChartLink = (function () {
                    var dSummaryChartLinkk = dSummaryContainerTitle.find('#summaryChartLink');
                    return dSummaryChartLinkk;
                })();
                return dSummaryContainerTitle;
            })();
            var dSummaryTable = (function () {
                var dSummaryTable = dSummaryContainer.find('#summaryTable');
                (function dUnitName() {
                    var dUnitName = dSummaryTable.find('#unitName');
                    switch (eWalletType) {
                        case 'TeamwiseShared':
                            dUnitName.lSetLang('common.Team');
                            break;
                        case 'Individual':
                            dUnitName.lSetLang('common.Member');
                            break;
                    }
                    return dUnitName;
                })();
                dSummaryTable.mListTable(unitList, null, function (i, oUnit, dEachDom) {
                    (function formatMoney() {
                        dEachDom.find('.money').formatContentToMoney('int');
                    })();
                    (function setCreditLimitLink() {
                        var dCreditLimitEditor = dEachDom.find('.creditLimitEditor').hide();
                        if (!$.lUtil.authUserPms('cpyEwalletEditPms')) {
                            return;
                        }
                        var ewalletId = oUnit.ewalletId;
                        var unitCreditLimit = parseInt(oUnit.unitCreditLimit);
                        var opt = {
                            ewalletId: ewalletId,
                            creditCurrencyCode: creditCurrencyCode,
                            unitCreditLimit: unitCreditLimit,
                            updateCb: function (res) {
                                $.mNtfc.showMsgAftUpdate(res, function () {
                                    $.lUtil.goPage($.pCpy.cpyEwalletPath, pageOpt);
                                }, function (result) {
                                    var code = result.code;
                                    var langPath = 'pCpy.resMsg.' + $.lStr.escapeRegExp(code);
                                    var msg = $.lLang.parseLanPath(langPath);
                                    if (msg) {
                                        $.mNtfc.show(msg, 'wng');
                                        return false;
                                    }
                                    return true;
                                });
                            }
                        };
                        dCreditLimitEditor.pCpyCreditLimitEditor(opt);
                        var dLink = $.lDom.createLink('');
                        var dUnitCreditLimit = dEachDom.find('.unitCreditLimit');
                        dUnitCreditLimit
                            .lClass('basic-link')
                            .action('click', function () {
                                // hide all editor
                                $('.creditLimitEditor').hide();
                                dCreditLimitEditor.showEditor();
                            })
                            .after(dLink);
                        dLink.append(dUnitCreditLimit);
                    })();
                });
                return dSummaryTable;
            })();
            /**
             * use 3rd-party-amCharts
             * please refer to http://www.amcharts.com/javascript-charts/
             * @returns {*}
             */
            var dSummaryChart = (function () {
                var dSummaryChart = dOverview.find('#summaryChart');
                var chartData = [];
                var createChart = function () {
                    var availableCreditLang = $.lLang.parseLanPath('common.AvailableCredit');
                    var creditLimitLang = $.lLang.parseLanPath('common.CreditLimit');
                    var cashBalanceLang = $.lLang.parseLanPath('common.CashBalance');
                    var graphsOpt = [
                        {
                            balloonText: '[[currency]] [[value]] (' + availableCreditLang + ')',
                            labelText: '[[currency]] [[value]] (' + availableCreditLang + ')',
                            labelPosition: 'bottom',
                            fillAlphas: 1,
                            lineThickness: 0,
                            title: availableCreditLang,
                            type: 'column',
                            fillColors: '#4babee',
                            valueField: 'creditRemain'
                        },
                        {
                            balloonText: '[[currency]] [[value]] (' + creditLimitLang + ')',
                            fillAlphas: 1,
                            lineThickness: 0,
                            title: creditLimitLang,
                            type: 'column',
                            fillColors: '#0e75be',
                            valueField: 'creditLimit',
                            clustered: false
                        },
                        {
                            balloonText: '[[currency]] [[value]] (' + cashBalanceLang + ')',
                            labelText: '[[currency]] [[value]] (' + cashBalanceLang + ')',
                            labelPosition: 'bottom',
                            fillAlphas: 1,
                            lineThickness: 0,
                            title: cashBalanceLang,
                            type: 'column',
                            fillColors: '#5bcb39',
                            valueField: 'cashBalance'
                        }
                    ];
                    AmCharts.makeChart(dSummaryChart.lId(), {
                        type: 'serial',
                        rotate: true,
                        startDuration: 0.5,
                        creditsPosition: 'bottom-right',
                        startEffect: 'easeOutSine',
                        columnSpacing: 0,
                        dataProvider: chartData,
                        graphs: graphsOpt,
                        categoryField: 'unitName',
                        valueAxes: [
                            {
                                showLastLabel: false
                            }
                        ],
                        legend: {
                            align: 'center',
                            useGraphSettings: true,
                            switchable: false
                        }
                    });
                };
                $.each(unitList, function (i, oUnit) {
                    var oUnitData = {
                        creditRemain: oUnit.unitCreditRemain,
                        creditLimit: oUnit.unitCreditLimit,
                        cashBalance: oUnit.unitCashBalance,
                        unitName: oUnit.name
                    };
                    chartData.push(oUnitData);
                });

                dSummaryChart.css({
                    width: '100%',
                    height: (chartData.length + 1) * 100
                });
                $.lEventEmitter.hookEvent('befSwitchLang', selfId, function () {
                    if (!dSummaryChart.isHidden()) {
                        createChart();
                    }
                }, {
                    source: self
                });

                dSummaryChart.createChart = createChart;
                return dSummaryChart;
            })();
            dSummaryContainerTitle.dSummaryTableLink.mCollapser(dSummaryTable, {
                appendTarget: dSummaryContainerTitle,
                defaultShow: true
            });
            dSummaryContainerTitle.dSummaryChartLink.mCollapser(dSummaryChart, {
                appendTarget: dSummaryContainerTitle,
                beforeShow: function () {
                    dSummaryChart.empty();
                },
                afterShow: function () {
                    dSummaryChart.createChart();
                }
            });
            return dSummaryContainer;
        })();
        return dOverview;
    })();
    (function dUnitOverview() {
        var dUnitOverview = self.find('#unitOverview');
        if (unitList.length < 1) {
            dUnitOverview.remove();
            return null;
        }
        var dUnitInfoMain = (function () {
            var dUnitInfoMain = dUnitOverview.find('#unitInfoMain');
            return dUnitInfoMain.hide();
        })();
        (function dChoiceUnit() {
            var dChoiceUnit = dUnitOverview.find('#choiceUnit');
            var langPath = 'pCpy.eWallet.unitOverview.';
            langPath += (eWalletType === 'TeamwiseShared') ? 'ChoiceTeam' : 'ChoiceMember';
            dChoiceUnit.lSetLang(langPath);
            return dChoiceUnit;
        })();
        (function dUnitSelect() {
            var dUnitSelect = dUnitOverview.find('#unitSelect');
            dUnitSelect.mSelect(unitList, {
                zeroOption: true
            }, function (i, oUnit, dOpt) {
                dOpt.data('oUnit', oUnit);
            });
            dUnitSelect.action('change', function () {
                var eWalletId = dUnitSelect.val();
                var dSelectedOpt = dUnitSelect.find(':selected');
                if (eWalletId) {
                    var opt = {
                        ewalletId: eWalletId
                    };
                    $.ajax.eWallet.getEwalletByIdAJ(opt, function (res) {
                        $.lAjax.parseRes(res, function (oUnitEwallet) {
                            $.lUtil.getPageSwitchTarget('/company/ewallet/cpyEwalletUnitInfo', 'unitInfoMain', function () {
                                // combine unit and e-wallet data
                                var oUnit = dSelectedOpt.data('oUnit');
                                $.extend(oUnit, oUnitEwallet);
                                dUnitInfoMain.pCpyEwalletUnitInfo(oUnit);
                            });
                        });
                    });
                }
                // reset select
                dUnitSelect.val(null);
            });
            return dUnitSelect;
        })();
        return dUnitOverview;
    })();
    return self;
};

$.fn.pCpyCreditLimitEditor = function (pageOpt) {
    var self = this;
    var ewalletId = pageOpt.ewalletId;
    var creditCurrencyCode = pageOpt.creditCurrencyCode;
    var unitCreditLimit = pageOpt.unitCreditLimit;
    var updateCb = pageOpt.updateCb;
    var opt = {
        ewalletId: ewalletId,
        currencyCode: creditCurrencyCode
    };
    var dCreditLimitAmountInp = (function () {
        var dCreditLimitAmountInp = self.find('.creditLimitAmountInp');
        dCreditLimitAmountInp
            .mInputRestrict('moneyInt')
            .action('keyup', function () {
                var creditLimitAmount = parseInt(dCreditLimitAmountInp.getRealValue());
                var newCreditLimit = unitCreditLimit - creditLimitAmount;
                if (creditLimitAmount > 0) {
                    dAddCreditLimitBtn.enable();
                    if (newCreditLimit < 0) {
                        dReduceCreditLimitBtn.disable();
                        return;
                    }
                    dReduceCreditLimitBtn.enable();
                } else {
                    dAddCreditLimitBtn.disable();
                    dReduceCreditLimitBtn.disable();
                }
            });
        return dCreditLimitAmountInp;
    })();
    var dAddCreditLimitBtn = (function () {
        var dAddCreditLimitBtn = self.find('.addCreditLimitBtn');
        dAddCreditLimitBtn
            .mBtn('submit', {
                title: $.lDom.createLangSpan('pCpy.eWallet.overview.summary.addCreditLimit')
            })
            .mConfirmBox({
                boxTitle: function () {
                    return $.lDom.createLangSpan('pCpy.eWallet.overview.summary.ModifyCreditLimit');
                },
                boxMsg: function () {
                    var creditLimitAmount = dCreditLimitAmountInp.getRealValue();
                    var newCreditLimit = unitCreditLimit + creditLimitAmount;
                    var unitCreditLimitFormat = $.lStr.formatMoney(unitCreditLimit, 'int');
                    var newCreditLimitFormat = $.lStr.formatMoney(newCreditLimit, 'int');

                    return unitCreditLimitFormat + ' → ' + newCreditLimitFormat;
                },
                btnYesFn: function () {
                    opt.amount = dCreditLimitAmountInp.getRealValue();
                    opt.currentCreditLimit = unitCreditLimit;
                    $.ajax.eWallet.addCreditLimitAsyncAJ(opt, function (res) {
                        updateCb && updateCb(res);
                    });
                }
            });
        return dAddCreditLimitBtn;
    })();
    var dReduceCreditLimitBtn = (function () {
        var dReduceCreditLimitBtn = self.find('.reduceCreditLimitBtn');
        dReduceCreditLimitBtn
            .mBtn('submit', {
                title: $.lDom.createLangSpan('pCpy.eWallet.overview.summary.reduceCreditLimit')
            })
            .mConfirmBox({
                boxTitle: function () {
                    return $.lDom.createLangSpan('pCpy.eWallet.overview.summary.ModifyCreditLimit');
                },
                boxMsg: function () {
                    var creditLimitAmount = dCreditLimitAmountInp.getRealValue();
                    var newCreditLimit = unitCreditLimit - creditLimitAmount;
                    if (newCreditLimit < 0) {
                        newCreditLimit = 0;
                    }
                    var unitCreditLimitFormat = $.lStr.formatMoney(unitCreditLimit, 'int');
                    var newCreditLimitFormat = $.lStr.formatMoney(newCreditLimit, 'int');

                    return unitCreditLimitFormat + ' → ' + newCreditLimitFormat;
                },
                btnYesFn: function () {
                    // will check the new creditLimit if less than 0, no need check here
                    opt.amount = dCreditLimitAmountInp.getRealValue();
                    opt.currentCreditLimit = unitCreditLimit;
                    $.ajax.eWallet.reduceCreditLimitAsyncAJ(opt, function (res) {
                        updateCb && updateCb(res);
                    });
                }
            });
        if (unitCreditLimit === 0) {
            dReduceCreditLimitBtn.disable();
        }
        return dReduceCreditLimitBtn;
    })();
    (function dCancelUpdateCreditLimitBtn() {
        var dCancelUpdateCreditLimitBtn = self.find('.cancelUpdateCreditLimitBtn');
        dCancelUpdateCreditLimitBtn.mBtn('cancel', function () {
            self.hide();
        });
        return dCancelUpdateCreditLimitBtn;
    })();
    self.showEditor = function () {
        dCreditLimitAmountInp.val('');
        dAddCreditLimitBtn.disable();
        dReduceCreditLimitBtn.disable();
        self.fadeIn();
    };
    return self.hide();
};

$.fn.pCpyEwalletUnitInfo = function (oUnitData) {
    var self = this;
    var ewalletId = oUnitData.ewalletId;
    var dUnitInfoDetail = (function () {
        var dUnitInfoDetail = self.find('#unitInfoDetail');
        return dUnitInfoDetail.hide();
    })();
    (function dUnitTitle() {
        var dUnitTitle = self.find('#unitTitle');
        (function dUnitName() {
            var dUnitName = dUnitTitle.find('#unitName');
            var unitName = oUnitData.name;
            return dUnitName.html(unitName);
        })();
        (function dEwalletId() {
            var dEwalletId = dUnitTitle.find('#eWalletId');
            return dEwalletId.html(ewalletId);
        })();
        return dUnitTitle;
    })();
    (function dUnitInfo() {
        var dUtilInfo = $('#unitInfo');
        (function dPointBlock() {
            // TODO no test
            var dPointBlock = dUtilInfo.find('#pointBlock');
            dPointBlock.action('click', function () {
                var dPointDetail = self.find('#pointDetail');
                return dPointDetail;
            });
            return dPointBlock;
        })();
        (function dCouponBlock() {
            // TODO no test
            var dCouponBlock = dUtilInfo.find('#couponBlock');
            dCouponBlock.action('click', function () {
                var dCouponDetail = self.find('#couponDetail');
                return dCouponDetail;
            });
            return dCouponBlock;
        })();
        (function dCashBlock() {
            var dCashBlock = dUtilInfo.find('#cashBlock');
            (function dCashTable() {
                var dCashTable = dCashBlock.find('#cashTable');
                $.lModel.mapDom(oUnitData, dCashTable);
                dCashTable.find('.money').formatContentToMoney('sInt');

                dCashTable.find('td').css({
                    padding: 0
                });
                return dCashTable;
            })();
            dCashBlock.action('click', function () {
                $.lUtil.getPageSwitchTarget('/company/ewallet/cpyEwalletUnitInfoCash', dUnitInfoDetail, function () {
                    dUnitInfoDetail.pCpyEwalletUnitInfoCash(ewalletId);
                });
            });
            return dCashBlock;
        })();
        (function dUnitInfoBlock() {
            var dUnitInfoBlock = dUtilInfo.find('.unitInfoBlock');
            dUnitInfoBlock.mBlockBtn();
            return dUnitInfoBlock;
        })();
        return dUtilInfo;
    })();
    $.lLang.switchLang(self);
    return self;
};

$.fn.pCpyEwalletUnitInfoCash = function (eWalletId) {
    var pageOpt = $.lHelper.getListPageOpt({
        ewalletIds: eWalletId
    });
    var self = this;
    var dTranxListFn = function () {
        var dTranxList = self.find('#tranxList');
        var oTranxList = null;
        // set language
        $.lLang.switchLang(dTranxList);
        $.ajax.eWalletTransaction.getTransactionListAJ(pageOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oTranxList = $.lObj.cloneObj(result);
            });
        });
        if (!oTranxList) {
            return dTranxList;
        }
        (function dTranxListTable() {
            var oaTranx = oTranxList.results;
            var dTranxListTable = dTranxList.find('#tranxListTable');
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
                    dTranxListFn();
                }
            };
            dPagination = dPagination.mPagination(opt);
            return dPagination;
        })();
        return dTranxList;
    };
    dTranxListFn();
    return self;
};