<template>
  <v-layout column>
    <NewsBox></NewsBox>

    <admin-cards></admin-cards>
  </v-layout>
</template>

<script>
import Chart from "@/components/charts/Chart";
import ChartLines from "@/components/charts/ChartLines";
import DataTable from "@/components/table/DataTable";


import adminDashboardChart from "@/config/charts/adminDashboard";
import usersTableSchema from "@/config/tables/usersSchema";
import requestsTableSchema from "@/config/tables/requestsSchema";

import users from "@/functions/users";
import {onMounted, reactive, ref} from "@vue/composition-api";
import AdminCards from "~/components/elements/cards/AdminCards";

export default {
  name: "ServClienti",
  components: {AdminCards, ChartLines, Chart, DataTable},
  setup(props, {root}) {
    const {$apiCalls, $router} = root;
    const dashboardChart = ref(adminDashboardChart);
    const dashboardData = reactive({
      usersToValidate: [],
    });

    function openUser(user) {
      $router.push("/users/" + user.id);
    }

    onMounted(async () => {
      const result = await $apiCalls.dashboardFetch();

      // root.$set(dashboardData, "validatedUsers", result.validatedUsers || []);
      root.$set(dashboardData, "usersToValidate", result.usersToValidate);
    });

    return {
      goToUser: users(root).goToUser,
      dashboardChart,
      dashboardData,
      openUser
    };
  },
  data() {
    return {
      adminDashboardChart
    };
  },
  computed: {
    usersTableHeaders() {
      /* return usersTableSchema(this).headers.filter(col => {
        if (col.value !== 'actions') {
          return true
        }
      }) */
    },

    pendingUsers() {
      return this.pendingUsers.map(group => group.data[0]);
    },
    chartsAdminDataset() {
      return this.adminDashboardChart.datasets.map(set => {
        set.label = this.$t(set.label);

        return set;
      });
    }
  }
};
</script>

<style scoped></style>
