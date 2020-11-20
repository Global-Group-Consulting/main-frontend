<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="itemsPerPage"
    :no-data-text="$t(noDataText)"
    @click:row="goToUser($event.id)"
  >
    <template v-slot:item.contractNumber="{ item }">
      {{ $options.filters.contractNumberFormatter(item.contractNumber) }}
    </template>

    <template v-slot:item.validated_at="{ item }">
      {{ $options.filters.dateFormatter(item.validated_at, true) }}
    </template>
  </v-data-table>
</template>

<script>
import { computed, onMounted, ref } from "@vue/composition-api";
import { get as _get } from "lodash";

import UserRoles from "../../enums/UserRoles.js";
import roleBasedConfig from "../../config/roleBasedConfig";

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    tableKey: {
      type: String,
      required: true
    },
    schema: {
      type: String,
      required: true
    },
    itemsPerPage: 10,
    noDataText: "tables.no-data"
  },
  setup(props, { root }) {
    const { $auth } = root;
    const availableTableColumns = ref([]);

    const headers = computed(() => {
      const columns = _get(
        roleBasedConfig,
        `${UserRoles.getIdName($auth.user.role)}.tables.${
          props.tableKey
        }.columns`
      );

      if (!columns) {
        console.warn("No columns found for", props.tableKey, props.schema);

        return;
      }

      return columns.reduce((acc, column) => {
        const col = availableTableColumns[column];

        if (!col) {
          console.warn(`No column found for ${column} in ${props.schema}`);
          return acc;
        }

        acc.push({
          ...col,
          text: root.$t(col.text)
        });

        return acc;
      }, []);
    });

    onMounted(async () => {
      const result = await import(`../../config/tables/${props.schema}.js`);

      root.$set(availableTableColumns, "value", result.default);
    });

    return {
      headers
    };
  }
};
</script>
