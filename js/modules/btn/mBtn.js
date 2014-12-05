/**
 * The basic btn module
 * v1.1
 * @author Caro.Huang
 */


/**
 * create basic btn style
 * OPT
 * icon: str (default:'') - set custom-icon by bootstrap
 * title: str/DOM (default:'') - set custom-title
 * btnClass: 'info/danger/success/warning/danger' (default:'') - set custom-btn-class by bootstrap
 *
 * @param type
 * @param opt
 * @param clickFn
 */
$.fn.mBtn = function (type, opt, clickFn) {
    var self = this;
    var selfId = 'mBtn';
    var icon = '';
    var langPath = '';
    var title = '';
    var btnClass = '';

    var dTitleSpan = $('<span></span>').lClass('mBtnTitle');

    // the fns mapping by type
    var oTypeFn = {
        create: function () {
            icon = 'plus';
            langPath = 'Create';
            btnClass = 'success';
        },
        edit: function () {
            icon = 'pencil';
            langPath = 'Edit';
            btnClass = 'info';
        },
        delete: function () {
            icon = 'trash';
            langPath = 'Delete';
            btnClass = 'danger';
        },
        submit: function () {
            icon = 'save';
            langPath = 'Submit';
            btnClass = 'primary';
        },
        clean: function () {
            icon = 'remove';
            langPath = 'Clean';
            btnClass = 'warning';
        },
        revert: function () {
            icon = 'retweet';
            langPath = 'Revert';
            btnClass = 'success';
        },
        download: function () {
            icon = 'download';
            langPath = 'Download';
            btnClass = 'success';
        },
        upload: function () {
            icon = 'upload';
            langPath = 'Upload';
            btnClass = 'primary';
        },
        return: function () {
            icon = 'share-alt';
            langPath = 'Return';
            btnClass = 'info';
        },
        search: function () {
            icon = 'search';
            langPath = 'Search';
            btnClass = 'info';
        },
        detail: function () {
            icon = 'eye-open';
            langPath = 'Detail';
            btnClass = 'info';
        },
        approve: function () {
            icon = 'ok-sign';
            langPath = 'Approve';
            btnClass = 'danger';
        },
        reject: function () {
            icon = 'ban-circle';
            langPath = 'Reject';
            btnClass = 'warning';
        },
        confirm: function () {
            icon = 'ok';
            langPath = 'Confirm';
            btnClass = 'success';
        },
        cancel: function () {
            icon = 'remove';
            langPath = 'Cancel';
            btnClass = 'danger';
        },
        save: function () {
            icon = 'save';
            langPath = 'Save';
            btnClass = 'success';
        },
        open: function () {
            icon = 'open';
            langPath = 'Open';
            btnClass = 'info';
        },
        close: function () {
            icon = 'remove';
            langPath = 'Close';
            btnClass = 'danger';
        }
    };

    // change the vars by type
    oTypeFn [type] && oTypeFn [type]();

    // change the vars if opt-set
    if ($.lHelper.isFn(opt)) {
        clickFn = opt;
    } else if (opt) {
        icon = opt.icon || icon;
        title = opt.title || title;
        btnClass = opt.btnClass || btnClass;
        clickFn = opt.clickFn || clickFn;
    }

    icon = $.lDom.createIcon(icon);

    if (title) {
        dTitleSpan.html(title);
        langPath = title;
    } else {
        dTitleSpan.lSetLang(selfId + '.' + langPath);
    }
    self.empty().append(icon).append(' ').append(dTitleSpan)
        .lClass('btn-' + btnClass).lClass('btn')
        .css({
            'margin-left': 2,
            'margin-right': 2
        });

    clickFn && self.action('click.' + selfId, clickFn);
    return self;
};