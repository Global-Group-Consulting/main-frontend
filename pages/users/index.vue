<template>
  <v-layout>
    <v-flex>
      <page-header page-name="users"></page-header>

      <!--      <dashboard-blocks :dashboard-data="usersDataBlocks"
                              class="mb-6"
                              readonly
                              page="users"
                              format-as-int
                              :loading="!$store.getters['users/initialized']"
            ></dashboard-blocks>-->
      <UserProfileBlocks></UserProfileBlocks>

      <page-toolbar always-visible :actions-list="actionsList" filters-schema="users"></page-toolbar>

      <UsersListTable></UsersListTable>

      <!-- Floating action button -->
      <div v-if="$vuetify.breakpoint.smAndUp">
        <NewUsersFAB></NewUsersFAB>
      </div>

    </v-flex>
  </v-layout>
</template>

<script>
import PageHeader from '@/components/blocks/PageHeader'
import usersPage from '@/functions/usersPage'
import pageBasic from '@/functions/pageBasic'
import { onMounted, computed, ref, reactive, watch } from '@vue/composition-api'

import Permissions from '../../functions/permissions'
import DataTable from '@/components/table/DataTable'
import SigningLogsPopup from '@/components/elements/SigningLogsPopup'
import PageToolbar from '@/components/blocks/PageToolbar'

import ClientsListDialog from '../../components/dialogs/ClientsListDialog'
import { UsersPermissions } from '../../functions/acl/enums/users.permissions'
import UsersListTable from '../../components/table/UsersListTable.vue'
import DashboardBlocks from '../../components/DashboardBlocks'
import NewUsersFAB from '../../components/actions/NewUsersFAB.vue'
import UserProfileBlocks from '../../components/dashboard/UserProfileBlocks.vue'

import { useNewUserActions } from '@/composables/newUserActions'

export default {
  name: 'index',
  components: {
    DashboardBlocks,
    UsersListTable,
    ClientsListDialog,
    PageToolbar,
    SigningLogsPopup,
    DataTable,
    PageHeader,
    NewUsersFAB,
    UserProfileBlocks
  },
  meta: {
    permissions: [UsersPermissions.ACL_USERS_TEAM_READ, UsersPermissions.ACL_USERS_ALL_READ]
  },
  setup (props, { root }) {
    const { $enums, $i18n, $apiCalls, $vuetify, $router, $store, $alerts, $auth } = root
    const currentTab = ref(0)
    const lastTab = ref(0)
    const permissions = Permissions(root)
    const usersPageData = usersPage(root)
    const newUserActions = useNewUserActions($store, $i18n)

    //********************************************************
    // COMPUTED PROPS
    //********************************************************

    const actionsList = computed(() => ([
      ...newUserActions.list.value.reduce((acc, curr) => {
        acc.push({
          text: 'users-add-' + $enums.UserRoles.getIdName(curr.type),
          if: curr.if && $vuetify.breakpoint.xsOnly,
          icon: 'mdi-account',
          click: () => $router.push(`/users/new?type=${curr.type}`),
          onlyInMobile: true,
          options: {
            color: $enums.UserRoles.get(curr.type).color
          }
        })

        return acc
      }, [])
    ]))
    const getTabColor = computed(() => {
      const selectedTable = usersPageData.usersList.value[currentTab.value]

      return selectedTable ? $enums.UserRoles.get(selectedTable.id).color : ''
    })

    /* const usersDataBlocks = computed(() => {
       // TODO:: Dati devono essere recuperati da API direttamente qui
       const userIsAgente = $store.getters['user/userIsAgente']
       const usersStatistics = $store.getters['users/usersStatistics']
       const agentUsersStatistics = $store.getters['users/agentUsersStatistics']

       return {
         blocks: userIsAgente ? agentUsersStatistics : usersStatistics
       }
     })*/

    //********************************************************
    // FUNCTIONS
    //********************************************************

    return {
      ...usersPageData,
      ...pageBasic(root, 'users'),
      permissions,
      getTabColor,
      currentTab,
      actionsList
      // usersDataBlocks
    }
  }
}
</script>

<style scoped></style>
