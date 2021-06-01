/**
 * @type {Record<string, import("~/@types/config/TableSchema").TableSchema>}
 */
const schema = {
  'contractNumber': {text: 'tables.contract-number', value: 'contractNumber'},
  'firstName': {text: 'tables.first-name', value: 'firstName'},
  'lastName': {text: 'tables.last-name', value: 'lastName'},
  'email': {text: 'tables.email', value: 'email'},
  'accountStatus': {text: 'tables.account-status', value: 'account_status', component: "CellUserAccountStatus"},
  'referenceAgent': {text: 'tables.reference-agent', value: 'referenceAgent', component: "CellUserReferenceAgent"},
  'validatedAt': {text: 'tables.validated-at', value: 'validated_at'},
  'contractStatus': {text: 'tables.contract-status', value: 'contractSignedAt', component: "CellUserContractStatus"},
  'role': {text: 'tables.role', value: 'role', align: "center",  component: "CellUserRole"},
  'clientsNumber': {text: 'tables.clients-number', value: 'clientsCount', align: 'center', component: "CellUserClientsCount"},

  'clubPack': {text: 'tables.club.gold', value: 'clubPack', align: 'center', component: "CellUserClubPack"},

  'signDocSent': {text: 'tables.sign-doc-sent', value: 'signDocSent', align: 'center'},
  'signDocViewed': {text: 'tables.sign-doc-viewed', value: 'signDocViewed', align: 'center'},
  'signDocSigned': {text: 'tables.sign-doc-signed', value: 'signDocSigned', align: 'center'},
  'signDocLogs': {value: 'signDocLogs', align: 'center', sortable: false},

  'commissionsAssigned': {
    text: 'tables.commissions-assigned',
    value: 'commissionsAssigned', align: 'center',
    sortable: false,
    component: "CellUserCommissionsAssigned"
  },
  'superAdmin': {
    value: 'superAdmin',
    sortable: false,
    align: 'center',
    width: '1%',
    component: "CellUserSuperAdmin"
  },
  'actions': {
    value: 'actions',
    sortable: false,
    align: 'center',
    visible: false,
    width: '1%',
    component: "CellUserActions"
  }
}

export default schema
