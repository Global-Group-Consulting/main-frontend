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
      <v-card-title class="p-relative">
        <v-icon>mdi-file-document-edit-outline</v-icon>
        {{ this.$t("tables.pending-contract-signature") }}

        <div class="v-alert__border v-alert__border&#45;&#45;bottom blue"></div>
      </v-card-title>

      <v-card-text>
        <data-table
          :items="dashboardData.pendingSignatures"
          table-key="pendingSignatures"
          schema="usersSchema"
        >
          <template v-slot:item.signDocSent="{item}">
            {{ getSignDocSent(item).timestamp | dateHourFormatter }}
          </template>
          <template v-slot:item.signDocViewed="{item}">
            {{ getSignDocViewed(item).timestamp | dateHourFormatter }}
          </template>
          <template v-slot:item.signDocSigned="{item}">
            {{ getSignDocSigned(item).timestamp | dateHourFormatter }}
          </template>
          <template v-slot:item.signDocLogs="{item}">
            <v-menu offset-y open-on-hover bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-on="on" v-bind="attrs">
                  <v-icon>mdi-information</v-icon>
                </v-btn>
              </template>

              <signing-logs-popup :value="item.signinLogs"></signing-logs-popup>
            </v-menu>
          </template>
          <template v-slot:item.actions="{item}">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn color="primary" icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="onSignContractClick(item)">
                  <v-list-item-title>
                    {{ $t("menus.sign-contract") }}
                  </v-list-item-title>
                </v-list-item>

                <v-list-item :to="'/users/' + item.id">
                  <v-list-item-title>
                    {{ $t("menus.show-user-account") }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </data-table>
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

<script lang="ts">
import ChartLines from "@/components/charts/ChartLines.vue";
import RequestsListTable from "@/components/table/RequestsListTable.vue";


import adminDashboardChart from "@/config/charts/adminDashboard";
import DataTable from "~/components/table/DataTable.vue";
import {Component, Vue} from "vue-property-decorator";
import {SignRequestLog} from "~/@types/SignRequest";
import {WebhooksCall} from "~/@types/SignRequest/Webhooks";
import {User} from "~/@types/UserFormData";
import SigningLogsPopup from "~/components/elements/SigningLogsPopup.vue";

@Component({
  components: {SigningLogsPopup, DataTable, ChartLines, RequestsListTable},
})
export default class Admin extends Vue {

  public dashboardChart = adminDashboardChart;
  public dashboardData = {
    validatedUsers: [],
    pendingRequests: [],
    pendingSignatures: []
  }

  get pendingUsers() {
    // return pendingUsers.map((group) => group.data[0]);
    return [];
  }

  get chartsAdminDataset() {
    return this.dashboardChart.datasets.map(set => {
      set.label = this.$t(set.label) as string;

      return set;
    });
  }

  openRequest(request: any) {
    this.$router.push("/requests#" + request.id);
  }

  getSignDocSent(item: User): SignRequestLog {
    return item.signinLogs?.find(hook => hook.event === "sent") || {} as SignRequestLog
  }

  getSignDocViewed(item: User): SignRequestLog {
    return item.signinLogs?.find(hook => hook.event === "signer_viewed") || {} as SignRequestLog
  }

  getSignDocSigned(item: User): SignRequestLog {
    return item.signinLogs?.find(hook => hook.event === "signer_signed") || {} as SignRequestLog
  }

  onSignContractClick(item: User) {
    this.$alerts.info({
      title: "",
      html: this.$t("alerts.sign-contract-unavailable", {name: item.firstName + " " + item.lastName}) as string
    })
  }

  async mounted() {
    const result = await this.$apiCalls.dashboardFetch();

    // root.$set(dashboardData, "validatedUsers", result.validatedUsers || []);
    this.dashboardData.pendingRequests = result.pendingRequests
    this.dashboardData.pendingSignatures = result.pendingSignatures
  }

}

</script>

<style scoped></style>
