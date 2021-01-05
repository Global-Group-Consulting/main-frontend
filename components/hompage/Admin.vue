<template>
  <v-layout column>
    <v-card width="100%" class="text-center mb-5">
      <v-card-text>
        <chart-lines
          :labels="dashboardChart.labels"
          :datasets="chartsAdminDataset"
        />
      </v-card-text>
    </v-card>

    <v-card class="mb-5">
      <!-- Table with all users in "validated" state -->
      <v-card-title class="p-relative">
        <v-icon>mdi-account-clock</v-icon>
        {{ this.$t("tables.pending-users-table") }}

        <div class="v-alert__border v-alert__border--bottom red"></div>
      </v-card-title>

      <v-card-text>
        <data-table
          :items="[{ firstName: 'asdasd' }]"
          table-key="pendingUsers"
          schema="usersSchema"
          no-data-text="tables.no-pending-requests"
        ></data-table>
      </v-card-text>
    </v-card>

    <v-card class="mb-5">
      <v-card-title class="p-relative">
        <v-icon>mdi-fire</v-icon>
        {{ this.$t("tables.pending-requests-table") }}

        <div class="v-alert__border v-alert__border--bottom warning"></div>
      </v-card-title>

      <v-card-text>
        <requests-list-table
          :items="dashboardData.pendingRequests"
          @click:row="openRequest"
        >
        </requests-list-table>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import ChartLines from "@/components/charts/ChartLines";
import RequestsListTable from "@/components/table/RequestsListTable";


import adminDashboardChart from "@/config/charts/adminDashboard";
import users from "@/functions/users";
import { computed, onMounted, reactive, ref } from "@vue/composition-api";

export default {
  name: "Admin",
  components: { ChartLines, RequestsListTable },
  setup(props, { root }) {
    const { $apiCalls, $router } = root;
    const dashboardChart = ref(adminDashboardChart);
    const dashboardData = reactive({
      validatedUsers: [],
      pendingRequests: []
    });

    function openRequest(request) {
      $router.push("/requests?open=" + request.id);
    }

    onMounted(async () => {
      const result = await $apiCalls.dashboardFetch();

      // root.$set(dashboardData, "validatedUsers", result.validatedUsers || []);
      root.$set(dashboardData, "pendingRequests", result.pendingRequests);
    });

    return {
      goToUser: users(root).goToUser,
      dashboardChart,
      dashboardData,
      openRequest
    };
  },
  data() {
    return {
    };
  },
  computed: {
    pendingUsers() {
      // return pendingUsers.map((group) => group.data[0]);
      return [];
    },
    chartsAdminDataset() {
      return this.dashboardChart.datasets.map(set => {
        set.label = this.$t(set.label);

        return set;
      });
    }
  }
};
</script>

<style scoped></style>
