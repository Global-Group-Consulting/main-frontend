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

      <v-alert>
        <h4 class="text-center">Dati presto disponibili...</h4>
      </v-alert>

      <!-- Elenco Richieste -->
      <!-- Elenco Movimenti -->

      <!--      <data-table schema="clubBriteSchema"
                        table-key="brite"
                        :items="tableData">
              <template v-slot:item.amountChange="{item, value}">
                <span :class="getMovementColor(item)">
                  B {{ value | moneyFormatter(true) }}</span>
              </template>
              <template v-slot:item.deposit="{item, value}">
                <strong>B {{ value | moneyFormatter(true) }}</strong>
              </template>
              <template v-slot:item.depositOld="{item, value}">
                B {{ value | moneyFormatter(true) }}
              </template>
              <template v-slot:item.movementType="{item, value}">
                <v-chip :color="$enums.ClubMovementTypes.get(value).color" small>
                  {{ $t(`enums.ClubMovementTypes.` + value) }}
                </v-chip>
              </template>
              <template v-slot:item.notes="{item, value}">
                <v-tooltip bottom v-if="value">
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon>mdi-note</v-icon>
                    </v-btn>
                  </template>
                  {{ value }}
                </v-tooltip>
              </template>
            </data-table>-->
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import PageHeader from "../../../components/blocks/PageHeader.vue";
import DataTable from "../../../components/table/DataTable.vue";
import DashboardBlocks from "~/components/DashboardBlocks.vue";
import {User} from "~/@types/UserFormData";

@Component({
  components: {DashboardBlocks, DataTable, PageHeader}
})
export default class Profile extends Vue {
  userData: User | any = {}

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

  get showUserBlocks() {
    return [this.$enums.UserRoles.AGENTE, this.$enums.UserRoles.CLIENTE].includes(+this.userData.role)
  }

  get showAgentBlocks() {
    return [this.$enums.UserRoles.AGENTE].includes(+this.userData.role)
  }

  async beforeMount() {
    const userId = this.$route.params.id;

    try {
      this.userData = await this.$apiCalls.fetchUserDetails(userId);

      if (this.showUserBlocks) {
        const resultDashboard = await this.$apiCalls.dashboardFetch(userId);

        this.userDashboardData.blocks = resultDashboard.blocks
      }

      if (this.showAgentBlocks) {
        const resultCommissions = await this.$apiCalls.fetchCommissionsStatus({userId});

        this.agentDashboardData.blocks = resultCommissions.blocks
      }
    } catch (er) {
      this.$alerts.error(er)
    }
  }
}
</script>
