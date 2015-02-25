/**
 * the l18n with Pagination module
 * @author Caro.Huang
 */

$.tLan.mPagination = {};
$.tLan.mPagination.en_us = {
    GoTo: 'Go to page ',
    Page: ' ',
    ShowRecord1: 'Show ',
    ShowRecord2: ' records each page',
    /**
     * @param totalRecord
     * @returns {string}
     * @param totalPage
     * @constructor
     */
    TotalRecord: function (totalRecord, totalPage) {
        var sRecord = ' record';
        var sPage = ' page';
        if (totalRecord > 1) {
            sRecord += 's';
        }
        if (totalPage > 1) {
            sPage += 's';
        }
        return 'Total ' + totalRecord + sRecord + ' / ' + totalPage + sPage;
    }
};

$.tLan.mPagination.zh_cn = {
    GoTo: '跳转到第 ',
    Page: ' 页',
    ShowRecord1: '每页显示 ',
    ShowRecord2: ' 笔',
    /**
     * @param record
     * @returns {string}
     * @param totalPage
     * @constructor
     */
    TotalRecord: function (record, totalPage) {
        return '总共 ' + record + ' 笔 / ' + totalPage + ' 页';
    }
};

$.tLan.mPagination.zh_tw = {
    GoTo: '跳轉到第 ',
    Page: ' 页',
    ShowRecord1: '每頁顯示 ',
    ShowRecord2: ' 筆',
    /**
     * @param record
     * @returns {string}
     * @param totalPage
     * @constructor
     */
    TotalRecord: function (record, totalPage) {
        return '總共 ' + record + ' 筆 / ' + totalPage + ' 頁';
    }
};
