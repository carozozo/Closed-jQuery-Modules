/**
 * The form lib
 * @author Caro.Huang
 */

$.lForm = (function () {
    var self = {};

    /**
     * clean form
     * ex1.
     * $.lForm.clean('formId');
     *
     * ex2.
     * $.lForm.clean($('#form1'));
     */
    self.clean = function () {
        var dom = arguments[0];
        dom = $.lStr.toDom(dom);

        // clear input
        dom.find('input').each(function () {
            var self = $(this);
            if (self.lType() == 'radio') {
                self.prop('checked', false);
                return;
            }

            if (self.lType() == 'checkbox') {
                self.prop('checked', false);
                return;
            }
            self.val('');
        });

        // clear select
        dom.find('select').each(function () {
            var self = $(this);
            self.find('option:first').prop('selected', true);
        });

        // clear textarea
        dom.find('textarea').each(function () {
            var self = $(this);
            // it should be .html('') but not work
            self.val('');
        });
    };

    /**
     * get all FORM-DOM-Tag value and cover to Obj by DOM-id
     * @param dom
     * @param [opt]
     * @returns {{}}
     */
    self.coverToModel = function (dom, opt) {
        var model = {};
        var coverEmpty = true;
        var extendModel = {};
        if (opt) {
            coverEmpty = opt.coverEmpty !== false;
            extendModel = opt.extendModel ? opt.extendModel : extendModel;
        }
        dom = $.lStr.toDom(dom);
        dom.find('input, select, textarea').each(function () {
            var self = $(this);
            var domId = self.lId();
            var val = self.getVal();
            if (domId && (coverEmpty || val)) {
                model[domId] = val;
            }
        });
        return $.extend(model, extendModel);
    };

    return self;
})();