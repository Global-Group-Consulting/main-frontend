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
  </data-table>
</template>

<script>
import DataTable from "~/components/table/DataTable";
import CellRequestActions from "~/components/table/CellsTemplates/CellRequestActions";

export default {
  components: {CellRequestActions, DataTable},
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

    function getRefAgentName(item) {
      return item.user?.referenceAgentData?.firstName + " " + item.user?.referenceAgentData?.lastName
    }

    return {
      getItemClass,
      getAmountSign,
      formatRequestCurrency,
      getRefAgentName
    };
  }
};
</script>

<style></style>
