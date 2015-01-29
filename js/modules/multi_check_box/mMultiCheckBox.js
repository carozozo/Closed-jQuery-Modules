/**
 * The module that can control target-check-box
 * v1.0
 * @author Caro.Huang
 */

/**
 * OPT
 * type: str(default: 'sameToggle') - the control-type
 *
 * @param targetClass
 * @param opt
 * @returns {$.fn}
 */
$.fn.mMultiCheckBox = function (targetClass, opt) {
    var self = this;
    var aType = ['sameToggle', 'all', 'none', 'toggle'];
    var type = aType[0];
    var isAllChecked = false;
    var oFn = {
        sameToggle: function (targets) {
            $.each(targets, function (i, target) {
                target = $(target);
                var domType = self.lType();
                var isChecked = true;
                if (domType === 'checkbox') {
                    isChecked = self.isChecked();
                } else {
                    isChecked = !isAllChecked;
                }
                target.setChecked(isChecked);
            });
            isAllChecked = !isAllChecked;
        },
        all: function (targets) {
            $.each(targets, function (i, target) {
                target = $(target);
                target.setChecked(true);
            });
        },
        none: function (targets) {
            $.each(targets, function (i, target) {
                target = $(target);
                target.setChecked(false);
            });
        },
        toggle: function (targets) {
            $.each(targets, function (i, target) {
                target = $(target);
                var targetChecked = target.isChecked();
                target.setChecked(!targetChecked);
            });

        }
    };
    if (opt) {
        type = aType.indexOf(opt.type) > -1 ? opt.type : type;
    }

    self.on('click', function () {
        var targets = $('.' + targetClass);
        oFn[type](targets);
    });

    self.getCheckBoxVal = function (ifJoin) {
        var ret = [];
        var targets = $('.' + targetClass + ':checked');
        $.each(targets, function (i, target) {
            target = $(target);
            var value = target.val();
            ret.push(value);
        });
        if (!ifJoin)
            return ret;
        return ret.join(',');
    };
    return self;
};