$.pEwallet = (function () {
    var self = {};
    self.pagePms = ['eWalletEditPms'];
    self.eWalletEditPath = '/e_wallet/edit/eWalletEdit';
    return self;
})();

$.tPageInfo[$.pEwallet.eWalletEditPath] = {
    title: 'pEwallet.edit.pageTitle',
    initFn: function () {
        $('#ewalletEditPage').pEwalletEdit();
    }
};