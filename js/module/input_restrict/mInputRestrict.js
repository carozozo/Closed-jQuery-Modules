/**
 * The input-restrict module
 * v1.0
 * @author Caro.Huang
 */

/*
 var blacklist = '!@#$%^&*()+=[]\\\';,/{}|":<>?~`.- _';

 var DEFAULT_SETTINGS_ALPHANUM = {
 allow              : '',    // Allow extra characters
 disallow           : '',    // Disallow extra characters
 allowSpace         : true,  // Allow the space character
 allowNumeric       : true,  // Allow digits 0-9
 allowUpper         : true,  // Allow upper case characters
 allowLower         : true,  // Allow lower case characters
 allowCaseless      : true,  // Allow characters that don't have both upper & lower variants - eg Arabic or Chinese
 allowLatin         : true,  // a-z A-Z
 allowOtherCharSets : true,  // eg é, Á, Arabic, Chinese etc
 forceUpper         : false, // Convert lower case characters to upper case
 forceLower         : false, // Convert upper case characters to lower case
 maxLength          : NaN    // eg Max Length
 }

 var CONVENIENCE_SETTINGS_ALPHANUM = {
 'alpha'      : {
 allowNumeric : false
 },
 'upper'      : {
 allowNumeric  : false,
 allowUpper    : true,
 allowLower    : false,
 allowCaseless : true
 },
 'lower'      : {
 allowNumeric  : false,
 allowUpper    : false,
 allowLower    : true,
 allowCaseless : true
 }
 };

 var DEFAULT_SETTINGS_NUM = {
 allowPlus           : false, // Allow the + sign
 allowMinus          : true,  // Allow the - sign
 allowThouSep        : true,  // Allow the thousands separator, default is the comma eg 12,000
 allowDecSep         : true,  // Allow the decimal separator, default is the fullstop eg 3.141
 allowLeadingSpaces  : false,
 maxDigits           : NaN,   // The max number of digits
 maxDecimalPlaces    : NaN,   // The max number of decimal places
 maxPreDecimalPlaces : NaN,   // The max number digits before the decimal point
 max                 : NaN,   // The max numeric value allowed
 min                 : NaN    // The min numeric value allowed
 }

 var CONVENIENCE_SETTINGS_NUMERIC = {
 'integer'         : {
 allowPlus:    false,
 allowMinus:   true,
 allowThouSep: false,
 allowDecSep:  false
 },
 'positiveInteger' : {
 allowPlus:    false,
 allowMinus:   false,
 allowThouSep: false,
 allowDecSep:  false
 }
 };
 */

/**
 * create a input-restrict base on [3rd party jquery-alphanum]
 * please read [https://github.com/KevinSheedy/jquery.alphanum]
 *
 * and base on [3rd party jquery-autonumberic] for money type
 * please read [https://github.com/BobKnothe/autoNumeric]
 *
 * @param [type]
 * @param [opt]
 */
$.fn.mInputRestrict = function (type, opt) {
    var self = this;
    var useAutoNumeric = false;
    var basicOpt = {
        allow: '._-',
        allowOtherCharSets: false,
        allowSpace: false
    };
    var checkCase = function () {
        if (opt.forceUpper) {
            self.css({
                'text-transform': 'uppercase'
            });
        }
        else if (opt.forceLower) {
            self.css({
                'text-transform': 'lowercase'
            });
        }
    };

    if ($.lHelper.isObj(type)) {
        opt = type;
        type = opt.type;
    }
    opt = opt || {};

    // the fns mapping by type
    var oTypeFn = {
        /**
         * same as alphanum
         */
        textNum: function () {
            self.alphanum(opt);
        },
        /**
         * same as alpha
         */
        text: function () {
            self.alpha(opt);
        },
        /**
         * same as numeric
         */
        num: function () {
            self.numeric(opt);
        },
        engNum: function () {
            var engNumOpt = {
                allowOtherCharSets: false
            };
            $.extend(engNumOpt, opt);
            self.alphanum(engNumOpt);
        },
        /**
         * basic input restriction
         */
        basic: function () {
            $.extend(basicOpt, opt);
            self.alphanum(basicOpt);
        },
        /**
         * base on basic type and add [@]
         */
        email: function () {
            $.extend(basicOpt, opt);
            basicOpt.allow += '@';
            self.alphanum(basicOpt);
        },
        textarea: function () {
            $.extend(basicOpt, opt);
            basicOpt.allow = '!@#$%^&*()+=[]\\\';,/{}|":<>?~`.- _';
            basicOpt.allowCaseless = true;
            self.alphanum(basicOpt);
        },
        /**
         * integer
         */
        int: function () {
            self.numeric('integer');
        },
        /**
         * positive integer
         */
        positiveInt: function () {
            self.numeric('positiveInteger');
        },
        /**
         * money type
         * ex. 100,332.55
         */
        money: function () {
            useAutoNumeric = true;
            var defOpt = {
                vMax: '99999999.99'
            };
            opt = $.lObj.extendObj(defOpt, opt);
            self.autoNumeric('init', opt);
        },
        /**
         * moneyNoSep type
         * ex. 9999999.99
         */
        moneyNoSep: function () {
            useAutoNumeric = true;
            var defOpt = {
                aSep: '',
                vMax: '99999999.99'
            };
            opt = $.lObj.extendObj(defOpt, opt);
            self.autoNumeric('init', opt);
        },
        /**
         * money type
         * ex. 100,332
         */
        moneyInt: function () {
            useAutoNumeric = true;
            var defOpt = {
                mDec: '0'
            };
            opt = $.lObj.extendObj(defOpt, opt);
            self.autoNumeric('init', opt);
        }
    };

    if (oTypeFn[type]) {
        oTypeFn[type]();
    }
    else {
        oTypeFn.basic();
    }

    checkCase();
    self.getRealValue = function () {
        if (useAutoNumeric) {
            self.autoNumeric('init');
            return parseInt(self.autoNumeric('get'));
        }
        var value = self.getVal();
        if ($.lStr.isNumeric(value)) {
            return parseInt(value);
        }
        return value;
    };
    return self;
};