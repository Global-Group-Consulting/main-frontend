import { get as _get } from "lodash"
import roleBasedConfig from '../config/roleBasedConfig'

import { enums } from "../plugins/enums";

export default function (availableColumns, tableName, { $i18n }) {
  /**
   * @param {number} role
   */
  function getTableHeaders(role, condition) {
    if (!role) {
      return
    }

    const roleId = enums.UserRoles.getIdName(role)
    const columns = _get(roleBasedConfig, `${roleId}.tables.${tableName}.columns`)

    return columns.reduce((acc, column) => {
      let colName = column
      let colCondition = null

      if (column instanceof Array) {
        colName = column[0]
        colCondition = column[1] instanceof Array ? column[1].includes(condition) : condition === column[1]
      }

      const col = availableColumns[colName]

      if (typeof colCondition === "boolean" && !colCondition) {
        return acc
      }

      acc.push({
        ...col,
        text: $i18n.t(col.text)
      })

      return acc
    }, [])
  }

  return {
    getTableHeaders
  }
}