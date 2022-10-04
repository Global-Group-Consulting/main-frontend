<template>
  <v-layout>
    <v-flex>
      <page-header page-name="user.profile" sub-title="true" :loading="loading">
        <template v-slot:subtitle>
          <v-row>
            <v-col md="6" cols="12">
              {{ userData.firstName + ' ' + userData.lastName }}
            </v-col>
            <v-col md="6" cols="12">
              <!--              <div>{{ $t("pages.club.brite.totalUsableBrite") }}: <strong>
                              Br' {{ clubStatistics.totalAmount|moneyFormatter(true) }}</strong></div>
                            <ul class="pl-4" style="list-style: none; font-size: 20px; line-height: 1;">
                              <li v-for="(entry, i) of clubStatistics.expirations" :key="i">
                                <div v-html="$t('pages.club.brite.totalExpiresAt', {
                                            amount: $options.filters.moneyFormatter(entry.amount, true),
                                            expiresAt: $options.filters.dateFormatter(entry.expiresAt)
                                            })"/>
                                <ul class="mb-2" style="list-style: none; font-size: 16px; line-height: 1;">
                                  <li v-for="pack of Object.entries(entry.byPack)" v-if="pack[1] > 0">
                                    {{ $t("enums.ClubPacks." + pack[0]) }} : {{ pack[1] }}
                                  </li>
                                </ul>
                              </li>
                            </ul>-->
            </v-col>
          </v-row>
        </template>
      </page-header>


      <ProfileDashboard :user="userData" @reloadCommissions="onReloadCommissions"></ProfileDashboard>

      <!-- Blocchi resoconto dashboard -->
      <!--      <h2>Deposito e Rendite</h2>-->
      <!--
            <dashboard-blocks :dashboard-data="userDashboardData"
                              class="mb-6"
                              :readonly="$store.getters['user/userIsAgente']"
                              v-if="showUserBlocks"
                              :loading="loading"
                              include-commissions-add-dialog
            >
              <template v-slot:deposit_card-action="{item}"
                        v-if="$store.getters['user/userIsAgente']">
                <v-card-actions class="text-right pt-0 transparent">
                  <v-btn link text small color="primary" @click="onAddRepayment">
                    Rimborso
                  </v-btn>
                </v-card-actions>
              </template>

            </dashboard-blocks>
      -->

      <!--      <h2>Provvigioni</h2>-->
      <!--      <agent-wallet-cards :user-id="userData.id" :user="userData" v-if="showAgentBlocks"
                                @reloadCommissions="onReloadCommissions"></agent-wallet-cards>-->


      <div class="mt-10"></div>

      <page-toolbar :actions-list="actionsList"></page-toolbar>

      <!-- Dashboard agente se agente -->

      <dynamic-tabs :tabs-list="tabsList"
                    outlined>
        <template v-for="tab of tabsList"
                  v-slot:[`tabContent_${tab.id}`]="{item}">
          <component :is="tab.id + '-list-table'"
                     :user-id="userId"
                     :ref="tab.id + '_list_table'"
          />
        </template>
      </dynamic-tabs>

      <admin-request-dialog
          v-if="$store.getters['user/userIsRealAdmin']
              && $store.getters['dialog/dialogId'] === 'AdminRequestDialog'"
          @newRequestAdded="onAdminNewRequestAdded"
      />

      <agent-request-repayment
          v-if="$store.getters['user/userIsAgente'] && $store.getters['dialog/dialogId'] === 'AgentRequestRepayment'"
      />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PageHeader from '../../../components/blocks/PageHeader.vue'
import DataTable from '../../../components/table/DataTable.vue'
import DashboardBlocks from '~/components/DashboardBlocks.vue'
import { User } from '~/@types/UserFormData'
import MovementsListTable from '~/components/table/MovementsListTable.vue'
import UsersListTable from '~/components/table/UsersListTable.vue'
import CommissionsListTable from '~/components/table/CommissionsListTable.vue'
import AgentBriteListTable from '~/components/table/AgentBriteListTable.vue'

