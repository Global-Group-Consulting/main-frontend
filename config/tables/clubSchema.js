/**
 * @typedef {import("~/@types/Tables/ColumnSchema").ColumnSchemaList} ColumnSchemaList
 */

/**
 *  @type {Record<string, import("~/@types/config/TableSchema").TableSchema>}
 */
const columns = {
  'firstName': {text: 'tables.first-name', value: 'firstName'},
  'lastName': {text: 'tables.last-name', value: 'lastName'},
  'email': {text: 'tables.email', value: 'email'},
  'role': {text: 'tables.role', value: 'role', align: "center", component: "CellUserRole"},

  'clubCardNumber': {text: 'tables.club.cardNumber', value: 'clubCardNumber', component: "CellUserClubCardNumber"},
  'clubPack': {text: 'tables.club.clubPack', value: 'clubPack', align: "center", component: "CellUserClubPack"},
  'briteTotal': {text: 'tables.club.briteTotal', value: 'britesTotal', align: "right", component: "CellBriteValue"},
  'briteUsed': {text: 'tables.club.briteUsed', value: 'britesUsed', align: "right", component: "CellBriteValue"},
  'briteAvailable': {
    text: 'tables.club.briteAvailable',
    value: 'britesAvailable',
    align: "right",
    component: "CellBriteValue"
  },

  'actions': {
    value: 'actions',
    sortable: false,
    align: 'center',
    visible: false,
    width: '1%',
    component: "CellUserClubActions"
  }
}

export default columns
