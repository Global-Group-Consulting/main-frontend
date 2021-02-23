/**
 * @typedef {import("~/@types/Tables/ColumnSchema").ColumnSchemaList} ColumnSchemaList
 */

/**
 * @type {ColumnSchemaList}
 */
const columns = {
  "code": {text: "tables.acl.code", value: "code"},
  "description": {text: "tables.acl.description", value: "description", width: "40%", sortable: false},
  "permissions": {text: "tables.acl.permissions", value: "permissions", width: "40%", sortable: false},
  "actions": {text: "", width: "1%", value: "actions", sortable: false}
}

export default columns
