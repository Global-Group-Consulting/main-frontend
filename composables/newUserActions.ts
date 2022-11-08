import { computed, ComputedRef, SetupContext } from '@vue/composition-api'
import UserRoles from '~/enums/UserRoles'
import { ApiCalls } from '~/plugins/apiCalls'
import jsFileDownload from 'js-file-download'

/**
 *
 * @param {any} $store
 * @param {any} $apiCalls
 * @param {any} $router
 */
export function useNewUserActions ($store: any, $apiCalls: ApiCalls, $router: any, $nuxt: any) {
  
  const list = computed(() => [
    {
      type: UserRoles.ADMIN,
      color: UserRoles.get(UserRoles.ADMIN).color,
      icon: 'mdi-account-plus',
      onlyInMobile: true,
      options: {
        color: UserRoles.get(UserRoles.ADMIN).color
      },
      text: 'users.add-admin',
      click: () => $router.push(`/users/new?type=${UserRoles.ADMIN}`),
      if: $store.getters['user/canAddUsers_admin']
    },
    {
      type: UserRoles.SERV_CLIENTI,
      color: UserRoles.get(UserRoles.SERV_CLIENTI).color,
      icon: 'mdi-account-plus',
      onlyInMobile: true,
      options: {
        color: UserRoles.get(UserRoles.SERV_CLIENTI).color
      },
      text: 'users.add-servClienti',
      click: () => $router.push(`/users/new?type=${UserRoles.SERV_CLIENTI}`),
      if: $store.getters['user/canAddUsers_servClienti']
    },
    {
      type: UserRoles.AGENTE,
      color: UserRoles.get(UserRoles.AGENTE).color,
      icon: 'mdi-account-plus',
      onlyInMobile: true,
      options: {
        color: UserRoles.get(UserRoles.AGENTE).color
      },
      text: 'users.add-agente',
      click: () => $router.push(`/users/new?type=${UserRoles.AGENTE}`),
      if: $store.getters['user/canAddUsers_agente']
    },
    {
      type: UserRoles.CLIENTE,
      color: UserRoles.get(UserRoles.CLIENTE).color,
      icon: 'mdi-account-plus',
      onlyInMobile: true,
      options: {
        color: UserRoles.get(UserRoles.CLIENTE).color
      },
      text: 'users.add-cliente',
      click: () => $router.push(`/users/new?type=${UserRoles.CLIENTE}`),
      if: $store.getters['user/canAddUsers_cliente']
    },
    {
      icon: 'mdi-account-arrow-down',
      onlyInDesktop: true,
      text: 'users.download-filtered',
      tooltip: 'users.download-filtered-tooltip',
      loading: false,
      click: async function () {
        $nuxt.$loading.start()
        
        try {
          const file = await $apiCalls.userApi.downloadFiltered($store.getters['filters/activeFilters'])
          
          jsFileDownload(file.data, 'utenti_filtrati_' + Date.now(), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        } catch (e) {
          console.error(e)
        }
        
        $nuxt.$loading.finish()
      },
      if: $store.getters['user/userIsAdmin'] && $store.getters['filters/areActiveFilters']
    }
  ].filter(_entry => _entry.if))
  
  const canAddUsers = computed(() => $store.getters['user/canAddUsers'])
  
  return {
    list,
    canAddUsers
  }
}
