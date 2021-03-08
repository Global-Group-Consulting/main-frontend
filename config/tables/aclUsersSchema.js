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
  'roles': {text: 'tables.roles', value: 'roles', width: "20%"},
  'permissions': {text: 'tables.directPermissions', value: 'directPermissions', width: "20%"},
}

export default columns
