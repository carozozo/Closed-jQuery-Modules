/**
 * init menu
 * @author Caro.Huang
 */


$.init(function () {
    var basicNavOpt = {
        inLogged: true
    };
    if ($.lUtil.isLogon()) {
        setUsersAdminMenu();
        setB2BAdminMenu();
        setPaymentMenu();
        setOrderMenu();
        setEwalletMenu();
    }

    function setUsersAdminMenu() {
        var items = [];
        if ($.lUtil.authUserPms($.pUser.pagePms)) {
            items.push({
                id: 'user',
                titleLangPath: 'pUser.list.pageTitle',
                click: function () {
                    $.pUserListOpt = $.pUser.getDefListOpt();
                    $.lUtil.goPage($.pUser.userListPath);
                }
            });
        }
        if ($.lUtil.authUserPms($.pRole.pagePms)) {
            items.push({
                id: 'role',
                titleLangPath: 'pRole.list.pageTitle',
                click: function () {
                    $.pRoleListOpt = $.pRole.getDefListOpt();
                    $.lUtil.goPage($.pRole.roleListPath);
                }
            });
        }
        if (items.length) {
            var opt = {
                titleLangPath: 'common.UserAdmin',
                dropDownItems: items
            };
            opt = $.lObj.extendObj(opt, basicNavOpt);
            $.mNav.regNav('userAdmin', opt);
        }
    }

    function setB2BAdminMenu() {
        var items = [];
        if ($.lUtil.authUserPms($.pMember.pagePms)) {
            items.push({
                id: 'member',
                titleLangPath: 'pMember.list.pageTitle',
                click: function () {
                    $.pMeListOpt = $.pMember.getDefListOpt();
                    $.lUtil.goPage($.pMember.memberListPath);
                }
            });
        }
        if ($.lUtil.authUserPms($.pCpy.pagePms)) {
            items.push({
                id: 'company',
                titleLangPath: 'pCpy.list.pageTitle',
                click: function () {
                    $.pCpyListOpt = $.pCpy.getDefListOpt();
                    $.lUtil.goPage($.pCpy.cpyListPath);
                }
            });
        }
        if ($.lUtil.authUserPms($.pReg.pagePms)) {
            items.push(
                {
                    id: 'registration',
                    titleLangPath: 'pReg.list.pageTitle',
                    click: function () {
                        $.pRegListOpt = $.pReg.getDefListOpt();
                        $.lUtil.goPage($.pReg.regListPath);
                    }
                }
            );
        }

        if (items.length) {
            var opt = {
                titleLangPath: 'common.B2BAdmin',
                dropDownItems: items
            };
            opt = $.lObj.extendObj(opt, basicNavOpt);
            $.mNav.regNav('b2bAdmin', opt);
        }
    }

    function setPaymentMenu() {
        var items = [];
        if ($.lUtil.authUserPms($.pPayment.pagePms)) {
            items.push({
                    id: 'payment',
                    titleLangPath: 'pPayment.list.pageTitle',
                    click: function () {
                        $.pPaymentListOpt = $.pPayment.getDefListOpt();
                        $.lUtil.goPage($.pPayment.paymentListPath);
                    }
                }
            );
        }
        if ($.lUtil.authUserPms($.pMotoProcessing.pagePms)) {
            items.push(
                {
                    id: 'motoProcessing',
                    titleLangPath: 'pMotoProcessing.list.pageTitle',
                    click: function () {
                        $.pMotoProcessingListOpt = $.pMotoProcessing.getDefListOpt();
                        $.lUtil.goPage($.pMotoProcessing.motoProcessingListPath);
                    }
                }
            );
        }
        if ($.lUtil.authUserPms($.pOnlinePayment.pagePms)) {
            items.push(
                {
                    id: 'onlinePayment',
                    titleLangPath: 'pOnlinePayment.list.pageTitle',
                    click: function () {
                        $.pOnlinePaymentListOpt = $.pOnlinePayment.getDefListOpt();
                        $.lUtil.goPage($.pOnlinePayment.onlinePaymentListPath);
                    }
                }
            );
        }
        if ($.lUtil.authUserPms($.pPaymentException.pagePms)) {
            items.push(
                {
                    id: 'paymentException',
                    titleLangPath: 'pPaymentException.list.pageTitle',
                    click: function () {
                        $.pPaymentExceptionListOpt = $.pPaymentException.getDefListOpt();
                        $.lUtil.goPage($.pPaymentException.paymentExceptionListPath);
                    }
                }
            );
        }
        if (items.length) {
            var opt = {
                titleLangPath: 'common.PaymentAdmin',
                dropDownItems: items
            };
            opt = $.lObj.extendObj(opt, basicNavOpt);
            $.mNav.regNav('paymentAdmin', opt);
        }
    }

    function setOrderMenu() {
        var items = [];
        if ($.lUtil.authUserPms($.pOrder.pagePms)) {
            items.push({
                    id: 'order',
                    titleLangPath: 'pOrder.list.pageTitle',
                    click: function () {
                        $.pOrderListOpt = $.pOrder.getDefListOpt();
                        $.lUtil.goPage($.pOrder.orderListPath);
                    }
                }
            );
        }
        if (items.length) {
            var opt = {
                titleLangPath: 'common.OrderAdmin',
                dropDownItems: items
            };
            opt = $.lObj.extendObj(opt, basicNavOpt);
            $.mNav.regNav('orderAdmin', opt);
        }
    }

    function setEwalletMenu(){
        var items = [];
        if ($.lUtil.authUserPms($.pEwallet.pagePms)) {
            items.push({
                    id: 'eWallet',
                    titleLangPath: 'pEwallet.edit.pageTitle',
                    click: function () {
                        $.lUtil.goPage($.pEwallet.eWalletEditPath);
                    }
                }
            );
        }
        if (items.length) {
            var opt = {
                titleLangPath: 'common.EwalletAdmin',
                dropDownItems: items
            };
            opt = $.lObj.extendObj(opt, basicNavOpt);
            $.mNav.regNav('eWalletAdmin', opt);
        }
    }
});