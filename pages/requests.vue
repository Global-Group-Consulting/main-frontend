<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <v-toolbar class="mb-5">
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
          <v-card :color="table.color" dark>
            <v-card-title>
              <v-icon class="mr-2">{{ table.icon }}</v-icon>
              {{ table.title }}</v-card-title
            >
            <v-data-table
              light
              :headers="getTableHeaders($auth.user.role, table.id)"
              :items="requestsGroups[table.id]"
              :items-per-page="10"
              :hide-default-footer="requestsGroups[table.id].length <= 10"
              @click:row="openRequestDetails"
            >
              <template v-slot:item.user.contractNumber="{ item }">
                {{
                  $options.filters.contractNumberFormatter(
                    item.user.contractNumber
                  )
                }}
              </template>

              <template v-slot:item.user="{ item }">
                {{ $options.filters.userFormatter(item.user) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <requests-crud-actions
                  :item="item"
                  @rowDeleted="onRequestDeleted"
                  @rowStatusChanged="onRequestStatusChanged"
                ></requests-crud-actions>
              </template>

              <template v-slot:item.amount="{ item }">
                <span
                  :class="getAmountClass(getAmountSign(item.type))"
                  class="text-no-wrap"
                >
                  {{ getAmountSign(item.type) }}
                  € {{ $options.filters.moneyFormatter(item.amount) }}
                </span>
              </template>

              <template v-slot:item.currency="{ item }">
                {{ formatRequestCurrency(item.currency) }}
              </template>

              <template v-slot:item.created_at="{ item }">
                {{ $options.filters.dateFormatter(item.created_at, true) }}
              </template>

              <template v-slot:item.updated_at="{ item }">
                {{ $options.filters.dateFormatter(item.updated_at, true) }}
              </template>

              <template v-slot:item.completed_at="{ item }">
                {{ $options.filters.dateFormatter(item.completed_at, true) }}
              </template>

              <template v-slot:item.type="{ item }">
                {{ getTipoRichiesta(item.type) }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>

    <request-dialog
      @newRequestAdded="onNewRequestAdded"
      @requestDeleted="onRequestDeleted"
      @requestStatusChanged="onRequestStatusChanged"
      v-if="$store.getters['dialog/dialogId'] === 'RequestDialog'"
    ></request-dialog>
  </v-layout>
</template>

<script>
import { ref, computed, onBeforeMount } from "@vue/composition-api";

// configs
import tableHeadersSchema from "../config/tables/requestsSchema";

// components
import PageHeader from "../components/blocks/PageHeader";
import RequestsCrudActions from "../components/table/RequestsCrudAction";
import RequestDialog from "../components/dialogs/RequestDialog";

// functions
import pageBasicFn from "../functions/pageBasic";
import tableHeadersFn from "../functions/tablesHeaders";
import permissionsFn from "../functions/permissions";

export default {
  components: {
    RequestDialog,
    PageHeader,
    RequestsCrudActions
  },
  setup(props, { root }) {
    const { $apiCalls, $set, $enums, $store, $i18n, $options } = root;
    const permissions = permissionsFn(root);
    const requestsList = ref([]);
    const requestsGroups = computed(() => {
      const toReturn = {
        nuova: [],
        accettata: [],
        rifiutata: []
      };

      requestsList.value.forEach(richiesta => {
        const stato = $enums.RequestStatus.get(richiesta.status);
        const groupName = stato.id;

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
          icon: "mdi-timer-sand"
        },
        {
          id: "accettata",
          title: $i18n.t(`pages.requests.tableAccettata-title`),
          color: "green",
          icon: "mdi-check-all"
        },
        {
          id: "rifiutata",
          title: $i18n.t(`pages.requests.tableRifiutata-title`),
          color: "red",
          icon: "mdi-close-box-multiple-outline"
        }
      ];
    });

    async function fetchAll() {
      const result = await $apiCalls.fetchRequests();

      $set(requestsList, "value", result);
    }

    async function onNewRequestAdded() {
      await fetchAll();
    }

    async function onRequestDeleted() {
      await fetchAll();
    }

    async function onRequestStatusChanged() {
      await fetchAll();
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

    function newWithdrawlRequest() {
      $store.dispatch("dialog/updateStatus", {
        title: $i18n.t("dialogs.requests.title-withdrawal"),
        id: "RequestDialog",
        data: {
          type: $enums.RequestTypes.RISC_INTERESSI
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

    function formatRequestCurrency(value) {
      const currencyData = $enums.CurrencyType.get(value);

      return `${currencyData.symbol} (${$i18n.t(
        `enums.CurrencyType.${currencyData.id}`
      )})`;
    }

    onBeforeMount(fetchAll);

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
      onNewRequestAdded,
      onRequestDeleted,
      onRequestStatusChanged,
      formatRequestCurrency
      // showCrudActions
    };
  },
  data() {
    return {
      requestDialogData: {}
    };
  },
  methods: {
    getAmountSign(requestType) {
      return [
        this.$enums.RequestTypes["VERSAMENTO"],
        this.$enums.RequestTypes["INTERESSI"]
      ].includes(requestType)
        ? "+"
        : "-";
    },
    getAmountClass(sign) {
      const minus = "red--text";
      const plus = "green--text";

      return sign === "-" ? minus : plus;
    },
    getTipoRichiesta(_id) {
      const id = this.$enums.RequestTypes.get(_id).id;

      return this.$t("enums.RequestTypes." + id);
    },
    onNewRequest() {
      this.$store.dispatch("dialog/updateStatus", {
        title: "",
        readonly: false,
        data: {}
      });
    }
  }
};
</script>