import MovementsFn from '@/functions/movementsFn.js'
import DynamicTabs from '~/components/DynamicTabs.vue'
import { DynamicTab } from '~/@types/components/DynamicTab'
import PageToolbar from '~/components/blocks/PageToolbar.vue'
import { ActionItem } from '~/@types/ActionItem'
import AdminRequestDialog from '~/components/dialogs/AdminRequestDialog.vue'
import AgentWalletCards from '~/components/elements/cards/AgentWalletCards.vue'
import { sortBy } from 'lodash'
import { ClubPermissions } from '~/functions/acl/enums/club.permissions'
import { UsersPermissions } from '~/functions/acl/enums/users.permissions'
import { AclUserRoles } from '~/enums/AclUserRoles'
import RequestTypes from '~/enums/RequestTypes'
import ProfileDashboard from '~/components/ProfileDashboard.vue'
import jsFileDownload from 'js-file-download'
import { userFormatter } from '~/plugins/filters'

@Component({
  components: {
    ProfileDashboard,
    AgentWalletCards,
    AdminRequestDialog,
    PageToolbar,
    DynamicTabs,
    AgentBriteListTable, CommissionsListTable, MovementsListTable, UsersListTable,
    DashboardBlocks, DataTable, PageHeader
  },
  meta: {
    permissions: [UsersPermissions.ACL_USERS_TEAM_READ, UsersPermissions.ACL_USERS_ALL_READ]
  }
})
export default class Profile extends Vue {
  userData: User | any = {}
  movementsFn = MovementsFn(this)
  loading = true

  userDashboardData: any = {
    user: null,
    blocks: {
      deposit: 0,
      interestAmount: 0,
      depositCollected: 0,
      interestsCollected: 0
    }
  }
  agentDashboardData: any = {
    user: null,
    blocks: {
      monthCommissions: 0,
      reinvestedCommissions: 0,
      collectedCommissions: 0,
      clientsTotalDeposit: 0
    }
  }

  clubBlocks: any = {}

  $refs!: {
    commissions_list_table: CommissionsListTable[]
    movements_list_table: MovementsListTable[]
  }

  get actionsList (): ActionItem[] {
    const toReturn: any[] = [
      {
        text: 'user-data',
        tooltip: 'user-data-tooltip',
        position: 'center',
        icon: 'mdi-account-box',
        click: this.goToUserData
      }, {
        text: 'club-data',
        tooltip: 'club-data-tooltip',
        position: 'center',
        icon: 'mdi-diamond-stone',
        click: this.goToClubData,
        if: this.$store.getters['user/userIsAdmin'] || this.$auth.user.permissions.includes(ClubPermissions.CLUB_READ)
      }, {
        text: 'movements-download-excel',
        tooltip: 'movements-download-excel-tooltip',
        position: 'center',
        icon: 'mdi-file-excel-outline',
        click: this.downloadMovementsList,
        if: this.$store.getters['user/userIsAdmin']
      }
    ]

    return toReturn.filter(el => el.if ?? true)
  }

  get userId () {
    return this.$route.params.id
  }

  get userIsAgent () {
    return this.userData?.roles?.includes(AclUserRoles.AGENT)
  }

  get showUserBlocks () {
    return this.$acl.checkRoles([AclUserRoles.AGENT, AclUserRoles.CLIENT], this.userData)
    // return [this.$enums.UserRoles.AGENTE, this.$enums.UserRoles.CLIENTE].includes(+this.userData.role)
  }

  get showAgentBlocks () {
    return this.$acl.checkRoles([AclUserRoles.AGENT], this.userData)
    // return [this.$enums.UserRoles.AGENTE].includes(+this.userData.role)
  }

  get tabsList (): DynamicTab[] {
    return [
      {
        id: 'users',
        title: 'Utenti',
        if: +this.userData.role !== this.$enums.UserRoles.CLIENTE
      },
      {
        id: 'movements',
        title: 'Movimenti',
        if: true
      }, {
        id: 'commissions',
        title: 'Provvigioni',
        if: +this.userData.role !== this.$enums.UserRoles.CLIENTE
      },
      {
        id: 'agent-brite',
        title: 'Brite Agente',
        if: +this.userData.role !== this.$enums.UserRoles.CLIENTE
      }
    ].filter(el => el.if)
  }

