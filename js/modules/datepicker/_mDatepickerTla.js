/**
 * the l18n with datepicker module
 * @author Caro.Huang
 */

$.datepicker.regional['en_us'] = {
    closeText: 'Done',
    prevText: 'Prev',
    nextText: 'Next',
    currentText: 'Today',
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    weekHeader: 'Wk',
//    isRTL: false,
    showMonthAfterYear: false
};

$.datepicker.regional['zh_cn'] = {
    closeText: '关闭',
    prevText: '&#x3c;上月',
    nextText: '下月&#x3e;',
    currentText: '今天',
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
    weekHeader: '周',
//    isRTL: false,
    showMonthAfterYear: true
};

$.datepicker.regional['zh_tw'] = {
    closeText: '關閉',
    prevText: '&#x3c;上月',
    nextText: '下月&#x3e;',
    currentText: '今天',
    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
    weekHeader: '周',
//    isRTL: false,
    showMonthAfterYear: true
};

$.timepicker.regional['en_us'] = {
    timeOnlyTitle: 'Choose time',
    timeText: 'Time',
    hourText: 'Hour',
    minuteText: 'minute',
    secondText: 'second',
    millisecText: 'milli second',
    timezoneText: 'time zone',
    currentText: 'current',
    closeText: 'close',
    timeFormat: 'HH:mm',
    amNames: ['AM', 'A'],
    pmNames: ['PM', 'P'],
    isRTL: false
};

$.timepicker.regional['zh_cn'] = {
    timeOnlyTitle: '选择时间',
    timeText: '时间',
    hourText: '时',
    minuteText: '分',
    secondText: '秒',
    millisecText: '毫秒',
    timezoneText: '时区',
    currentText: '现在',
    closeText: '关闭',
    timeFormat: 'HH:mm',
    amNames: ['AM', 'A'],
    pmNames: ['PM', 'P'],
    isRTL: false
};

$.timepicker.regional['zh_tw'] = {
    timeOnlyTitle: '選擇時間',
    timeText: '時間',
    hourText: '時',
    minuteText: '分',
    secondText: '秒',
    millisecText: '毫秒',
    timezoneText: '時區',
    currentText: '現在',
    closeText: '關閉',
    timeFormat: 'HH:mm',
    amNames: ['AM', 'A'],
    pmNames: ['PM', 'P'],
    isRTL: false
};

$.datetimepicker = {};
$.datetimepicker.regional = {};
$.datetimepicker.regional['en_us'] = $.extend($.datepicker.regional['en_us'], $.timepicker.regional['en_us']);

$.datetimepicker.regional['zh_cn'] = $.extend($.datepicker.regional['zh_cn'], $.timepicker.regional['zh_cn']);

$.datetimepicker.regional['zh_tw'] = $.extend($.datepicker.regional['zh_tw'], $.timepicker.regional['zh_tw']);