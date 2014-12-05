/**
 * The crumbs module
 * v1.2
 * @author Caro.Huang
 */

$.lEventEmitter.hookEvent('befContainerSwitch', 'mCrumbs', function () {
    $.mCrumbs.removeAllCrumbs();
    $.mCrumbs.unRegCrumb();
});

$.mCrumbs = (function () {
    var self = {};
    var selfId = 'mCrumbs';
    var oaCrumb = {};

    /**
     * append crumb-DOM
     */
    self.render = function () {
        // remove crumbs if exists
        self.removeAllCrumbs();
        if ($.lObj.getObjLength(oaCrumb) < 1) {
            return;
        }
        var dHeaderBottom = $('#headerBottom');
        var dCrumbsMain = (function () {
            var dCrumbsMain = $('<div></div>')
                .lId(selfId)
                .css({
                    float: 'left',
                    'margin-top': 15,
                    'margin-bottom': 10
                });
            return dCrumbsMain;
        })();
        $.each(oaCrumb, function (i, opt) {
            var id = opt.id;
            var langPath = opt.langPath;
            var clickFn = opt.clickFn;
            var disable = opt.disable;
            // check if link status
            var linkSituation = clickFn && !disable;
            var dCrumb = (function () {
                var dCrumb = $('<span></span>')
                    .lId(selfId + '-' + id)
                    .css({
                        'padding': '5px',
                        'margin-left': 5,
                        'margin-right': 5,
                        'color': '#ffffff',
                        'border-radius': '4px'
                    });

                if ($.lHelper.isFn(langPath)) {
                    dCrumb.html($.lHelper.executeIfFn(langPath));
                    $.lEventEmitter.hookEvent('befSwitchLang', selfId, function () {
                        dCrumb.html($.lHelper.executeIfFn(langPath));
                    }, dCrumb);
                }
                else {
                    dCrumb.lSetLang(langPath);
                }

                if (linkSituation) {
                    dCrumb.lClass('label-primary');
                    dCrumb.action('click', clickFn);
                } else {
                    dCrumb.lClass('label-default');
                }

                dCrumb
                    .on('mouseover', function () {
                        if (linkSituation) {
                            dCrumb.toggleClass('label-primary label-info');
                            dCrumb.css('cursor', 'pointer');
                        } else {
                            dCrumb.css('cursor', 'default');
                        }
                    })
                    .on('mouseout', function () {
                        if (linkSituation) {
                            dCrumb.toggleClass('label-primary label-info');
                        }
                    });
                return dCrumb;
            })();
            dCrumbsMain.append(dCrumb);
        });
        dHeaderBottom.append(dCrumbsMain);
    };

    /**
     * remove crumbs-DOM
     */
    self.removeAllCrumbs = function () {
        var dCrumbsMain = $('#' + selfId);
        if (dCrumbsMain.length > 0) {
            dCrumbsMain.remove();
        }
    };

    /**
     * enable assigned-crumb by id or enable all crumbs
     * @param id
     */
    self.enable = function (id) {
        if (id) {
            oaCrumb[id].disable = false;
            return;
        }
        $.each(oaCrumb, function (id) {
            oaCrumb[id].disable = false;
        });
    };

    /**
     * disable assigned-crumb by id
     * or disable all crumbs
     * @param [id]
     */
    self.disable = function (id) {
        if (id) {
            oaCrumb[id].disable = true;
            return;
        }
        $.each(oaCrumb, function (id) {
            oaCrumb[id].disable = true;
        });
    };

    /**
     * register sub-crumb
     * @param id
     * @param langPath
     * @param [clickFn]
     */
    self.regCrumb = function (id, langPath, clickFn) {
        var opt = {
            id: id,
            langPath: langPath,
            clickFn: clickFn,
            disable: false
        };
        oaCrumb[id] = (opt);
    };

    /**
     * remove reg-Crumb from oaCrumb by reg-id
     * or remove all crumbs
     * @param [saId]: str/arr
     */
    self.unRegCrumb = function (saId) {
        if (saId) {
            // cover str to arr
            if ($.lHelper.isStr(saId)) {
                saId = [saId];
            }
            $.each(saId, function (i, id) {
                delete oaCrumb[id];
            });
            return;
        }
        oaCrumb = {};
    };

    return self;
})();