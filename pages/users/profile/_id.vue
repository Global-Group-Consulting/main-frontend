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
              <div>{{ $t("pages.club.brite.totalUsableBrite") }}: <strong>
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
              </ul>
            </v-col>
          </v-row>
        </template>
      </page-header>

      <!-- Blocchi resoconto dashboard -->
      <dashboard-blocks :dashboard-data="userDashboardData"
                        class="mb-6"
                        :readonly="$auth.user.role !== $enums.UserRoles.ADMIN"
                        v-if="showUserBlocks"
                        :loading="loading"
      ></dashboard-blocks>

      <agent-wallet-cards :user-id="userData.id" :user="userData" v-if="showAgentBlocks"
                          @reloadCommissions="onReloadCommissions"></agent-wallet-cards>

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
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import PageHeader from "../../../components/blocks/PageHeader.vue";
import DataTable from "../../../components/table/DataTable.vue";
import DashboardBlocks from "~/components/DashboardBlocks.vue";
import {User} from "~/@types/UserFormData";
import MovementsListTable from "~/components/table/MovementsListTable.vue";
import UsersListTable from "~/components/table/UsersListTable.vue";
import CommissionsListTable from "~/components/table/CommissionsListTable.vue";
import AgentBriteListTable from "~/components/table/AgentBriteListTable.vue";

import MovementsFn from "@/functions/movementsFn.js";
import DynamicTabs from "~/components/DynamicTabs.vue";
import {DynamicTab} from "~/@types/components/DynamicTab";
import PageToolbar from "~/components/blocks/PageToolbar.vue";
import {ActionItem} from "~/@types/ActionItem";
import AdminRequestDialog from "~/components/dialogs/AdminRequestDialog.vue";
import AgentWalletCards from "~/components/elements/cards/AgentWalletCards.vue";
import {sortBy} from "lodash";
import {ClubPermissions} from "~/functions/acl/enums/club.permissions";

@Component({
  components: {
    AgentWalletCards,
    AdminRequestDialog,
    PageToolbar,
    DynamicTabs,
    AgentBriteListTable, CommissionsListTable, MovementsListTable, UsersListTable,
    DashboardBlocks, DataTable, PageHeader
  }
})
export default class Profile extends Vue {
  userData: User | any = {}
  movementsFn = MovementsFn(this);
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
      clientsTotalDeposit: 0,
    }
  }

  clubBlocks: any = {}

  $refs!: {
    commissions_list_table: CommissionsListTable[]
    movements_list_table: MovementsListTable[]
  }

  get actionsList(): ActionItem[] {
    const toReturn: any[] = [
      {
        text: "user-data",
        tooltip: "user-data-tooltip",
        position: "center",
        icon: "mdi-account-box",
        click: this.goToUserData
      }, {
        text: "club-data",
        tooltip: "club-data-tooltip",
        position: "center",
        icon: "mdi-diamond-stone",
        click: this.goToClubData,
        if: this.$store.getters["user/userIsAdmin"] || this.$auth.user.permissions.includes(ClubPermissions.CLUB_READ)
      }, /*{
        text: "import-contract",
        tooltip: "import-contract-tooltip",
        position: "right",
        icon: "mdi-file-document-edit"
      }, {
        text: "import-movements",
        tooltip: "import-movements-tooltip",
        position: "right",
        icon: "mdi-playlist-plus",
      }*/
    ]

    return toReturn.filter(el => el.if ?? true)
  }

  get userId() {
    return this.$route.params.id;
  }

  get showUserBlocks() {
    return [this.$enums.UserRoles.AGENTE, this.$enums.UserRoles.CLIENTE].includes(+this.userData.role)
  }

  get showAgentBlocks() {
    return [this.$enums.UserRoles.AGENTE].includes(+this.userData.role)
  }

  get tabsList(): DynamicTab[] {
    return [
      {
        id: "users",
        title: "Utenti",
        if: +this.userData.role !== this.$enums.UserRoles.CLIENTE
      },
      {
        id: "movements",
        title: "Movimenti",
        if: true
      }, {
        id: "commissions",
        title: "Provvigioni",
        if: +this.userData.role !== this.$enums.UserRoles.CLIENTE
      },
      {
        id: "agent-brite",
        title: "Brite Agente",
        if: +this.userData.role !== this.$enums.UserRoles.CLIENTE
      }
    ].filter(el => el.if)
  }

  get clubStatistics() {
    const toReturn: any = {
      totalAmount: 0,
      expirations: []
    }

    for (const entry of Object.entries<Record<string, any>>(this.clubBlocks)) {
      const usableFrom = this.$moment(entry[1].usableFrom);
      const expiresAt = this.$moment(entry[1].expiresAt);
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

    toReturn.expirations = sortBy(toReturn.expirations, "expiresAt", function (o: any) {
      return o.expiresAt.toDate()
    })

    return toReturn
  }

  goToUserData(event: MouseEvent, action: ActionItem) {
    let openInNewTab = event.ctrlKey
    const path = "/users/" + this.$route.params.id

    if (openInNewTab) {
      return window.open(path, "_blank")
    }

    this.$router.push(path)
  }

  goToClubData(event: MouseEvent, action: ActionItem) {
    let openInNewTab = event.ctrlKey || true
    const path = "/club/" + this.$route.params.id

    if (openInNewTab) {
      return window.open(path, "_blank")
    }

    this.$router.push(path)
  }

  async onReloadCommissions() {
    if (!this.$refs.commissions_list_table) {
      return;
    }

    let target: any = this.$refs.commissions_list_table
    let finalTarget: any = null;

    if (target instanceof Array) {
      finalTarget = target[0]
    }

    if ("updateData" in target && finalTarget) {
      await finalTarget.updateDate()
    }
  }

  async onAdminNewRequestAdded() {
    await this.fetchUserDetails();
    await this.$refs.movements_list_table[0]?.updateData();
  }

  async fetchUserDetails() {
    this.userData = await this.$apiCalls.fetchUserDetails(this.userId);

    if (this.showUserBlocks) {
      const resultDashboard = await this.$apiCalls.dashboardFetch(this.userId);

      this.userDashboardData.blocks = resultDashboard.blocks
      this.userDashboardData.user = this.userData
    }
  }

  async beforeMount() {
    try {
      await this.fetchUserDetails();

      this.clubBlocks = await this.$apiCalls.clubFetchBlocks(this.userId)

      if (this.showAgentBlocks) {
        const resultCommissions = await this.$apiCalls.fetchCommissionsStatus(this.userId);

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
