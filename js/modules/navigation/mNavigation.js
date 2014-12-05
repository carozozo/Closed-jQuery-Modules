/**
 * The Travel Global navigation module
 * v2.4
 * @author Caro.Huang
 */

// the -99999 is want to be first init
$.init(function () {
    var dHeaderTop = $('#headerTop');
    if (!dHeaderTop.length) {
        return;
    }
    if (dHeaderTop.find('#' + $.mNav.navId).length) {
        return;
    }
    $.mNav.unRegNav();
    dHeaderTop.append($.mNav);
}, -99999);

// the 99998 is want to be 2nd-last init
$.init(function () {
    $.mNav.renderNavHeader();
    $.mNav.renderNav();
}, 99998);


$.mNav = (function () {
    var headerOpt = {};
    var aLeftTabOpt = {};
    var aRightTabOpt = {};

    var selfId = 'mNav';
    var navHeaderId = selfId + 'Header';
    var navLeftId = selfId + 'Left';
    var navRightId = selfId + 'Right';
    var navTabClass = selfId + 'Tab';
    var navTabIconClass = selfId + 'TabIcon';
    var navTabTitleClass = selfId + 'TabTitle';
    var navDropDownClass = selfId + 'DropDown';
    var navDropDownItemClass = selfId + 'DropDownItem';
    var clickEventName = 'click.' + selfId;
    var mouseEnterEventName = 'mouseenter.' + selfId;
    var mouseLeaveEventName = 'mouseleave.' + selfId;
    var self = $('<nav></nav>').lClass('navbar navbar-default').lId(selfId).attr('role', 'navigation');
    var createNavTab = function (opt) {
        var id = opt.id;
        var dIcon = null;
        var dTab = {};

        var clickFn = opt.click || null;
        var iconId = opt.iconId || null;
        var title = opt.title || null;
        var titleLangPath = opt.titleLangPath || null;
        var inLogged = opt.inLogged || false;
        var cb = opt.cb || null;
        var dropDownItems = opt.dropDownItems || [];
        var dTabFn = function () {
            var dTab = $('<li></li>').lClass('navTab small').lId(navTabClass + '-' + id);
            var dTitleMain = $.lDom.createLink('');
            var dTitle = $('<span></span>')
                .lClass(navTabTitleClass)
                .lId(navTabTitleClass + '-' + id);
            if (title) {
                if ($.lHelper.isFn(title)) {
                    var setTitleFn = function () {
                        var sTitle = title();
                        dTitle.html(sTitle);
                    };
                    setTitleFn();
                    $.lEventEmitter.hookEvent('befSwitchLang', selfId, function () {
                        setTitleFn();
                    }, {
                        source: dTab
                    });
                }
                else {
                    dTitle.html(title);
                }
            }
            if (titleLangPath) {
                dTitle.lSetLang(titleLangPath);
            }
            if (iconId) {
                dIcon = $.lDom.createIcon(iconId)
                    .lClass(navTabIconClass)
                    .lId(navTabIconClass + '-' + id);
                dTitleMain.append(dIcon).append('&nbsp;');
                dTab.dIcon = dIcon;
            }
            dTitleMain.append(dTitle);
            dTab.append(dTitleMain);

            // add dropable css
            dTab.droppable({
                accept: '.navTab',
                activeClass: 'basic-bg-gray2'
            });

            // set Tab-DOM to opt
            dTab.dTitleMain = dTitleMain;
            dTab.dTitle = dTitle;
            return  dTab;
        };
        var dDropDownFn = function () {
            var dDropDownTab = dTabFn();
            var dCaret = $('<strong></strong>').lClass('caret');
            // class-name [dropdown-menu] is used for bootstrap, [3rd party bootstrap-select] used same class-name
            var dDropDown = $('<ul></ul>')
                .lId(navDropDownClass + '-' + id)
                .lClass(navDropDownClass + ' dropdown-menu');

            dDropDownTab
                .on(mouseEnterEventName, function () {
                    $('.' + navDropDownClass).hide();
                    dDropDown.fadeIn();
                })
                .on(mouseLeaveEventName, function () {
                    dDropDown.hide();
                });
            $.each(dropDownItems, function (i, itemOpt) {
                var dDropDownItem = createDropDownItem(dDropDown, itemOpt);
                dDropDown.append(dDropDownItem);
            });

            dDropDownTab.dTitleMain.append(dCaret);
            dDropDownTab.append(dDropDown);
            return dDropDownTab;
        };
        if (inLogged && !$.lUtil.isLogon()) {
            return dTab;
        }
        if (dropDownItems.length > 0) {
            dTab = dDropDownFn();
        } else {
            dTab = dTabFn();
            if (clickFn) {
                dTab.on(clickEventName, clickFn);
            }
        }
        cb && cb(dTab);
        return dTab;
    };
    var createDropDownItem = function (dDropDown, itemOpt) {
        var id = itemOpt.id;
        var title = itemOpt.title;
        var titleLangPath = itemOpt.titleLangPath;
        var iconId = itemOpt.iconId;
        var clickFn = itemOpt.click;
        var cbFn = itemOpt.cb;

        var dItemMain = $('<li></li>')
            .lClass(navDropDownItemClass)
            .lId(navDropDownItemClass + '-' + id);
        var dLiA = $.lDom.createLink('');
        var dIcon = null;
        if (iconId) {
            dIcon = $.lDom.createIcon(iconId);
            dLiA.append(dIcon).append('&nbsp;');
        }
        var dLiAContent = $('<strong></strong>');

        if (title) {
            if ($.lHelper.isFn(title)) {
                var setTitleFn = function () {
                    var sTitle = title();
                    dLiAContent.html(sTitle);
                };
                setTitleFn();
                $.lEventEmitter.hookEvent('befSwitchLang', selfId, function () {
                    setTitleFn();
                }, {
                    source: dItemMain
                });
            } else {
                dLiAContent.html(title);
            }
        }

        if (titleLangPath) {
            dLiAContent.lSetLang(titleLangPath);
        }
        dItemMain
            .on(clickEventName, function () {
                dDropDown.slideUp();
                clickFn && clickFn();
            });
        dLiA
            .append(dLiAContent)
            .appendTo(dItemMain);
        cbFn && cbFn(dItemMain);

        return dItemMain;
    };

    (function () {
        var dNavHeader = (function () {
            return $('<div></div>').lClass('navbar-header').lId(navHeaderId);
        })();
        var dNavLeft = (function () {
            return $('<ul></ul>').lClass('nav navbar-nav navbar-left').lId(navLeftId);
        })();
        var dNavRight = (function dNavRightFn() {
            return $('<ul></ul>').lClass('nav navbar-nav navbar-right')
                .lId(navRightId).css('margin-right', '5px');
        })();

        self.append(dNavHeader).append(dNavLeft).append(dNavRight);
        self.dNavHeader = dNavHeader;
        self.dNavLeft = dNavLeft;
        self.dNavRight = dNavRight;
    })();

    self.regNavHeader = function (content, clickFn) {
        headerOpt = {
            content: content,
            click: clickFn
        };
    };
    /**
     * reg a nav tab/dropdown
     *
     * OPT
     * side - right/left (default: left) - the tab side
     * title - str/fn (default: null) - the tab-title
     * titleLangPath - str (default: null) - the language path you want to change with localisation
     * inLogged - bool (default: false) - if only set tab when user is logged-in
     * order - inf (default: 0) - the tab order, lefter with smaller
     * click - fn (default: null) - fire fn when clicked
     * cb - fn (default: null) - callback function after append tab
     * dropDownItems - ITEM-OPT-array
     *
     * ITEM-OPT = {
     *      id: str (default: '') - item id
     *      title: str/fn (default: '') - item title
     *      titleLangPath: str (default: '') - item title-langPath for switch locality
     *      iconId: str (default: '') - the icon's id if want to show icon( bootstrap )
     *      click: fn (default: null) - fire fn when clicked
     *      cb: fn (default: null) - fire fn after item-Dom created
     *  }
     *
     * ex.
     * $.mNav.regNav('a', {title:'PageA', side: 'left', order: 0})
     * will create a tab with title 'PageA', the attr id = ''navTab-a' at left side
     *
     * ex2.
     * $.mNav.regNav('a', {title:'PageA', side: 'right', order: 0})
     * $.mNav.regNav('b', {title:'PageB', side: 'right', order: 100})
     * $.mNav.regNav('c', {title:'PageC', side: 'right', order: 50})
     * the tab order will be [PageA][PageC][PageB] at right side
     *
     * ex3.
     * $.mNav.regNav('someId', {
     *      side: 'right',
     *      titleLangPath: 'someLangPAth',
     *      order: 0,
     *      dropDownItems: [{id: 'xxx', title: 'xxx', titleLangPath: 'xxx', click: function(){} },
     *      {id: 'xxx', title: 'xxx', titleLangPath: 'xxx', click: function(){}, cb: function(){} }]
     * });
     *
     * @param id
     * @param opt
     */
    self.regNav = function (id, opt) {
        var side = 'left';
        side = opt.side ? opt.side : side;
        opt.id = id;
        if (side === 'left') {
            // ex. $.mNav.aLeftTabOpt.users = {order:0, dTab:_DOM, cb:fn}
            aLeftTabOpt[id] = opt;
        } else {
            aRightTabOpt[id] = opt;
        }
    };
    /**
     * remove registered tab by id/side
     * @param [idOrSide]
     */
    self.unRegNav = function (idOrSide) {
        if (!idOrSide) {
            aLeftTabOpt = {};
            aRightTabOpt = {};
            return;
        }
        if (idOrSide === 'left') {
            aLeftTabOpt = {};
            return;
        }
        if (idOrSide === 'right') {
            aRightTabOpt = {};
            return;
        }
        if (aLeftTabOpt[idOrSide]) {
            delete aLeftTabOpt[idOrSide];
        }
        else if (aRightTabOpt[idOrSide]) {
            delete aRightTabOpt[idOrSide];
        }
    };
    self.renderNavHeader = function () {
        var content = headerOpt.content || null;
        var clickFn = headerOpt.click || null;
        self.dNavHeader.empty().append(content).on(clickEventName, function () {
            clickFn && clickFn();
        });
    };
    /**
     * render registered tab to html DOM, and the left-tabs sortable
     * you can render by side(left/right/register-id),or render all
     * @param [idOrSide]
     */
    self.renderNav = function (idOrSide) {
        var renderNavById = function (id) {
            var tabOpt = aLeftTabOpt[id];
            var side = 'left';
            if (aRightTabOpt[id]) {
                tabOpt = aRightTabOpt[id];
                side = 'right';
            }
            var dTab = createNavTab(tabOpt);
            var dOriTab = $('#' + navTabClass + '-' + id);
            if (dOriTab.length) {
                // replace original tab
                dOriTab.after(dTab).remove();
                return;
            }
            // no original tab, replace side (by order)
            renderNavBySide(side);
        };

        var renderNavBySide = function (side) {
            var dSide = (side === 'left') ? self.dNavLeft : self.dNavRight;
            var aSideOpt = [];
            var oClickFn = {};
            var aOriginSideOpt = (side === 'left') ? aLeftTabOpt : aRightTabOpt;
            $.each(aOriginSideOpt, function (id, opt) {
                // get sorted order from cookie if exists
                var cookieOrder = $.lCookie.get('navOrder-' + id);
                if (cookieOrder > -1) {
                    opt.order = cookieOrder;
                }
                aSideOpt.push(opt);
                oClickFn[id] = opt.click;
            });
            // sort by order
            aSideOpt.sortByObjKey('order');
            dSide.empty();
            $.each(aSideOpt, function (i, opt) {
                var id = opt.id;
                var dTab = self.getTab(id);
                // remove original tab
                if (dTab.length) {
                    dTab.remove();
                }
                dTab = createNavTab(opt);
                dSide.append(dTab);
            });

            var sortableOpt = {
                cursor: 'move',
                revert: true,
                tolerance: 'pointer',
                start: function () {
                    // disable click even when sort start
                    $.each(aSideOpt, function (i, opt) {
                        var id = opt.id;
                        var dTab = self.getTab(id);
                        dTab.off(clickEventName);
                    });
                },
                stop: function () {
                    $.each(aSideOpt, function (i, opt) {
                        var id = opt.id;
                        var dTab = self.getTab(id);
                        if (oClickFn[id]) {
                            // rebuild click even
                            dTab.on(clickEventName, oClickFn[id]);
                        }
                        // set sorted order to cookie
                        $.lCookie.set('navOrder-' + id, dTab.index());
                    });
                }
            };
            // create sortable for left menu
            dSide.sortable(sortableOpt).disableSelection();
        };

        if (idOrSide) {
            if (idOrSide === 'left' || idOrSide === 'right') {
                renderNavBySide(idOrSide);
                return;
            }
            renderNavById(idOrSide);
            return;
        }
        renderNavBySide('left');
        renderNavBySide('right');
    };
    /**
     * add drop-down-item dynamically
     * inIndex - 'first'/'last'/int - set item in by index
     * @param id
     * @param itemOpt
     * @param [inIndex]
     */
    self.addDropDownItem = function (id, itemOpt, inIndex) {
        var dDropDown = self.getDropDown(id);
        var dDropDownItems = dDropDown.find('.' + navDropDownItemClass);
        if (!dDropDown) {
            return;
        }
        var dropDownItem = createDropDownItem(dDropDown, itemOpt);
        if (inIndex === 'first') {
            dDropDown.prepend(dropDownItem);
        }
        else if (inIndex === 'last' || !inIndex) {
            dDropDown.append(dropDownItem);
        }
        else if ($.lHelper.isNum(inIndex)) {
            var targetDropDownItem = dDropDownItems[inIndex];
            if (!targetDropDownItem) {
                return;
            }
            targetDropDownItem.before(dropDownItem);
        }
    };
    self.getHeader = function () {
        return self.find('#', navHeaderId);
    };
    self.getLeft = function () {
        return self.find('#', navLeftId);
    };
    self.getRight = function () {
        return self.find('#', navRightId);
    };
    self.getTab = function (id) {
        return self.find('#' + navTabClass + '-' + id);
    };
    self.getTabIcon = function (id) {
        var dTab = self.getTab(id);
        return dTab.find('#' + navTabIconClass + '-' + id);
    };
    self.getTabTitle = function (id) {
        var dTab = self.getTab(id);
        return dTab.find('#' + navTabTitleClass + '-' + id);
    };
    self.getDropDown = function (id) {
        return self.find('#' + navDropDownClass + '-' + id);
    };
    self.getDropDownItem = function (id, itemId) {
        var dNavDropDown = self.getDropDown(id);
        return dNavDropDown.find('#' + navDropDownItemClass + '-' + itemId);
    };
    self.navId = selfId;
    return self;
})();