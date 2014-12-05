tmd.pMember = function (data) {
    var obj = $.lObj.cloneObj(data);

    obj.gender = (data.gender) ? data.gender : 'Others';
    obj.memberStatus = (data.memberStatus) ? data.memberStatus : 'No Status';

    (function setPhoneNumber() {
        var countryCode = data.phoneCountryCode;
        var areaCode = data.phoneAreaCode;
        var number = data.phoneNumber;
        obj.phoneNumberTotal = $.lHelper.composePhoneNum(countryCode, areaCode, number);
    })();

    (function setMobileNumber() {
        var countryCode = data.mobileCountryCode;
        var number = data.mobileNumber;
        obj.mobileNumberTotal = $.lHelper.composePhoneNum(countryCode, '', number);
    })();

    (function setFaxNumber() {
        var countryCode = data.faxCountryCode;
        var areaCode = data.faxAreaCode;
        var number = data.faxNumber;
        obj.faxNumberTotal = $.lHelper.composePhoneNum(countryCode, areaCode, number);
    })();

    (function setRoleList() {
        var oaRole = data.roleList;
        if (!oaRole || !oaRole.length) {
            return;
        }
        var oRole = oaRole[0];
        obj.roleName = oRole.name;
        obj.roleId = oRole.roleId;
    })();

    (function setPreference() {
        var oPreference = data.preference;
        if (!oPreference) {
            return;
        }
        obj = $.lObj.extendObj(obj, oPreference);
    })();

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

    (function setLastConnectedAt() {
        var lastConnectedAt = data.lastConnectedAt;
        if (lastConnectedAt) {
            obj.lastConnectedAt = $.lDateTime.formatDateTime(lastConnectedAt, 'dateTime');
        }
    })();

    (function setAggregate() {
        var oAggregate = data.aggregate;
        if (!oAggregate) {
            return;
        }

        (function setCompany() {
            var oCompany = oAggregate.company;
            if (!oCompany) {
                return;
            }
            oCompany = tmd.pCompany(oCompany);
            obj.isTesting = oCompany.isTesting;
            obj.companyName = oCompany.name;
            obj.oCompany = oCompany;
        })();

        (function setTeam() {
            var oTeam = oAggregate.team;
            if (!oTeam) {
                return;
            }
            obj.oTeam = oTeam;
            obj.teamName = oTeam.name;
        })();

        (function setAuthList() {
            var oaAuth = oAggregate.authList;
            if (!oaAuth || !oaAuth.length) {
                return;
            }
            var oAuth = oaAuth[0];
            obj.userName = oAuth.userName;
            obj.email = oAuth.email;
            obj.authId = oAuth.authId;
            obj.lastConnectedAt = oAuth.lastConnectedAt;
            obj.oAuth = oaAuth[0];
        })();
    })();
    return obj;
};

tmd.pMemberTraveler = function (data) {
    var obj = $.lObj.cloneObj(data);
    (function setTravelerIcon() {
        if (data.companyId) {
            obj.travlerIconSrc = ('/img/common/icon_traveler_shared.svg');
        } else {
            obj.travlerIconSrc = ('/img/common/icon_member_black.svg');
        }
    })();

    (function setTitle() {
        if (data.title) {
            obj.displayName = data.title + '. ' + data.displayName;
        }
    })();

    (function setTagList() {
        var sTagList = '';
        $.each(data.tagList, function (index, tag) {
            sTagList += tag.tagKeyword + '';
        });
        obj.tagList = sTagList;
    })();

    (function setPhoneNumber() {
        var oaPhoneNumber = data.oaPhoneNumber;
        if (oaPhoneNumber) {
            $.each(oaPhoneNumber, function (index, oPhoneNumber) {
                var phoneNumberType = oPhoneNumber.phoneNumberType;
                var phoneCountryCode = oPhoneNumber.phoneCountryCode;
                var phoneAreaCode = oPhoneNumber.phoneAreaCode;
                var phoneNumber = oPhoneNumber.phoneNumber;
                if (phoneNumberType.toLowerCase() == 'mobile' && phoneNumber) {
                    var sPhone = '+' + phoneCountryCode + ' ';
                    sPhone += (phoneAreaCode) ? phoneAreaCode : '';
                    sPhone += ' ' + phoneNumber;
                    obj.mobile = sPhone;
                }
            });
        }
    })();

    (function setNumberOfTravelerDoc() {
        var oaTravelDocument = data.oaTravelDocument;
        if (oaTravelDocument) {
            obj.numberOfTravelerDoc = oaTravelDocument.length;
        }
    })();
    return obj;
};