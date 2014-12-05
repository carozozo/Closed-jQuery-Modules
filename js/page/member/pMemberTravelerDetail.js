$.fn.pMemberTravelerDetail = function (pageOpt) {
    var self = this;
    var travelerId = pageOpt.travelerId;
    var memberId = pageOpt.memberId;
    var oMemberTraveler = null;
    var oaPhone = {};
    var oaDoc = {};
    $.ajax.traveler.getTravelerDetailAJ({travelerId: travelerId}, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oMemberTraveler = tmd.pMemberTraveler(result);
            oaPhone = result.phoneNumbers;
            oaDoc = result.travelDocuments;
        });
    });
    $.lConsole.log('oMemberTraveler=', oMemberTraveler);
    if (!oMemberTraveler) {
        return self;
    }
    (function dTraDetailDiv() {
        var dTraDetailDiv = self.find('#travelerDetail');
        $.lModel.mapDom(oMemberTraveler, dTraDetailDiv);
        (function dTravelerTable() {
            var dTravelerTable = dTraDetailDiv.find('#travelerTable');
            (function setPhones() {
                dTravelerTable.find('.phoneTr:first').mListDom(oaPhone, function (index, oData, dEachDom) {
                    var dPhoneTypeSpan = dEachDom.find('.phoneTypeSpan');
                    var dPhoneNumberFull = dEachDom.find('.phoneNumberFull');
                    var phoneNumberType = oData.phoneNumberType;
                    var phoneNumberFull = oData.phoneNumberFull;
                    if (phoneNumberFull) {
                        switch (phoneNumberType) {
                            case 'Mobile':
                                dPhoneTypeSpan.lSetLang('common.Mobile');
                                break;
                            case 'Work':
                                dPhoneTypeSpan.lSetLang('common.OfficePhoneNumber');
                                break;
                            case 'Fax':
                                dPhoneTypeSpan.lSetLang('common.FaxNumber');
                                break;
                        }
                        dPhoneNumberFull.html(phoneNumberFull);
                    }
                });
            })();
            (function setShareType() {
                var dShareSetting = dTraDetailDiv.find('.shareSetting');
                var dIconTraveler = dTraDetailDiv.find('.iconTraveler');
                var companyId = oMemberTraveler.companyId;
                if (companyId) {
                    dShareSetting.lSetLang('common.ThisTravelerIsShared');
                    dIconTraveler.lSrc('/img/common/icon_traveler_shared.svg');
                }
                else {
                    dShareSetting.lSetLang('common.ThisTravelerIsPrivate');
                    dIconTraveler.lSrc('/img/common/icon_member_black.svg');
                }
            })();
            return dTravelerTable;
        })();
        (function dTravelerDocDetail() {
            var dTravelerDocDetail = dTraDetailDiv.find('.travelerDocDetail:first');
            dTravelerDocDetail.mListDom(oaDoc, function (index, oData, dEachDom) {
                (function setDocType() {
                    var dTravelDocumentType = dEachDom.find('.travelDocumentType');
                    dTravelDocumentType.lSetLang('common.travelDocumentTypeOpt.' + oData.travelDocumentType);
                })();
                (function setExpiryDate() {
                    if (!oData.expiryDate) {
                        return;
                    }
                    var dExpiryDate = dEachDom.find('.expiryDate');
                    var dDocExpireText = dEachDom.find('.docExpireText');
                    var dIconTravelDoc = dEachDom.find('.iconTravelDoc');
                    var expiryDate = oData.expiryDate;
                    var iconExpired = '';
                    if (oData.Expire == 'docExpired') {
                        iconExpired = $.lDom.createImg('/img/common/icon_expired.svg', 17, 17);
                        dDocExpireText.css('color', '#F00').lSetLang('pMember.traveler.document.DocExpired');
                        dIconTravelDoc.lSrc('/img/common/icon_travel_doc_expired.svg');
                    }
                    else if (oData.Expire == 'docExpiring') {
                        iconExpired = $.lDom.createImg('/img/common/icon_expiring.svg', 17, 17);
                        dDocExpireText.css('color', '#FF8500').lSetLang('pMember.traveler.document.DocExpiring');
                        dIconTravelDoc.lSrc('/img/common/icon_travel_doc_expiring.svg');
                    }
                    else {
                        dDocExpireText.lSetLang('');
                    }
                    dExpiryDate.html(expiryDate + ' ').append(iconExpired);
                })();
            });
            return dTravelerDocDetail;
        })();
        return dTraDetailDiv;
    })();
    (function dReturnBtn() {
        var dReturnBtn = self.find('#returnBtn');
        dReturnBtn.mBtn('return', function () {
            var memberOpt = {
                memberId: memberId
            };
            $.lUtil.goPage($.pMember.memberDetailPath, memberOpt);
        });
        return dReturnBtn;
    })();
    return self;
};