import { computed } from '@vue/composition-api'
import UserRoles from '~/enums/UserRoles'

/**
 *
 * @param {any} $store
 * @param {any} $i18n
 */
export function useNewUserActions ($store: any, $i18n: any) {
  
  const list = computed(() => [
    {
      type: UserRoles.ADMIN,
      color: UserRoles.get(UserRoles.ADMIN).color,
      text: $i18n.t('enums.UserRoles.' + UserRoles.getIdName(UserRoles.ADMIN)),
      if: $store.getters['user/canAddUsers_admin']
    },
    {
      type: UserRoles.SERV_CLIENTI,
      color: UserRoles.get(UserRoles.SERV_CLIENTI).color,
      text: $i18n.t('enums.UserRoles.' + UserRoles.getIdName(UserRoles.SERV_CLIENTI)),
      if: $store.getters['user/canAddUsers_servClienti']
    },
    {
      type: UserRoles.AGENTE,
      color: UserRoles.get(UserRoles.AGENTE).color,
      text: $i18n.t('enums.UserRoles.' + UserRoles.getIdName(UserRoles.AGENTE)),
      if: $store.getters['user/canAddUsers_agente']
    },
    {
      type: UserRoles.CLIENTE,
      color: UserRoles.get(UserRoles.CLIENTE).color,
      text: $i18n.t('enums.UserRoles.' + UserRoles.getIdName(UserRoles.CLIENTE)),
      if: $store.getters['user/canAddUsers_cliente']
    }
  ].filter(_entry => _entry.if))
  
  const canAddUsers = computed(() => $store.getters['user/canAddUsers'])
  
  return {
    list,
    canAddUsers
  }
}
