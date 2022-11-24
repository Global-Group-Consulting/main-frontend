<template>
  <v-layout>
    <v-flex>
      <page-header page-name="users"></page-header>

      <UserProfileBlocks></UserProfileBlocks>

      <page-toolbar always-visible :actions-list="actionsList" filters-schema="users"
                    filter-on-enter></page-toolbar>

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
import UserRoles from '@/enums/UserRoles'

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
    const newUserActions = useNewUserActions($store, $apiCalls, $router, root.$nuxt)

    //********************************************************
    // COMPUTED PROPS
    //********************************************************

    const actionsList = computed(() => newUserActions.list.value)
    const getTabColor = computed(() => {
      const selectedTable = usersPageData.usersList.value[currentTab.value]

      return selectedTable ? $enums.UserRoles.get(selectedTable.id).color : ''
    })

    //********************************************************
    // FUNCTIONS
    //********************************************************

    return {
      ...usersPageData,
      ...pageBasic(root, 'users'),
      permissions,
      getTabColor,
      currentTab,
      actionsList,
      newUserActions
      // usersDataBlocks
    }
  }
}
</script>

<style scoped></style>
