/**
 * @type {Record<string, import("~/@types/config/TableSchema").TableSchema>}
 */
const schema = {
  amount: {
    text: 'tables.agentBrite.amount-change', value: 'amount', align: "right",
    component: "CellAgentBriteAmount"
  },
  deposit: {
    text: 'tables.agentBrite.deposit', value: 'deposit', align: "right",
    component: "CellBriteValue", componentSettings: {showCurrency: true}
  },
  type: {
    text: 'tables.agentBrite.type', value: 'type',
    component: "CellAgentBriteType"
  },
  requestTotal: {
    text: 'tables.agentBrite.request-total', value: 'requestTotal', align: "right",
    component: "CellEuroValue", componentSettings: {showCurrency: true}
  },
  requestPercent: {
    text: 'tables.agentBrite.request-percent', value: 'requestPercent',
    align: "right",
    component: "CellPercentage",
  },
  created_at: {text: 'tables.agentBrite.created-at', value: 'created_at', align: "center"},
}

export default schema
