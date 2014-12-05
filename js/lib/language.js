/**
 * The language lib
 * @author Caro.Huang
 */

$.lLang = (function () {
    var self = {};
    var consoleErr = function (e, langPath, langObj) {
        console.error('$.lLang.parseLanPath exception: ', e);
        console.error('langPath=', langPath);
        console.error('langObj=', langObj);
    };

    /**
     * get locality (by cookie)
     * @returns {*|string}
     */
    self.getLocality = function () {
        return $.lCookie.get('locality') || 'en_us';
    };

    /**
     * set locality
     */
    self.setLocality = function (locality) {
        var aLocality = ['en_us', 'zh_cn', 'zh_tw'];
        if (aLocality.indexOf(locality) >= 0)
            $.lCookie.set('locality', locality);
    };

    /**
     * cover locality key( en -> en_us, zh_hk -> zh_tw )
     * @param oLocality
     */
    self.coverLocality = function (oLocality) {
        $.each(oLocality, function (locality, val) {
            locality = locality.toLowerCase();
            oLocality[locality] = val;
            if (locality === 'en') {
                oLocality['en_us'] = val;
            }
            else if (locality === 'zh_hk') {
                oLocality['zh_tw'] = val;
            }
        });
    };

    /**
     * parse a str to local language
     * ex1.
     * set-lan = 'mUserLogin.login'
     * locality = 'zh_tw'
     * will return value by [tla.mUserLogin.zh_tw.login]
     *
     * ex2. see as fn
     * set-lan = 'mPagination.Total.(3)'
     * locality ='zh_tw'
     * will return value by [tla.mPagination.Total(3)]
     *
     * @param langPath
     * @returns {string}
     */
    self.parseLanPath = function (langPath) {
        // replace \. to \@@ for escape [.]
        langPath = $.lStr.replaceAll(langPath, '\\.', '\\@@');
        var aEach = langPath.split('.');
        var lang = '';
        var locality = self.getLocality();
        // ex. aEach = [userLogin,login]
        $.each(aEach, function (index, val) {
            // replace \@@ to original [.]
            val = $.lStr.replaceAll(val, '\\@@', '.');
            if (index == 0) {
                lang = tla[val];
                // ex. oLang = tla.mUserLogin.en_us
                if (lang && lang[locality] !== undefined) {
                    lang = lang[locality];
                    return true;
                }
                consoleErr('', langPath, lang);
                return false;
            }
            if ($.lHelper.isFn(lang)) {
                return false;
            }
            try {
                lang = lang[val];
            } catch (e) {
                consoleErr(e, langPath, lang);
                return false;
            }
            return true;
        });
        return lang;
    };

    /**
     * set locale language to mapping DOM
     * @param dom
     */
    self.setLang = function (dom) {
        dom.find('[set-lan]').each(function (i, dom) {
            dom = $(dom);
            // ex. mUserLogin.login
            var langPath = dom.attr('set-lan');
            var lan = self.parseLanPath(langPath);
            dom.setVal(lan);
        });
    };

    /**
     * set locale language to mapping DOM
     * ex.
     * when html: <span set-lan='mUserLogin.rememberMe' />
     * it will get [記住我] by when locality is zh_tw( from [_tla.js] in userLogin lib )
     * or return undefined when not found in [_tla.js]
     *
     */
    self.switchLang = function (target) {
        // emit custom even
        var emitObj = {
            switchTarget: target
        };
        var switchContainer;
        if ($.lHelper.isDom(target)) {
            switchContainer = target;
            if ($.lEventEmitter.emitEvent('befSwitchLangInTarget', emitObj) === false) {
                return;
            }
            switchContainer = switchContainer.find('[set-lan]');
        } else {
            setTimeout($.lWindow.setContainerMarginTop, 20);
            if ($.lEventEmitter.emitEvent('befSwitchLang') === false) {
                return;
            }
            switchContainer = $('[set-lan]');
        }

        $.each(switchContainer, function (i, dom) {
            dom = $(dom);
            // ex. mUserLogin.login
            var langPath = dom.attr('set-lan');
            var lan = self.parseLanPath(langPath);

            if (!dom.is('input')) {
                dom.html(lan);
            } else {
                dom.val(lan);
            }
        });

        if (target) {
            $.lEventEmitter.emitEvent('aftSwitchLangInTarget', emitObj);
        }
        else {
            $.lEventEmitter.emitEvent('aftSwitchLang', emitObj);
        }
    };

    return self;
})();