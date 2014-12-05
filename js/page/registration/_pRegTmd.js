tmd.pReg = function (data) {
    var obj = $.lObj.cloneObj(data);
    (function setSubmittedAt() {
        var submittedAt = data.submittedAt;
        if (submittedAt) {
            obj.submittedAt = $.lDateTime.formatDateTime(submittedAt, 'dateTime');
        }
    })();
    return obj;
};