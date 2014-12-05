$.fn.pCpyProfile = function (pageOpt) {
    var self = this;
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pCpy.pagePms)) {
        return self;
    }
    var oProfile = null;
    var oCpy = null;
    $.ajax.company.getCompanyProfileAJ(pageOpt, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oProfile = result;
        });
    });
    $.lConsole.log('oProfile=', oProfile);
    if (!oProfile) {
        return self;
    }
    oCpy = oProfile.company;
    if (!oCpy) {
        return self;
    }
    oCpy = tmd.pCompany(oCpy);
    $.lConsole.log('oCpy=', oCpy);
    var dInfoBlock = (function () {
        var dInfoBlock = self.find('#infoBlock');
        var dInfoTitle = (function () {
            var dInfoTitle = dInfoBlock.find('#infoTitle');
            return dInfoTitle;
        })();
        var dInfoDiv = (function () {
            var dInfoDiv = dInfoBlock.find('#infoDiv');
            (function dInfoRow() {
                var dInfoRow = dInfoBlock.find('#infoRow');
                (function dEditBtn() {
                    var dEditBtn = dInfoRow.find('#editBtn');
                    dEditBtn.mBtn('edit', function () {
                        dInfoEditBlock.showInfoEditBlock();
                        dInfoBlock.hide();
                    });
                    return dEditBtn;
                })();
                (function dCompanyInfoTable() {
                    var dCompanyInfoTable = dInfoBlock.find('#companyInfoTable');
                    $.lModel.mapDom(oCpy, dCompanyInfoTable);
                    var isTesting = oCpy.isTesting;
                    (function dCountryCode() {
                        var dCountryCode = dCompanyInfoTable.find('#countryCode');
                        dCountryCode.lSetLang('countryNameOpt.' + oCpy.countryCode);
                        return dCountryCode;
                    })();
                    (function dAgencyBusinessType() {
                        var dAgencyBusinessType = dCompanyInfoTable.find('#agencyBusinessType');
                        dAgencyBusinessType.lSetLang('common.agencyBusinessTypesOpt.' + oCpy.agencyBusinessType);
                        return dAgencyBusinessType;
                    })();
                    var dIsTesting = (function () {
                        var dIsTesting = dCompanyInfoTable.find('#isTesting');
                        if (isTesting) {
                            dIsTesting.lSetLang('common.Yes');
                        }
                        else {
                            dIsTesting.lSetLang('common.No');
                        }
                        return dIsTesting;
                    })();
                    (function dChangeToDemoBtn() {
                        var dChangeToDemoBtn = dCompanyInfoTable.find('#changeToDemoBtn');
                        var boxMsgSpan = (function () {
                            var msgSpan = $('<span></span>');
                            var langSpan = $.lDom.createLangSpan('pCpy.list.ChangeToDemoAccount');
                            msgSpan.append(langSpan).append('?');
                            return msgSpan;
                        })();
                        if (isTesting) {
                            return dChangeToDemoBtn.remove();
                        }
                        dChangeToDemoBtn.mBtn('submit', {
                            title: $.lDom.createLangSpan('pCpy.list.ChangeToDemoAccount')
                        });
                        dChangeToDemoBtn.mConfirmBox({
                            showInWindow: false,
                            showTopLine: false,
                            boxMsg: boxMsgSpan,
                            btnYesFn: function () {
                                var opt = $.lObj.cloneObj(oCpy);
                                opt.isTesting = true;
                                $.ajax.company.updateCompanyAJ(opt, function (res) {
                                    $.mNtfc.showMsgAftUpdate(res, function () {
                                        dIsTesting.lSetLang('common.Yes');
                                        dChangeToDemoBtn.remove();
                                    });
                                });
                            },
                            befShowBox: function () {
                                dChangeToDemoBtn.dConfirmMain
                                    .append(dChangeToDemoBtn.dConfirmBtnYes)
                                    .append(dChangeToDemoBtn.dConfirmBtnNo);
                                dChangeToDemoBtn.dConfirmBottom.hide();
                                dIsTesting.fadeOut();
                            },
                            aftHideBox: function () {
                                dIsTesting.show();
                            }
                        });
                        return dChangeToDemoBtn;
                    })();
                    return dCompanyInfoTable;
                })();
                return dInfoRow;
            })();
            dInfoDiv.dConfigurationRow = (function () {
                var dConfigurationRow = dInfoBlock.find('#configurationRow');
                dInfoBlock.dEwalletInfoCol = (function () {
                    return dInfoBlock.find('#ewalletInfoCol');
                })();
                dInfoBlock.dEwalletInfoTable = (function () {
                    var dEwalletInfoTable = dInfoBlock.find('#ewalletInfoTable');
                    if (!oCpy.configuration) {
                        $.mNtfc.show('no company-configuration data', 'dng');
                        return dEwalletInfoTable;
                    }
                    (function dEwalletSettingsType() {
                        var dEwalletSettingsType = dEwalletInfoTable.find('.ewalletSettingsType');
                        dEwalletSettingsType.lSetLang('common.eWalletTypeOpt.' + oCpy.ewalletSettingsType);
                        return dEwalletSettingsType;
                    })();
                    (function dCreditCurrencyCode() {
                        var dCreditCurrencyCode = dEwalletInfoTable.find('.ewalletSettingsType');
                        dCreditCurrencyCode.lSetLang('common.creditCurrencyCodeOpt.' + oCpy.creditCurrencyCode);
                        return dCreditCurrencyCode;
                    })();
                    (function dInitialCreditLimit() {
                        var dInitialCreditLimit = dEwalletInfoTable.find('.ewalletSettingsType');
                        var initialCreditLimit = oCpy.initialCreditLimit;
                        if (initialCreditLimit) {
                            dInitialCreditLimit.html($.lStr.formatMoney(initialCreditLimit, 'sInt'));
                        }
                        return dInitialCreditLimit;
                    })();
                    $.lModel.mapDom(oCpy, dEwalletInfoTable);
                    return dEwalletInfoTable;
                })();
                return dConfigurationRow;
            })();
            return dInfoDiv;
        })();
        dInfoTitle.mCollapser(dInfoDiv, {
            ifShowIcon:true,
            defaultShow: true,
            closeOthers: false
        });
        dInfoBlock.showInfoBlock = function () {
            dInfoBlock.dEwalletInfoCol.append(dInfoBlock.dEwalletInfoTable);
            dInfoBlock.hide().fadeIn();
        };
        return dInfoBlock;
    })();
    var dInfoEditBlock = (function () {
        var dInfoEditBlock = self.find('#infoEditBlock');
        var initEditBlock = function () {
            $.lForm.clean(dInfoEditBlock);
            $.lModel.mapDom(oCpy, dCompanyEditTable);
            dCompanyEditTable.removeCheckerClass();
        };
        var dEwalletEditCol = (function () {
            return dInfoEditBlock.find('#ewalletEditCol');
        })();
        var dCompanyEditTable = (function () {
            var dCompanyEditTable = dInfoEditBlock.find('#companyEditTable');
            var dCompanyName = (function () {
                var dCompanyName = dCompanyEditTable.find('#name');
                dCompanyName.mInputRestrict('textNum', {maxLength: 100});
                return dCompanyName;
            })();
            var dAgencyBusinessType = (function () {
                var dAgencyBusinessType = dCompanyEditTable.find('#agencyBusinessType');
                var agencyBusinessTypesOpt = $.lDom.createLangSpanAuto('common.agencyBusinessTypesOpt');
                dAgencyBusinessType.mSelect(agencyBusinessTypesOpt, {zeroOption: true});
                return dAgencyBusinessType;
            })();
            (function dCountryCode() {
                var dCountryCode = dCompanyEditTable.find('#countryCode');
                var countryNameOpt = $.lDom.createLangSpanAuto('countryNameOpt');
                dCountryCode.mSelect(countryNameOpt, {search: true, searchByEnter: true});
                return dCompanyName;
            })();
            (function dPostalCode() {
                var dPostalCode = dCompanyEditTable.find('#postalCode');
                dPostalCode.mInputRestrict('textNum', {maxLength: 20});
                return dPostalCode;
            })();
            (function dBusinessRegistrationCode() {
                var dBusinessRegistrationCode = dCompanyEditTable.find('#businessRegistrationCode');
                dBusinessRegistrationCode.mInputRestrict('textNum', {maxLength: 20});
                return dBusinessRegistrationCode;
            })();
            (function dTierId() {
                var dTierId = dCompanyEditTable.find('#tierId');
                var tierIdOpt = $.lDom.createLangSpanAuto('common.tierIdOpt');
                dTierId.mSelect(tierIdOpt);
                return dTierId;
            })();
            (function dSubmitBtn() {
                var dSubmitBtn = dCompanyEditTable.find('#submitInfoBtn');
                dSubmitBtn.mBtn('submit', function () {
                    var pass = dCompanyEditTable.checkForm();
                    if (!pass) {
                        return;
                    }
                    var mEdit = $.lObj.cloneObj(oCpy);
                    dInfoEditBlock.mapModel(mEdit, function () {
                        $.ajax.company.updateCompanyAJ(mEdit, function (res) {
                            $.mNtfc.showMsgAftUpdate(res, function () {
                                $.lUtil.goPage($.pCpy.cpyProfilePath, pageOpt);
                            });
                        });
                    });
                });
                return dSubmitBtn;
            })();
            (function dRevertBtn() {
                var dRevertBtn = dCompanyEditTable.find('#revertBtn');
                dRevertBtn.mBtn('revert', function () {
                    initEditBlock();
                });
                return dRevertBtn;
            })();
            (function dReturnBtn() {
                var dReturnBtn = dCompanyEditTable.find('#returnInfoBtn');
                dReturnBtn.mBtn('return', function () {
                    dInfoEditBlock.hide();
                    dInfoBlock.showInfoBlock();
                });
                return dReturnBtn;
            })();
            (function setChecker() {
                dCompanyEditTable.mFormChecker({
                    'onBlur': true
                });
                var aRequiredDom = [dCompanyName, dAgencyBusinessType];
                dCompanyEditTable.addRequired(aRequiredDom);
            })();
            return dCompanyEditTable;
        })();
        dInfoEditBlock.showInfoEditBlock = function () {
            initEditBlock();
            dEwalletEditCol.append(dInfoBlock.dEwalletInfoTable);
            dInfoEditBlock.hide().fadeIn();
        };
        return dInfoEditBlock.hide();
    })();
    var dContactBlock = (function () {
        var dContactBlock = self.find('#contactBlock');
        var oaContact = oProfile.contactList;
        if (oaContact.length < 1) {
            return dContactBlock.hide();
        }
        var dContactTitle = (function () {
            var dContactTitle = dContactBlock.find('#contactTitle');
            return dContactTitle;
        })();
        var dContactList = (function () {
            var dContactList = dContactBlock.find('#contactList');
            dContactList.find('.memberDetail:first').mListDom(oaContact, function (index, oContact, dEachDom) {
                (function setPersonName() {
                    var dPersonName = dEachDom.find('.personName');
                    var title = oContact.title;
                    var personName = oContact.personName;
                    if (title) {
                        dPersonName.html(title + '. ' + personName);
                    }
                })();
                (function setEditContactBtn() {
                    var dEditContactBtn = dEachDom.find('.editContactBtn');
                    dEditContactBtn.mBtn('edit', function () {
                        dContactEditBlock.oContactData = oContact;
                        dContactEditBlock.showContactEditBlock();
                        dContactBlock.hide();
                    });
                })();
            });
            return dContactList;
        })();
        dContactTitle.mCollapser(dContactList, {
            ifShowIcon: true,
            closeOthers: false
        });
        dContactBlock.showContactBlock = function () {
            dContactBlock.hide().fadeIn();
        };
        return dContactBlock;
    })();
    var dContactEditBlock = (function () {
        var dContactEditBlock = self.find('#contactEditBlock');
        var dContactEditTable = (function () {
            var dContactEditTable = dContactEditBlock.find('#contactEditTable');
            var dPersonName = (function () {
                var dPersonName = dContactEditTable.find('#personName');
                return dPersonName;
            })();
            var dEmail = (function dEmailFn() {
                var dEmail = dContactEditTable.find('#email');
                return dEmail;
            })();
            (function dTitle() {
                var dTitle = dContactEditTable.find('#title');
                var titleOpts = $.lDom.createLangSpanAuto('common.titleOpt');
                dTitle.mSelect(titleOpts);
                return dTitle;
            })();
            (function dPhoneCountryCode() {
                var dPhoneCountryCode = dContactEditTable.find('#phoneCountryCode');
                dPhoneCountryCode.mInputRestrict('textNum', {maxLength: 4});
                return dPhoneCountryCode;
            })();
            (function dPhoneAreaCode() {
                var dPhoneAreaCode = dContactEditTable.find('#phoneAreaCode');
                dPhoneAreaCode.mInputRestrict('textNum', {maxLength: 3});
                return dPhoneAreaCode;
            })();
            (function dPhoneNumber() {
                var dPhoneNumber = dContactEditTable.find('#phoneNumber');
                dPhoneNumber.mInputRestrict('textNum', {maxLength: 20});
                return dPhoneNumber;
            })();
            (function dMobileCountryCode() {
                var dMobileCountryCode = dContactEditTable.find('#mobileCountryCode');
                dMobileCountryCode.mInputRestrict('textNum', {maxLength: 4});
                return dMobileCountryCode;
            })();
            (function dMobileNumber() {
                var dMobileNumber = dContactEditTable.find('#mobileNumber');
                dMobileNumber.mInputRestrict('textNum', {maxLength: 20});
                return dMobileNumber;
            })();
            (function dFaxCountryCode() {
                var dFaxCountryCode = dContactEditTable.find('#faxCountryCode');
                dFaxCountryCode.mInputRestrict('textNum', {maxLength: 4});
                return dFaxCountryCode;
            })();
            (function dFaxAreaCode() {
                var dFaxAreaCode = dContactEditTable.find('#faxAreaCode');
                dFaxAreaCode.mInputRestrict('textNum', {maxLength: 3});
                return dFaxAreaCode;
            })();
            (function dFaxNumber() {
                var dFaxNumber = dContactEditTable.find('#faxNumber');
                dFaxNumber.mInputRestrict('textNum', {maxLength: 20});
                return dFaxNumber;
            })();
            (function dSubmitContactBtn() {
                var dSubmitContactBtn = dContactEditTable.find('#submitContactBtn');
                dSubmitContactBtn.mBtn('submit', function () {
                    var pass = dContactEditTable.checkForm();
                    if (!pass) {
                        return;
                    }
                    var oContactData = dContactEditBlock.oContactData;
                    dContactEditBlock.mapModel(oContactData, function () {
                        $.ajax.companyContact.updateCompanyContactAJ(oContactData, function (res) {
                            $.mNtfc.showMsgAftUpdate(res, function () {
                                $.lUtil.goPage($.pCpy.cpyProfilePath, pageOpt);
                            });
                        });
                    });
                });
                return dSubmitContactBtn;
            })();
            (function dRevertContactBtn() {
                var dRevertContactBtn = dContactEditTable.find('#revertContactBtn');
                dRevertContactBtn.mBtn('revert', function () {
                    initEditContactBlock();
                });
                return dRevertContactBtn;
            })();
            (function dReturnContactBtn() {
                var dReturnContactBtn = dContactEditTable.find('#returnContactBtn');
                dReturnContactBtn.mBtn('return', function () {
                    dContactBlock.showContactBlock();
                    dContactEditBlock.hide();
                });
                return dReturnContactBtn;
            })();
            (function setChecker() {
                dContactEditTable.mFormChecker({
                    'onBlur': true
                });
                dContactEditTable.addRequired(dPersonName);
                dContactEditTable.addEmail(dEmail);
            })();
            return dContactEditTable;
        })();
        var initEditContactBlock = function () {
            $.lForm.clean(dContactEditBlock);
            $.lModel.mapDom(dContactEditBlock.oContactData, dContactEditTable);
            dContactEditTable.removeCheckerClass();
        };
        dContactEditBlock.showContactEditBlock = function () {
            initEditContactBlock();
            dContactEditBlock.hide().fadeIn();
        };
        return dContactEditBlock.hide();
    })();
    return self;
};