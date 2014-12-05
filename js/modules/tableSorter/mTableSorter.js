/**
 * The table sorter module
 * v1.0
 * @author Caro.Huang
 */


/**
 * !!! This will disable all actions in <th>
 * add table-sorter by 3rd-party [3rd party jquery-tableSorter]
 * please read [https://github.com/Mottie/tablesorter]
 *
 * OPT
 * disable: int arr, the column-index of table-head you want to disable sort
 * sortBegin: fire on fn when sort Begin
 * sortEnd: fire on fn when sort end
 */
$.fn.mTableSorter = function (opt) {
    var self = this;
    var aTh = self.find('th');
    var setBtnStyle = function (thDom) {
        thDom.css('cursor', 'pointer');
        thDom.on('click', function () {
            thDom.parent().find('th .tablesorter-header-inner').nextAll('.tablesorter-arrow, .tablesorter-blank').remove();
            var inner = thDom.find('.tablesorter-header-inner');
            var icon = null;
            var blankSpan = $('<span>&nbsp;&nbsp;</span>').lClass('tablesorter-blank');
            inner.css('float', 'left');
            if (thDom.hasClass('tablesorter-headerAsc')) {
                icon = $.lDom.createIcon('chevron-up');
            } else if (thDom.hasClass('tablesorter-headerDesc')) {
                icon = $.lDom.createIcon('chevron-down');
            }
            if (icon) {
                icon.lClass('tablesorter-arrow');
            }
            inner.after(icon).after(blankSpan);
        });
    };


    self.tablesorter(opt);
    (function disableColAndSetBtn() {
        var disable = [];
        disable = opt.disable || disable;
        aTh.each(function (i, th) {
            th = $(th);
            if (disable.indexOf(i) > -1) {
                // see example [http://mottie.github.io/tablesorter/docs/example-options-headers.html]
                th.data('sorter', false);
                return;
            }
            setBtnStyle(th);
        });
    })();
    // bind sortBegin-event
    self.bind('sortBegin', function () {
        opt && opt.sortBegin && opt.sortBegin();
    });

    self.bind('sortEnd', function () {
        opt && opt.sortEnd && opt.sortEnd();
    });

    // update the table sorter when table changed
    self.trigger('update', [true]);
    return self;
};