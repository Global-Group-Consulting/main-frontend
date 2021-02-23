<template>
  <v-layout>
    <v-flex>
      <page-header
        page-name="requests"
      ></page-header>

      <page-toolbar>
        <template slot="center-block">
          <tooltip-btn
            v-if="permissions.addRequest"
            :tooltip="$t('pages.requests.btnWithdrawal-tooltip')"
            text
            color="red"
            breakpoint="sm"
            icon-name="mdi-cash-minus"
            @click="newWithdrawlRequest"
          >
            {{ $t("pages.requests.btnWithdrawal") }}
          </tooltip-btn>

          <tooltip-btn
            v-if="permissions.addRequestGold"
            :tooltip="$t('pages.requests.btnWithdrawalGold-tooltip')"
            text
            color="orange"
            breakpoint="sm"
            icon-name="mdi-bank-minus"
            @click="newWithdrawlRequestGold"
          >
            {{ $t("pages.requests.btnWithdrawalGold") }}
          </tooltip-btn>

          <tooltip-btn
            v-if="permissions.addRequest"
            :tooltip="$t('pages.requests.btnDeposit-tooltip')"
            text
            color="green"
            breakpoint="sm"
            icon-name="mdi-cash-plus"
            @click="newDepositRequest"
          >
            {{ $t("pages.requests.btnDeposit") }}
          </tooltip-btn>

          <v-menu offset-y
                  transition="slide-y-transition"
                  v-if="permissions.userType === 'admin'"
                  :close-on-content-click="true"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                text
                v-bind="attrs"
                v-on="on"
              >
                <v-icon class="mr-2">mdi-download</v-icon>
                {{ $t("pages.requests.btnDownloadReport") }}

                <v-icon class="">mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-list>
                <v-list-item @click="onDownloadReportClick()">
                  <v-list-item-title>{{ getLastMonth() }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="onDownloadReportClick(2)">
                  <v-list-item-title>{{ getLastMonth(2) }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="onDownloadReportClick(3)">
                  <v-list-item-title>{{ getLastMonth(3) }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>


          </v-menu>
        </template>
      </page-toolbar>

      <v-tabs v-model="currentTab">
        <v-tab v-for="table of requestsTables" :key="table.id">
          <v-icon class="mr-2" small :color="requestsTables[currentTab].id === table.id ? table.color : ''">
            {{ table.icon }}
          </v-icon>
          {{ table.title }} ({{ requestsGroups[table.id].length }})
        </v-tab>
      </v-tabs>

      <v-card class="overflow-hidden">
        <v-tabs-items v-model="currentTab" touchless>
          <v-tab-item v-for="table of requestsTables" :key="table.id">
            <requests-list-table
              :condition="table.id"
              :items="requestsGroups[table.id]"
              :sort-by="table.sortBy"
              :sort-desc="table.sortDesc"
              :multi-sort="table.multiSort"
              @click:row="openRequestDetails"
              @refetchData="onRefetchData"
              @requestStartWorking="onRequestStartWorking"
              :items-per-page="25"
            ></requests-list-table>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-flex>

    <request-dialog
      @newRequestAdded="onNewRequestAdded"
      @requestDeleted="onRequestDeleted"
      @requestStatusChanged="onRequestStatusChanged"
      @requestStartWorking="onRequestStartWorking"
      v-if="$store.getters['dialog/dialogId'] === 'RequestDialog'"
    ></request-dialog>

    <request-dialog-gold
      @newRequestAdded="onNewRequestAdded"
      @requestDeleted="onRequestDeleted"
      @requestStatusChanged="onRequestStatusChanged"
      @requestStartWorking="onRequestStartWorking"
      v-if="$store.getters['dialog/dialogId'] === 'RequestDialogGold'"
    ></request-dialog-gold>

    <communication-new-dialog
      v-if="$store.getters['dialog/dialogId'] === 'CommunicationNewDialog'"
      @communicationAdded="onCommunicationAdded"
    ></communication-new-dialog>

  </v-layout>
</template>

<script>
import {ref, computed, onBeforeMount, onMounted, watch} from "@vue/composition-api";

import jsFileDownload from "js-file-download"
import {capitalize} from "lodash"

// configs
import tableHeadersSchema from "../config/tables/requestsSchema";

// components
import PageHeader from "../components/blocks/PageHeader";
import RequestsCrudActions from "../components/table/RequestsCrudAction";
import RequestDialog from "../components/dialogs/RequestDialog";
import CommunicationNewDialog from "../components/dialogs/CommunicationNewDialog";
import RequestsListTable from "../components/table/RequestsListTable";

// functions
import pageBasicFn from "../functions/pageBasic";
import tableHeadersFn from "../functions/tablesHeaders";
import permissionsFn from "../functions/permissions";
import RequestTypes from "../enums/RequestTypes";
import PageToolbar from "@/components/blocks/PageToolbar";
import RequestDialogGold from "@/components/dialogs/RequestGoldDialog";
import {RequestsPermissions} from "../functions/acl/enums/requests.permissions";

export default {
  components: {
    RequestDialogGold,
    PageToolbar,
    RequestDialog,
    PageHeader,
    RequestsCrudActions,
    RequestsListTable,
    CommunicationNewDialog
  },
  meta: {
    permissions: [RequestsPermissions.ACL_REQUESTS_ALL_READ, RequestsPermissions.ACL_REQUESTS_SELF_READ]
  },
  setup(props, {root}) {
    const {
      $apiCalls,
      $alerts,
      $set,
      $enums,
      $store,
      $i18n,
      $options,
      $moment,
      $route,
      $router,
    } = root;
    const permissions = permissionsFn(root);
    const requestsList = ref([]);
    const currentTab = ref(0);
    const requestsGroups = computed(() => {
      const toReturn = {
        nuova: [],
        lavorazione: [],
        accettata: [],
        rifiutata: []
      };

      requestsList.value.forEach(richiesta => {
        const stato = $enums.RequestStatus.get(richiesta.status);
        let groupName = stato.id;

        if (groupName === "annullata") {
          groupName = "accettata";
        }

        toReturn[groupName].push(richiesta);
      });

      return toReturn;
    });
    const requestsTables = computed(() => {
      return [
        {
          id: "nuova",
          title: $i18n.t(`pages.requests.tableNuova-title`),
          color: "warning",
          icon: "mdi-timer-sand",
          sortBy: "created_at",
          sortDesc: true
        },
        {
          id: "lavorazione",
          title: $i18n.t(`pages.requests.tableLavorazione-title`),
          color: "blue",
          icon: "mdi-sitemap",
          sortBy: "created_at",
          sortDesc: true
        },
        {
          id: "accettata",
          title: $i18n.t(`pages.requests.tableAccettata-title`),
          color: "green",
          icon: "mdi-check-all",
          sortBy: ["completed_at", "created_at"],
          sortDesc: [true, false],
          multiSort: true
        },
        {
          id: "rifiutata",
          title: $i18n.t(`pages.requests.tableRifiutata-title`),
          color: "red",
          icon: "mdi-close-box-multiple-outline",
          sortBy: ["completed_at", "created_at"],
          sortDesc: [true, false],
          multiSort: true
        }
      ];
    });
    const getTabColor = computed(() => {
      return requestsTables.value[currentTab.value].color
    })

    const actionsList = [
      {
        if: permissions.addRequest,
        tooltip: "$t('pages.requests.btnWithdrawal-tooltip')",
        color: "red",
        breakpoint: "sm",
        iconName: "mdi-cash-minus",
        click: newWithdrawlRequest,
        options: {
          text: true
        }
      },
      {
        title: "RiCiao",
        icon: "",
        click: ""
      }
    ]

    async function _fetchAll() {
      try {
        const result = await $apiCalls.fetchRequests();

        $set(requestsList, "value", result);
      } catch (er) {
        $alerts.error(er);
      }
    }

    function getLastMonth(months, returnMoment = false) {
      const now = $moment()
      let rightMonth = now.date() > 15 ? now : now.subtract(1, "months")

      if (months) {
        rightMonth = now.subtract(months - 1, "months")
      }

      if (returnMoment) {
        return rightMonth
      }

      const prevMonth = $moment(rightMonth).subtract(1, "months")

      return capitalize(rightMonth.format("MMMM YYYY")) + ` (16 ${prevMonth.format("MMM")} - 15 ${rightMonth.format("MMM")})`
    }

    function onRefetchData() {
      _fetchAll();
    }

    function onNewRequestAdded() {
      _fetchAll();
    }

    function onRequestDeleted() {
      _fetchAll();
    }

    function onRequestStatusChanged() {
      _fetchAll();
    }

    function newDepositRequest() {
      $store.dispatch("dialog/updateStatus", {
        title: $i18n.t("dialogs.requests.title-deposit"),
        id: "RequestDialog",
        data: {
          type: $enums.RequestTypes.VERSAMENTO
        }
      });
    }

    function newWithdrawlRequest(type) {
      $store.dispatch("dialog/updateStatus", {
        title: $i18n.t("dialogs.requests.title-withdrawal"),
        id: "RequestDialog",
        data: {
          type: type || $enums.RequestTypes.RISC_INTERESSI
        }
      });
    }

    function newWithdrawlRequestGold(type) {
      $store.dispatch("dialog/updateStatus", {
        title: $i18n.t("dialogs.requests.title-withdrawal-gold"),
        id: "RequestDialogGold",
        fullscreen: true,
        theme: "global-club",
        noActions: true,
        data: {
          type: type || $enums.RequestTypes.RISC_CAPITALE
        }
      });
    }

    function openRequestDetails(row) {
      const userId = row.user_id;
      let title = $i18n.t("dialogs.requests.title-details");

      if (permissions.userType === "admin") {
        title += ` <small><em>(${$options.filters.userFormatter(
          row.user
        )} - ${$options.filters.contractNumberFormatter(
          row.user.contractNumber
        )})</em></small>`;
      }

      $store.dispatch("dialog/updateStatus", {
        title,
        id: "RequestDialog",
        readonly: true,
        data: {
          ...row,
          currency: +row.currency,
          status: +row.status,
          type: +row.type,
          wallet: +row.wallet
        }
      });
    }

    function onRequestStartWorking(request) {
      root.$store.dispatch("dialog/updateStatus", {
        id: "CommunicationNewDialog",
        title: root.$t(`dialogs.communicationNewDialog.title-conversation`),
        fullscreen: false,
        readonly: false,
        data: {
          type: $enums.MessageTypes.CONVERSATION,
          subject: root.$t(
            "dialogs.communicationNewDialog.subject-new-deposit",
            {date: $options.filters.dateFormatter(request.created_at)}
          ),
          receiver: request.user.id,
          message: root.$t(
            "dialogs.communicationNewDialog.message-new-deposit",
            {
              firstName: request.user.firstName,
              lastName: request.user.lastName,
              amount: $options.filters.moneyFormatter(request.amount)
            }
          ),
          request
        }
      });
    }

    function onCommunicationAdded(communication) {
      _fetchAll();
    }

    function onQueryChange(route) {
      const query = route.query;

      if (query.open) {
        const idToOpen = query.open;

        const request = requestsList.value.find(_req => _req.id === idToOpen);

        if (request) {
          openRequestDetails(request);
        }

        root.$router.replace({query: {}});
      }
    }

    /**
     *
     * @param months
     * @returns {Promise<void>}
     */
    async function onDownloadReportClick(months) {
      const rightMonth = getLastMonth(months, true)

      try {
        const file = await $apiCalls.downloadRequestsReport(rightMonth.format("YYYY-MM"))

        jsFileDownload(file.data, $i18n.t("pages.requests.fileReportName", {date: getLastMonth(months)}) + ".xlsx")
      } catch (er) {
        $alerts.error(er)
      }
    }

    function onUrlQueryChange() {
      const query = $route.query;

      // if in the query we found "new" then open the corresponding dialog if any
      if (query.new) {
        switch (query.new) {
          case "add_deposit":
            newDepositRequest();
            break;
          case "collect_deposit":
          case "collect_interests":
          case "collect_commissions":
            let type;

            if (query.new === "collect_deposit") {
              type = RequestTypes.RISC_CAPITALE;
            } else if (query.new === "collect_interests") {
              type = RequestTypes.RISC_INTERESSI;
            } else if (query.new === "collect_commissions") {
              type = RequestTypes.RISC_PROVVIGIONI;
            }

            newWithdrawlRequest(type);
            break;
          case "collect_gold":
            newWithdrawlRequestGold()
            break;
        }

        onQueryChange($route)
      }
    }

    onBeforeMount(async () => {
      await _fetchAll();

      onQueryChange($route)
    });

    onMounted(() => {
      onUrlQueryChange()
    });

    return {
      ...pageBasicFn(root, "requests"),
      ...tableHeadersFn(tableHeadersSchema, "requests", root),
      currentTab,
      permissions,
      requestsList,
      requestsGroups,
      requestsTables,
      getTabColor,
      getLastMonth,
      newDepositRequest,
      newWithdrawlRequest,
      newWithdrawlRequestGold,
      openRequestDetails,
      onRefetchData,
      onNewRequestAdded,
      onRequestDeleted,
      onRequestStatusChanged,
      onRequestStartWorking,
      onCommunicationAdded,
      onQueryChange,
      onUrlQueryChange,
      onDownloadReportClick,
      actionsList
    };
  },
  watch: {
    '$route.query.new'() {
      this.onUrlQueryChange()
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.onQueryChange(to)

    next()
  }
};
</script>
