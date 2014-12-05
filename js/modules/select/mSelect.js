/**
 * The basic select module
 * v1.2
 * @author Caro.Huang
 */


/**
 * create <options> to select-Dom by data-obj{ name: xxx, val: yyy } array
 * OPT
 * zeroOption: bool (default: false) - if create <options> without value
 * zeroTitle: str (default: '') - title for zero-option
 * search: bool (default: false) - if can search by input
 * searchByEnter: bool (default: false) - only search by press-[Enter]
 *
 * @param oaData
 * @param [opt]
 * @param [mapFn]
 */
$.fn.mSelect = function (oaData, opt, mapFn) {
    var self = this;
    var selfId = 'mSelect';
    var langPathRoot = 'mSelect.';
    var zeroOption = false;
    var zeroTitle = '';
    var search = false;
    var searchByEnter = false;
    // clone obj-arr data
    oaData = oaData.cloneArr();
    if ($.lHelper.isFn(opt)) {
        mapFn = opt;
        opt = null;
    }
    if (opt) {
        zeroOption = opt.zeroOption === true;
        zeroTitle = opt.zeroTitle || zeroTitle;
        search = opt.search === true;
        searchByEnter = opt.searchByEnter === true;
    }
    var addOpts = function () {
        self.empty();
        $.each(oaData, function (i, oData) {
            var name = oData.name;
            var val = oData.val;
            var dOption = (function () {
                if ($.lHelper.isDom(name)) {
                    // clone if name is obj (DOM)
                    name = name.clone();
                }
                return $('<option></option>').val(val).html(name);
            })();
            self.append(dOption);
            mapFn && mapFn(i, oData, dOption);
        });
    };
    if (zeroOption && !self.zeroOption) {
        var langSpan = zeroTitle ? zeroTitle : $.lDom.createLangSpan('common.PleaseSelect');
        oaData.unshift({
            val: '',
            name: langSpan
        });
        self.zeroOption = true;
    }
    addOpts();
    if (search) {
        self.dSelectSearch = (function () {
            var dSearchInp = $('<input/>')
                .lType('text')
                .lClass('form-control basic-bg-gray')
                .css({
                    width: 100,
                    height: self.outerHeight(),
                    border: self.css('border'),
                    'border-radius': self.css('border-radius'),
                    'border-top-left-radius': 0,
                    'border-bottom-left-radius': 0
                })
                .on('keyup', function (e) {
                    // search-by-enter, but user not press enter
                    if (searchByEnter && !$.lHelper.isPressEnter(e)) {
                        return;
                    }
                    var searchName = dSearchInp.val().toLowerCase();
                    var isFind = false;
                    addOpts();
                    // remove options that not-match by search
                    $.each(self.find('option'), function (i, dOption) {
                        dOption = $(dOption);
                        var val = dOption.val();
                        var name = dOption.text().toLowerCase();
                        var isZeroOpt = (zeroOption && i === 0 && val === '');
                        if (!isZeroOpt) {
                            if (name.indexOf(searchName) < 0) {
                                dOption.remove();
                            }
                            else {
                                isFind = true;
                            }
                        }
                    });
                    // found nothing, rebuild opts
                    if (!isFind) {
                        addOpts();
                    }
                });
            var setPlaceHolder = function () {
                var lang = $.lLang.parseLanPath('common.Search');
                dSearchInp.attr('placeholder', lang);
            };
            setPlaceHolder();
            $.lEventEmitter.hookEvent('befSwitchLang', selfId, function () {
                setPlaceHolder();
            });
            if (searchByEnter) {
                setTip();
                $.lEventEmitter.hookEvent('befSwitchLang', 'mSelect2', function () {
                    setTip();
                });

                function setTip() {
                    var lang = $.lLang.parseLanPath(langPathRoot + 'searchEnter');
                    dSearchInp.lTitle(lang)
                        .tooltip('destroy')
                        .tooltip();
                }
            }
            return dSearchInp;
        })();
        var dSelectTable = $.lTable.createTable(1, 2);
        self.after(dSelectTable);
        dSelectTable['col0-0'].append(self);
        dSelectTable['col0-1'].append(self.dSelectSearch);
        self.css({
            // set width for [ no-change-width when rebuild-options ]
            width: self.outerWidth(),
            'border-right': 0,
            'border-top-right-radius': 0,
            'border-bottom-right-radius': 0
        });
    }
    return self.lClass(selfId + ' form-control');
};