  get clubStatistics () {
    const toReturn: any = {
      totalAmount: 0,
      expirations: []
    }

    for (const entry of Object.entries<Record<string, any>>(this.clubBlocks)) {
      const usableFrom = this.$moment(entry[1].usableFrom)
      const expiresAt = this.$moment(entry[1].expiresAt)
      const amount = +entry[1].briteAvailable

      // If the brites are usable in the future, avoid showing them
      if (usableFrom.isAfter(this.$moment()) || !amount) {
        continue
      }

      toReturn.totalAmount += +entry[1].briteAvailable
      toReturn.expirations.push({
        amount,
        usableFrom,
        expiresAt,
        byPack: entry[1].byPack
      })
    }

    toReturn.expirations = sortBy(toReturn.expirations, 'expiresAt', function (o: any) {
      return o.expiresAt.toDate()
    })

    return toReturn
  }

  goToUserData (event: MouseEvent, action: ActionItem) {
    let openInNewTab = event.ctrlKey
    const path = '/users/' + this.$route.params.id

    if (openInNewTab) {
      return window.open(path, '_blank')
    }

    this.$router.push(path)
  }

  goToClubData (event: MouseEvent, action: ActionItem) {
    const path = process.env.clubAppUrl + '/admin/users/profile/' + this.$route.params.id

    return window.open(path, '_blank')
  }

  async onReloadCommissions () {
    if (!this.$refs.commissions_list_table) {
      return
    }

    let target: any = this.$refs.commissions_list_table
    let finalTarget: any = null

    if (target instanceof Array) {
      finalTarget = target[0]
    }

    if ('updateData' in target && finalTarget) {
      await finalTarget.updateDate()
    }
  }

  async onAdminNewRequestAdded () {
    await this.fetchUserDetails()
    await this.$refs.movements_list_table[0]?.updateData()
  }

  async fetchUserDetails () {
    this.userData = await this.$apiCalls.fetchUserDetails(this.userId)

    if (this.showUserBlocks) {
      const resultDashboard = await this.$apiCalls.dashboardFetch(this.userId)

      this.userDashboardData.blocks = resultDashboard.blocks
      this.userDashboardData.user = this.userData
    }
  }

  async onAddRepayment () {
    await this.$store.dispatch('dialog/updateStatus', {
      id: 'AgentRequestRepayment',
      title: 'Nuova richiesta di <strong>Rimborso</strong>',
      texts: {
        cancelBtn: 'dialogs.agentBriteAddDialog.btn-cancel',
        confirmBtn: 'dialogs.agentBriteAddDialog.btn-send'
      },
      data: {
        user: this.userData,
        maxValue: await this.$apiCalls.fetchCommissionsAvailable(this.$auth.user.id)
      }
    })
  }

  async downloadMovementsList () {
    try {
      const file = await this.$apiCalls.downloadMovementsReport(this.userId)

      jsFileDownload(file.data, this.$t('pages.requests.fileMovementsName', {
        user: userFormatter(this.userData),
        id: this.userId
      }) + '.xlsx')
    } catch (er) {
      this.$alerts.error(er)
    }
  }

  async beforeMount () {
    try {
      await this.fetchUserDetails()

      // this.clubBlocks = await this.$apiCalls.clubFetchBlocks(this.userId)

      if (this.showAgentBlocks) {
        const resultCommissions = await this.$apiCalls.fetchCommissionsStatus(this.userId)

        this.agentDashboardData.blocks = resultCommissions.blocks
        this.agentDashboardData.blocks.collectedCommissions = resultCommissions.blocks.collectedCommissions.total
        this.agentDashboardData.user = this.userData
      }
    } catch (er) {
      this.$alerts.error(er)
    } finally {
      this.loading = false
    }
  }
}
</script>
