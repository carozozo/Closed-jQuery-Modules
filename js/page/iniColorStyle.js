/**
 * initial oa-web basic color style, mapping with /css/basic.css
 * @author Caro.Huang
 */
$.init(function () {
    (function setColorStyle() {
        // set basic-color
        var aColor = ['green', 'blue', 'red', 'orange', 'gray'];
        for (var i = 1; i < 5; i++) {
            var level = (i != 1) ? i : '';
            $.each(aColor, function (i, color) {
                var oColorStyle = {
                    'color': $.lColorStyle.getColor(color, level)
                };
                $.lColorStyle.addStyle('.basic-color-' + color + level, oColorStyle);

                var oBgColorStyle = {
                    'background-color': $.lColorStyle.getColor(color, -level)
                };
                $.lColorStyle.addStyle('.basic-bg-' + color + level, oBgColorStyle);
            });
        }
    }());

    (function () {
        $.lColorStyle.addStyle('.basic-color-white', {
            'color': $.lColorStyle.getWhite()
        });
    }());

    (function () {
        $.lColorStyle.addStyle('.basic-title', {
            'color': $.lColorStyle.getColor('green'),
            'border-bottom-color': $.lColorStyle.getColor('gray', 2)
        });
        $.lColorStyle.addStyle('.basic-title2', {
            'color': $.lColorStyle.getColor('gray', 4),
            'border-bottom-color': $.lColorStyle.getColor('gray', 2)
        });
    }());

    (function () {
        $.lColorStyle.addStyle('.basic-link-bg:hover', {
            'background-color': $.lColorStyle.getColor('gray', 2)
        });
    }());

    (function () {
        $.lColorStyle.addStyle('.basic-block, .basic-block-in, .basic-block-out', {
            'background-color': $.lColorStyle.getWhite(),
            'border-color': $.lColorStyle.getColor('gray', 2)
        });
        $.lColorStyle.addStyle('.basic-block2', {
            'background-color': $.lColorStyle.getWhite()
        });
    }());
});