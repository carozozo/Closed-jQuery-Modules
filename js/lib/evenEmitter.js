/**
 * The even-emitter lib, for emit/hook event
 *
 * ex:
 * $.lEventEmitter.hookEvent('customEvent','customNameSpace',function(){
 *      console.log(1);
 * });
 * $.lEventEmitter.hookEvent('customEvent','customNameSpace',function(){
 *      console.log(2);
 * });
 * $.lEventEmitter.emitEvent('customEvent'); // print 1 and 2
 *
 * ex2:
 * var dom = $('<div></div>');
 * $.lEventEmitter.hookEvent('customEvent', 'customNameSpace', function(){
 *      console.log(1);
 * },{source: dom});
 * $.lEventEmitter.hookEvent('customEvent', 'customNameSpace', function(){
 *      console.log(2);
 * },{source: dom});
 * $.lEventEmitter.emitEvent('customEvent'); // print 1
 *
 * ex3:
 * var dom = $('<div></div>');
 * $.lEventEmitter.hookEvent('customEvent', 'customNameSpace1', function(){
 *      console.log(1);
 * },{source: dom});
 * $.lEventEmitter.hookEvent('customEvent', 'customNameSpace2', function(){
 *      console.log(2);
 * },{source: dom});
 * $.lEventEmitter.emitEvent('customEvent'); // print 1 and 2
 * dom.remove();
 * $.lEventEmitter.emitEvent('customEvent'); // no-print
 *
 * @author Caro.Huang
 */


$.lEventEmitter = (function () {
    var self = {};
    var oaEmit = [];

    /**
     * emit event and get returned-value by hookFn
     * @param emitName
     * @param [dataObj]
     * @returns {*}
     */
    self.emitEvent = function (emitName, dataObj) {
        // emit custom even
        var returned = true;
        dataObj = dataObj || {};
        dataObj.type = emitName;
        dataObj.hookFn = function (fnReturned) {
            returned = fnReturned;
        };
        $.each(oaEmit, function (i, oSource) {
            var source = oSource.source;
            source.trigger(dataObj);
        });
        return returned;
    };

    /**
     * hook event, you can return value by fn
     * it won't hook-duplicate when [source set and same emit name]
     *
     * OPT
     * source: dom (default: null) - the hook-target, if target not exists, the hook fn will be remove too
     *
     * @param emitName
     * @param nameSpace
     * @param fn
     * @param [opt]
     */
    self.hookEvent = function (emitName, nameSpace, fn, opt) {
        if (!emitName || !nameSpace || !$.lHelper.isStr(emitName) || !$.lHelper.isStr(nameSpace)) {
            $.lConsole.error('$.lEventEmitter.hookEvent error:');
            $.lConsole.error('emitName= ', emitName);
            $.lConsole.error('nameSpace= ', nameSpace);
            return;
        }
        var pass = true;
        var source = null;

        if (opt) {
            source = opt.source || source;
        }
        source = $.lStr.toDom(source);
        emitName = emitName + '.' + nameSpace;

        if (source) {
            // do not hook if source & emitName in $.lEventEmitter.oaEmit
            $.each(oaEmit, function (i, oSource) {
                var sourceInArr = oSource.source;
                var emitNameInArr = oSource.emitName;
                if (source.get(0) === sourceInArr.get(0) && emitName === emitNameInArr) {
                    pass = false;
                }
            });
        } else {
            // create a new DOM as source
            source = $('<div></div>');
        }

        if (!pass) {
            return;
        }
        // set emit-info
        oaEmit.push({
            source: source,
            emitName: emitName
        });
        source.on(emitName, function (e) {
            var fnReturned = true;
            if ($.lHelper.isFn(fn)) {
                fnReturned = fn(e);
            }
            e.hookFn(fnReturned);
        });
    };

    /**
     * unhook event
     * @param emitName
     * @param nameSpace
     */
    self.unHookEvent = function (emitName, nameSpace) {
        if (!emitName || !nameSpace || !$.lHelper.isStr(emitName) || !$.lHelper.isStr(nameSpace)) {
            $.lConsole.error('$.lEventEmitter.unHookEvent error:');
            $.lConsole.error('emitName= ', emitName);
            $.lConsole.error('nameSpace= ', nameSpace);
            return;
        }
        emitName = emitName + '.' + nameSpace;
        $.each(oaEmit, function (i, oSource) {
            var source = oSource.source;
            source.off(emitName);
        });
    };

    return self;
})();