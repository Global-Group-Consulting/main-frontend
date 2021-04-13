export default {
  'contractNumber': { text: 'tables.contract-number', value: 'user.contractNumber', align: "center", width: "15%" },
  'firstName': { text: 'tables.first-name', value: 'user.firstName' },
  'lastName': { text: 'tables.last-name', value: 'user.lastName' },
  'user': { text: 'tables.user', value: 'user' },
  'email': { text: 'tables.email', value: 'user.email' },
  'type': { text: 'tables.request-type', value: 'type' },
  'amount': { text: 'tables.request-amount', value: 'amount', align: "right", class: "no-wrap" },
  'referenceAgent': {text: 'tables.reference-agent', value: 'user.referenceAgentData'},
  'status': {text: 'tables.request-status', value: 'status'},
  'created_at': { text: 'tables.created-at', value: 'created_at' },
  'updated_at': { text: 'tables.updated-at', value: 'updated_at' },
  'completed_at': { text: 'tables.completed-at', value: 'completed_at' },
  'currency': {
    text: 'tables.request-currency',
    value: 'currency',
    align: 'center',
  },
  'actions': {
    text: '',
    value: 'actions',
    sortable: false,
    align: 'center',
    width: '1%'
  }
}
