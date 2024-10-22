<template>
  <!--  <div style="position:relative;">-->
  <v-data-table
    class="data-table"
    :headers="headers"
    :items="items"
    :items-per-page="itemsPerPage"
    :item-class="itemClass"
    :footer-props="{
        disableItemsPerPage: !!serverItemsLength,
        itemsPerPageOptions: !!serverItemsLength ? [] : itemsPerPageOptions,
      }"
    :server-items-length="serverItemsLength"
    :loading="loading"
    :hide-default-footer="items.length <= itemsPerPage"
    :no-data-text="$t(noDataText)"
    :dense="dense"
    @click:row="$emit('click:row', $event)"
    :locale="$i18n.locale"
    :options="options"
    :disable-pagination="disablePagination"
  >
    <!-- Dynamic item templates -->
    <template v-for="(col, id) in headers" v-slot:[`item.${getColId(col)}`]="{ item, value }">
      <slot :name="'item.' + getColId(col)"
            v-bind:item="item"
            v-bind:value="value">
        <template v-if="col.component">
          <component :is="col.component"
                     :item="getItem(col, item)"
                     :value="value"
                     :col-config="col"
                     :table-data="items"
                     v-bind="col.componentSettings"
          ></component>
        </template>
        <template v-else>
          {{ item[col.value] }}
        </template>
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

    <template v-slot:item.completed_at="{ item }">
      <span class="text-no-wrap">
        {{ $options.filters.dateFormatter(item.completed_at, true) }}
      </span>
    </template>

    <template v-slot:item.updated_at="{ item }">
      <span class="text-no-wrap">
        {{ $options.filters.dateFormatter(item.updated_at, true) }}
      </span>
    </template>

    <template v-slot:no-data="{item}">
    </template>
  </v-data-table>
  <!--    <div class="table-overlay"></div>-->
  <!--  </div>-->
</template>

<script>
import {computed, onMounted, ref} from "@vue/composition-api";
import {get as _get} from "lodash";

import UserRoles from "../../enums/UserRoles";
import roleBasedConfig from "../../config/roleBasedConfig";
import CellComponents from "./CellsTemplates"

export default {
  components: {
    ...CellComponents
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    /**
     * @example
     * tableKey="calculator"
     */
    tableKey: {
      type: String,
      required: true
    },
    /**
     * @example
     * schema="calculatorSchema"
     */
    schema: {
      type: String,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    itemsPerPageOptions: {
      type: Array,
      default: () => {
        return [10, 25, 50, -1];
      }
    },
    serverItemsLength: {
      type: Number
    },
    itemClass: String | Function,
    loading: Boolean,
    noDataText: {
      type: String,
      default: "tables.no-data"
    },
    dense: Boolean,
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    condition: String | Number,
    disablePagination: Boolean,
    pagination: Object
  },
  setup(props, {root}) {
    const {$auth} = root;
    const availableTableColumns = ref([]);

    const headers = computed(() => {
      const roleName = UserRoles.getIdName($auth.user.role);
      const colPath = `${roleName}.tables.${props.tableKey}.columns`;
      const colDefaultPath = `defaults.tables.${props.tableKey}.columns`;

      let columns = _get(roleBasedConfig, colPath);

      if (availableTableColumns.value.length === 0) {
        return [];
      }

      // Fallback to the defaults
      if (!columns) {
        columns = _get(roleBasedConfig, colDefaultPath);
      }

      if (!columns) {
        console.warn("No columns found for", props.tableKey, props.schema);

        return;
      }

      return columns.reduce((acc, column) => {
        let colName = column;
        let colCondition = null;

        if (column instanceof Array) {
          colName = column[0];
          colCondition =
            column[1] instanceof Array
              ? column[1].includes(props.condition)
              : condition === column[1];
        }

        const col = availableTableColumns.value[colName];

        if (typeof colCondition === "boolean" && !colCondition) {
          return acc;
        }

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

    const getColId = function (col) {
      return col.id ?? col.value
    }

    const getItem = function (col, item) {
      if (col.componentSettings && col.componentSettings.item) {
        return item[col.componentSettings.item]
      }

      return item
    }

    onMounted(async () => {
      const result = await import(`../../config/tables/${props.schema}.js`);

      root.$set(availableTableColumns, "value", result.default);
    });

    return {
      headers,
      getColId,
      getItem
    };
  }
};
</script>

<style lang="scss" scoped>
.table-overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  pointer-events: none;
  display: none;
  /*
  */
}

.data-table::v-deep {

  .v-data-table__wrapper {
    /*background-image: linear-gradient(to right, white, white), linear-gradient(to right, white, white), linear-gradient(to right, rgba(0, 0, 20, .50), rgba(255, 255, 255, 0)), linear-gradient(to left, rgba(0, 0, 20, .50), rgba(255, 255, 255, 0));

    background-position: left center, right center, left center, right center;
    background-repeat: no-repeat;
    background-color: white;
    background-size: 20px 100%, 20px 100%, 10px 100%, 10px 100%;
    background-attachment: local, local, scroll, scroll;*/
  }

  .v-data-table__mobile-table-row:nth-child(odd) {
    background-color: #f7f7f7;
    display: inline-block;
    width: 100%;
  }

}
</style>
