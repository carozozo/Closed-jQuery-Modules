/**
 * The list-DOM module
 * v1.2
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
 * mapFn: fn (default: null) - fn when mapping each-data
 *
 * ex1.
 * mListDom(aData,function(){ do_something });
 *
 * ex2.
 * mListDom(aData, {mapFn: function(){ do_something });
 *
 * @param oaData
 * @param [opt]
 * @param [mapFn]
 */
$.fn.mListDom = function (oaData, opt, mapFn) {
    var self = this;
    var selfId = 'mLisDom';
    var groupNumKey = 'mListDomGroupNum';
    var groupNum = 1;
    var groupName = '';
    var dataCount = oaData.length;
    var minForDelay = 0;
    var cb = null;
    if ($.lHelper.isFn(opt)) {
        mapFn = opt;
    } else if (opt) {
        minForDelay = opt.minForDelay || minForDelay;
        cb = opt.cb || cb;
        mapFn = opt.mapFn || mapFn;
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
            // auto map data to data-DOM, and call fn for data-DOM
            $.lModel.mapDom(oData, dEachDom, function () {
                mapFn && mapFn(i, oData, dEachDom);
            });
            if (i === 0) {
                self.after(dEachDom);
            } else {
                $('.' + groupName + ':last').after(dEachDom);
            }
            if (i === dataCount - 1) {
                // fire callback after last-dom built
                cb && cb();
            }
        };
        if (minForDelay !== 0 && dataCount > minForDelay) {
            setTimeout(bdEachDom, i);
        } else {
            bdEachDom();
        }
    });
    return  self.hide();
};