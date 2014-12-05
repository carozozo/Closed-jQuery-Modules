/**
 * The date-picker module
 * v1.1
 * @author Caro.Huang
 */


// set jquery-ui-date-picker defaults
$.datepicker.setDefaults({
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy-mm-dd',
    yearRange: '1910:+00'
});


/**
 * date-picker base on jquery-ui-date-picker / jquery-time-picker / input-mask
 * please reference
 * [ http://api.jqueryui.com/datepicker/#option-isRTL ]
 * [ http://trentrichardson.com/examples/timepicker/ ]
 * [ https://github.com/RobinHerbots/jquery.inputmask ]
 * !! the formatter with date-picker/input-mask are different
 * OPT
 * type: date/dateTime/time (default: 'date') - picker-type
 */
$.fn.mDatepicker = function (opt) {
    var self = this;
    var useMask = 'yyyy-mm-dd';
    var defOpt = {
        showButtonPanel: false
    };
    var type = 'date';
    if (opt) {
        type = opt.type || type;
    }
    var setLocality = function setLocality() {
        var locality = $.lLang.getLocality();
        switch (type) {
            case 'dateTime':
                self.datetimepicker('option', $.datetimepicker.regional[locality]);
                break;
            case 'time':
                self.timepicker('option', $.timepicker.regional[locality]);
                break;
            default :
                self.datepicker('option', $.datepicker.regional[locality]);
                break;
        }
    };

    switch (type) {
        case 'dateTime':
            opt = $.extend(defOpt, opt);
            self.datetimepicker(opt);
            useMask = 'y-m-d h:s';
            break;
        case 'time':
            opt = $.extend(defOpt, opt);
            self.timepicker(opt);
            useMask = 'h:s';
            break;
        default :
            self.datepicker(opt);
            break;
    }

    // set input-mask
    if (useMask) {
        self.inputmask(useMask, {
            showMaskOnHover: false
        });
    }
    setLocality();
    $.lEventEmitter.hookEvent('befSwitchLang', 'mDatepicker', setLocality, {
        source: self
    });
    return self;
};