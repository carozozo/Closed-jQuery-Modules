/**
 * page-history module
 * v2.0
 * @author Caro.Huang
 */

$.init(function () {
    $.mPageHistory.setHistoryLink();
}, 9997);


$.mPageHistory = (function () {
    var self = {};
    var selfId = 'mPageHistory';
    // TODO set history-records if get from DB(for DB test)
    var historyByDb = false;

    /**
     * get pageHistory(by cookie)
     * return [] if nothing,return page-obj if set index and found
     * @param [index]
     * @returns {*}
     */
    var getPageHistory = function (index) {
        var oaPageHistory = null;
        if (historyByDb) {
            var opt = {
                uid: $.tSysVars.userInfo.uid
            };
            $.ajax.mPageHistory.getPageHistoryByUidAJ(opt, function (res) {
                $.lAjax.parseRes(res, function (result) {
                    if (result) {
                        oaPageHistory = result.pageHistory;
                    }
                }, function () {
                    oaPageHistory = $.lCookie.get('oaPageHistory');
                    historyByDb = false;
                });
            });
        } else {
            oaPageHistory = $.lCookie.get('oaPageHistory');
        }
        if (!oaPageHistory) {
            return [];
        }
        // return obj-arr
        if (!$.lHelper.isNum(index)) {
            return oaPageHistory;
        }
        // return obj
        if (oaPageHistory[index]) {
            return oaPageHistory[index];
        }
        return [];
    };

    /**
     * set pageHistory(by cookie), the newest page at index-0
     * should like:
     * [{page:xxx, vars:xxx},{page:xxx, vars:xxx}]
     * @param oPreviewPage
     */
    var setPageHistory = function (oPreviewPage) {
        var oaPageHistory = getPageHistory();
        var pageHistoryLength = oaPageHistory.length;
        if (pageHistoryLength) {
            var previewPage = oPreviewPage.page;
            var firstPage = oaPageHistory[0].page;
            if (previewPage === firstPage) {
                return false;
            }
        }

        // emit custom even
        var emitObj = {
            previewPage: oPreviewPage,
            oaPageHistory: oaPageHistory
        };
        if ($.lEventEmitter.emitEvent('befSetPageHistory', emitObj) === false) {
            return false;
        }

        oaPageHistory.unshift(oPreviewPage);
        // keep oaPageHistory length = 10
        if (pageHistoryLength > 9) {
            // remove first-history
            oaPageHistory.pop();
        }

        if (historyByDb) {
            var opt = {
                uid: $.tSysVars.userInfo.uid,
                pageHistory: oaPageHistory
            };
            $.ajax.mPageHistory.insertPageHistoryByUidAJ(opt, function (res) {
                $.lAjax.parseRes(res, function () {
                }, function () {
                    $.lCookie.set('oaPageHistory', oaPageHistory);
                    historyByDb = false;
                })
            });
        } else {
            $.lCookie.set('oaPageHistory', oaPageHistory);
        }

        $.lEventEmitter.emitEvent('aftSetPageHistory', emitObj);
        return true;
    };

    $.lEventEmitter.hookEvent('aftLogin', selfId, function () {
        // clean history after login
        self.cleanPageHistory();
    });

    $.lEventEmitter.hookEvent('aftSetPreviewPage', selfId, function (e) {
        var ifSetHistory = setPageHistory(e.previewPage);
        if (!ifSetHistory) {
            return;
        }
        // re-set history-link
        var ifSetHistoryLink = self.setHistoryLink();
        if (!ifSetHistoryLink) {
            return;
        }
        // refresh navigation
        $.mNav.renderNav(selfId);
    });

    self.cleanPageHistory = function () {
        if (historyByDb) {
            $.ajax.mPageHistory.removeAllPageHistoryAJ(function (res) {
                $.lAjax.parseRes(res, function () {
                }, function () {
                    $.lCookie.set('oaPageHistory', []);
                    historyByDb = false;
                })
            });
        } else {
            $.lCookie.set('oaPageHistory', []);
        }
    };

    self.setHistoryLink = function () {
        if (!$.lUtil.isLogon()) {
            return self;
        }
        var oaPageHistory = getPageHistory();
        var pageHistoryLength = oaPageHistory.length;
        if (pageHistoryLength < 2) {
            $.mNav.unRegNav(selfId);
            return false;
        }
        // remove first-record
        var firstHistory = oaPageHistory.shift();
        var items = [];
        $.each(oaPageHistory, function (i, oPageHistory) {
            var page = oPageHistory.page;
            var vars = oPageHistory.vars;
            var oPageInfo = $.tPageInfo[page];
            var langPathTitle = oPageInfo.title;
            var item = {
                id: selfId + i,
                iconId: 'share-alt',
                titleLangPath: langPathTitle,
                click: function () {
                    $.lUtil.goPage(page, vars);
                }
            };
            items.push(item);
        });
        if (items.length) {
            // add clean-item
            items.push({
                id: 'cleanHistory',
                iconId: 'trash',
                titleLangPath: 'mPageHistory.CleanHistory',
                click: function () {
                    self.cleanPageHistory();
                    // keep first-record (now-page)
                    setPageHistory(firstHistory);
                    var dTab = $.mNav.getTab(selfId);
                    dTab.fadeOut();
                },
                cb: function (dItem) {
                    dItem.css('color', '#ffffff');
                    dItem.lClass('basic-bg-gray2');
                }
            });

            var opt = {
                side: 'right',
                titleLangPath: 'mPageHistory.History',
                dropDownItems: items,
                order: 9999,
                inLogged: true
            };
            $.mNav.regNav(selfId, opt);
            return true;
        }
        return false;
    };
    return self;
})();