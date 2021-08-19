<template>
  <v-layout>
    <v-flex>
      <page-header page-name="reports"/>

      <dynamic-tabs :tabs-list="tabsList"
                    :loading="loading"
                    outlined>
        <template slot="tabContent_withdrawals">
          <withdrawals-report/>
        </template>

        <template slot="tabContent_commissions">
          <commissions-report/>
        </template>
      </dynamic-tabs>
    </v-flex>
  </v-layout>
</template>


<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {DynamicTab} from "~/@types/components/DynamicTab";

import DataTable from "~/components/table/DataTable.vue";
import DynamicTabs from "~/components/DynamicTabs.vue";
import PageHeader from "~/components/blocks/PageHeader.vue";
import PageToolbar from "~/components/blocks/PageToolbar.vue";
import DynamicFilters from "~/components/filters/DynamicFilters.vue";

import WithdrawalsReport from "~/components/reports/WithdrawalsReport.vue";
import CommissionsReport from "~/components/reports/CommissionsReport.vue";
import {ReportsPermissions} from "~/functions/acl/enums/reports.permissions";

@Component({
  components: {
    CommissionsReport,
    WithdrawalsReport,
    DataTable,
    DynamicTabs,
    PageHeader,
    PageToolbar,
    DynamicFilters,
  },
  meta: {
    permissions: [ReportsPermissions.REPORTS_READ]
  },
})
export default class Reports extends Vue {
  loading: boolean = false;

  commissionsForm = {}

  get tabsList(): DynamicTab[] {
    return [
      {
        id: "withdrawals",
        title: "Riscossioni / Prelievi",
      },
      {
        id: "commissions",
        title: "Provvigioni",
      },
    ]
  }


}
</script>
