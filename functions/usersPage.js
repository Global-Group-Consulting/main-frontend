import { get as _get } from 'lodash'

import usersFunctions from '@/functions/users'
import { computed, onMounted, ref } from '@vue/composition-api'

import roleBasedConfig from '@/config/roleBasedConfig'
import availableTableColumns from '@/config/tables/usersSchema'

export default function (root) {

  const { $apiCalls, $alerts, $enums } = root
  const { goToUser } = usersFunctions(root)

  const usersGroups = ref([])

  const fetchAllUsers = async function () {
    try {
      return await $apiCalls.fetchAllUsers()
    } catch (er) {
      $alerts.error(er)
    }
  }

  const getUerRoleData = function (id) {
    return $enums.UserRoles.get(+id)
  }

  /**
   * @param {number} role
   */
  const getTableHeaders = function (role) {
    const columns = _get(roleBasedConfig, `${$enums.UserRoles.getIdName(role)}.tables.users.columns`)

    const toReturn = []

    for (const colId of columns) {
      const col = availableTableColumns[colId]

      col.text && (col.text = root.$t(col.text))

      toReturn.push(col)
    }

    return toReturn
  }

  return {
    usersGroups,
    onRowClick: goToUser,
    fetchAllUsers,
    getUerRoleData,
    getTableHeaders
  }
}
