/**
 * The select-picker module
 * v1.4
 * @author Caro.Huang
 */


/**
 * create a select-picker base on [3rd party bootstrap-select]
 * please read [http://silviomoreto.github.io/bootstrap-select/]
 *
 * OPT
 * multiple: if multiple-select(boolean, default: false )
 * oaData: object array to build select-options( obj{ name:xxx, val:xxx }, default: null )
 * title: msg when nothing selected and multiple is true ( str/fn, default: null )
 * selectAllBtn: if set the select btn when multiple is true ( bool, default: true )
 * maxShow: if the selected no less than maxShow the msg become like [x/xx be selected] ( int, default:0 )
 * val: default selected-option-val after module built( str/arr, default: null )
 *
 * FN
 * selectAll;
 * deselectAll
 * render
 * refresh
 * val
 * enable
 * disable
 * hide
 * show
 * @param [opt]
 */
$.fn.mSelectPicker = function (opt) {
    var self = this;
    var selfId = 'mSelectPicker';
    var langPathRoot = 'mSelectPicker.';
    var multiple = false;
    var oaData = null;
    var title = null;
    var selectAllBtn = true;
    var maxShow = 0;
    var val = null;
    if (opt) {
        multiple = opt.multiple === true;
        oaData = opt.oaData || oaData;
        title = (multiple) ? ( opt.title || title ) : title;
        selectAllBtn = (multiple) ? (opt.selectAllBtn !== false) : false;
        maxShow = (multiple) ? ( ($.lStr.isInt(opt.maxShow)) ? opt.maxShow : maxShow ) : maxShow;
        val = opt.val || val;
    } else {
        opt = {};
    }
    // get title with default or option set in begin(used for reg switch lan)
    var originTitle = title;
    // create select picker and set the btn style if exists
    var createSelectPicker = function () {
        dSelectPicker = (function () {
            var dTable = null;
            if (multiple && selectAllBtn) {
                dTable = $.lTable.createTable(1, 2);
                // buildup select btn, and set to table.selectAllBtn
                dTable.selectAllBtn = (function dSelectAllBtn() {
                    // css margin-bottom assort with bootstrap-select plugin
                    var dBtn = $('<button></button>').lClass('btn').lId('mSelectAllPickerBtn').css('margin-bottom', '10px');
                    var dIconO = $.lDom.createIcon('ok');
                    var dIconR = $.lDom.createIcon('remove');

                    // setup the click event
                    dBtn.action('click.' + selfId, function () {
                        if (dBtn.selected) {
                            deselectAll();
                        } else {
                            selectAll();
                        }
                    });

                    // set the [ select all ] style
                    dBtn.setOkStyle = function () {
                        var lan = $.lLang.parseLanPath(langPathRoot + 'selectAll');
                        dBtn.empty().append(dIconO).append(lan);
                        dBtn.selected = false;
                    };
                    // set the [ deselect all ] style
                    dBtn.setRemoveStyle = function () {
                        var lan = $.lLang.parseLanPath(langPathRoot + 'deselectAll');
                        dBtn.empty().append(dIconR).append(lan);
                        dBtn.selected = true;
                    };
                    dBtn.setOkStyle();
                    dBtn.css({
                        'border-top-right-radius': 0,
                        'border-bottom-right-radius': 0
                    });
                    return dBtn;
                })();
                dTable.dTd1 = dTable['col0-0'];
                dTable.dTd2 = dTable['col0-1'].css('width', '99%');
                dTable.dTd1.append(dTable.selectAllBtn);
            } else {
                dTable = $.lTable.createTable(1, 1);
                dTable.dTd2 = dTable['col0-0'];
            }
            dTable['row0'].lClass(selfId).css('width', '100%');

            dTable.enableBtn = function () {
                dTable.selectAllBtn && dTable.selectAllBtn.enable();
            };

            dTable.disableBtn = function () {
                dTable.selectAllBtn && dTable.selectAllBtn.disable();
            };

            dTable.setBtnOk = function () {
                dTable.selectAllBtn && dTable.selectAllBtn.setOkStyle();
            };

            dTable.setBtnRemove = function () {
                dTable.selectAllBtn && dTable.selectAllBtn.setRemoveStyle();
            };
            return dTable;
        })();
        self.data(selfId, dSelectPicker);
        // append main table after the select
        self.after(dSelectPicker);
        // append the select to main table
        dSelectPicker.dTd2.append(self);
        // fire the bootstrap-select plugin, and set to target-DOM
        self.selectpicker(opt);

        self.dSelectPicker = dSelectPicker;
        self.selectAllBtn = dSelectPicker.selectAllBtn;
        self.dSelect = dSelectPicker.find('.bootstrap-select');
        self.dSelectBtn = self.dSelect.find('.selectpicker:button');
        self.dSelectMenu = self.dSelect.find('.dropdown-menu:first');
        self.dOptions = self.dSelectMenu.find('ul li');

        checkSelectedOptionCount();

        if (!dSelectPicker.selectAllBtn) {
            return;
        }
        // set btn clicked if selected all
        $.each(self.dOptions, function (index, dOption) {
            dOption = $(dOption);
            dOption.action('mouseup.' + selfId, function () {
                // set-timeout used for bootstrap-function done
                setTimeout(function () {
                    checkSelectedOptionCount();
                }, 10);
            });
        });

        self.dSelectBtn.css({
            'border-top-left-radius': 0,
            'border-bottom-left-radius': 0
        });
    };
    var getTitle = function (title) {
        // if user set opt.title = function(){....}
        title = $.lHelper.executeIfFn(title);
        // if user not set the title
        if (!title) {
            if (multiple) {
                title = $.lLang.parseLanPath(langPathRoot + 'multipleTitle');
            } else {
                title = $.lLang.parseLanPath(langPathRoot + 'title');
            }
        }
        // do nothing if user set title string type
        return title;
    };
    // count the selected options decide if change [select-btn] style
    // and set options click-check(after bootstrap-select .render and .refresh)
    var checkSelectedOptionCount = function () {
        // get the options built by bootstrap-select plugin
        var optionCount = self.dOptions.length;
        var selectedCount = self.dSelectMenu.find('ul .selected').length;
        if (selectedCount !== optionCount) {
            dSelectPicker.setBtnOk();
        } else {
            dSelectPicker.setBtnRemove();
        }
    };
    var selectAll = function () {
        self.selectpicker('selectAll');
        dSelectPicker.setBtnRemove();
    };
    var deselectAll = function () {
        self.selectpicker('deselectAll');
        dSelectPicker.setBtnOk();
        return self;
    };
    var render = function () {
        self.selectpicker('render');
        checkSelectedOptionCount();
        return self;
    };
    var refresh = function () {
        self.selectpicker('refresh');
        checkSelectedOptionCount();
        return self;
    };
    var setVal = function (val) {
        if (val !== undefined) {
            val && self.selectpicker('val', val) && render();
            return self;
        } else {
            return self.selectpicker('val');
        }
    };
    var enable = function () {
        // enable the target-DOM then refresh the bootstrap-select
        self.prop('disabled', false);
        self.selectpicker('refresh');
        dSelectPicker.enableBtn();
        return self;
    };
    var disable = function () {
        // disable the target-DOM then refresh the bootstrap-select
        self.prop('disabled', true);
        self.selectpicker('refresh');
        dSelectPicker.disableBtn();
        return self;
    };
    var hide = function () {
        dSelectPicker.hide();
        return self;
    };
    var show = function () {
        dSelectPicker.show();
        return self;
    };

    // get the msg when not selected
    title = getTitle(title);
    if (oaData) {
        // set the basic option
        self.mSelect(oaData);
    }
    if (multiple) {
        self.attr('multiple', true);
        if (maxShow) {
            opt.selectedTextFormat = 'count>' + (maxShow - 1);
        }
        // set the language when selected no less than maxShow( used for bootstrap-select )
        opt.countSelectedText = '{0}/{1}' + $.lLang.parseLanPath(langPathRoot + 'countSelectedText');
    }
    // set the title to target-DOM( used for bootstrap-select )
    self.lTitle(title);
    // get the selectPicker-DOM from target-DOM
    var dSelectPicker = self.data(selfId);
    // if the selectPicker-DOM not in target-DOM, create it
    if (!dSelectPicker) {
        createSelectPicker();
    }
    // set the selected value
    setVal(val);
    $.lEventEmitter.hookEvent('befSwitchLang', selfId, function () {
        // if the dSelectPicker has selectAllBtn, reset the btn language
        if (dSelectPicker.selectAllBtn && dSelectPicker.selectAllBtn.selected) {
            dSelectPicker.setBtnRemove();
        } else {
            dSelectPicker.setBtnOk();
        }

        var title = getTitle(originTitle);
        // reset the title
        self.lTitle(title);
        // reset the msg when select no less than maxShow
        opt.countSelectedText = '{0}/{1}' + $.lLang.parseLanPath(langPathRoot + 'countSelectedText');
        self.selectpicker(opt);
        self.refresh();
    }, {
        source: self
    });

    /**
     * add support fn
     */
    self.selectAll = selectAll;
    self.deselectAll = deselectAll;
    self.render = render;
    self.refresh = refresh;
    self.val = setVal;
    self.enable = enable;
    self.disable = disable;
    self.hide = hide;
    self.show = show;
    return self;
};