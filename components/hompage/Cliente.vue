<template>
  <div>
    <!-- <activation-wizard v-if="userMustActivate"
                       class="mb-5"
    /> -->

    <dashboard-blocks :dashboard-data="dashboardData"></dashboard-blocks>

    <v-row class="my-5">
      <v-col sm="12" md="8">
        <v-card class="text-center">
          <v-card-text>
            <chart-lines
              :labels="chartsClientLabels"
              :datasets="chartsClientDataset"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="4">
        <v-card>
          <v-card-text class="d-flex">
            <a href="/GGM_7_dash.pdf" target="_blank" style="width: 100%">
              <v-img
                src="/GGM_7_dash.jpg"
                width="100%"
                contain
                class=""
              ></v-img>
            </a>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Grafico from "@/components/charts/Grafico";
import ActivationWizard from "@/components/hompage/activationWizard/ActivationWizard";
import clientDashboardChart from "@/config/charts/clientDashboard";
import DashboardBlocks from "~/components/DashboardBlocks";

import { onBeforeMount, reactive, ref, computed } from "@vue/composition-api";

export default {
  name: "Cliente",
  components: { DashboardBlocks, Grafico, ActivationWizard },
  setup(props, { root }) {
    const { $apiCalls, $options } = root;
    const monthsToShow = ref(6);
    const dashboardData = reactive({
      blocks: {
        deposit: 0,
        interestAmount: 0,
        depositCollected: 0,
        interestsCollected: 0
      },
      charts: {
        pastRecapitalizations: []
      }
    });

    const chartsClientDataset = computed(() => {
      const data = {
        deposit: [],
        interestAmount: [],
        "charts.picket-deposit": [],
        "charts.picked-interests": []
      };

      for (const _data of dashboardData.charts.pastRecapitalizations) {
        if (data.deposit.length >= monthsToShow.value) {
          break;
        }

        data.deposit.push(_data.deposit.toFixed(2));
        data.interestAmount.push(_data.interestAmount.toFixed(2));
      }

      return clientDashboardChart.datasets.map(set => {
        const label = root.$t(`charts.current-${set.id}`);

        set.data = (data[set.id] || []).reverse();
        set.label = label;

        return set;
      });
    });

    const chartsClientLabels = computed(() => {
      return clientDashboardChart.labels(
        dashboardData.charts.pastRecapitalizations
      );
    });

    onBeforeMount(async () => {
      const result = await $apiCalls.dashboardFetch();

      root.$set(dashboardData, "blocks", result.blocks);
      root.$set(dashboardData, "charts", result.charts);
    });

    return { dashboardData, chartsClientDataset, chartsClientLabels };
  },
  data() {
    return { clientDashboardChart };
  },
  computed: {
    ...mapGetters({
      userMustActivate: "user/mustActivate"
    })
  }
};
</script>

<style scoped></style>
