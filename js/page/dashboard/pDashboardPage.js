$.fn.pDashboardPage = function () {
    var self = this;
    var selfId = 'pDashboard';
    var dContainer = $('#container');
    var dHeader = $('#header');
    var dTable = (function () {
        var dTable = $.lTable.createTable(2, 5).css({
            'width': '100%',
            'height': tableHeight
        }).lClass(selfId + 'Table');
        dTable.find('td').css({
            'vertical-align': 'top',
            'padding': 5
        });
        return dTable;
    })();
    var containerX = dContainer.position().left;
    var containerWidth = dContainer.width();
    var headerHeight = dHeader.height();
    var tableHeight = 500;
    var groupTotal = 0;

    $.each($.pDashboard.aDashboardFn, function (i, opt) {
        var groupName = opt.groupName;
        var groupTitle = opt.groupTitle;
        var fn = opt.fn;
        var dGroupDashboard = (function () {
            var dashbaordKeyX = 'dashboard-' + groupName + '-x';
            var dashbaordKeyY = 'dashboard-' + groupName + '-y';
            var dGroupDashboard = $('<div></div>')
                .lId(selfId + '-' + groupName)
                .lClass('basic-block')
                .css({
                    'padding': '0px 20px 20px 12px',
                    'min-width': 200,
                    'min-height': 150
                })
                .on('mouseover', function () {
                    dGroupDashboard.css('cursor', 'move');
                })
                .on('mouseup', function () {
                    // set cookie-position-value
                    var x = dGroupDashboard.position().left;
                    var y = dGroupDashboard.position().top;
                    $.lCookie.set(dashbaordKeyX, x);
                    $.lCookie.set(dashbaordKeyY, y);
                })
                .on('mousedown', function () {
                    dGroupDashboard.setIndexZ();
                })
                .draggable({ containment: [ containerX, headerHeight, containerWidth, tableHeight ] });
            var dCol = (function () {
                // get index that group should be placed
                var nowRow = Math.floor(groupTotal / 10);
                var nowCel = groupTotal % 10;
                groupTotal++;
                return dTable.find('tr:eq(' + nowRow + ')').find('td:eq(' + nowCel + ')');
            })();
            var dGroupTitle = (function () {
                return $('<h4></h4>')
                    .lClass('basic-title')
                    .html(groupTitle);
            })();
            (function setDefault() {
                var cookieX = $.lCookie.get(dashbaordKeyX);
                var cookieY = $.lCookie.get(dashbaordKeyY);
                if (cookieX) {
                    dGroupDashboard.css({
                        position: 'absolute',
                        left: cookieX + 'px',
                        top: cookieY + 'px'
                    });
                }
                dGroupDashboard.append(dGroupTitle);
                dCol.append(dGroupDashboard);
            })();

            dGroupDashboard.setLink = function (linkContent, linkFn) {
                var dLinkMain = (function () {
                    var dLinkMain = $('<div></div>').css('padding', '3px');
                    var dLink = $.lDom.createLink('', '#');
                    dLink.html(linkContent);
                    dLink.action('click', linkFn);
                    dLinkMain.append(dLink);
                    return dLinkMain;
                })();
                dGroupDashboard.append(dLinkMain);
                dLinkMain.hide().fadeIn();
            };
            return dGroupDashboard;
        })();
        fn && fn(dGroupDashboard);
    });
    self.append(dTable);
    return self;
};