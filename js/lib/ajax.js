/**
 * The ajax lib
 * @author Caro.Huang
 */

$.lAjax = (function () {
    var self = {};
    self.aRunningAjax = [];

    /**
     * abort running ajax in $.lAjax.aRunningAjax
     */
    self.abortRunningAjax = function () {
        $.each(self.aRunningAjax, function (i, runningAjax) {
            runningAjax.abort();
        });
        self.aRunningAjax = [];
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
                $.lPage.goIndexPage();
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

    return self;
})();