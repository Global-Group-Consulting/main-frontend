/**
 * @type {Record<string, import("~/@types/config/TableSchema").TableSchema>}
 */
const schema = {
  "amountChange": {
    text: 'tables.amount-change', value: 'amountChange', align: "right",
    component: "CellCommissionAmount"
  },
  "commissionType": {text: 'tables.commission-type', value: 'commissionType'},
  "createdAt": {text: 'tables.created-at', value: 'created_at', align: "center"},
  "currMonthCommissions": {text: 'tables.curr-month-commissions',
    value: 'currMonthCommissions',
    align: "right"},
  "user": {text: 'tables.user', value: 'user'},
  "commissionPercentage": {text: 'tables.commission-percentage', value: 'commissionPercentage', align: 'center'},
  "commissionOnValue": {
    text: 'tables.commission-on-value', value: 'commissionOnValue', align: 'right',
    component: "CellEuroValue",
    componentSettings: {emptyIfNull: true, showCurrency: true}
  },
}

export default schema
