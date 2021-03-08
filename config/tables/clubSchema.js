/**
 * @typedef {import("~/@types/Tables/ColumnSchema").ColumnSchemaList} ColumnSchemaList
 */

/**
 * @type {ColumnSchemaList}
 */
const columns = {
  'firstName': {text: 'tables.first-name', value: 'firstName'},
  'lastName': {text: 'tables.last-name', value: 'lastName'},
  'email': {text: 'tables.email', value: 'email'},
  'role': {text: 'tables.role', value: 'role', align: "center"},

  'clubCardNumber': {text: 'tables.club.cardNumber', value: 'clubCardNumber'},
  'clubPack': {text: 'tables.club.clubPack', value: 'clubPack', align: "center"},
  'briteTotal': {text: 'tables.club.briteTotal', value: 'britesTotal', align: "right"},
  'briteUsed': {text: 'tables.club.briteUsed', value: 'britesUsed', align: "right"},
  'briteAvailable': {text: 'tables.club.briteAvailable', value: 'britesAvailable', align: "right"},

  'actions': {
    value: 'actions',
    sortable: false,
    align: 'center',
    visible: false,
    width: '1%'
  }
}

export default columns
