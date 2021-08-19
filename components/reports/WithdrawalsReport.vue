<template>
  <basic-report
    filters-schema="reports"
    table-schema="reportsSchema"
    table-key="reports"
    :table-items="tableItems"
    v-model="withdrawalsForm"
    xls-name="Riscossioni e Prelievi"
    filters-key="withdrawals"
    @applyFilters="onApplyFilters"
    @resetFilters="onResetFilters"
  />
</template>


<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import BasicReport from "~/components/reports/BasicReport.vue";

@Component({
  components: {BasicReport}
})
export default class WithdrawalsReport extends Vue {
  defaultFormData = {
    dates: [
      this.$moment().subtract(1, "months").set({
        date: 16,
        hour: 0,
        minute: 0,
        second: 0,
      }).format("YYYY-MM-DD"),
      this.$moment().set({
        date: 15,
        hour: 23,
        minute: 59,
        second: 59,
      }).format("YYYY-MM-DD")]
  }

  withdrawalsForm = {
    ...this.defaultFormData
  }

  get tableItems() {
    return this.$store.getters['reports/withdrawalsList'];
  }

  onApplyFilters(filters: any) {
    this.$nextTick(() => {
      if (filters.dates) {
        filters.startDate = filters.dates[0];
        filters.endDate = filters.dates[1];

        delete filters.dates;
      }

      this.$store.dispatch("reports/fetchWithdrawalData", filters);
    })
  }

  onResetFilters() {
    this.$store.dispatch("reports/resetWithdrawalData");

    this.withdrawalsForm = this.defaultFormData
  }

}
</script>
