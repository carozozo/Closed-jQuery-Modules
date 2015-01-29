/**
 * The list-DOM module
 * v1.4
 * @author Caro.Huang
 */

$.mListDom = (function () {
    var self = {};
    self.groupNum = 1;

    return self;
})();

/**
 * create list-DOM by array data, will auto mapping with key as id/class
 * OPT
 * minForDelay: int (default: 0) - build each-DOM by delay if data-count bigger than minForDelay
 * cb: fn (default: null) - callback-fn after mapping done
 *
 * ex1.
 * mListDom(aData,function(){ do_something });
 *
 * ex2.
 * mListDom(aData, {mapFn: function(){ do_something });
 *
 * @param oaData
 * @param [dataSwitchFn]
 * @param [mapFn]
 * @param [opt]
 */
$.fn.mListDom = function (oaData, dataSwitchFn, mapFn, opt) {
    var self = this;
    var selfId = 'mLisDom';
    var groupNumKey = 'mListDomGroupNum';
    var groupNum = 1;
    var groupName = '';
    var dataCount = oaData.length;
    var minForDelay = 0;
    var cb = null;
    if (opt) {
        minForDelay = opt.minForDelay || minForDelay;
        cb = opt.cb || cb;
    }

    if (self.data(groupNumKey)) {
        groupNum = self.data(groupNumKey);
        groupName = selfId + groupNum;
        $('.' + groupName).remove();
    } else {
        self.data(groupNumKey, $.mListDom.groupNum);
        groupNum = $.mListDom.groupNum;
        groupName = selfId + groupNum;
        $.mListDom.groupNum++;
    }

    $.each(oaData, function (i, oData) {
        var bdEachDom = function () {
            var dEachDom = self.clone();
            dEachDom
                .show()
                .lClass(selfId)
                .lClass(groupName);
            if ($.lHelper.isFn(dataSwitchFn)) {
                oData = dataSwitchFn(oData);
                oaData[i] = oData;
            }
            // auto map data to data-DOM, and call fn for data-DOM
            $.lModel.mapDom(oData, dEachDom, function () {
                if (i === 0) {
                    self.after(dEachDom);
                } else {
                    $('.' + groupName + ':last').after(dEachDom);
                }
                mapFn && mapFn(i, oData, dEachDom);
                if (i === dataCount - 1) {
                    // fire callback after last-dom built
                    cb && cb();
                }
            });
        };
        if (minForDelay !== 0 && dataCount > minForDelay) {
            setTimeout(bdEachDom, i);
        } else {
            bdEachDom();
        }
    });
    return  self.hide();
};