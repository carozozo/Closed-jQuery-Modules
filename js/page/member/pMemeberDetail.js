$.fn.pMemberDetail = function (pageOpt) {
    var self = this; //detailPage:1 member detail+Travel list
    var memberId = pageOpt.memberId;
    var oMember = null;
    var teamName = '';
    var teamOptions = [];
    $.ajax.member.getMemberById({memberId: memberId}, function (res) {
        $.lAjax.parseRes(res, function (result) {
            oMember = tmd.pMember(result);
        });
    });
    $.lConsole.log('oMember=', oMember);
    if (!oMember) {
        return self;
    }
    // get team-name and team-list for dropdown-box
    var opt = {
        companyId: oMember.companyId,
        pageSize: 1000
    };
    $.ajax.company.getTeamListByCompanyIdAJ(opt, function (res) {
        $.lAjax.parseRes(res, function (result) {
            $.each(result.results, function (i, oTeam) {
                if (oMember.teamId == oTeam.teamId) {
                    teamName = oTeam.name;
                }
                teamOptions.push({
                    name: oTeam.name,
                    val: oTeam.teamId
                });
            });
        });
    });
    var dInfoDiv = (function () {
        var localeCode = oMember.localeCode;
        var memberStatus = oMember.memberStatus;
        var currencyCode = oMember.currencyCode;
        var dInfoDiv = self.find('#infoDiv');
        $.lModel.mapDom(oMember, dInfoDiv);
        (function dTeamName() {
            var dTeamName = dInfoDiv.find('#teamName');
            return dTeamName.html(teamName);
        })();
        (function dDisplayName() {
            var dDisplayName = dInfoDiv.find('#displayName');
            var oGenderOpt = {
                Others: '',
                Male: 'Mr. ',
                Female: 'Miss. '
            };
            return dDisplayName.html(oGenderOpt[oMember.gender] + oMember.displayName);
        })();
        (function dLocaleCode() {
            var dLocaleCode = dInfoDiv.find('#localeCode');
            return dLocaleCode.lSetLang('common.localeCodeOpt.' + localeCode);
        })();
        (function dCurrencyCode() {
            var dCurrencyCode = dInfoDiv.find('#currencyCode');
            return dCurrencyCode.lSetLang('common.currencyCodeOpt.' + currencyCode);
        })();
        (function dMemberStatus() {
            var dMemberStatus = dInfoDiv.find('#memberStatus');
            return dMemberStatus.lSetLang('pMember.list.status.' + memberStatus);
        })();
        (function dEditBtn() {
            var dEditBtn = dInfoDiv.find('#editBtn');
            return dEditBtn.mBtn('edit', function () {
                dInfoDiv.hide();
                dInfoEditDiv.showInfoEdit();
            });
        })();
        return dInfoDiv;
    })();
    var dInfoEditDiv = (function () {
        var memberUserName = oMember.userName;
        var memberEmail = oMember.email;
        var userNameExist = false;
        var emailExist = false;
        var dInfoEditDiv = self.find('#infoEditDiv');
        var initEditForm = function () {
            userNameExist = false;
            emailExist = false;
            dInfoEditDiv.removeCheckerClass();
            $.lForm.clean(dInfoEditDiv);
            $.lModel.mapDom(oMember, dInfoEditDiv);
        };
        var setHasDef = function (dom) {
            dom.parent().removeClass('has-error').removeClass('has-success');
        };

        var setHasSuc = function (dom) {
            dom.parent().addClass('has-error').removeClass('has-success');
        };
        var setHasErr = function (dom) {
            dom.parent().removeClass('has-error').addClass('has-success');
        };
        var dDisplayName = (function () {
            var dDisplayName = dInfoEditDiv.find('#displayName');
            dDisplayName.mInputRestrict('textNum');
            return dDisplayName;
        })();
        var dUserName = (function () {
            var dUserName = dInfoEditDiv.find('#userName');
            dUserName
                .on('change', function () {
                    var userName = dUserName.val();
                    if (!userName || userName === memberUserName) {
                        userNameExist = false;
                        return;
                    }
                    $.ajax.member.getMemberListAJ({userName: userName}, function (res) {
                        $.lAjax.parseRes(res, function () {
                            if (res.result.totalCount == 0) {
                                userNameExist = false;
                                setHasSuc(dUserName);
                            } else {
                                var msg = $.lLang.parseLanPath('common.UserNameExist');
                                userNameExist = true;
                                $.mNtfc.show(msg, 'dng');
                                setHasErr(dUserName);
                            }
                        });
                    });
                })
                .on('mousedown', function () {
                    setHasDef(dUserName);
                });
            return dUserName;
        })();
        var dMemberEmail = (function () {
            var dMemberEmail = dInfoEditDiv.find('#email');
            dMemberEmail
                .on('change', function () {
                    var email = dMemberEmail.val();
                    if (email != '' && email != memberEmail) {
                        emailExist = false;
                        return;
                    }
                    $.ajax.member.getMemberListAJ({email: email}, function (res) {
                        $.lAjax.parseRes(res, function () {
                            if (res.result.totalCount == 0) {
                                emailExist = false;
                                setHasSuc(dMemberEmail);
                            } else {
                                var msg = $.lLang.parseLanPath('common.emailExist');
                                emailExist = true;
                                $.mNtfc.show(msg, 'dng');
                                setHasErr(dMemberEmail);
                            }
                        });
                    });
                })
                .on('mousedown', function () {
                    setHasDef(dMemberEmail);
                });
            return dMemberEmail;
        })();
        var dRoleId = (function () {
            return dInfoEditDiv.find('#roleId');
        })();
        (function dTeamId() {
            var dTeamId = dInfoEditDiv.find('#teamId');
            dTeamId.mSelect(teamOptions);
            return dTeamId;
        })();
        (function dPhoneCountryCode() {
            var dPhoneCountryCode = dInfoEditDiv.find('#phoneCountryCode');
            dPhoneCountryCode.mInputRestrict('textNum', {maxLength: 4});
            return dPhoneCountryCode;
        })();
        (function dPhoneAreaCode() {
            var dPhoneAreaCode = dInfoEditDiv.find('#phoneAreaCode');
            dPhoneAreaCode.mInputRestrict('textNum', {maxLength: 3});
            return dPhoneAreaCode;
        })();
        (function dPhoneNumber() {
            var dPhoneNumber = dInfoEditDiv.find('#phoneNumber');
            dPhoneNumber.mInputRestrict('textNum', {maxLength: 20});
            return dPhoneNumber;
        })();
        (function dMobileCountryCode() {
            var dMobileCountryCode = dInfoEditDiv.find('#mobileCountryCode');
            dMobileCountryCode.mInputRestrict('textNum', {maxLength: 4});
            return dMobileCountryCode;
        })();
        (function dMobileNumber() {
            var dMobileNumber = dInfoEditDiv.find('#mobileNumber');
            dMobileNumber.mInputRestrict('textNum', {maxLength: 20});
            return dMobileNumber;
        })();
        (function dFaxCountryCode() {
            var dFaxCountryCode = dInfoEditDiv.find('#faxCountryCode');
            dFaxCountryCode.mInputRestrict('textNum', {maxLength: 4});
            return dFaxCountryCode;
        })();
        (function dFaxAreaCode() {
            var dFaxAreaCode = dInfoEditDiv.find('#faxAreaCode');
            dFaxAreaCode.mInputRestrict('textNum', {maxLength: 3});
            return dFaxAreaCode;
        })();
        (function dFaxNumber() {
            var dFaxNumber = dInfoEditDiv.find('#faxNumber');
            dFaxNumber.mInputRestrict('textNum', {maxLength: 20});
            return dFaxNumber;
        })();
        (function dCurrencyCode() {
            var dCurrencyCode = dInfoEditDiv.find('#currencyCode');
            var currencyCodeOpt = $.lDom.createLangSpanAuto('common.currencyCodeOpt');
            dCurrencyCode.mSelect(currencyCodeOpt, {zeroOption: true});
            return dCurrencyCode;
        })();
        (function dLocaleCode() {
            var dLocaleCode = dInfoEditDiv.find('#localeCode');
            var localeCodeOpt = $.lDom.createLangSpanAuto('common.localeCodeOpt');
            dLocaleCode.mSelect(localeCodeOpt, {zeroOption: true});
            return dLocaleCode;
        })();
        (function dReturnInfoBtn() {
            var dReturnInfoBtn = dInfoEditDiv.find('#returnInfoBtn');
            dReturnInfoBtn.mBtn('return', function () {
                dInfoDiv.fadeIn();
                dInfoEditDiv.hide();
            });
            return dReturnInfoBtn;
        })();
        (function dRevertBtn() {
            var dRevertBtn = dInfoEditDiv.find('#revertBtn');
            dRevertBtn.mBtn('revert', initEditForm);
            return dRevertBtn;
        })();
        (function dSubmitBtn() {
            var dSubmitBtn = dInfoEditDiv.find('#submitBtn');
            dSubmitBtn.mBtn('submit', function () {
                // check user name and email
                var errMsg = [];
                if (userNameExist) {
                    dUserName.focus();
                    errMsg.push($.lLang.parseLanPath('common.UserNameExist'));
                }
                if (emailExist) {
                    dMemberEmail.focus();
                    errMsg.push($.lLang.parseLanPath('common.emailExist'));
                }
                if (errMsg.length) {
                    errMsg = errMsg.join('<br/>');
                    $.mNtfc.show(errMsg, 'dng', 2000);
                    return;
                }
                // check data
                var mEdit = $.lObj.cloneObj(oMember);
                if (!mEdit.roleList || !oMember.oAuth) {
                    var msg = $.lLang.parseLanPath('common.DataError');
                    $.mNtfc.show(msg, 'dng');
                    return;
                }
                var pass = dInfoEditDiv.checkForm();
                if (!pass) {
                    return;
                }
                // update auth if auth-data exists
                var mAuth = $.lObj.cloneObj(oMember.oAuth);
                dInfoEditDiv.mapModel(mAuth, function () {
                    $.ajax.passwordAuth.updatePasswordAuthAJ(mAuth, function (res) {
                        $.lAjax.parseRes(res, function () {
                            // update member
                            mEdit.roleList[0].roleId = dRoleId.val();
                            dInfoEditDiv.mapModel(mEdit, function () {
                                $.ajax.member.updateMemberAJ(mEdit, function (res) {
                                    $.mNtfc.showMsgAftUpdate(res, function () {
                                        $.lUtil.goPage($.pMember.memberDetailPath, pageOpt);
                                    });
                                });
                            });
                        });
                    });
                });
            });
            return dSubmitBtn;
        })();
        (function setFormChecker() {
            dInfoEditDiv.mFormChecker();
            dInfoEditDiv.addRequired([dDisplayName, dUserName, dMemberEmail]);
            dInfoEditDiv.addEmail(dMemberEmail);
        })();
        dInfoEditDiv.showInfoEdit = function () {
            initEditForm();
            dInfoEditDiv.hide().fadeIn();
        };
        return dInfoEditDiv.hide();
    })();
    (function dTravelerListDiv() {
        var dTravelerListDiv = self.find('#travelerListDiv');
        var travelerListOpt = {
            memberId: memberId
        };
        return dTravelerListDiv.pMemberTravelerList(travelerListOpt);
    })();
    return self;
};

