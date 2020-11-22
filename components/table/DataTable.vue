<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="itemsPerPage"
    :item-class="itemClass"
    :footer-props="{
      itemsPerPageOptions
    }"
    :hide-default-footer="items.length <= itemsPerPage"
    :no-data-text="$t(noDataText)"
    :dense="dense"
    @click:row="$emit('click:row', $event)"
    :locale="$i18n.locale"
  >
    <!-- Dynamic item templates -->
    <template v-for="col in headers" v-slot:[`item.${col.value}`]="{ item }">
      <slot :name="'item.' + col.value" v-bind:item="item">
        {{ item[col.value] }}
      </slot>
    </template>

    <template v-slot:item.contractNumber="{ item }">
      {{ $options.filters.contractNumberFormatter(item.contractNumber) }}
    </template>

    <template v-slot:item.validated_at="{ item }">
      <span class="text-no-wrap">
        {{ $options.filters.dateFormatter(item.validated_at, true) }}
      </span>
    </template>

    <template v-slot:item.created_at="{ item }">
      <span class="text-no-wrap">
        {{ $options.filters.dateFormatter(item.created_at, true) }}
      </span>
    </template>

    <template v-slot:item.updated_at="{ item }">
      <span class="text-no-wrap">
        {{ $options.filters.dateFormatter(item.updated_at, true) }}
      </span>
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
    itemsPerPage: {
      type: Number,
      default: 10
    },
    itemsPerPageOptions: {
      typr: Array,
      default: () => {
        return [10, 25, 50, -1];
      }
    },
    itemClass: String | Function,
    noDataText: "tables.no-data",
    dense: Boolean
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
        const col = availableTableColumns.value[column];

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
