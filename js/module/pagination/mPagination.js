/**
 * The Travel Global pagination module
 * v1.3
 * @author Caro.Huang
 */


/**
 * create a pagination
 * OPT
 * btnRange: numbers of page btn base on current page
 * currentPage: btn index that active
 * totalPage: total page count
 * totalCount: total count of records
 * clickFn: page btn click fn
 * align: pagination align left/center/right (default: center)
 * @param opt
 * @returns {$.fn}
 */
$.fn.mPagination = function (opt) {
    var self = this;
    var selfId = 'mPagination';
    var keyDownEventName = 'keydown.' + selfId;
    if (!opt) {
        return self;
    }
    var btnRange = opt.btnRange || 2;
    var startPage = opt.startPage || 0;
    var pageSize = opt.pageSize || 10;
    var totalPage = opt.totalPage || 0;
    var totalCount = opt.totalCount || 0;
    var clickFn = opt.clickFn || false;
    var align = (['left', 'center', 'right'].indexOf(opt.align) > -1) ? opt.align : 'center';

    if (totalCount < 1) {
        self.hide();
        return self;
    }
    self.firstBtn = (function () {
        var dFirst = $('<li></li>');
        var dFirstLink = $.lDom.createLink('&laquo;');
        dFirst
            .append(dFirstLink)
            .action('click', function () {
                if (startPage > 0) {
                    startPage = 0;
                    clickFn && clickFn(startPage, pageSize);
                }
            });
        return dFirst;
    })();
    self.prevBtn = (function () {
        var dPrev = $('<li></li>');
        var dPrevLink = $.lDom.createLink('&lt;');
        dPrev
            .append(dPrevLink)
            .action('click', function () {
                if (startPage > 0) {
                    startPage--;
                    clickFn && clickFn(startPage, pageSize);
                }
            });
        return dPrev;
    })();
    self.nextBtn = (function () {
        var dNext = $('<li></li>');
        var dNextLink = $.lDom.createLink('&gt;');
        dNext
            .append(dNextLink)
            .action('click', function () {
                if (startPage < totalPage - 1) {
                    startPage++;
                    clickFn && clickFn(startPage, pageSize);
                }
            });
        return dNext;
    })();
    self.lastBtn = (function () {
        var dLast = $('<li></li>');
        var dLastLink = $.lDom.createLink('&raquo;');
        dLast
            .append(dLastLink)
            .action('click', function () {
                if (startPage < totalPage - 1) {
                    startPage = totalPage - 1;
                    clickFn && clickFn(startPage, pageSize);
                }
            });
        return dLast;
    })();
    self.dPagination = (function () {
        var dPagination = $('<ul></ul>').lClass('pagination').lClass(selfId);
        // page btn length = btnRange*2 + 1 || totalPage
        var min = startPage - btnRange;
        var max = (startPage + btnRange) + 1;

        if (min < 0) {
            max -= min;
        }
        if (max > totalPage) {
            min -= max - totalPage;
        }
        min = (min > 0) ? min : 0;
        max = (max < totalPage) ? max : totalPage;

        dPagination.append(self.firstBtn);
        dPagination.append(self.prevBtn);
        for (var i = min; i < max; i++) {
            var dPageBtn = (function (page) {
                var dPage = $('<li></li>').lClass('pageBtn');
                var dPageLink = $.lDom.createLink(page + 1);
                dPage
                    .append(dPageLink)
                    .action('click', function () {
                        self.find('.pageBtn').removeClass('active');
                        $(this).lClass('active');
                        startPage = page;
                        clickFn && clickFn(startPage, pageSize);
                    });
                if (page == startPage) {
                    dPage.lClass('active');
                }
                return dPage;
            })(i);
            dPagination.append(dPageBtn);
        }
        dPagination.append(self.nextBtn);
        dPagination.append(self.lastBtn);
        return dPagination;
    })();
    self.dPageSize = (function () {
        var langPath1 = selfId + '.ShowRecord1';
        var langPath2 = selfId + '.ShowRecord2';
        var sLan1 = $.lLang.parseLanPath(langPath1);
        var sLan2 = $.lLang.parseLanPath(langPath2);
        var dPageSizeMain = $('<div></div>').lId('pageSize');
        var dPageSize = $('<span></span>').lSetLang(langPath1).html(sLan1);
        var dPageSizeInput = $('<input/>').lType('text')
            .lId('pageSizeInput')
            .val(pageSize)
            .css('width', '30px');
        var dPageSize2 = $('<span></span>').lSetLang(langPath2).html(sLan2);

        dPageSizeInput.on(keyDownEventName, function (e) {
            var newPageSize = dPageSizeInput.val();
            newPageSize = newPageSize >= 100 ? 100 : newPageSize;
            newPageSize = newPageSize < 1 ? 1 : newPageSize;
            if ($.lHelper.isPressEnter(e)) {
                startPage = 0;
                pageSize = newPageSize;
                clickFn && clickFn(startPage, newPageSize);
            }
        });
        dPageSizeMain.append(dPageSize).append(dPageSizeInput).append(dPageSize2);
        return dPageSizeMain;
    })();
    self.dGoto = (function () {
        var lanPath1 = selfId + '.GoTo';
        var lanPath2 = selfId + '.Page';
        var sLan1 = $.lLang.parseLanPath(lanPath1);
        var sLan2 = $.lLang.parseLanPath(lanPath2);
        var dGoToMain = $('<div></div>').lId('goTo');
        var dGoTo = $('<span></span>').lSetLang(lanPath1).html(sLan1);
        var dPageInput = $('<input/>').lType('text').lId('pageInput').css('width', '30px');
        var dGoTo2 = $('<span></span>').lSetLang(lanPath2).html(sLan2);

        dPageInput.on(keyDownEventName, function (e) {
            var page = dPageInput.val();
            page = page >= totalPage ? totalPage : page;
            page = page < 1 ? 1 : page;
            if ($.lHelper.isPressEnter(e)) {
                startPage = page - 1;
                clickFn && clickFn(startPage, pageSize);
            }
        });

        dGoToMain.append(dGoTo).append(dPageInput).append(dGoTo2);
        return dGoToMain;
    })();
    self.totalInfo = (function () {
        var lanPath = selfId + '.TotalRecord';
        var sLang = getInfoLang();
        var dTotalInfoMain = $('<div></div>').lId('totalInfo');
        var dTotalSpan = $('<span></span>').html(sLang);

        $.lEventEmitter.hookEvent('befSwitchLang', selfId, function () {
            var sLang = getInfoLang();
            dTotalSpan.html(sLang);
        }, {
            source: dTotalInfoMain
        });

        dTotalInfoMain.append(dTotalSpan);
        return dTotalInfoMain;

        function getInfoLang() {
            return  $.lLang.parseLanPath(lanPath)(totalCount, totalPage);
        }
    })();
    self.dPaginationMain = (function () {
        var dPaginationMain = $.lTable.createTable(1, 4);
        var dCol1 = dPaginationMain.find('td:first');
        var dCol2 = dPaginationMain.find('td:eq(1)');
        var dCol3 = dPaginationMain.find('td:eq(2)');
        var dCol4 = dPaginationMain.find('td:last');

        dPaginationMain.lId('mPaginationMain').css('width', '100%');
        dPaginationMain.find('td').css({
            'padding': '10px',
            'text-align': 'center'
        });
        switch (align) {
            case 'left':
                dCol1.append(self.dPagination);
                dCol2.append(self.totalInfo);
                dCol3.append(self.dPageSize);
                dCol4.append(self.dGoto);
                break;
            case 'right':
                dCol1.append(self.totalInfo);
                dCol2.append(self.dPageSize);
                dCol3.append(self.dGoto);
                dCol4.append(self.dPagination);
                break;
            default :
                dCol1.append(self.totalInfo);
                dCol2.append(self.dPagination);
                dCol3.append(self.dPageSize);
                dCol4.append(self.dGoto);
                break;
        }
        return dPaginationMain;
    })();
    return self.empty().append(self.dPaginationMain).show();
};