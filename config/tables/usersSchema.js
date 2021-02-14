export default {
  'contractNumber': {text: 'tables.contract-number', value: 'contractNumber'},
  'firstName': {text: 'tables.first-name', value: 'firstName'},
  'lastName': {text: 'tables.last-name', value: 'lastName'},
  'email': {text: 'tables.email', value: 'email'},
  'accountStatus': {text: 'tables.account-status', value: 'account_status'},
  'referenceAgent': {text: 'tables.reference-agent', value: 'referenceAgent'},
  'validatedAt': {text: 'tables.validated-at', value: 'validated_at'},
  'contractStatus': {text: 'tables.contract-status', value: 'contractSignedAt'},
  'role': {text: 'tables.role', value: 'role', align: "center"},
  'clientsNumber': {text: 'tables.clients-number', value: 'clientsCount', align: 'center'},
  'commissionsAssigned': {
    text: 'tables.commissions-assigned',
    value: 'commissionsAssigned', align: 'center',
    sortable: false
  },
  'superAdmin': {
    value: 'superAdmin',
    sortable: false,
    align: 'center',
    width: '1%'
  },
  'actions': {
    value: 'actions',
    sortable: false,
    align: 'center',
    visible: false,
    width: '1%'
  }
}
