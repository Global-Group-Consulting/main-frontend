/**
 * @typedef {import("~/@types/Tables/ColumnSchema").ColumnSchemaList} ColumnSchemaList
 * @typedef {import("~/@types/Acl/Permissions").AclPermission} AclPermission
 */

/**
 * @type {ColumnSchemaList<AclPermission>}
 */
const columns = {
  "code": {text: "tables.acl.code", value: "code"},
  "description": {text: "tables.acl.description", value: "description", width: "70%", sortable: false},
  "actions": {text: "", width: "1%", value: "actions", sortable: false},
}

export default columns
