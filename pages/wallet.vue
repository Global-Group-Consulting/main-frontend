<template>
  <v-flex>
    <page-header page-name="wallet"/>

    <agent-wallet-cards></agent-wallet-cards>

    <dynamic-tabs :tabs-list="tabs"
                  outlined>
      <template v-slot:tabContent_dashboard="{item}">
        <admin-cards outlined></admin-cards>
      </template>

      <template v-slot:tabContent_commissions="{item}">
        <commissions-list-table :user-id="$auth.user.id"></commissions-list-table>
      </template>

      <template v-slot:tabContent_agentBrites="{item}">
        <agent-brite-list-table></agent-brite-list-table>
      </template>

    </dynamic-tabs>

    <RequestsListTable table-schema="requestsTeam"></RequestsListTable>

    <request-dialog
        v-if="$store.getters['dialog/dialogId'] === 'RequestDialog'"
    ></request-dialog>
  </v-flex>
</template>

<script lang="ts">
import DashboardBlocks from "@/components/DashboardBlocks.vue";
import DataTable from "@/components/table/DataTable.vue";
import PageHeader from "@/components/blocks/PageHeader.vue";

import {PortfolioPermissions} from "~/functions/acl/enums/portfolio.permissions";
import CommissionsListTable from "../components/table/CommissionsListTable.vue";
import {Component, Vue} from "vue-property-decorator";
import RequestDialog from "~/components/dialogs/RequestDialog.vue";
import {DynamicTab} from "~/@types/components/DynamicTab";
import DynamicTabs from "~/components/DynamicTabs.vue";
import AgentBriteListTable from "~/components/table/AgentBriteListTable.vue";
import DashboardCard from "~/components/dashboard/DashboardCard.vue";
import AgentWalletCards from "~/components/elements/cards/AgentWalletCards.vue";

@Component({
  components: {
    AgentWalletCards,
    DashboardCard,
    AgentBriteListTable,
    DynamicTabs,
    RequestDialog,
    CommissionsListTable,
    PageHeader,
    DataTable,
    DashboardBlocks
  },
  meta: {
    permissions: [PortfolioPermissions.ACL_PORTFOLIO_SELF_READ]
  }
})
export default class Wallet extends Vue {

  tabs: DynamicTab[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      sortBy: [],
      sortDesc: []
    },
    {
      id: 'commissions',
      title: this.$t(`pages.wallet.tabs.commissions`) as string,
      sortBy: ['created_at'],
      sortDesc: [true]
    },
    {
      id: 'agentBrites',
      title: this.$t(`pages.wallet.tabs.agentBrites`) as string,
      sortBy: ['created_at'],
      sortDesc: [true]
    }
  ]
}
</script>

<style scoped>

</style>
