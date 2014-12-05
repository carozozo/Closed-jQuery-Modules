/**
 * the l18n with form-checker module
 * @author Caro.Huang
 */


tla.mFormChecker = {};
tla.mFormChecker.en_us = {
    required: 'Required',
    num: 'Please insert number',
    int: 'Please insert integer',
    email: 'Please insert email',
    equal: function (tarName) {
        return 'Must equal to ' + tarName;
    },
    minLength: function (minLength) {
        return 'No less than ' + minLength + ' characters';
    }
};

tla.mFormChecker.zh_cn = {
    required: '必填',
    num: '请输入数字',
    int: '请输入整数',
    email: '请输入email',
    equal: function (tarName) {
        return '必需和 ' + tarName + ' 相同';
    },
    minLength: function (minLength) {
        return '最少' + minLength + '个字元';
    }
};

tla.mFormChecker.zh_tw = {
    required: '必填',
    num: '請輸入數字',
    int: '請輸入整數',
    email: '請輸入email',
    equal: function (tarName) {
        return '必需和 ' + tarName + ' 相同';
    },
    minLength: function (minLength) {
        return '最少' + minLength + '個字元';
    }
};