<template>
  <data-table
    :table-key="tableKey"
    schema="requestsSchema"
    light
    :loading="loading"
    :items="items"
    :items-per-page="itemsPerPage"
    :item-class="getItemClass"
    :options="{sortBy: sortBy, sortDesc: sortDesc}"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:item.actions="{ item }">
      <requests-crud-actions
        :item="item"
        @rowDeleted="onRequestDeleted"
        @rowStatusChanged="onRequestStatusChanged"
        @rowCanceled="onRequestCanceled"
        @requestStartWorking="$emit('requestStartWorking', item)"
      ></requests-crud-actions>
    </template>
  </data-table>
</template>

<script>
import RequestsCrudActions from "../../components/table/RequestsCrudAction";
import tableHeadersFn from "../../functions/tablesHeaders";

export default {
  components: {RequestsCrudActions},
  props: {
    items: Array,
    tableKey: {
      type: String,
      default: "requests"
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    sortBy: {
      type: Array,
      default: () => []
    },
    sortDesc: {
      type: Array,
      default: () => []
    },
    loading: Boolean
    // condition: String // serve per decidere se mostrare una colonna, in base all'array passato come configurazione
  },
  setup(props, {root, emit}) {
    const {$enums, $set, $apiCalls, $store} = root;

    function getItemClass(item) {
      if (+item.status === $enums.RequestStatus.ANNULLATA) {
        return "grey lighten-2 text-decoration-line-through";
      }
    }

    function onRequestDeleted() {
      emit("refetchData");
    }

    function onRequestStatusChanged() {
      emit("refetchData");
    }

    function onRequestCanceled() {
      emit("refetchData");
    }

    function formatRequestCurrency(value) {
      const currencyData = $enums.CurrencyType.get(value);

      return `${currencyData.symbol} (${root.$t(
        `enums.CurrencyType.${currencyData.id}`
      )})`;
    }

    function getAmountSign(requestType) {
      if ([
        $enums.RequestTypes["VERSAMENTO"],
        $enums.RequestTypes["INTERESSI"]
      ].includes(requestType)) {
        return "+"
      } else if ($enums.RequestTypes.COMMISSION_MANUAL_ADD === requestType) {
        return "*"
      } else {
        return "-";
      }
    }

    function getAmountClass(sign) {
      const minus = "red--text";
      const plus = "green--text";
      const wildcard = "orange--text";

      return sign === "-" ? minus : (sign === "*" ? wildcard : plus);
    }

    function getTipoRichiesta(_id, item) {
      const id = $enums.RequestTypes.get(_id).id;

      const isInitialMovement = item.initialMovement

      return root.$t("enums.RequestTypes." + id) + (isInitialMovement ? " (<strong>Nuovo Cliente</strong>)" : "");
    }

    function getRefAgentUrl(item) {
      return 'users/profile/' + item.user?.referenceAgentData?.id
    }

    function getRefAgentName(item) {
      return item.user?.referenceAgentData?.firstName + " " + item.user?.referenceAgentData?.lastName
    }

    async function getTargetUser(item) {
      if (!item.targetUser) {
        try {
          item.targetUser = await this.$apiCalls.readRequestTargetUser(item.targetUserId)
        } catch (er) {
         return this.$alerts.error(er)
        }
      }

      this.$alerts.info({
        title: "",
        html: `Agente destinatario:<br>
            ${item.targetUser.firstName} ${item.targetUser.lastName} (${item.targetUser.email})
            `
      })
    }

    return {
      getItemClass,
      getAmountSign,
      getAmountClass,
      getTipoRichiesta,
      onRequestDeleted,
      onRequestStatusChanged,
      onRequestCanceled,
      formatRequestCurrency,
      getRefAgentName,
      getRefAgentUrl,
      getTargetUser
    };
  }
};
</script>

<style></style>
