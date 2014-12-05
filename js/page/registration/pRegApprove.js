$.fn.pRegApprove = function (pageOpt) {
    var self = this;
    var registrationId = pageOpt.registrationId;
    var oRegDetail = null;
    $.ajax.registrations.getRegDetailAJ({registrationId: registrationId}, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oRegDetail = result;
        });
    });
    $.lConsole.log('oRegDetail=', oRegDetail);
    if (!oRegDetail) {
        return self;
    }
    var oReg = oRegDetail.registration;
    var oaRegContact = oRegDetail.regContact;
    oReg = tmd.pReg(oReg);
    (function dRegInfoTable() {
        var dRegInfoTable = self.find('#infoTable');
        (function () {
            var dRegDetailTable = dRegInfoTable.find('#registrationTable');
            var textShorterOpt = {
                clickShow: true,
                maxLength: 50
            };
            $.lModel.mapDom(oReg, dRegDetailTable);
            (function dCompanyName() {
                var dCompanyName = dRegDetailTable.find('#companyName');
                dCompanyName.mTextShorter(textShorterOpt);
                return dCompanyName;
            })();
            (function dCompanyWebsite() {
                var dCompanyWebsite = dRegDetailTable.find('#companyWebsite');
                dCompanyWebsite.mTextShorter(textShorterOpt);
                return dCompanyWebsite;
            })();
            (function dCompanyCountryCode() {
                var dCompanyCountryCode = dRegDetailTable.find('#companyCountryCode');
                dCompanyCountryCode.mTextShorter(textShorterOpt);
                return dCompanyCountryCode;
            })();
            (function dCompanyAddress() {
                var dCompanyAddress = dRegDetailTable.find('#companyAddress');
                dCompanyAddress.mTextShorter(textShorterOpt);
                return dCompanyAddress;
            })();
            (function dName() {
                var dName = dRegDetailTable.find('#name');
                dName.val(oReg.companyName);
                return dName;
            })();
            (function dWebsite() {
                var dWebsite = dRegDetailTable.find('#website');
                dWebsite.val(oReg.companyWebsite);
                return dWebsite;
            })();
            (function dCountryCode() {
                var dCountryCode = dRegDetailTable.find('#countryCode');
                dCountryCode.val(oReg.companyCountryCode);
                return dCountryCode;
            })();
            (function dRegistrationId() {
                var dRegistrationId = dRegDetailTable.find('#registrationId');
                dRegistrationId.val(oReg.registrationId);
                return dRegistrationId;
            })();
            (function dAddress() {
                var dAddress = dRegDetailTable.find('#address');
                dAddress.val(oReg.companyAddress);
                return dAddress;
            })();
            (function dPostalCode() {
                var dPostalCode = dRegDetailTable.find('#postalCode');
                dPostalCode.val(oReg.companyPostalCode);
                return dPostalCode;
            })();
            return dRegDetailTable;
        })();
        (function dRegContactDiv() {
            var dRegContactDiv = dRegInfoTable.find('.regContactDiv');
            var textShorterOpt = {
                clickShow: true,
                maxLength: 50
            };
            dRegContactDiv.mListDom(oaRegContact, function (index, oData, dEachDom) {
                var dPersonName = dEachDom.find('#personName');
                (function setPersonName() {
                    dPersonName.mTextShorter(textShorterOpt);
                })();
                (function setDepartment() {
                    var dDepartment = dEachDom.find('#department');
                    dDepartment.mTextShorter(textShorterOpt);
                })();
                (function setEmail() {
                    var dEmail = dEachDom.find('#email');
                    dEmail.mTextShorter(textShorterOpt);
                })();
                (function setPersonName() {
                    var dCopyBtn = dEachDom.find('#copyBtn');
                    dCopyBtn.action('click', function () {
                        $.lModel.mapDom(oData, dRegSettingTable);
                        var personName = dPersonName.text();
                        var email = oData.email ? oData.email.trim() : '';
                        dRegSettingTable.dMemberName.val(personName);
                        dRegSettingTable.dMemberEmail.val(email).trigger('change');
                        if (email !== '') {
                            dRegSettingTable.dUserName.focus();
                        }
                    });
                })();
            });
        })();
        return dRegInfoTable;
    })();
    var dRegSettingTable = (function () {
        var dRegSettingTable = self.find('#settingTable');
        var positiveSmallIntOpt = {
            allowPlus: false,
            allowMinus: false,
            allowThouSep: false,
            allowDecSep: false,
            max: 32767
        };
        var eWalletTypeOpt = $.lDom.createLangSpanAuto('common.eWalletTypeOpt');
        var eWalletTypeOpt2 = [];
        // get eWalletTypeOptions without [Individual]
        $.each(eWalletTypeOpt, function (i, obj) {
            if (obj.val !== 'Individual') {
                eWalletTypeOpt2.push(obj);
            }
        });
        var dGender = (function () {
            var dGender = dRegSettingTable.find('#gender');
            return dGender;
        })();
        var dMemberName = (function () {
            var dMemberName = dRegSettingTable.find('#memberName');
            return dMemberName;
        })();
        var dUserName = (function () {
            var dUserName = dRegSettingTable.find('#userName');
            dUserName.on('mousedown', function () {
                dUserName.removeClass('check-form-required');
            });
            return dUserName;
        })();
        var dMemberEmail = (function () {
            var dMemberEmail = dRegSettingTable.find('#memberEmail');
            dMemberEmail.on('mousedown', function () {
                dMemberEmail.removeClass('check-form-required');
            });
            return dMemberEmail;
        })();
        var dPhoneCountryCode = (function () {
            var dPhoneCountryCode = dRegSettingTable.find('#phoneCountryCode');
            dPhoneCountryCode.mInputRestrict('textNum', {maxLength: 4});
            return dPhoneCountryCode;
        })();
        var dPhoneAreaCode = (function () {
            var dPhoneAreaCode = dRegSettingTable.find('#phoneAreaCode');
            dPhoneAreaCode.mInputRestrict('textNum', {maxLength: 3});
            return dPhoneAreaCode;
        })();
        var dPhoneNumber = (function () {
            var dPhoneNumber = dRegSettingTable.find('#phoneNumber');
            dPhoneNumber.mInputRestrict('textNum', {maxLength: 20});
            return dPhoneNumber;
        })();
        var dMobileCountryCode = (function () {
            var dMobileCountryCode = dRegSettingTable.find('#mobileCountryCode');
            dMobileCountryCode.mInputRestrict('textNum', {maxLength: 4});
            return dMobileCountryCode;
        })();
        var dMobileNumber = (function () {
            var dMobileNumber = dRegSettingTable.find('#mobileNumber');
            dMobileNumber.mInputRestrict('textNum', {maxLength: 20});
            return dMobileNumber;
        })();
        var dFaxCountryCode = (function () {
            var dFaxCountryCode = dRegSettingTable.find('#faxCountryCode');
            dFaxCountryCode.mInputRestrict('textNum', {maxLength: 4});
            return dFaxCountryCode;
        })();
        var dFaxAreaCode = (function () {
            var dFaxAreaCode = dRegSettingTable.find('#faxAreaCode');
            dFaxAreaCode.mInputRestrict('textNum', {maxLength: 3});
            return dFaxAreaCode;
        })();
        var dFaxNumber = (function () {
            var dFaxNumber = dRegSettingTable.find('#faxNumber');
            dFaxNumber.mInputRestrict('textNum', {maxLength: 20});
            return dFaxNumber;
        })();
        var dEwalletSettingsTypeOptions = (function () {
            var dEwalletSettingsTypeOptions = dRegSettingTable.find('#ewalletSettingsTypeOptions');
            var opt = {
                oaData: eWalletTypeOpt,
                multiple: true
            };
            dEwalletSettingsTypeOptions.mSelectPicker(opt);
            dEwalletSettingsTypeOptions.dSelectBtn.on('click', function () {
                dEwalletSettingsTypeOptions.dSelectBtn.removeClass('check-form-required')
            });
            return dEwalletSettingsTypeOptions;
        })();
        var dEwalletSettingsTypeOptions2 = (function () {
            var dEwalletSettingsTypeOptions2 = dRegSettingTable.find('#ewalletSettingsTypeOptions2');
            var opt = {
                oaData: eWalletTypeOpt2,
                multiple: true
            };
            dEwalletSettingsTypeOptions2.mSelectPicker(opt).hide();
            dEwalletSettingsTypeOptions2.dSelectBtn.on('click', function () {
                dEwalletSettingsTypeOptions2.dSelectBtn.removeClass('check-form-required')
            });
            return dEwalletSettingsTypeOptions2;
        })();
        var dInitialCreditLimit = (function () {
            var dInitialCreditLimit = dRegSettingTable.find('#initialCreditLimit');
            dInitialCreditLimit
                .mInputRestrict('moneyNoSep', {maxLength: 10})
                .val(0)
                .on('change', function () {
                    var creditLimit = dInitialCreditLimit.val();
                    var selectedVal = '';
                    creditLimit = parseFloat(creditLimit);
                    if (creditLimit) {
                        selectedVal = dEwalletSettingsTypeOptions.val();
                        dEwalletSettingsTypeOptions.hide();
                        dEwalletSettingsTypeOptions2.val(selectedVal).show();
                        return;
                    }
                    selectedVal = dEwalletSettingsTypeOptions2.val();
                    dEwalletSettingsTypeOptions.show().val(selectedVal);
                    dEwalletSettingsTypeOptions2.hide();
                });
            return dInitialCreditLimit;
        })();
        var dMaxMemberAllowed = (function () {
            var dMaxMemberAllowed = dRegSettingTable.find('#maxMemberAllowed');
            dMaxMemberAllowed
                .mInputRestrict('num', positiveSmallIntOpt)
                .val(100)
            return dMaxMemberAllowed;
        })();
        var dMaxTeamAllowed = (function () {
            var dMaxTeamAllowed = dRegSettingTable.find('#maxTeamAllowed');
            dMaxTeamAllowed
                .mInputRestrict('num', positiveSmallIntOpt)
                .val(20);
            return dMaxTeamAllowed;
        })();
        var dCreditCurrencyCode = (function () {
            var dCreditCurrencyCode = dRegSettingTable.find('#creditCurrencyCode');
            var creditCurrencyCodeOpt = $.lDom.createLangSpanAuto('common.creditCurrencyCodeOpt');
            dCreditCurrencyCode.mSelect(creditCurrencyCodeOpt, {zeroOption: true});
            return dCreditCurrencyCode;
        })();
        (function dTierId() {
            var dTierId = dRegSettingTable.find('#tierId');
            var tierIdOpt = $.lDom.createLangSpanAuto('common.tierIdOpt');
            dTierId.mSelect(tierIdOpt);
            return dTierId;
        })();
        (function dApproveSubmitBtn() {
            var dApproveSubmitBtn = dRegSettingTable.find('#approveSumbitBtn');
            dApproveSubmitBtn.mBtn('approve', function () {
                var pass = dRegSettingTable.checkForm();
                if (!pass) {
                    return;
                }
                dUserName.removeClass('check-form-required');
                dMemberEmail.removeClass('check-form-required');
                dCreditCurrencyCode.removeClass('check-form-required');
                dEwalletSettingsTypeOptions.dSelectBtn.removeClass('check-form-required');
                dEwalletSettingsTypeOptions2.dSelectBtn.removeClass('check-form-required');
                var errorMsg = [];
                var initialCreditLimit = dInitialCreditLimit.val();
                var creditCurrencyCode = dCreditCurrencyCode.val();
                (function checkUserName() {
                    var userName = dUserName.getVal();
                    $.ajax.member.getMemberListAJ({
                        userName: userName
                    }, function (res) {
                        $.lAjax.parseRes(res, function () {
                            if (res.result.totalCount > 0) {
                                dUserName.addClass('check-form-required').focus();
                                var msg = $.lLang.parseLanPath('common.UserNameExist');
                                errorMsg.push(msg);
                            }
                        }, function (result) {
                            dUserName.addClass('check-form-required');
                            var msg = $.lLang.parseLanPath('pReg.approve.resMsg.' + result.code);
                            errorMsg.push(msg);
                        });
                    });
                })();
                (function checkEmail() {
                    var email = dMemberEmail.getVal();
                    $.ajax.member.getMemberListAJ({
                        email: email
                    }, function (res) {
                        $.lAjax.parseRes(res, function () {
                            if (res.result.totalCount > 0) {
                                dMemberEmail.addClass('check-form-required').focus();
                                var msg = $.lLang.parseLanPath('common.emailExist');
                                errorMsg.push(msg);
                            }
                        }, function (result) {
                            dMemberEmail.addClass('check-form-required');
                            var msg = $.lLang.parseLanPath('pReg.approve.resMsg.' + result.code);
                            errorMsg.push(msg);
                        });
                    });
                })();
                (function checkCurrencyCode() {
                    dCreditCurrencyCode.on('click', function () {
                        dCreditCurrencyCode.removeClass('check-form-required');
                    });
                    if (initialCreditLimit > 0 && !creditCurrencyCode) {
                        dCreditCurrencyCode.addClass('check-form-required').focus();
                        var msg = $.lLang.parseLanPath('pReg.approve.resMsg.PleaseSelectCreditCurrencyCode');
                        errorMsg.push(msg);
                    }
                })();
                (function setContactIfNotExists() {
                    if (oaRegContact && oaRegContact.length > 0) {
                        return;
                    }
                    oaRegContact = [
                        {
                            personName: dMemberName.val(),
                            department: 'Managers',
                            email: dMemberEmail.val(),
                            countryCode: dPhoneCountryCode.val(),
                            phoneAreaCode: dPhoneAreaCode.val(),
                            phoneNumber: dPhoneNumber.val(),
                            mobileCountryCode: dMobileCountryCode.val(),
                            mobileNumber: dMobileNumber.val(),
                            faxCountryCode: dFaxCountryCode.val(),
                            faxAreaCode: dFaxAreaCode.val(),
                            faxNumber: dFaxNumber.val()
                        }
                    ];
                })();
                var mApproveCreate = $.lForm.coverToModel(self);
                self.mapModel(mApproveCreate, function () {
                    var ewalletSettingsTypeOptions = null;
                    if (initialCreditLimit <= 0) {
                        ewalletSettingsTypeOptions = dEwalletSettingsTypeOptions.val();
                    }
                    else {
                        ewalletSettingsTypeOptions = dEwalletSettingsTypeOptions2.val();
                    }
                    if (!ewalletSettingsTypeOptions) {
                        var msg = $.lLang.parseLanPath('pReg.approve.resMsg.pleaseSelectEwalletType');
                        dEwalletSettingsTypeOptions.dSelectBtn.addClass('check-form-required');
                        dEwalletSettingsTypeOptions2.dSelectBtn.addClass('check-form-required');
                        errorMsg.push(msg);
                    }
                    if (errorMsg.length) {
                        errorMsg = errorMsg.join('<br/>');
                        $.mNtfc.show(errorMsg, 'dng', 6000);
                        return;
                    }
                    mApproveCreate.ewalletSettingsTypeOptions = ewalletSettingsTypeOptions;
                    var approveCreateOpt = {
                        approveData: mApproveCreate,
                        contactData: oaRegContact
                    };
                    $.ajax.registrations.approveCreateAJ(approveCreateOpt, function (res) {
                        $.lAjax.parseRes(res, function () {
                            var msg = $.lLang.parseLanPath('pReg.approve.resMsg.success');
                            $.mNtfc.show(msg, 'suc');
                            $.lUtil.goPage($.pReg.regListPath);
                        }, function err(result) {
                            var msg = $.lLang.parseLanPath('pReg.approve.resMsg.fail') + ' ' + result.message;
                            $.mNtfc.show(msg, 'wng', 6000);
                        });
                    });
                });
            });
            return dApproveSubmitBtn;
        })();
        (function dRejectBtn() {
            var dRejectBtn = dRegSettingTable.find('#rejectBtn');
            dRejectBtn.mBtn('reject', function () {
                var mRegUpdateReject = $.lObj.cloneObj(oReg);
                self.mapModel(mRegUpdateReject, function () {
                    // set status to Rejected
                    mRegUpdateReject.status = 'Rejected';
                    $.ajax.registrations.updateRegistrationAJ(mRegUpdateReject, function (res) {
                        $.lAjax.parseRes(res, function () {
                            var msg = $.lLang.parseLanPath('pReg.approve.resMsg.reject');
                            $.mNtfc.show(msg, 'suc');
                            $.lForm.clean(dRegSettingTable);
                            $.lUtil.goPage($.pReg.regListPath);
                        }, function (result) {
                            var msg = $.lLang.parseLanPath('pReg.approve.resMsg.rejectFail') + ' ' + result.message;
                            $.mNtfc.show(msg, 'wng', 6000);
                        });
                    });
                });
            });
            return dRejectBtn;
        })();
        (function dReturnBtn() {
            var dReturnBtn = dRegSettingTable.find('#returnBtn');
            dReturnBtn.mBtn('return', function () {
                $.lUtil.goPage($.pReg.regListPath);
            });
            return dReturnBtn;
        })();
        (function setFormChecker() {
            // add the form checker
            var formChecker = dRegSettingTable.mFormChecker();
            var aRequiredDom = [dMemberName, dGender, dUserName, dMemberEmail, dMaxMemberAllowed, dMaxTeamAllowed, dInitialCreditLimit];
            formChecker.addRequired(aRequiredDom);
            formChecker.addEmail(dMemberEmail);
            formChecker.removeCheckerClass();
        })();
        dRegSettingTable.dUserName = dUserName;
        dRegSettingTable.dMemberName = dMemberName;
        dRegSettingTable.dMemberEmail = dMemberEmail;
        return dRegSettingTable;
    })();
    return self;
};