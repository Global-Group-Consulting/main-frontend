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
      <v-card-text>
        <!-- Table with all users in "validated" state -->
        <p class="text-h5 text--primary">
          <v-icon>mdi-account-clock</v-icon>
          {{ this.$t("tables.pending-users-table") }}
        </p>

        <v-data-table
          :headers="usersTableHeaders"
          :items="dashboardData.validatedUsers"
          :items-per-page="10"
          @click:row="goToUser($event.id)"
        >
          <template v-slot:item.contractNumber="{ item }">
            {{ $options.filters.contractNumberFormatter(item.contractNumber) }}
          </template>

          <template v-slot:item.validated_at="{ item }">
            {{ $options.filters.dateFormatter(item.validated_at, true) }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

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

  import { requests as pendingRequests } from "@/assets/fakeRichieste";

  import adminDashboardChart from "@/config/charts/adminDashboard";
  import availableTableColumns from "@/config/tables/usersSchema";
  import requestsTableSchema from "@/config/tables/requestsSchema";
  import users from "@/functions/users";
  import { computed, onMounted, reactive, ref } from "@vue/composition-api";

  export default {
    name: "Admin",
    components: { ChartLines, Chart },
    setup(props, { root }) {
      const { $apiCalls } = root;
      const dashboardChart = ref(adminDashboardChart);
      const dashboardData = reactive({
        validatedUsers: [],
        pendingRequeusts: [],
      });

      const usersTableHeaders = computed(() => {
        const columns = [
          "contractNumber",
          "firstName",
          "lastName",
          "email",
          "validatedAt",
        ];

        return columns.reduce((acc, column) => {
          const col = availableTableColumns[column];

          acc.push({
            ...col,
            text: root.$t(col.text),
          });

          return acc;
        }, []);
        /* return usersTableSchema.headers.filter((col) => {
                                if (col.value !== "actions") {
                                  return true;
                                }
                              }); */
      });

      onMounted(async () => {
        const result = await $apiCalls.dashboardData();

        root.$set(dashboardData, "validatedUsers", result.validatedUsers || []);
        root.$set(
          dashboardData,
          "pendingRequeusts",
          result.pendingRequeusts || []
        );
      });

      return {
        goToUser: users(root).goToUser,
        usersTableHeaders,
        dashboardChart,
        dashboardData,
      };
    },
    data() {
      return {
        pendingRequests,
      };
    },
    computed: {
      requestsTableHeaders() {
        /* return requestsTableSchema(this).headers.filter((col) => {
                                if (col.value !== "actions") {
                                  return true;
                                }
                              }); */
        return [];
      },
      pendingUsers() {
        // return pendingUsers.map((group) => group.data[0]);
        return [];
      },
      chartsAdminDataset() {
        return this.dashboardChart.datasets.map((set) => {
          set.label = this.$t(set.label);

          return set;
        });
      },
    },
  };
</script>

<style scoped>

</style>
