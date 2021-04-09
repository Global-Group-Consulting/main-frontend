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

import MovementsFn from "@/functions/movementsFn.js";
import CommissionsListTable from "~/components/table/CommissionsListTable.vue";
import DynamicTabs from "~/components/DynamicTabs.vue";
import {DynamicTab} from "~/@types/components/DynamicTab";

@Component({
  components: {DynamicTabs, CommissionsListTable, MovementsListTable, DashboardBlocks, DataTable, PageHeader}
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
    blocks: {
      monthCommissions: 0,
      reinvestedCommissions: 0,
      collectedCommissions: 0,
      clientsTotalDeposit: 0,
    }
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
      },
      {
        id: "movements",
        title: "Movimenti",
      }, {
        id: "commissions",
        title: "Provvigioni",
      }
    ]
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
      }
    } catch (er) {
      this.$alerts.error(er)
    }
  }
}
</script>
