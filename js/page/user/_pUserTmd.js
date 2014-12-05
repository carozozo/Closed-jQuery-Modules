tmd.pUser = function (data) {
    var obj = $.lObj.cloneObj(data);
    (function setLastConnectedAt() {
        var lastConnectedAt = data.lastConnectedAt;
        if (lastConnectedAt) {
            obj.lastConnectedAt = $.lDateTime.formatDateTime(lastConnectedAt, 'dateTime');
        }
    })();
    return obj;
};