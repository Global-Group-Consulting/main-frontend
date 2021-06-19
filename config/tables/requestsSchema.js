//import {TableSchema} from "~/@types/config/TableSchema";

/**
 * @type {Record<string, import("~/@types/config/TableSchema").TableSchema>}
 */
const schema = {
  'contractNumber': {
    text: 'tables.contract-number',
    value: 'user.contractNumber',
    align: "center",
    width: "15%",
    component: "CellUserContractNumber"
  },
  'firstName': {text: 'tables.first-name', value: 'user.firstName'},
  'lastName': {text: 'tables.last-name', value: 'user.lastName'},
  'user': {text: 'tables.user', value: 'user', component: "CellUserName"},
  'email': {text: 'tables.email', value: 'user.email'},
  'type': {text: 'tables.request-type', value: 'type', component: "CellRequestType"},
  'amount': {
    text: 'tables.request-amount',
    value: 'amount',
    align: "right",
    class: "no-wrap",
    component: "CellRequestAmount"
  },
  'referenceAgent': {
    text: 'tables.reference-agent',
    value: 'user.referenceAgentData',
    component: "CellUserReferenceAgent"
  },
  'status': {text: 'tables.request-status', value: 'status', component: "CellRequestStatus"},
  'created_at': {text: 'tables.created-at', value: 'created_at'},
  'updated_at': {text: 'tables.updated-at', value: 'updated_at'},
  'completed_at': {text: 'tables.completed-at', value: 'completed_at'},
  'currency': {
    text: 'tables.request-currency',
    value: 'currency',
    align: 'center',
    component: "CellCurrency"
  },
  'actions': {
    value: 'actions',
    sortable: false,
    align: 'center',
    width: '1%',
    component: "CellRequestActions"
  }
}

export default schema
