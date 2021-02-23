<template>
  <v-layout>
    <v-flex>
      <page-header
        page-name="movements"></page-header>

      <v-row>
        <v-col cols="12">
          <v-card>
            <movements-list-table
              :movements="movements"
              v-if="movements.list.value.length > 0"
            >

            </movements-list-table>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
/** @typedef {import("../@types/Movement").IMovement} IMovement */

import {ref, onBeforeMount} from "@vue/composition-api";

import DataTable from "../components/table/DataTable";
import MovementTypes from "../enums/MovementTypes";
import MovementsFn from "@/functions/movementsFn.js";

import pageBasicFn from "../functions/pageBasic";
import PageHeader from "@/components/blocks/PageHeader";
import MovementsListTable from "@/components/table/MovementsListTable";
import {MovementsPermissions} from "../functions/acl/enums/movements.permissions";

export default {
  components: {
    PageHeader,
    MovementsListTable,
    DataTable
  },
  meta: {
    permissions: [MovementsPermissions.ACL_MOVEMENTS_SELF_READ]
  },
  setup(props, {root}) {
    const {$apiCalls, $set, $options, $i18n} = root;
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
