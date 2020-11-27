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
              :items="movements.list"
              table-key="movements"
              schema="movementsSchema"
              :items-per-page="25"
              :item-class="movements.getItemClass"
            >
              <template v-slot:item.amountChange="{ item }">
                <div v-html="movements.formatAmountChange(item)"></div>
              </template>

              <template v-slot:item.movementType="{ item }">
                <div v-html="movements.formatMovementType(item)"></div>
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
import MovementsFn from "@/functions/movementsFn.js";

import pageBasicFn from "../functions/pageBasic";

export default {
  component: {
    PageHeader,
    DataTable
  },
  setup(props, { root }) {
    const { $apiCalls, $set, $options, $i18n } = root;
    const movementsFn = MovementsFn(root);

    onBeforeMount(movementsFn.fetchList);

    return {
      ...pageBasicFn(root, "movements"),
      movements: movementsFn
    };
  }
};
</script>

<style scoped></style>
