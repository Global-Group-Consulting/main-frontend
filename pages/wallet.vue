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

          <data-table
            :items="commissions"
            table-key="commissions"
            schema="commissionsSchema"
            :items-per-page="25"
            :item-class="getItemClass"
            :options="{
              sortBy: ['created_at'],
              sortDesc: [true]
            }"
          >
            <template v-slot:item.amountChange="{ item }">
              <div v-html="formatAmountChange(item)"></div>
            </template>

            <template v-slot:item.user="{ item }">
              <div v-if="item.user">
                {{ item.user.firstName }} {{ item.user.lastName }}
                ({{ $t("enums.UserRoles." + $enums.UserRoles.getIdName(+item.user.role)) }})
              </div>
            </template>

            <template v-slot:item.commissionType="{ item }">
              <div v-html="formatCommissionType(item)"></div>
            </template>

            <template v-slot:item.commissionPercentage="{ item }">
              <span v-if="item.commissionPercentage">
                {{ item.commissionPercentage }} %
              </span>
            </template>

            <template v-slot:item.currMonthCommissions="{ item }">
              <span class="text-no-wrap">
                € {{ item.currMonthCommissions|moneyFormatter }}
              </span>
            </template>

          </data-table>

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
import CommissionType from "@/enums/CommissionType";
import pageBasicFn from "@/functions/pageBasic"
import {PortfolioPermissions} from "../functions/acl/enums/portfolio.permissions";

export default {
  name: "wallet",
  components: {PageHeader, DataTable, DashboardBlocks},
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
    const commissions = ref([])

    /**
     *@param {IMovement} item
     */
    function formatAmountChange(item) {
      const sign = [
        CommissionType.NEW_DEPOSIT,
        CommissionType.ANNUAL_DEPOSIT,
        CommissionType.TOTAL_DEPOSIT,
      ].includes(item.commissionType)
        ? "+"
        : "-";
      const color = sign === "-" ? "red--text" : "green--text";

      return `<span class="text-no-wrap ${color}">€ ${sign}${$options.filters.moneyFormatter(
        item.amountChange.toFixed(2)
      )}</span>`;
    }

    /**
     *@param {IMovement} item
     */
    function formatCommissionType(item) {
      const commissionId = CommissionType.get(item.commissionType).id;
      const text = $i18n.t(`enums.CommissionType.${commissionId}`);

      if (item.commissionType === CommissionType.COMMISSIONS_REINVESTMENT) {
        return `<strong>${text}</strong>`;
      }

      return text;
    }

    /**
     *@param {IMovement} item
     */
    function getItemClass(item) {
      if (item.commissionType === CommissionType.COMMISSIONS_TO_REINVEST) {
        return "yellow lighten-5";
      }
    }

    onBeforeMount(async () => {
      const result = await $apiCalls.fetchCommissionsStatus();

      root.$set(dashboardData, "blocks", result.blocks);
      root.$set(commissions, "value", result.list);
    });

    return {
      ...pageBasicFn(root, "wallet"),
      dashboardData,
      commissions,
      formatAmountChange,
      formatCommissionType,
      getItemClass
    }
  }
}
</script>

<style scoped>

</style>
