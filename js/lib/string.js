/**
 * The helper of common string functions
 * use 3rd-party [validator] for str-validation
 * refer to [https://github.com/chriso/validator.js]
 * @author Caro.Huang
 */

$.lStr = (function () {
    var self = {};
    var changeCase = function (str, type, opt) {
        var aType = ['toUpperCase', 'toLowerCase'];
        var start = null;
        var end = null;
        var force = true;
        if (opt) {
            start = !$.lHelper.isEmptyVal(opt.start) ? opt.start : start;
            end = opt.end || end;
            force = opt.force !== false;
        }
        if (!$.lHelper.isStr(str)) {
            if (!force) {
                return str;
            }
            str = '';
        }
        type = (aType.indexOf(type) > -1) ? type : aType[0];
        if ($.lHelper.isEmptyVal(start)) {
            return str[type]();
        }
        var ret = [];
        start = $.lHelper.coverToInt(start);
        end = $.lHelper.coverToInt(end);
        ret.push(str.slice(0, start));
        if (end) {
            ret.push((str.slice(start, end))[type]());
            ret.push(str.slice(end));
        } else {
            ret.push((str.slice(start))[type]());
        }
        return ret.join('');
    };

    /**
     * create random string
     * OPT
     * ifEn: bool (default: true) - if include lower-case English
     * ifUpCase: bool (default: true) - if include upper-case English
     * ifNum: bool (default: true) - if include number
     * exclude: arr/str (default: []) - the charts that excluded
     *
     * @param len
     * @param [opt]
     * @returns {string}
     */
    self.random = function (len, opt) {
        var text = '';
        var chars = [];
        var ifEn = true;
        var ifUpCase = true;
        var ifNum = true;
        var exclude = [];
        if (opt) {
            ifEn = opt.ifEn !== false;
            ifUpCase = opt.ifUpCase !== false;
            ifNum = opt.ifNum !== false;
            exclude = opt.exclude || exclude;
        }
        if (ifEn)
            chars.push('abcdefghijklmnopqrstuvwxyz');
        if (ifUpCase)
            chars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (ifNum)
            chars.push('0123456789');
        chars = chars.join('');
        // cover to array if string
        exclude = string.splitStr(exclude, ',');
        exclude.forEach(function (excludeStr) {
            chars = string.replaceAll(chars, excludeStr, '');
        });
        for (var i = 0; i < len; i++)
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        return text;
    };
    self.isNumeric = function (str) {
        return validator.isNumeric(str);
    };
    self.isInt = function (str) {
        return validator.isInt(str);
    };
    self.isEmail = function (str) {
        return validator.isEmail(str);
    };
    self.isUppercase = function (str) {
        return validator.isUppercase(str);
    };
    self.isLowercase = function (str) {
        return validator.isLowercase(str);
    };
    /**
     * check the string if Json type
     * @param str
     * @returns {boolean}
     */
    self.isJson = function (str) {
        return validator.isJSON(str);
    };
    /**
     * check if all chart is eng-letter
     * EX.
     * isEngLetter('abc') => true
     * isEngLetter('aa123') => false
     * @param str
     * @returns {boolean}
     */
    self.isEngLetter = function (str) {
        if (!$.lHelper.isStr(str)) return false;
        str = str.replace(/[a-zA-Z]/g, '');
        return str === '';
    };
    self.isEngNum = function (str) {
        if (!$.lHelper.isStr(str)) return false;
        str = str.replace(/[a-zA-Z]/g, '');
        return self.isInt(str);
    };
    /**
     * check str if "true"/"false" and covert to boolean, no change otherwise
     * @param str
     * @returns {boolean}
     */
    self.toBool = function (str) {
        str = (str == 'true') ? true : ((str == 'false') ? false : str);
        return str;
    };
    /**
     * add the head to string if not exist
     * @param str
     * @param addStr
     * @returns {*}
     */
    self.addHead = function (str, addStr) {
        if (!$.lHelper.isStr(str)) return str;
        var index = str.indexOf(addStr);
        if (index !== 0) {
            str = addStr + str;
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
        if (!$.lHelper.isStr(str)) return str;
        var index = str.lastIndexOf(addStr);
        var strLength = str.length;
        var addLength = addStr.length;
        if (strLength < addLength || index !== strLength - addLength) {
            str += addStr;
        }
        return str;
    };
    /**
     * replace the \n(from client) to <br/>
     * @param str
     * @returns {*|string}
     */
    self.wrapToBr = function (str) {
        if (!$.lHelper.isStr(str)) return str;
        return str.replace(/\n/g, '<br />');
    };
    /**
     * replace the <br/> to \n
     * @param str
     * @returns {*|string}
     */
    self.brToWrap = function (str) {
        if (!$.lHelper.isStr(str)) return str;
        var regex = /<br\s*[\/]?>/gi;
        return str.replace(regex, '\n');
    };
    /**
     * split to array by '\n' '\r' '\r\n'
     * OPT
     * acceptEmpty: bool (default: false) - if still return array when str is empty
     *
     * @param str
     * @param [opt]
     * @returns {*}
     */
    self.splitByWrap = function (str, opt) {
        if (!$.lHelper.isStr(str)) return str;
        var acceptEmpty = false;
        if (opt) {
            acceptEmpty = opt.acceptEmpty === true;
        }
        if (!acceptEmpty && !str) {
            return null;
        }
        var wrap = '\n';
        if (str.indexOf(wrap) > -1) {
            return str.split(wrap);
        }
        wrap = '\r';
        if (str.indexOf(wrap) > -1) {
            return str.split(wrap);
        }
        wrap = '\r\n';
        if (str.indexOf(wrap) > -1) {
            return str.split(wrap);
        }
        return [str];
    };
    /**
     * escape RegExp
     * @param str
     * @returns {*|string}
     */
    self.escapeRegExp = function (str) {
        if (!$.lHelper.isStr(str)) return str;
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
        if (!$.lHelper.isStr(str)) return str;
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
     * currency: str ( default: '') - currency before prefix
     *
     * Customized-OPT
     * 'int': integer-money
     * 'sInt': integer-money with prefix [$]
     *
     * @param str
     * @param [arg1]
     * @param [arg2]
     * @returns {string}
     */
    self.formatMoney = function (str, arg1, arg2) {
        var ret = [];
        var isObj = $.lHelper.isObj;
        var isStr = $.lHelper.isStr;
        var option = isObj(arg1) ? arg1 : (isObj(arg2) ? arg2 : undefined);
        var type = isStr(arg1) ? arg1 : (isStr(arg2) ? arg2 : '');
        var float = 2;
        var decimal = '.';
        var separated = ',';
        var prefix = '';
        var currency = '';
        if (isObj(option)) {
            float = (float = Math.abs(option.float)) > -1 ? float : 2;
            decimal = isStr(option.decimal) ? option.decimal : decimal;
            separated = isStr(option.separated) ? option.separated : separated;
            prefix = isStr(option.prefix) ? option.prefix : prefix;
            currency = isStr(option.currency) ? option.currency : currency;
        }
        if (type === 'sInt') {
            float = 0;
            prefix = '$';
        }
        else if (type === 'int') {
            float = 0;
        }
        var s = str < 0 ? '-' : '';
        var iStr = parseInt(Math.abs(str || 0).toFixed(float)).toString();
        var sepLength = (iStr.length > 3 ) ? (iStr.length % 3) : 0;
        var retStr = s + (sepLength ? iStr.substr(0, sepLength) + separated : '')
            + iStr.substr(sepLength).replace(/(\d{3})(?=\d)/g, '$1' + separated)
            + (float ? decimal + Math.abs(str - iStr).toFixed(float).slice(2) : '');

        currency && ret.push(currency);
        prefix && ret.push(prefix);
        ret.push(retStr);
        return ret.join(' ');
    };
    /**
     * ex: ThisIsWord -> This Is Word
     * @param str
     * @returns {string}
     */
    self.insertBlankBefUpper = function (str) {
        if (!$.lHelper.isStr(str)) return str;
        var indexCount = 0;
        var aStr = str.split('');
        var aStrClone = $.lArr.cloneArr(aStr);
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
    self.upperStr = function (str, opt) {
        return changeCase(str, 'upperCase', opt);
    };
    self.upperFirst = function (str) {
        if (!$.lHelper.isStr(str)) return str;
        return self.upperStr(str, {
            start: 0,
            end: 1
        })
    };
    self.lowerStr = function (str, opt) {
        return changeCase(str, 'toLowerCase', opt);
    };
    self.trimStr = function (str, opt) {
        var force = true;
        if (opt) {
            force = opt.force !== false;
        }
        if (!$.lHelper.isStr(str)) {
            if (!force) {
                return str;
            }
            str = '';
        }
        return str.trim();
    };
    self.splitStr = function (str, splitter, opt) {
        if ($.lHelper.isArr(str)) {
            return str;
        }
        var force = true;
        if (opt) {
            force = opt.force !== false;
        }
        if (!$.lHelper.isStr(str)) {
            if (!force) {
                return str;
            }
            str = '';
        }
        splitter = $.lHelper.isStr(splitter) ? splitter : '';
        return str.split(splitter);
    };
//    self.multiSplit = function (str, aSpliter) {
//        var retArr = [];
//        if ($.lHelper.isStr(aSpliter)) {
//            aSpliter = [aSpliter];
//        }
//        var count = 0;
////        var spliterLength = aSpliter.length;
//        var sp = function (subStr) {
//            var spliter = aSpliter[count];
//            console.log('spliter=',spliter);
//            if (spliter) {
//                var arr = subStr.split(spliter);
//                console.log('arr=',arr);
////                $.each(arr, function (i, newStr) {
////                    sp(newStr);
////                });
////                count++;
////                return;
//            }
////            retArr.push(subStr);
//        };
//        sp(str);
//        return retArr;
//    };
//    var aa='1,3;45,3,336;234,22';
//    var spliter=[';',','];
//    console.log('@@=',self.multiSplit(aa,spliter));

    return self;
})();