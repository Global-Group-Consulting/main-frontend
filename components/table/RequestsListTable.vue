<template>
  <data-table
    :table-key="tableKey"
    schema="requestsSchema"
    light
    :items="items"
    :items-per-page="itemsPerPage"
    :item-class="getItemClass"
    :options="{sortBy: sortBy, sortDesc: sortDesc}"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:item.user.contractNumber="{ item }">
      <template v-if="item.user">
        {{ $options.filters.contractNumberFormatter(item.user.contractNumber) }}
      </template>
    </template>

    <template v-slot:item.user="{ item }">
      <v-btn text v-if="item.user && item.user.id" small
             target="_blank"
             class="text-capitalize"
             color="primary"
             @click.stop=""
             :href="'users/' + item.user.id">
        <v-icon small class="mr-2">mdi-open-in-new</v-icon>
        {{ $options.filters.userFormatter(item.user) }}
      </v-btn>
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
      <v-flex class="d-flex">
<!--        <v-tooltip v-if="item.initialMovement" bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon color="blue">mdi-new-box</v-icon>
            </v-btn>
          </template>

          {{ item.notes }}
        </v-tooltip>-->

        <span style="flex: 1"></span>

        <span
          :class="getAmountClass(getAmountSign(item.type))"
          class="text-no-wrap"
        >
        {{ getAmountSign(item.type) }}
        € {{ $options.filters.moneyFormatter(item.amount) }}
      </span>
      </v-flex>
    </template>

    <template v-slot:item.currency="{ item }">
      {{ formatRequestCurrency(item.currency) }}
    </template>

    <template v-slot:item.type="{ item }">
      <v-icon color="orange" v-if="item.typeClub">mdi-cards-spade</v-icon>


      <span v-html="getTipoRichiesta(item.type, item)"></span>

      <v-tooltip v-if="$enums.RequestTypes.COMMISSION_MANUAL_ADD === item.type" bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-information</v-icon>
          </v-btn>
        </template>

        <template v-if="item.targetUser">
          Agente destinatario:<br>
          {{ item.targetUser.firstName }} {{ item.targetUser.lastName }} ({{ item.targetUser.email }})
        </template>
      </v-tooltip>
    </template>

    <template v-slot:item.user.referenceAgentData="{item}">
      <v-btn text v-if="item.user && item.user.referenceAgentData" small
             target="_blank"
             class="text-capitalize"
             color="primary"
             @click.stop=""
             :href="getRefAgentUrl(item)">
        <v-icon small class="mr-2">mdi-open-in-new</v-icon>
        {{ getRefAgentName(item) }}
      </v-btn>
    </template>

    <template v-slot:item.status="{item, value}">
      <v-chip small
              :outlined="!item.initialMovement"
              :dark="item.initialMovement"
              :color="$enums.RequestStatus.get(value).color"
      >
        {{ $t("enums.RequestStatus." + $enums.RequestStatus.getIdName(value)) }}
      </v-chip>

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
      type: Array
    },
    sortDesc: {
      type: Array
    }
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
      return 'users/' + item.user?.referenceAgentData?.id
    }

    function getRefAgentName(item) {
      return item.user?.referenceAgentData?.firstName + " " + item.user?.referenceAgentData?.lastName
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
      getRefAgentUrl
    };
  }
};
</script>

<style></style>
