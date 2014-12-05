$.fn.pUserList = function () {
    var self = this;
    var pageSizeName = 'userListPageSize';
    var pageSize = $.lCookie.get(pageSizeName);
    if (!$.lUtil.goIndexIfAuthPmsFailed($.pUser.pagePms)) {
        return self;
    }
    if (pageSize) {
        $.pUserListOpt.pageSize = pageSize;
    }
    var dUserListFn = function () {
        var dList = self.find('#list');
        var oUserList = null;
        $.ajax.user.getUserListAJ($.pUserListOpt, function (res) {
            $.lAjax.parseRes(res, function (result) {
                oUserList = $.lObj.cloneObj(result);
            });
        });
        $.lConsole.log('oUserList=', oUserList);
        if (!oUserList) {
            return dList;
        }
        (function dCreateBtn() {
            var dCreateBtn = dList.find('#createBtn');
            dCreateBtn.mBtn('create', function () {
                $.lUtil.goPage($.pUser.userCreatePath);
            });
            return dCreateBtn;
        })();
        (function dUserListTable() {
            var oaUser = oUserList.results;
            var dUserListTable = dList.find('#userListTable');
            dUserListTable.mListTable(oaUser, function (oUser) {
                return tmd.pUser(oUser);
            }, function (i, oUser, dEachDom) {
                (function setIndex() {
                    var dIndex = dEachDom.find('.index');
                    dIndex.html(($.pUserListOpt.startPage * $.pUserListOpt.pageSize) + i + 1);
                })();
                (function setStatus() {
                    var dStatus = dEachDom.find('.status');
                    var langPath = 'pUser.list.status.' + oUser.status;
                    dStatus.lSetLang(langPath);
                })();
                (function setUpdateBtn() {
                    var dUpdateBtn = dEachDom.find('.updateBtn');
                    var uid = oUser.uid;
                    dUpdateBtn.mBtn('edit', function () {
                        var userOpt = {
                            uid: uid
                        };
                        $.lUtil.goPage($.pUser.userEditPath, userOpt);
                    });
                })();
            });
            return dUserListTable;
        })();
        (function dPagination() {
            var dPagination = dList.find('#pagination');
            var startPage = oUserList.currentPageNumber;
            var pageSize = oUserList.pageSize;
            var totalCount = oUserList.totalCount;
            var totalPage = oUserList.totalPages;
            var opt = {
                startPage: startPage,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPage: totalPage,
                clickFn: function (page, pageSize) {
                    $.pUserListOpt.startPage = page;
                    $.pUserListOpt.pageSize = pageSize;
                    $.lCookie.set(pageSizeName, pageSize);
                    dUserListFn();
                }
            };
            dPagination.mPagination(opt);
            return dPagination;
        })();
        return dList;
    };
    (function dSearch() {
        var dSearch = self.find('#search');
        var searchFn = function () {
            $.pUserListOpt.startPage = 0;
            var mSearch = $.lForm.coverToModel(dSearch);
            $.extend($.pUserListOpt, mSearch);
            dUserListFn();
        };
        (function dSearchInputs() {
            var dSearchInputs = dSearch.find(':input');
            dSearchInputs.onPressEnter(function () {
                searchFn();
            });
            return dSearchInputs;
        })();
        (function dSearchBtn() {
            var dSearchBtn = dSearch.find('#searchBtn');
            dSearchBtn.mBtn('search', function () {
                searchFn();
            });
            return dSearchBtn;
        })();
        (function dResetBtn() {
            var dResetBtn = dSearch.find('#resetBtn');
            dResetBtn.mBtn('clean', function () {
                $.lForm.clean(dSearch);
            });
            return dResetBtn;
        })();
        $.lModel.mapDom($.pUserListOpt, dSearch);
        return dSearch;
    })();
    dUserListFn();
    return self;
};