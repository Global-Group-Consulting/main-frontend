<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <v-row>
        <v-col cols="12">
          <v-card>
            <data-table
              :items="movementsList"
              table-key="movements"
              schema="movementsSchema"
              :items-per-page="25"
              :item-class="getItemClass"
            >
              <template v-slot:item.amountChange="{ item }">
                <div v-html="formatAmountChange(item)"></div>
              </template>

              <template v-slot:item.movementType="{ item }">
                <div v-html="formatMovementType(item)"></div>
              </template>

              <template v-slot:item.deposit="{ item }">
                <span class="text-no-wrap">
                  € {{ $options.filters.moneyFormatter(item.deposit) }}
                </span>
              </template>

              <template v-slot:item.interestAmount="{ item }">
                <span class="text-no-wrap">
                  € {{ $options.filters.moneyFormatter(item.interestAmount) }}
                </span>
              </template>
            </data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
/** @typedef {import("../@types/Movement").IMovement} IMovement */

import { ref, onBeforeMount } from "@vue/composition-api";

import PageHeader from "../components/blocks/PageHeader";
import DataTable from "../components/table/DataTable";
import MovementTypes from "../enums/MovementTypes";

import pageBasicFn from "../functions/pageBasic";

export default {
  component: {
    PageHeader,
    DataTable
  },
  setup(props, { root }) {
    /**
     * @type {{
     *  $apiCalls: import("../plugins/apiCalls").ApiCalls
     * }}
     */
    const { $apiCalls, $set, $options, $i18n } = root;

    /**
     *@type {{value:IMovement[]}}
     */
    const movementsList = ref([]);

    /**
     *@param {IMovement} item
     */
    function formatAmountChange(item) {
      const sign = [
        MovementTypes.INTEREST_COLLECTED,
        MovementTypes.DEPOSIT_COLLECTED,
        MovementTypes.COMMISSION_COLLECTED
      ].includes(item.movementType)
        ? "-"
        : "+";
      const color = sign === "-" ? "red--text" : "green--text";

      return `<span class="text-no-wrap ${color}">€ ${sign}${$options.filters.moneyFormatter(
        item.amountChange.toFixed(2)
      )}</span>`;
    }

    /**
     *@param {IMovement} item
     */
    function formatMovementType(item) {
      const movementId = MovementTypes.get(item.movementType).id;
      const text = $i18n.t(`enums.MovementTypes.${movementId}`);

      if (item.movementType === MovementTypes.INTEREST_RECAPITALIZED) {
        return `<strong>${text}</strong>`;
      }

      return text;
    }

    /**
     *@param {IMovement} item
     */
    function getItemClass(item) {
      if (item.movementType === MovementTypes.INTEREST_RECAPITALIZED) {
        return "yellow lighten-5";
      }
    }

    async function fetchMovementsList() {
      const data = await $apiCalls.fetchMovementsList();

      $set(movementsList, "value", data);
    }

    onBeforeMount(fetchMovementsList);

    return {
      ...pageBasicFn(root, "movements"),
      movementsList,
      formatAmountChange,
      formatMovementType,
      getItemClass
    };
  }
};
</script>

<style scoped></style>
