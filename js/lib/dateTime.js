/**
 * The date-time lib
 * this is base on [3rd-party moment]
 * please refer [http://momentjs.com/docs/]
 * @author Caro.Huang
 */

$.lDateTime = (function () {
    var self = {};

    /**
     * format string to date-time
     * @param [str]
     * @param [fmt]
     * @returns {*}
     */
    self.formatDateTime = function (str, fmt) {
        if (!fmt || fmt === 'date') {
            fmt = 'YYYY-MM-DD';
        }
        else if (fmt === 'dateTime') {
            fmt = 'YYYY-MM-DD HH:mm:ss';
        }
        else if (fmt === 'time') {
            fmt = 'HH:mm:ss';
        }
        if (str) {
            return moment(str).format(fmt);
        }
        return moment().format(fmt);
    };

    /**
     * compare date if before target-Date
     * [!target-Date] = now
     * sUntilTo = 'year'/'month'/'date'/'hour'/'minute'/'second'/'millisecond'
     * @param date
     * @param tarDate
     * @param sUntilTo
     * @returns {*}
     */
    self.isBefore = function (date, tarDate, sUntilTo) {
        if (!tarDate) {
            return moment(date).isBefore();
        }
        return moment(date).isBefore(tarDate, sUntilTo);
    };

    /**
     * compare date if after target-Date
     * [!target-Date] = now
     * sUntilTo = 'year'/'month'/'date'/'hour'/'minute'/'second'/'millisecond'
     * @param date
     * @param tarDate
     * @param sUntilTo
     * @returns {*}
     */
    self.isAfter = function (date, tarDate, sUntilTo) {
        if (!tarDate) {
            return moment(date).isAfter();
        }
        return moment(date).isAfter(tarDate, sUntilTo);
    };

    return self;
})();