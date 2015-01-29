/**
 * The language lib
 * @author Caro.Huang
 */

$.lLang = (function () {
    var self = {};
    var consoleErr = function (e, langPath, langObj, ifPrint) {
        if (!ifPrint) {
            return;
        }
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
     * @returns {*}
     */
    self.coverLocality = function (oLocality) {
        $.each(oLocality, function (locality, val) {
            locality = locality.toLowerCase();
            oLocality[locality] = val;
            switch (locality) {
                case 'en':
                    oLocality['en_us'] = val;
                    break;
                case 'zh_hk':
                case 'hk':
                    oLocality['zh_tw'] = val;
                    break;
                case 'cn':
                    oLocality['zh_cn'] = val;
                    break;
            }
        });
        return oLocality;
    };
    /**
     * TODO beta
     * convenience cover locality-obj in object, and set lang-path by key & id
     * EX
     * a = {
     *      localityKey1: {en: 'xxx', zh_hk: 'yyy'}
     *      localityKey2: {en: 'aaa', zh_hk: 'bbb'}
     * };
     * $.lLang.coverLocalityAndSetLangPath(a, 'localityKey1,localityKey2', '123');
     * =>
     * a = $.tLan.oLocalityKey123 = {
     *      localityKey1: {en: 'xxx', zh_hk: 'yyy'}
     *      localityKey2: {en: 'aaa', zh_hk: 'bbb'}
     *      oLocalityKey1: {en: 'xxx', en_us: 'xxx', zh_hk: 'yyy', zh_tw: 'yyy'}
     *      oLocalityKey2: {en: 'aaa', en_us: 'aaa', zh_hk: 'bbb', zh_tw: 'bbb'}
     * };
     * @param obj
     * @param localityObjKeys
     * @param langId
     */
    self.coverLocalityAndSetLangPath = function (obj, localityObjKeys, langId) {
        var aLocalityObjKey = $.lStr.splitStr(localityObjKeys, ',');
        $.each(aLocalityObjKey, function (i, localityObjKey) {
            localityObjKey = localityObjKey.trim();
            var oLocality = obj[localityObjKey];
            var newLocalityObjKey = 'o' + $.lStr.upperFirst(localityObjKey);
            if (oLocality) {
                $.each(oLocality, function (key, locality) {
                    if ($.lHelper.isStr(locality)) {
                        locality = $.lStr.wrapToBr(locality);
                        oLocality[key] = locality;
                    }
                });
                $.tLan[newLocalityObjKey + langId] = self.coverLocality(oLocality);
                obj[newLocalityObjKey] = oLocality;
            }
        });
    };
    /**
     * parse a str to local language
     * OPT
     * printErr: bool (default: false) - if print console when get error by langPath
     *
     * ex1.
     * set-lan = 'mUserLogin.login'
     * locality = 'zh_tw'
     * will return value by [$.tLan.mUserLogin.zh_tw.login]
     *
     * ex2. see as fn
     * set-lan = 'mPagination.Total.(3)'
     * locality ='zh_tw'
     * will return value by [$.tLan.mPagination.Total(3)]
     *
     * @param langPath
     * @param [opt]
     * @returns {string}
     */
    self.parseLanPath = function (langPath, opt) {
        var printErr = true;
        if (opt) {
            printErr = opt.printErr !== false;
        }
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
                lang = $.tLan[val];
                // ex. oLang = $.tLan.mUserLogin.en_us
                if (lang && lang[locality] !== undefined) {
                    lang = lang[locality];
                    return true;
                }
                consoleErr('', langPath, lang, printErr);
                return false;
            }
            if ($.lHelper.isFn(lang)) {
                return false;
            }
            try {
                lang = lang[val];
            } catch (e) {
                consoleErr('', langPath, lang, printErr);
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
    self.getLocalTitleDom = function (local, opt) {
        var dom = $('<span></span>');
        var langPath = '';
        if (opt) {
            dom = opt.dom || dom;
        }
        if (!$.lHelper.isDom(dom)) {
            return dom
        }
        switch (local) {
            case 'en':
                langPath = 'common.English';
                break;
            case 'zh_hk':
            case 'hk':
            case 'zh_tw':
            case 'tw':
                langPath = 'common.TraditionalChinese';
                break;
            case 'zh_cn':
            case 'cn':
                langPath = 'common.SimplifiedChinese';
                break;
        }
        langPath && dom.lSetLang(langPath);
        return dom;
    };
    return self;
})();