$.fn.pMemberTravelerList = function (pageOpt) {
    var self = this;
    (function dList() {
        var oTravelerList = null;
        var dList = self.find('#list');
        var dTravelerListTableFn = function () {
            var oaTraveler = oTravelerList.results;
            var dListTable = dList.find('#travelerListTable');
            dListTable.mListTable(oaTraveler, function (oTraveler) {
                return tmd.pMemberTraveler(oTraveler);
            }, function (index, oTraveler, dEachDom) {
                (function setEmail() {
                    var dEmail = dEachDom.find('.email');
                    dEmail.mTextShorter({clickShow: true, maxLength: 30});
                })();
                (function setMobile() {
                    var dMobile = dEachDom.find('.mobile');
                    dMobile.appendLoadingImg();
                    setTimeout(function () {
                        $.ajax.traveler.getTravelerPhoneNumbersByTravelerIdAsyncAJ(oTraveler, function (res) {
                            // set empty first
                            dMobile.empty();
                            $.lAjax.parseRes(res, function (result) {
                                // result.length maybe 0
                                $.each(result, function (i, oMobile) {
                                    var phoneNumberType = oMobile.phoneNumberType;
                                    if (!phoneNumberType || phoneNumberType.toLowerCase() !== 'mobile') {
                                        return;
                                    }
                                    var phoneCountryCode = oMobile.phoneCountryCode;
                                    var phoneAreaCode = oMobile.phoneAreaCode;
                                    var phoneNumber = oMobile.phoneNumber;
                                    var phoneNumberFull = $.lHelper.composePhoneNum(phoneCountryCode, phoneAreaCode, phoneNumber);
                                    dMobile.html(phoneNumberFull);
                                });
                            });
                        });
                    }, 100);
                })();
                (function setNumberOfTravelerDoc() {
                    var dNumberOfTravelerDoc = dEachDom.find('.numberOfTravelerDoc');
                    dNumberOfTravelerDoc.appendLoadingImg();
                    setTimeout(function () {
                        $.ajax.traveler.getTravelerDocumentByTravelerIdAsyncAJ(oTraveler, function (res) {
                            dNumberOfTravelerDoc.empty();
                            $.lAjax.parseRes(res, function (result) {
                                dNumberOfTravelerDoc.html(result.length);
                                if (result.length < 1) {
                                    return;
                                }
                                var oaDocument = result[0];
                                var docExpire = oaDocument.docExpire;
                                var dIconExpired = null;
                                var msg = '';
                                if (docExpire == 'docExpired') {
                                    msg = $.lLang.parseLanPath('pMember.traveler.document.DocExpired');
                                    dIconExpired = $.lDom.createImg('/img/common/icon_expired.svg');
                                }
                                else if (docExpire == 'docExpiring') {
                                    msg = $.lLang.parseLanPath('pMember.traveler.document.DocExpiring');
                                    dIconExpired = $.lDom.createImg('/img/common/icon_expiring.svg');
                                }
                                if (!dIconExpired) {
                                    return;
                                }
                                dIconExpired.lTitle(msg).css({
                                    width: 17,
                                    height: 17
                                });
                                dNumberOfTravelerDoc.append(' ');
                                dNumberOfTravelerDoc.append(dIconExpired);
                            });
                        });
                    }, 100);
                })();
                (function setDisplayName() {
                    var dDisplayName = dEachDom.find('.displayName');
                    dDisplayName.mTextShorter({clickShow: true});
                })();
                (function setTagList() {
                    var dTagList = dEachDom.find('.tagList');
                    dTagList.mTextShorter({clickShow: true});
                })();
                (function setIconTraveler() {
                    var dIconTraveler = dEachDom.find('.iconTraveler');
                    dIconTraveler.lSrc(oTraveler.travlerIconSrc);
                })();
                (function setTravelerDetailButton() {
                    var dTravelerDetailBtn = dEachDom.find('.travelerDetailBtn');
                    var travelerId = oTraveler.travelerId;
                    var memberId = oTraveler.memberId;
                    dTravelerDetailBtn.mBtn('detail').on('click', function () {
                        var traOpt = {
                            travelerId: travelerId,
                            memberId: memberId
                        };
                        $.lUtil.goPage($.pMember.memTravelerDetailPath, traOpt);
                    });
                })();
            });
            return dListTable;
        };
        var dTravelerListPaginationFn = function () {
            var dPagination = dList.find('#pagination');
            var startPage = oTravelerList.currentPageNumber;
            var pageSize = oTravelerList.pageSize;
            var totalCount = oTravelerList.totalCount;
            var totalPage = oTravelerList.totalPages;
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    pageOpt.startPage = page;
                    pageOpt.pageSize = pageSize;
                    dTravelerListFn();
                }
            };
            dPagination = dPagination.mPagination(opt);
            return dPagination;
        };
        $.ajax.member.getTravelerListByMemberIdAsyncAJ(pageOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                if (!result) {
                    return;
                }
                oTravelerList = result;
                $.lConsole.log('oTravelerList=', oTravelerList);
                dTravelerListTableFn();
                dTravelerListPaginationFn();
            });
        });
        return dList;
    })();
    return self;
};