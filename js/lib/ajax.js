/**
 * The ajax lib
 * @author Caro.Huang
 */

$.lAjax = (function () {
    var self = {};
    var aRunningAjax = [];
    self.addRunningAjax = function (ajaxObj) {
        aRunningAjax.push(ajaxObj);
    };
    /**
     * abort running ajax in $.lAjax.aRunningAjax
     */
    self.abortRunningAjax = function () {
        $.each(aRunningAjax, function (i, runningAjax) {
            $.lHelper.isObj(runningAjax) && runningAjax.readyState !== 4 &&
                $.lHelper.isFn(runningAjax.abort) && runningAjax.abort();
        });
        aRunningAjax = [];
    };
    /**
     * validate ajax call if been reject and logout
     * show error-msg if server no response
     */
    self.setupAjax = function () {
        $.ajaxSetup({
            timeout: 30000
        });
        // the ajax global success fn
        $(document).ajaxSuccess(function (event, xhr, settings) {
            var responseJSON = xhr.responseJSON;
            if (!responseJSON) {
                return;
            }
            if (responseJSON.__noUser) {
                $.lUtil.logout();
                return;
            }
            if (responseJSON.__rej) {
//                $.lPage.goIndexPage();
                return;
            }
            if (settings.url !== '/main/html/getPage')
                setTimeout(function () {
                    var img = $('.navbar-brand');
                    img.effect('bounce');
                }, 1);
        });
        $(document).ajaxError(function (event, jqxhr, settings, exception) {
            var url = settings.url;
            if (exception === 'abort') {
                $.lConsole.log('ajaxError abort, url=' + url);
                return;
            }
            $.lConsole.error('ajaxError exception=' + exception + ', url=' + url);
        });
    };
    /**
     * parse ajax response, do function if success or error(for OA client server)
     *
     * ex1.
     * parseRes(res, function(result){
     *      do_something_when_success(result);
     * })
     *
     * ex2.
     * parseRes(res, function(result){
     *      do_something_when_success(result);
     * }, function(result){
     *      do_something_when_error(result);
     * })
     */
    self.parseRes = function (res) {
        var sucCb = null;
        var errCb = null;
        var var1 = arguments[1];
        var var2 = arguments[2];

        if ($.lHelper.isFn(var1)) {
            sucCb = var1;
        }
        if ($.lHelper.isFn(var2)) {
            errCb = var2;
        }
        var result = res.result;
        // call suc fn if ajax response success
        if (res.__suc) {
            sucCb && sucCb(result);
            return;
        }
        else if (res.__noUser) {
            // do nothing, because $.lAjax.validateAjax
            return;
        }
        else if (res.__rej) {
            // do nothing, because $.lAjax.validateAjax
            return;
        }
        errCb && errCb(result);
    };
    /**
     * set obj/input-files to formData
     * Note: DO NOT set input-files to obj, will cause exception
     * EX.
     * var fileList = e.target.files;
     * var obj = {
     *      files: fileList
     * };
     * => cause exception
     * @param opt
     * @param files
     * @returns {FormData}
     */
    self.coverToFormData = function (opt, files) {
        var formData = new FormData();
        $.each(opt, function (key, val) {
            formData.append(key, val);
        });
        $.each(files, function (key, val) {
            formData.append(key, val);
        });
        return formData;
    };
    return self;
})();
//$.runAjax = function () {
//    var aArg = [];
//    var ajaxFn = null;
//    var async = false;
//    $.each(arguments, function (i, arg) {
//        if (i === 0) {
//            if ($.lHelper.isBool(arg)) {
//                async = arg === true;
//                return;
//            }
//            if ($.lHelper.isFn(arg)) {
//                ajaxFn = arg;
//            }
//            return;
//        }
//        if (i === 1 && !ajaxFn && $.lHelper.isFn(arg)) {
//            ajaxFn = arg;
//            return;
//        }
//        aArg.push(arg);
//    });
//    if (!ajaxFn) {
//        return;
//    }
//    var ajaxOpt = ajaxFn.apply(ajaxFn, aArg);
//    if (!$.lHelper.isObj(ajaxOpt)) {
//        return;
//    }
//    ajaxOpt.async = async;
//    var ajaxObj = $.ajax(ajaxOpt);
//    if (!async) {
//        return;
//    }
//    $.lAjax.addRunningAjax(ajaxObj);
//};