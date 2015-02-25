/**
 * The table list module
 * v1.3
 * @author Caro.Huang
 */


/**
 * create list-table by array data, will auto mapping with key as id/class
 * OPT
 * defStyle: bool (default: true) - if set the default style of list-table
 * defFadeIn: bool (default: true) - if show with fadeIn-animate after table built
 * emptyMsg: str (default: '') - the empty msg
 * emptyFontSize: 1~6 (default: 3) - the empty msg size
 * ex1.
 * mListTable(aData,function(){ do_something });
 *
 * ex2.
 * mListTable(aData, {mapFn: function(){ do_something }, defStyle: false});
 *
 * Fn
 * addOddClass: set class to odd-DOM
 * addEvenClass: set class to even-DOM
 * removeOddClass: remove class from odd-DOM
 * removeEvenClass: remove class from even-DOM
 *
 * @param oaData
 * @param [dataSwitchFn]
 * @param [mapFn]
 * @param [opt]
 */
$.fn.mListTable = function (oaData, dataSwitchFn, mapFn, opt) {
    var self = this;
    var selfId = 'mListTable';
    var langPathRoot = 'mListTable.';
    var defStyle = true;
    var defFadeIn = true;
    var emptyLangPath = langPathRoot + 'emptyMsg';
    var emptyMsg = '';
    var emptyFontSize = 3;
    if (opt) {
        defStyle = opt.defStyle !== false;
        defFadeIn = opt.defFadeIn !== false;
        emptyMsg = opt.emptyMsg || emptyMsg;
        emptyFontSize = opt.emptyFontSize || emptyFontSize;
    }
    /**
     * set style by bootstrap
     */
    var setDefaultStyle = function () {
        self.lClass('table-hover');
        self.find('.basic-dataObj:odd').removeClass('success');
        self.find('.basic-dataObj:even').lClass('success');
    };

    (function bdListTable() {
        var dListDataTmp = null;
        // get dataObj template if in DOM
        if (self.data('dataObjTmp')) {
            dListDataTmp = self.data('dataObjTmp');
        } else {
            // save the first dataObj used as template
            dListDataTmp = self.find('.basic-dataObj').first();
            self.data('dataObjTmp', dListDataTmp);
        }
        // remove origin list data and append template
        self.find(' > tbody > tr').remove();
        // set empty-msg if no data
        if (!oaData || oaData.length === 0) {
            if (self.find('.emptyMsgTr').length > 0)
                return;
            var dEmptyMsgTr = (function () {
                var firstTr = self.find('tr:first');
                var colLength = firstTr.find('th').length || firstTr.find('td').length;
                var dTr = $('<tr></tr>').lClass('emptyMsgTr');
                var dTd = $('<td></td>').attr('colspan', colLength).lClass('text-center emptyMsgTd');
                var dDiv = $('<h' + emptyFontSize + '></h' + emptyFontSize + '>')
                    .lClass('alert alert-warning')
                    .css({
                        'margin': 0
                    });
                if (emptyMsg) {
                    dDiv.html(emptyMsg);
                } else {
                    dDiv.lSetLang(emptyLangPath);
                }
                dTd.append(dDiv).appendTo(dTr);
                return dTr
            })();
            self.append(dEmptyMsgTr);
            return;
        }
        self.append(dListDataTmp);
        $.each(oaData, function (i, oData) {
            var dEachDom = dListDataTmp.clone().show();
            if ($.lHelper.isFn(dataSwitchFn)) {
                oData = dataSwitchFn(oData);
                oaData[i] = oData;
            }
            // auto map data to data-DOM, and call fn for data-DOM
            $.lModel.mapDom(oData, dEachDom, function () {
                mapFn && mapFn(i, oData, dEachDom);
            });
            self.find('.basic-dataObj:last').after(dEachDom);
        });
        self.find('.basic-dataObj').first().remove();
    })();

    if (defStyle) {
        setDefaultStyle();
    }
    if (defFadeIn) {
        self.hide().fadeIn();
    }
    self.setDefaultStyle = setDefaultStyle;
    self.addOddClass = function (sClass) {
        self.find('.basic-dataObj:odd').lClass(sClass);
    };
    self.addEvenClass = function (sClass) {
        self.find('.basic-dataObj:even').lClass(sClass);
    };
    self.removeOddClass = function (sClass) {
        self.find('.basic-dataObj:odd').removeClass(sClass);
    };
    self.removeEvenClass = function (sClass) {
        self.find('.basic-dataObj:even').removeClass(sClass);
    };
    return self.lClass(selfId);
};