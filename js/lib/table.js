/**
 * The table lib
 * @author Caro.Huang
 */

$.lTable = (function () {
    var self = {};

    /**
     * create basic table or bootstrap table
     *
     * OPT
     * tableId: add table id
     * tableClass: add table class
     * rowClass: add each row(tr) class
     * colClass: add each column(td) class
     *
     * ex1.
     * $.lTable(1, 4)
     * create table with 1 tr / 4 td
     *
     * ex2
     * $.lTable( 2, { sm:[[2,3],4,3] } )
     * create bootstrap with 2 row
     * and the col class in row = <col-sm-2 col-sm-offset-3 ><col-sm-4><col-sm-3>
     *
     * @param row
     * @param col
     * @param [opt]
     * @returns {*}
     */
    self.createTable = function (row, col, opt) {
        var dTable = null;
        var tableId = null;
        var tableClass = null;
        var rowClass = null;
        var colClass = null;

        if (opt) {
            tableId = opt.tableId || tableId;
            tableClass = opt.tableClass || tableClass;
            rowClass = opt.rowClass || rowClass;
            colClass = opt.colClass || colClass;
        }
        if ($.lHelper.isNum(col)) {
            dTable = createTable();
        } else if ($.lHelper.isObj(col)) {
            dTable = createBootStrapTable();
        }
        if (tableId)
            dTable.lId(tableId);
        if (tableClass)
            dTable.lClass(tableClass);
        return dTable;

        function createTable() {
            dTable = $('<table></table>');
            for (var i = 0; i < row; i++) {
                var dRow = $('<tr></tr>');
                if (rowClass) {
                    dRow.lClass(rowClass);
                }
                for (var j = 0; j < col; j++) {
                    var dCol = $('<td></td>');
                    if (colClass && colClass[j]) {
                        dCol.lClass(colClass[j]);
                    }
                    dRow.append(dCol);
                    dTable['col' + i + '-' + j] = dCol;
                }
                dTable.append(dRow);
                dTable['row' + i] = dRow;
            }
            return dTable;
        }

        function createBootStrapTable() {
            dTable = $('<div></div>');
            //ex. col = { md:[4, 4, 4] } or { lg:[ [1, 2], 5, [2, 2] ] }
            var prefix = null;
            if (col.xs)
                prefix = 'xs';
            if (col.sm)
                prefix = 'sm';
            if (col.md) {
                prefix = 'md';
            }
            if (col.lg) {
                prefix = 'lg';
            }
            // declare bootstrap table
            for (var i = 0; i < row; i++) {
                var dRow = $('<div></div>').lClass('row');
                if (rowClass) {
                    dRow.lClass(rowClass);
                }
                $.each(col[prefix], function (j, col) {
                    var dCol = $('<div></div>');
                    if (colClass && colClass[j]) {
                        dCol.lClass(colClass[j]);
                    }
                    if (!$.lHelper.isArr(col)) {
                        dCol.lClass('col-' + prefix + '-' + col);
                    } else {
                        var span = col[0];
                        var offset = col[1];
                        dCol.lClass('col-' + prefix + '-' + span).lClass('col-' + prefix + '-offset-' + offset);
                    }
                    dRow.append(dCol);
                    dTable['col' + i + '-' + j] = dCol;
                });
                dTable.append(dRow);
                dTable['row' + i] = dRow;
            }
            return dTable;
        }
    };

    return self;
})();