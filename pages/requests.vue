<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <v-toolbar class="mb-5" v-if="permissions.userType === 'user'">
        <v-toolbar-items class="flex-fill">
          <v-spacer></v-spacer>

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

          <v-spacer></v-spacer>
        </v-toolbar-items>
      </v-toolbar>

      <v-row v-for="table of requestsTables" :key="table.id">
        <v-col cols="12">
          <v-card>
            <v-card-title class="p-relative">
              <v-icon class="mr-2">{{ table.icon }}</v-icon>
              {{ table.title }}
              <div
                class="v-alert__border v-alert__border--bottom"
                :class="table.color"
              ></div>
            </v-card-title>

            <requests-list-table
              :condition="table.id"
              :items="requestsGroups[table.id]"
              :sort-by="table.sortBy"
              :sort-desc="table.sortDesc"
              :multi-sort="table.multiSort"
              @click:row="openRequestDetails"
              @refetchData="onRefetchData"
              @requestStartWorking="onRequestStartWorking"
            ></requests-list-table>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>

    <request-dialog
      @newRequestAdded="onNewRequestAdded"
      @requestDeleted="onRequestDeleted"
      @requestStatusChanged="onRequestStatusChanged"
      @requestStartWorking="onRequestStartWorking"
      v-if="$store.getters['dialog/dialogId'] === 'RequestDialog'"
    ></request-dialog>

    <communication-new-dialog
      v-if="$store.getters['dialog/dialogId'] === 'CommunicationNewDialog'"
      @communicationAdded="onCommunicationAdded"
    ></communication-new-dialog>
  </v-layout>
</template>

<script>
import { ref, computed, onBeforeMount, onMounted } from "@vue/composition-api";

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

export default {
  components: {
    RequestDialog,
    PageHeader,
    RequestsCrudActions,
    RequestsListTable,
    CommunicationNewDialog
  },
  setup(props, { root }) {
    const {
      $apiCalls,
      $set,
      $enums,
      $store,
      $i18n,
      $options,
      $route,
      $alerts
    } = root;
    const permissions = permissionsFn(root);
    const requestsList = ref([]);
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

    async function _fetchAll() {
      try {
        const result = await $apiCalls.fetchRequests();

        $set(requestsList, "value", result);
      } catch (er) {
        $alerts.error(er);
      }
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
            { date: $options.filters.dateFormatter(request.created_at) }
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

    onBeforeMount(async () => {
      const query = $route.query;

      await _fetchAll();

      if (query.open) {
        const idToOpen = query.open;

        const request = requestsList.value.find(_req => _req.id === idToOpen);

        if (request) {
          openRequestDetails(request);
        }

        root.$router.replace({ query: {} });
      }
    });

    onMounted(() => {
      const query = $route.query;

      // if in the query we found "new" then open the corresponding dialog if any
      if (query.new) {
        switch (query.new) {
          case "add_deposit":
            newDepositRequest();
            break;
          case "collect_deposit":
          case "collect_interests":
            let type;

            if (query.new === "collect_deposit") {
              type = RequestTypes.RISC_CAPITALE;
            } else if (query.new === "collect_interests") {
              type = RequestTypes.RISC_INTERESSI;
            }

            newWithdrawlRequest(type);
            break;
        }
      }
    });

    return {
      ...pageBasicFn(root, "requests"),
      ...tableHeadersFn(tableHeadersSchema, "requests", root),
      permissions,
      requestsList,
      requestsGroups,
      requestsTables,
      newDepositRequest,
      newWithdrawlRequest,
      openRequestDetails,
      onRefetchData,
      onNewRequestAdded,
      onRequestDeleted,
      onRequestStatusChanged,
      onRequestStartWorking,
      onCommunicationAdded
    };
  }
};
</script>
