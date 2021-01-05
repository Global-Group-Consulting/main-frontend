<template>
  <v-layout column>
    <v-card width="100%" class="text-center mb-5">
      <v-card-text>
        <chart-lines
          :labels="adminDashboardChart.labels"
          :datasets="chartsAdminDataset"
        />
      </v-card-text>
    </v-card>

    <v-card class="mb-5">
      <!-- Table with all users in "validated" state -->
      <v-card-title class="p-relative">
        <v-icon class="mr-2">mdi-account-question</v-icon>
        {{ this.$t("tables.pending-verify-users-table") }}

        <div class="v-alert__border v-alert__border--bottom red"></div>
      </v-card-title>

      <v-card-text>
        <data-table
          :items="dashboardData.usersToValidate"
          table-key="usersToValidate"
          schema="usersSchema"
          no-data-text="tables.no-users-to-validate"
          @click:row="openUser"
        ></data-table>
      </v-card-text>
    </v-card>

    <!--    <v-card class="mb-5">
          <v-card-text>
            <p class="text-h5 text&#45;&#45;primary">
              <v-icon>mdi-account-clock</v-icon>
              {{ this.$t("tables.pending-users-table") }}
            </p>

            <v-data-table
              :headers="usersTableHeaders"
              :items="pendingUsers"
              :items-per-page="10"
              @click:row="goToUser($event._id)"
            >
            </v-data-table>
          </v-card-text>
        </v-card>-->

    <!-- <v-card class="mb-5">
      <v-card-text>
        <p class="text-h5 text--primary">
          <v-icon>mdi-compare-vertical</v-icon>
          {{ this.$t("tables.pending-requests-table") }}
        </p>

        <v-data-table
          :headers="requestsTableHeaders"
          :items="pendingRequests"
          :items-per-page="10"
        >
          <template v-slot:item.requestType="{ item }">
            {{
              $t(
                "enums.RequestTypes." +
                  $enums.RequestTypes.get(item.requestType).id
              )
            }}
          </template>

          <template v-slot:item.requestAmount="{ item }">
            {{ item.requestAmount | moneyFormatter }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card> -->
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

export default {
  name: "ServClienti",
  components: {ChartLines, Chart, DataTable},
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
      pendingRequests,
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
      return pendingUsers.map(group => group.data[0]);
    },
    chartsAdminDataset() {
      return adminDashboardChart.datasets.map(set => {
        set.label = this.$t(set.label);

        return set;
      });
    }
  }
};
</script>

<style scoped></style>
