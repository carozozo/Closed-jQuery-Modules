// TODO some localize-language not ready
tla.pOrder = {};

tla.pOrder.en_us = {
    OrderSummary: 'Order Summary',
    list: {
        pageTitle: 'Order List'

    },
    followUp: {
        followUpTitle: 'Follow Up',
        confirmContentFn: function (key) {
            return 'Change ' + key.toUpperCase() + ' ?';
        }
    },
    detail: {
        pageTitle: 'Order detail',
        LastTen: 'Last 10',
        Orders: 'Orders',
        CustomerRemarks: 'Customer Remarks',
        PaymentRecords: 'Payment Records',
        TravelerList: 'Traveler List',
        GuestIndex: 'Guest#',
        GuestType: 'Guest Type',
        CreateServiceLog: 'Create Service Log',
        WasQueuedForSending: 'Was Queued For Sending',
        orderDocTypeOpt: {
            orderReceiptEmail: 'Order Receipt Email',
            orderReceiptSms: 'Order Receipt SMS',
            paymentConfirmedEmail: 'Payment Confirmed Email',
            paymentConfirmedSms: 'Payment Confirmed SMS',
            paymentRejectedEmail: 'Payment Rejected Email',
            paymentRejectedSms: 'Payment Rejected SMS',
            eTicketEmail: 'E-Tick Email',
            eTicketSms: 'E-Tick SMS',
            paymentRefundEmail: 'Payment Refund Email',
            paymentRefundSms: 'Payment Refund SMS',
            customerSms: 'Customer SMS'
        }
    },
    eventProductToPendingDocEdit: {
        editTitle: 'Change To PendingDoc',
        supplierConfirmationCode: 'Confirmation Code'
    },
    eventProductToCompleteEdit: {
        editTitle: 'Change To Complete'
    }
};

tla.pOrder.zh_tw = {
    OrderSummary: '訂單摘要',
    list: {
        pageTitle: '訂單列表'
    },
    followUp: {
        followUpTitle: '進度',
        confirmContentFn: function (key) {
            return '修改 ' + key.toUpperCase() + ' ?';
        }
    },
    detail: {
        pageTitle: '訂單明細',
        LastTen: '最近10筆',
        Orders: '訂單',
        CustomerRemarks: '客戶備註',
        PaymentRecords: '付款記錄',
        TravelerList: '旅客列表',
        GuestIndex: '旅客#',
        GuestType: '旅客類型',
        CreateServiceLog: '新增服務日誌',
        WasQueuedForSending: '已加入系統排程',
        orderDocTypeOpt: {
            orderReceiptEmail: '訂單收據電郵',
            orderReceiptSms: '訂單收據簡訊',
            paymentConfirmedEmail: '支付已確認電郵',
            paymentConfirmedSms: '支付已確認簡訊',
            paymentRejectedEmail: '支付失敗電郵',
            paymentRejectedSms: '支付失敗簡訊',
            eTicketEmail: '電子單電郵',
            eTicketSms: '電子單簡訊',
            paymentRefundEmail: '支付退費電郵',
            paymentRefundSms: '支付退費簡訊',
            customerSms: '客服簡訊'
        }
    },
    eventProductToPendingDocEdit: {
        editTitle: '更改狀態為 PendingDoc'
    },
    eventProductToCompleteEdit: {
        editTitle: '更改狀態為 Complete'
    }
};

tla.pOrder.zh_cn = {
    OrderSummary: '订单摘要',
    list: {
        pageTitle: '订单列表'
    },
    followUp: {
        followUpTitle: '进度',
        confirmContentFn: function (key) {
            return '修改 ' + key.toUpperCase() + ' ?';
        }
    },
    detail: {
        pageTitle: '订单明细',
        LastTen: '最近10笔',
        Orders: '订单',
        CustomerRemarks: '客户备注',
        PaymentRecords: '支付记录',
        TravelerList: '旅客列表',
        GuestIndex: '旅客#',
        GuestType: '旅客类型',
        CreateServiceLog: '新增服务日志',
        WasQueuedForSending: '已加入系统排程',
        orderDocTypeOpt: {
            orderReceiptEmail: '订单收据电邮',
            orderReceiptSms: '订单收据短信',
            paymentConfirmedEmail: '支付已确认电邮',
            paymentConfirmedSms: '支付已确认短信',
            paymentRejectedEmail: '支付失败电邮',
            paymentRejectedSms: '支付失败短信',
            eTicketEmail: '电子单电邮',
            eTicketSms: '电子单短信',
            paymentRefundEmail: '支付退费电邮',
            paymentRefundSms: '支付退费短信',
            customerSms: '客服短信'
        }
    },
    eventProductToPendingDocEdit: {
        editTitle: '更改状态为 PendingDoc'
    },
    eventProductToCompleteEdit: {
        editTitle: '更改状态为 Complete'
    }
};