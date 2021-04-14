<template>
  <v-layout>
    <v-flex>
      <page-header page-name="user.profile" sub-title="true">
        <template v-slot:subtitle>{{ userData.firstName + ' ' + userData.lastName }}</template>
      </page-header>


      <!-- Blocchi resoconto dashboard -->
      <dashboard-blocks :dashboard-data="userDashboardData"
                        class="mb-6"
                        readonly
                        v-if="showUserBlocks"
      ></dashboard-blocks>

      <dashboard-blocks :dashboard-data="agentDashboardData"
                        page="wallet"
                        readonly
                        includeCommissionsAddDialog
                        v-if="showAgentBlocks"
      ></dashboard-blocks>

      <div class="mt-10"></div>

      <page-toolbar :actions-list="actionsList"></page-toolbar>

      <!-- Dashboard agente se agente -->

      <dynamic-tabs :tabs-list="tabsList">
        <template v-for="tab of tabsList"
                  v-slot:[`tabContent_${tab.id}`]="{item}">
          <component :is="tab.id + '-list-table'"
                     :user-id="userId"
          />
        </template>
      </dynamic-tabs>

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

import MovementsFn from "@/functions/movementsFn.js";
import DynamicTabs from "~/components/DynamicTabs.vue";
import {DynamicTab} from "~/@types/components/DynamicTab";
import PageToolbar from "~/components/blocks/PageToolbar.vue";
import {ActionItem} from "~/@types/ActionItem";

@Component({
  components: {
    PageToolbar,
    DynamicTabs, CommissionsListTable, MovementsListTable, UsersListTable, DashboardBlocks, DataTable, PageHeader
  }
})
export default class Profile extends Vue {
  userData: User | any = {}
  movementsFn = MovementsFn(this);

  userDashboardData: any = {
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

  get actionsList(): ActionItem[] {
    return [
      {
        text: "user-data",
        tooltip: "user-data-tooltip",
        position: "center",
        icon: "mdi-account-box",
        click: this.goToUserData
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
      }
    ].filter(el => el.if)
  }

  goToUserData(event: MouseEvent, action: ActionItem) {
    let openInNewTab = event.ctrlKey
    const path = "/users/" + this.$route.params.id

    if (openInNewTab) {
      return window.open(path, "_blank")
    }

    this.$router.push(path)
  }

  async beforeMount() {
    try {
      this.userData = await this.$apiCalls.fetchUserDetails(this.userId);

      if (this.showUserBlocks) {
        const resultDashboard = await this.$apiCalls.dashboardFetch(this.userId);

        this.userDashboardData.blocks = resultDashboard.blocks
      }

      if (this.showAgentBlocks) {
        const resultCommissions = await this.$apiCalls.fetchCommissionsStatus({userId: this.userId});

        this.agentDashboardData.blocks = resultCommissions.blocks
        this.agentDashboardData.user = this.userData
      }
    } catch (er) {
      this.$alerts.error(er)
    }
  }
}
</script>
