<template>
  <div>
    <v-skeleton-loader
        elevation="1"
        v-if="showSkeleton"
        type="table-thead, table-tbody, table-tfoot"
    ></v-skeleton-loader>

    <div>
      <div>
        <dynamic-tabs :tabs-list="tabsList"
                      :loading="loading"
                      :filters-fields-map="usersFiltersFieldsMap"
                      filters-schema="usersSchema"
                      filters-table-key="usersFilter"
                      :outlined="true"
                      @tabChange="onTabChange">

          <template v-for="tab of tabsList"
                    v-slot:[`tabContent_${tab.id}`]="{item}">
            <data-table
                :items="tab.data"
                table-key="users"
                schema="usersSchema"
                :options="{
                  sortBy: ['accountStatusOrdered', 'firstName', 'lastName'],
                }"
                :loading="loading"
                :condition="+$enums.UserRoles.get(tab.id).index"
            >
            </data-table>
          </template>

        </dynamic-tabs>

        <clients-list-dialog v-if="$store.getters['dialog/dialogId'] === 'ClientsListDialog'"/>
      </div>

      <!--      <div v-else>Nessun utente disponibile...</div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import { User } from '~/@types/UserFormData'
import { DynamicTab } from '~/@types/components/DynamicTab'

import DynamicTabs from '../DynamicTabs.vue'
import DataTable from '../table/DataTable.vue'
import SigningLogsPopup from '../elements/SigningLogsPopup.vue'
import ClientsListDialog from '~/components/dialogs/ClientsListDialog.vue'
import CellUserAccountStatus from '~/components/table/CellsTemplates/CellUserAccountStatus.vue'
import { usersFiltersFieldsMap } from '~/config/forms/filters/usersFiltersSchema'
import { AclUserRoles } from '~/enums/AclUserRoles'

@Component({
  components: { CellUserAccountStatus, ClientsListDialog, SigningLogsPopup, DataTable, DynamicTabs }
})
export default class UsersListTable extends Vue {
  @Prop({ type: String, required: true })
  public userId!: string

  @Prop({ type: Array, default: () => [] })
  public filtersActive!: any[]

  currentTab!: any
  loading: boolean = false

  /* usersData: Record<string, User[]> = {
     [this.getRoleName(this.$enums.UserRoles.CLIENTE)]: [],
     [this.getRoleName(this.$enums.UserRoles.AGENTE)]: [],
     [this.getRoleName(this.$enums.UserRoles.SERV_CLIENTI)]: [],
     [this.getRoleName(this.$enums.UserRoles.ADMIN)]: []
   }*/

  get usersData () {
    if (this.mustLoadAgentUsers) {
      return this.$store.getters['users/agentUsersGroups']
    } else {
      return this.$store.getters['users/usersGroups']
    }
  }

  get tabsList (): DynamicTab[] {
    return [{
      id: AclUserRoles.CLIENT,
      title: 'Clienti',
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.CLIENTE)]
    }, {
      id: AclUserRoles.AGENT,
      title: 'Agenti',
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.AGENTE)]
    }, {
      id: AclUserRoles.CLIENTS_SERVICE,
      title: 'Servizio Clienti',
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.SERV_CLIENTI)]
    }, {
      id: AclUserRoles.ADMIN,
      title: 'Admin',
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.ADMIN)]
    }].filter(el => el.data && el.data.length > 0)
  }

  get usersFiltersFieldsMap () {
    return usersFiltersFieldsMap
  }

  get existsData () {
    const data = this.tabsList.reduce((acc: any[], curr) => {
      if (curr.data) {
        acc.push(...curr.data)
      }

      return acc
    }, [])

    return data.length > 0
  }

  get mustLoadAgentUsers () {
    return this.$auth.user.id !== this.userId || this.$auth.user.role === this.$enums.UserRoles.AGENTE
  }

  get showSkeleton () {
    return false //!this.$store.getters['users/initialized']
  }

  getRoleName (role: number | string) {
    return this.$enums.UserRoles.getIdName(+role)
  }

  getInitials (str: any, item: any): string {
    switch (item.name) {
      case this.$enums.CommissionType.NEW_DEPOSIT:

        return item.percent + '%'
      case this.$enums.CommissionType.TOTAL_DEPOSIT:

        return '% / mese'
      case this.$enums.CommissionType.ANNUAL_DEPOSIT:

        return item.percent + '% / anno'
    }

    return ''
  }

  async showClientsList (user: User) {
    try {
      // Fetch the users list
      const usersList = await this.$apiCalls.getClientsList(user.id)

      await this.$store.dispatch('dialog/updateStatus', {
        title: this.$i18n.t('dialogs.clientsList.title'),
        id: 'ClientsListDialog',
        fullscreen: false,
        large: true,
        readonly: true,
        texts: {
          cancelBtn: 'dialogs.clientsList.btn-cancel'
        },
        data: {
          usersList,
          agent: user
        }
      })
    } catch (e) {
      this.$alerts.error(e)
    }
  }

  onUserDeleted (item: User, data: any[]) {
    const index = data.findIndex(_el => _el.id === item.id)

    this.$delete(data, index)
  }

  public async updateData () {
    this.loading = true

    try {
      let usersList: any[]
      let listToEmit: any[] = []

      if (this.mustLoadAgentUsers) {
        await this.$store.dispatch('users/fetchAgentClients', this.userId)
        /*usersList = await this.$apiCalls.getClientsList(this.userId)

        listToEmit = usersList;

        for (const user of usersList) {
          if (user.id === this.userId) {
            continue
          }

          this.usersData[this.$enums.UserRoles.getIdName(+user.role)].push(user)
        }*/
      } else {
        // await this.$store.dispatch('users/fetchData', this.currentTab)
      }

      /* this.$emit("updatedUsersList", listToEmit.map(user => {

         user.accountStatusOrdered = this.$enums.AccountStatuses.get(user.account_status).order

         return user
       }))*/
    } catch (e) {
      console.error(e)
    }

    this.loading = false
  }

  /**
   * @param {string} newTab
   */
  async onTabChange (newTab: string) {
    this.currentTab = newTab

    // const usersList = await this.$apiCalls.userApi.fetchByRole(this.currentTab ?? AclUserRoles.CLIENT)
  }

  @Watch('usersData', { deep: true })
  onUserDataChange (value: any) {
    this.$store.dispatch('filters/updateDataToFilter', Object.values(value).flat())
  }

  // @ts-ignore
  async mounted () {
    await this.updateData()
  }
}
</script>

<style scoped>

</style>
