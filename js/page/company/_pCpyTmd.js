tmd.pCompany = function (data) {
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

    (function setConfiguration() {
        var oConfiguration = data.configuration;
        if (!oConfiguration) {
            return;
        }
        obj = $.lObj.extendObj(obj, oConfiguration);
    })();
    return obj;
};

tmd.pCompanyStaff = function (data) {
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

tmd.pCompanyEwallet = function (data) {
    var obj = $.lObj.cloneObj(data);
    (function setCompany() {
        var oCpy = data.company;
        oCpy = tmd.pCompany(oCpy);
        obj.oCompany = oCpy;
    })();
    return obj;
};