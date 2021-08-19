<template>
  <basic-report
    filters-schema="reports"
    table-schema="reportsSchema"
    table-key="reports"
    :table-items="tableItems"
    v-model="commissionsForm"
    xls-name="Provvigioni"
    filters-key="commissions"
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
export default class CommissionsReport extends Vue {
  defaultFormData = {
    dates: [
      this.$moment().subtract(1, "months").set({
        date: 1,
        hour: 0,
        minute: 0,
        second: 0,
      }).format("YYYY-MM-DD"),

      this.$moment().set({
        date: 1,
        hour: 23,
        minute: 59,
        second: 59,
      })
        .subtract(1, "days")
        .format("YYYY-MM-DD")]
  }

  commissionsForm = {
    ...this.defaultFormData
  }

  get tableItems() {
    return this.$store.getters['reports/commissionsList'];
  }

  onApplyFilters(filters: any) {
    this.$nextTick(() => {
      if (filters.dates) {
        filters.startDate = filters.dates[0];
        filters.endDate = filters.dates[1];

        delete filters.dates;
      }

      this.$store.dispatch("reports/fetchCommissionsData", filters);
    })
  }

  onResetFilters() {
    this.$store.dispatch("reports/resetCommissionsData");

    this.commissionsForm = this.defaultFormData
  }
}
</script>
