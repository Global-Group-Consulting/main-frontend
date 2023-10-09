/**
 * @type {Record<string, import('~/@types/config/TableSchema').TableSchema>}
 */
export default {
  'amountChange': { text: 'tables.amount-change', value: 'amountChange', align: 'right', component:"CellMovementAmount" },
  'movementType': { text: 'tables.movement-type', value: 'movementType', component: "CellMovementType" },
  'createdAt': { text: 'tables.created-at', value: 'created_at', align: 'center', component: "CellDate" },
  'deposit': { text: 'tables.deposit', value: 'deposit', align: 'right', component: "CellEuroValue", componentSettings: { showCurrency:  true, emptyIfNull: true } },
  'interestAmount': { text: 'tables.interest-amount', value: 'interestAmount', align: 'right', component: "CellEuroValue", componentSettings: { showCurrency:  true, emptyIfNull: true  } },
  'actions': {
    text: '',
    value: 'actions',
    sortable: false,
    align: 'center',
    width: '1%',
    component: "CellMovementActions",
  }
}
