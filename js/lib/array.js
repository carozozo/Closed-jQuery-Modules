/**
 * The array lib
 * @author Caro.Huang
 */


/**
 * sort arr by obj key
 * @param key
 * @param [sort]: bool (default: true for ASC)
 * @returns {Array}
 */
Array.prototype.sortByObjKey = function (key, sort) {
    sort = (sort !== false);
    this.sort(function (a, b) {
        var order1 = a[key] || 0;
        var order2 = b[key] || 0;
        if (sort)
            return ((order1 < order2) ? -1 : ((order1 > order2) ? 1 : 0));
        return((order1 > order2) ? -1 : ((order1 < order2) ? 1 : 0));
    });
    return this;
};

/**
 * sum the value in array (number)
 */
Array.prototype.sum = function () {
    var sum = 0;
    $.each(this, function (i, val) {
        if ($.lHelper.isNum(val)) {
            sum += val;
        }
    });
    return sum;
};

/**
 * remove array element by index
 * @param i
 */
Array.prototype.removeByIndex = function (i) {
    this.splice(i, 1);
};

/**
 * remove array element by value
 * @param val
 */
Array.prototype.removeByValue = function (val) {
    var i = this.indexOf(val);
    if (i > -1) {
        this.splice(i, 1);
    }
};

/**
 * clone array
 * @returns {Array}
 */
Array.prototype.cloneArr = function () {
    return $.extend(true, [], this);
};

/**
 * remove duplicate value in arr
 * @returns {Array}
 */
Array.prototype.removeDuplicate = function () {
    var aUnique = [];
    $.each(this, function (i, el) {
        if ($.inArray(el, aUnique) === -1) aUnique.push(el);
    });
    return aUnique;
};

/**
 * push arr without duplicate-value
 * @param val
 */
Array.prototype.pushNoDuplicate = function (val) {
    if ($.inArray(val, this) < 0) this.push(val);
};