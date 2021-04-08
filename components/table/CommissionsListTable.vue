<template>
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
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import DataTable from "./DataTable.vue";
import CommissionType from "@/enums/CommissionType";
import {IMovement} from "~/@types/Movement";

@Component({
  components: {DataTable}
})
export default class CommissionsListTable extends Vue {
  commissions = []

  formatAmountChange(item: IMovement) {
    const sign = [
      CommissionType.NEW_DEPOSIT,
      CommissionType.ANNUAL_DEPOSIT,
      CommissionType.TOTAL_DEPOSIT,
      CommissionType.MANUAL_ADD,
    ].includes(item.commissionType)
      ? "+"
      : "-";
    const color = sign === "-" ? "red--text" : "green--text";

    return `<span class="text-no-wrap ${color}">€ ${sign}${
      this.$options?.filters?.moneyFormatter(item.amountChange.toFixed(2)
      )}</span>`;
  }

  formatCommissionType(item: IMovement) {
    const commissionId = CommissionType.get(item.commissionType).id;
    const text = this.$t(`enums.CommissionType.${commissionId}`);

    if (item.commissionType === CommissionType.COMMISSIONS_REINVESTMENT) {
      return `<strong>${text}</strong>`;
    }

    return text;
  }

  getItemClass(item: IMovement) {
    if (item.commissionType === CommissionType.COMMISSIONS_TO_REINVEST) {
      return "yellow lighten-5";
    }
  }

  async beforeMount() {
    try {
      const result = await this.$apiCalls.fetchCommissionsStatus();

      debugger

      this.commissions = result.list
    } catch (er) {
      console.error(er)
    }
  }
}
</script>

<style scoped>

</style>
