/**
 * The model lib
 * @author Caro.Huang
 */

$.lModel = (function () {
    var self = {};

    /**
     * auto mapping model val with same key
     * ex.
     * m1={id:'caro',pwd:'123'}
     * m2={id:'',pwd:'456',status:false}
     * mapModel(m1,m2,function(){ ... })
     * => m1={id:'',pwd:'456'}
     * @param m1
     * @param m2
     * @param [cb]
     */
    self.mapData = function (m1, m2, cb) {
        // set m2's value to m1 with same key
        $.each(m1, function (key) {
            if (!$.lObj.keyInObj(m2, key)) {
                return;
            }
            m1[key] = m2[key];
        });
        cb && cb();
    };
    /**
     * uto mapping model val to DOM with key as id/class
     * @param model
     * @param dom
     * @param [cb]
     */
    self.mapDom = function (model, dom, cb) {
        // type is id or class
        dom = $.lStr.toDom(dom);
        if (model) {
            $.each(model, function (key, val) {
                var subDom = dom.find('#' + key);
                if (subDom.length <= 0) {
                    subDom = dom.find('.' + key);
                }
                if (subDom.length > 0) {
                    subDom.setVal(val);
                }
            });
        }
        cb && cb();
    };
    return self;
})();