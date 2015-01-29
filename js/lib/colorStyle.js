/**
 * The color-style lib
 * support basic-color-type [green/blue/red/orange/gray]
 * and each color-level is more darker by default
 *
 * ex.
 * var green1 = $.lColorStyle.getColor('green');
 * var green2 = $.lColorStyle.getColor('green', 2);
 *
 * result:
 * green1 = '#89c859';
 * green2 = '#63a233'; (darker than green1)
 *
 * @author Caro.Huang
 */

$.lColorStyle = (function () {
    var self = {};
    var green = '#89c859';
    var blue = '#428bca';
    var red = '#d9534f';
    var orange = '#f0ad4e';
    var gray = '#828282';
    var oColor = {
        green: green,
        blue: blue,
        red: red,
        orange: orange,
        gray: gray
    };

    var pad = function pad(num, totalChars) {
        var pad = '0';
        num = num + '';
        while (num.length < totalChars) {
            num = pad + num;
        }
        return num;
    };

    // Ratio is between 0 and 1
    var changeColor = function (color, ratio, useDarker) {
        // Trim trailing/leading whitespace
        color = color.replace(/^\s*|\s*$/, '');

        // Expand three-digit hex
        color = color.replace(
            /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
            '#$1$1$2$2$3$3'
        );

        // Calculate ratio
        var difference = Math.round(ratio * 256) * (useDarker ? -1 : 1),
        // Determine if input is RGB(A)
            rgb = color.match(new RegExp('^rgba?\\(\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '\\s*,\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '\\s*,\\s*' +
                '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
                '(?:\\s*,\\s*' +
                '(0|1|0?\\.\\d+))?' +
                '\\s*\\)$'
                , 'i')),
            alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

        // Convert hex to decimal
            decimal = !!rgb ? [rgb[1], rgb[2], rgb[3]] : color.replace(
                /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
                function () {
                    return parseInt(arguments[1], 16) + ',' +
                        parseInt(arguments[2], 16) + ',' +
                        parseInt(arguments[3], 16);
                }
            ).split(/,/);

        // Return RGB(A)
        return !!rgb ?
            'rgb' + (alpha !== null ? 'a' : '') + '(' +
                Math[useDarker ? 'max' : 'min'](
                    parseInt(decimal[0], 10) + difference, useDarker ? 0 : 255
                ) + ', ' +
                Math[useDarker ? 'max' : 'min'](
                    parseInt(decimal[1], 10) + difference, useDarker ? 0 : 255
                ) + ', ' +
                Math[useDarker ? 'max' : 'min'](
                    parseInt(decimal[2], 10) + difference, useDarker ? 0 : 255
                ) +
                (alpha !== null ? ', ' + alpha : '') +
                ')' :
            // Return hex
            [
                '#',
                pad(Math[useDarker ? 'max' : 'min'](
                    parseInt(decimal[0], 10) + difference, useDarker ? 0 : 255
                ).toString(16), 2),
                pad(Math[useDarker ? 'max' : 'min'](
                    parseInt(decimal[1], 10) + difference, useDarker ? 0 : 255
                ).toString(16), 2),
                pad(Math[useDarker ? 'max' : 'min'](
                    parseInt(decimal[2], 10) + difference, useDarker ? 0 : 255
                ).toString(16), 2)
            ].join('');
    };

    self.lighterColor = function lighterColor(color, ratio) {
        return changeColor(color, ratio, false);
    };

    self.darkerColor = function darkerColor(color, ratio) {
        return changeColor(color, ratio, true);
    };

    /**
     * get support-color by color-level
     * @param color
     * @param [degree]
     * @returns {*}
     */
    self.getColor = function (color, degree) {
        color = oColor[color];
        if (!degree) {
            return  color;
        }
        if (degree > 0) {
            return self.darkerColor(color, degree * .1);
        }
        degree = -degree;
        return self.lighterColor(color, degree * .1);
    };

    self.getDark = function () {
        return '#000000';
    };

    self.getWhite = function () {
        return '#ffffff';
    };

    /**
     * add style to head
     * @param className
     * @param oStyle
     */
    self.addStyle = function (className, oStyle) {
        var dHead = $('head');
        if (!self.dStyle) {
            self.dStyle = $('<style></style>');
            dHead.append(self.dStyle);
        }
        // cover object to string like css-format
        var sStyle = '{';
        $.each(oStyle, function (key, style) {
            sStyle += key + ':' + style + ';';
        });
        sStyle += '}';
        self.dStyle.append(className).append(sStyle);

    };

    return self;
})();