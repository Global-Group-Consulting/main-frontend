/**
 * @typedef {import("~/@types/Tables/ColumnSchema").ColumnSchemaList} ColumnSchemaList
 */

/**
 * @type {ColumnSchemaList}
 */
const columns = {
  'amountChange': {text: 'tables.club.amountChange', value: 'amountChange', align: "right"},
  'createdAt': {text: 'tables.club.createdAt', value: 'created_at', align: "center"},
  'deposit': {text: 'tables.club.deposit', value: 'deposit', align: "right", sortable: false},
  'depositOld': {text: 'tables.club.depositOld', value: 'depositOld', align: "right", sortable: false},
  'movementType': {text: 'tables.club.movementType', value: 'movementType', align: "center", sortable: false},
  'notes': {text: 'tables.club.notes', value: 'notes', align: "center", sortable: false},

  'actions': {
    value: 'actions',
    sortable: false,
    align: 'center',
    visible: false,
    width: '1%'
  }
}

export default columns
