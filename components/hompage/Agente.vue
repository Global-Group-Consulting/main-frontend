<template>
  <div>
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
            <a href="/magazine/GGM_3_21_Dash.pdf" target="_blank" style="width: 100%">
              <v-img
                src="/magazine/GGM_3_21_Dash.jpg"
                width="100%"
                contain
                class=""
              ></v-img>
            </a>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!--    <v-card width="100%" class="text-center mb-5">
          <v-card-text>
            <chart-lines
              :labels="agentDashboardChart.labels"
              :datasets="chartsAdminDataset"
            />
          </v-card-text>
        </v-card>-->
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Grafico from "@/components/charts/Grafico";
import ActivationWizard from "@/components/hompage/activationWizard/ActivationWizard";

import agentDashboardChart from "@/config/charts/agentDashboard";
import clientDashboardChart from "@/config/charts/clientDashboard";
import ChartLines from "@/components/charts/ChartLines";
import DashboardBlocks from "~/components/DashboardBlocks";

import {onBeforeMount, reactive, ref, computed} from "@vue/composition-api";

export default {
  name: "Cliente",
  components: {DashboardBlocks, ChartLines, Grafico, ActivationWizard},
  setup(props, {root}) {
    const {$apiCalls, $options, $moment} = root;
    const monthsToShow = ref(12);
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

      const futureData = []

      const lastRealRecapitalization = dashboardData.charts.pastRecapitalizations[0]

      for (let i = 0; i < 6; i++) {
        let newDeposit = 0
        let newInterest = 0
        let amountChange = 0
        let lastDate = null

        if (!lastRealRecapitalization) {
          break
        }

        if (futureData.length === 0) {
          lastDate = lastRealRecapitalization.created_at
          amountChange = dashboardData.blocks.interestAmount
          newDeposit = dashboardData.blocks.deposit + amountChange;
          newInterest = newDeposit * lastRealRecapitalization.interestPercentage / 100
        } else {
          lastDate = futureData[futureData.length - 1].created_at
          amountChange = futureData[futureData.length - 1].interestAmount
          newDeposit = futureData[futureData.length - 1].deposit + amountChange
          newInterest = newDeposit * lastRealRecapitalization.interestPercentage / 100
        }

        futureData.push({
          amountChange: amountChange,
          created_at: $moment(lastDate).add(1, "months").toISOString(),
          deposit: newDeposit,
          interestAmount: newInterest,
          interestPercentage: lastRealRecapitalization.interestPercentage,
          userId: lastRealRecapitalization.userId
        });
      }

      if (futureData.length > 0) {
        dashboardData.charts.pastRecapitalizations.unshift(...futureData.reverse())
      }

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

    return {dashboardData, chartsClientDataset, chartsClientLabels};
  },
  data() {
    return {
      agentDashboardChart,
      clientDashboardChart
    };
  },
  computed: {
    ...mapGetters({
      userMustActivate: "user/mustActivate"
    }),
    chartsAdminDataset() {
      return agentDashboardChart.datasets.map(set => {
        set.label = this.$t(set.label);

        return set;
      });
    }
  }
};
</script>

<style scoped></style>
