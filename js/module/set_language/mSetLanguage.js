/**
 * The set language module
 * v1.0
 * @author Caro.Huang
 */


$.init(function () {
    $.mSetLanguage();
});

// the 99999 is want to be last init
$.init(function () {
    $.lLang.switchLang();
}, 99999);

/**
 * the set locality drop down ui
 * @returns {*|jQuery|HTMLElement}
 */
$.mSetLanguage = function () {
    var self = {};
    var item1 = {
        id: 'setLangEnUs',
        title: 'English',
        click: function () {
            $.lLang.setLocality('en_us');
            $.lLang.switchLang();
        }
    };
    var item2 = {
        id: 'setLangZhCn',
        title: '简体中文',
        click: function () {
            $.lLang.setLocality('zh_cn');
            $.lLang.switchLang();
        }
    };
    var item3 = {
        id: 'setLangZhTw',
        title: '繁體中文',
        click: function () {
            $.lLang.setLocality('zh_tw');
            $.lLang.switchLang();
        }
    };
    var opt = {
        side: 'right',
        titleLangPath: 'mSetLanguage.choiceLan',
        order: 999,
        dropDownItems: [item1, item2, item3]
    };
    $.mNav.regNav('setLanguage', opt);
    return self;
};