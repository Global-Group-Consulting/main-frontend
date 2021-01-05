<template>
  <data-table
    table-key="requests"
    schema="requestsSchema"
    light
    :items="items"
    :item-class="getItemClass"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:item.user.contractNumber="{ item }">
      <template v-if="item.user">
        {{ $options.filters.contractNumberFormatter(item.user.contractNumber) }}
      </template>
    </template>

    <template v-slot:item.user="{ item }">
      <template v-if="item.user">
        {{ $options.filters.userFormatter(item.user) }}
      </template>
    </template>

    <template v-slot:item.actions="{ item }">
      <requests-crud-actions
        :item="item"
        @rowDeleted="onRequestDeleted"
        @rowStatusChanged="onRequestStatusChanged"
        @rowCanceled="onRequestCanceled"
        @requestStartWorking="$emit('requestStartWorking', item)"
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

    <template v-slot:item.type="{ item }">
      <v-icon color="orange" v-if="item.typeClub">mdi-cards-spade</v-icon>
      {{ getTipoRichiesta(item.type, item) }}
    </template>
  </data-table>
</template>

<script>
import RequestsCrudActions from "../../components/table/RequestsCrudAction";
import tableHeadersFn from "../../functions/tablesHeaders";

export default {
  components: {RequestsCrudActions},
  props: {
    items: Array
    // condition: String // serve per decidere se mostrare una colonna, in base all'array passato come configurazione
  },
  setup(props, {root, emit}) {
    const {$enums, $set, $apiCalls, $store} = root;

    function getItemClass(item) {
      if (+item.status == $enums.RequestStatus.ANNULLATA) {
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
      return [
        $enums.RequestTypes["VERSAMENTO"],
        $enums.RequestTypes["INTERESSI"]
      ].includes(requestType)
        ? "+"
        : "-";
    }

    function getAmountClass(sign) {
      const minus = "red--text";
      const plus = "green--text";

      return sign === "-" ? minus : plus;
    }

    function getTipoRichiesta(_id, item) {
      const id = $enums.RequestTypes.get(_id).id;

      return root.$t("enums.RequestTypes." + id);
    }

    return {
      getItemClass,
      getAmountSign,
      getAmountClass,
      getTipoRichiesta,
      onRequestDeleted,
      onRequestStatusChanged,
      onRequestCanceled,
      formatRequestCurrency
    };
  }
};
</script>

<style></style>
