import { get as _get, sortBy as _sortBy } from 'lodash'

import usersFunctions from '@/functions/users'
import { computed, onMounted, reactive, ref } from '@vue/composition-api'

import roleBasedConfig from '@/config/roleBasedConfig'
import availableTableColumns from '@/config/tables/usersSchema'
import UserRoles from "../enums/UserRoles"

export default function (root) {

  const { $apiCalls, $alerts, $enums, $set } = root
  const { goToUser } = usersFunctions(root)

  const usersGroups = reactive({
    [UserRoles.CLIENTE]: [],
    [UserRoles.AGENTE]: [],
    [UserRoles.ADMIN]: [],
    [UserRoles.SERV_CLIENTI]: [],
  })

  const fetchAllUsers = async function () {
    try {
      let result = await $apiCalls.fetchAllUsers()

      result = result.map(_entry => {
        switch (_entry.id) {
          case UserRoles.ADMIN:
            _entry.index = 3

            break;
          case UserRoles.AGENTE:
            _entry.index = 1

            break;
          case UserRoles.CLIENTE:
            _entry.index = 0

            break;
          case UserRoles.SERV_CLIENTI:
            _entry.index = 2

            break;
        }

        return _entry
      })

      return _sortBy(result, ["index"])
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

    return columns.reduce((acc, column) => {
      const col = availableTableColumns[column]

      acc.push({
        ...col,
        text: root.$t(col.text)
      })

      return acc
    }, [])
  }

  /**
   * @param {{}} item
   * @param {[]} group
   */
  const onUserDeleted = function (item, group) {
    const index = group.findIndex(_el => _el.id === item.id)

    root.$delete(group, index)
  }

  onMounted(async () => {
    const result = await fetchAllUsers()

    for (const entry of result) {
      $set(usersGroups, entry.id, entry.data)
    }

  })

  return {
    usersGroups,
    onRowClick: goToUser,
    fetchAllUsers,
    getUerRoleData,
    getTableHeaders,
    onUserDeleted
  }
}
