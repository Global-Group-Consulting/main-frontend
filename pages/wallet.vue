<template>
  <v-flex>
    <page-header
      page-name="wallet"
    ></page-header>

    <dashboard-blocks :dashboard-data="dashboardData"
                      page="wallet"></dashboard-blocks>

    <v-row class="my-5">
      <v-col cols="12">
        <v-card>

          <commissions-list-table :user-id="this.$auth.user.id"></commissions-list-table>

        </v-card>
      </v-col>
    </v-row>
  </v-flex>
</template>

<script>
import {onBeforeMount, reactive, ref} from "@vue/composition-api";
import DashboardBlocks from "@/components/DashboardBlocks";
import DataTable from "@/components/table/DataTable";
import PageHeader from "@/components/blocks/PageHeader";

import pageBasicFn from "@/functions/pageBasic"
import {PortfolioPermissions} from "../functions/acl/enums/portfolio.permissions";
import CommissionsListTable from "../components/table/CommissionsListTable";

export default {
  name: "wallet",
  components: {CommissionsListTable, PageHeader, DataTable, DashboardBlocks},
  meta: {
    permissions: [PortfolioPermissions.ACL_PORTFOLIO_SELF_READ]
  },
  setup(props, {root}) {
    const {$apiCalls, $options, $i18n} = root
    const dashboardData = reactive({
      blocks: {
        monthCommissions: 0,
        reinvestedCommissions: 0,
        collectedCommissions: 0,
        clientsTotalDeposit: 0,
      }
    });



    onBeforeMount(async () => {
      const result = await $apiCalls.fetchCommissionsStatus();

      root.$set(dashboardData, "blocks", result.blocks);
      // root.$set(commissions, "value", result.list);
    });

    return {
      ...pageBasicFn(root, "wallet"),
      dashboardData,
      /*commissions,
      formatAmountChange,
      formatCommissionType,
      getItemClass*/
    }
  }
}
</script>

<style scoped>

</style>
