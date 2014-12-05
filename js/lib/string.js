/**
 * The helper of common string functions
 * use 3rd-party [validator] for str-validation
 * refer to [https://github.com/chriso/validator.js]
 * @author Caro.Huang
 */

$.lStr = (function () {
    var self = {};

    /**
     * check str if num type
     * @param str
     * @returns {boolean}
     */
    self.isNumeric = function (str) {
        return validator.isNumeric(str);
    };

    /**
     * check str if int type
     * @param str
     * @returns {boolean}
     */
    self.isInt = function (str) {
        return validator.isInt(str);
    };

    /**
     * check str if email type
     * the email type should have one [@] and more [.]
     * ex. caro@yahoo.com.tw ( has @ and 2 . )
     * @param str
     * @returns {boolean}
     */
    self.isEmail = function (str) {
        return validator.isEmail(str);
    };


    self.isUppercase = function (str) {
        return validator.isUppercase(str);
    };

    /**
     * cover str to array
     * @param str
     * @param splitter
     * @returns {*}
     */
    self.toArray = function (str, splitter) {
        if ($.lHelper.isArr(str)) {
            return str;
        }
        splitter = splitter || '';
        return str.split(splitter);
    };

    /**
     * cover str to DOM
     * @param str
     * @returns {*}
     */
    self.toDom = function (str) {
        if ($.lHelper.isStr(str)) {
            return $('#' + str);
        }
        return str;
    };

    /**
     * add the head to string if not exist
     * @param str
     * @param addStr
     * @returns {*}
     */
    self.addHead = function (str, addStr) {
        try {
            var index = str.indexOf(addStr);
            if (index !== 0) {
                str = addStr + str;
            }
        } catch (e) {
        }
        return str;
    };

    /**
     * add the tail to string if not exist
     * @param str
     * @param addStr
     * @returns {*}
     */
    self.addTail = function (str, addStr) {
        try {
            var index = str.lastIndexOf(addStr);
            if (index !== str.length - addStr.length) {
                str += addStr;
            }
        } catch (e) {
        }
        return str;
    };

    /**
     * upper case first char of string
     * @param str
     * @returns {string}
     */
    self.upperFirst = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    /**
     * replace the \n(from client) to <br/>
     * @param str
     * @returns {*|string}
     */
    self.wrapToBr = function (str) {
        return str.replace(/\n/g, '<br />');
    };

    /**
     * replace the <br/> to \n
     * @param str
     * @returns {*|string}
     */
    self.brToWrap = function (str) {
        var regex = /<br\s*[\/]?>/gi;
        return str.replace(regex, '\n');
    };

    /**
     * escape RegExp
     * @param str
     * @returns {*|string}
     */
    self.escapeRegExp = function (str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    };

    /**
     * replace all find in str
     * @param str
     * @param find
     * @param replace
     * @returns {*|string}
     */
    self.replaceAll = function (str, find, replace) {
        find = self.escapeRegExp(find);
        var regex = new RegExp(find, 'g');
        return str.replace(regex, replace);
    };

    /**
     * format not money type like 1,000.00
     * OPT
     * float: int (default: 2) - float length
     * decimal: str (default: '.') - decimal-symbol
     * separated: str (default: ',') - separated-symbol
     * prefix: str (default: '') - prefix-symbol
     *
     * Customized-OPT
     * 'int': integer-money
     * 'sInt': integer-money with prefix [$]
     *
     * @param str
     * @param [opt]
     * @returns {string}
     */
    self.formatMoney = function (str, opt) {
        var float = 2;
        var decimal = '.';
        var separated = ',';
        var prefix = '';

        if (opt === 'sInt') {
            float = 0;
            prefix = '$';
        }
        else if (opt === 'int') {
            float = 0;
        }
        else if ($.lHelper.isObj(opt)) {
            float = (float = Math.abs(opt.float)) > -1 ? float : 2;
            decimal = $.lHelper.isStr(opt.decimal) ? opt.decimal : decimal;
            separated = $.lHelper.isStr(opt.separated) ? opt.separated : separated;
            prefix = opt.prefix || prefix;
        }

        var s = str < 0 ? '-' : '';
        var iStr = parseInt(Math.abs(str || 0).toFixed(float)).toString();
        var sepLength = (iStr.length > 3 ) ? (iStr.length % 3) : 0;
        var retStr = s + (sepLength ? iStr.substr(0, sepLength) + separated : '')
            + iStr.substr(sepLength).replace(/(\d{3})(?=\d)/g, '$1' + separated)
            + (float ? decimal + Math.abs(str - iStr).toFixed(float).slice(2) : '');
        if (prefix) {
            retStr = prefix + ' ' + retStr;
        }
        return retStr
    };

    /**
     * ex: ThisIsWord -> This Is Word
     * @param str
     * @returns {string}
     */
    self.insertBlankBefUpper = function (str) {
        var indexCount = 0;
        var aStr = str.split('');
        var aStrClone = aStr.cloneArr();
        $.each(aStrClone, function (i, char) {
            var isUpper = self.isUppercase(char);
            if (i > 0 && isUpper) {
                // add ' ' before upper-char
                aStr.splice(indexCount, 0, ' ');
                // aStr length + 1 after add ' ', so indexCount++;
                indexCount++;
            }
            indexCount++;
        });
        return aStr.join('');
    };

    return self;
})();