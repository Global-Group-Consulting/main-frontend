<template>
  <v-data-table
      :headers="headers"
      :items="data"
      item-key="name"
      :server-items-length="paginatedData.total"
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [],
      }"
      :options="{
        page:paginatedData.page,
        itemsPerPage: paginatedData.perPage,
        ...tableOptions
      }"
      multi-sort
      class="data-table"
      :loading="loading"
      :item-class="itemClass"
      loading-text="Caricamento in corso... Prego attendere"
      @click:row="$emit('click:row', $event)"
      @update:options="onOptionsChange"
  >
    <!-- Dynamic item templates -->
    <template v-for="(col, id) in headers"
              v-slot:[`item.${(col.id||col.value)}`]="{ item, value }">
      <slot :name="'item.' + (col.id || col.value)"
            v-bind:item="item"
            v-bind:value="value" >
        <template v-if="col.component">
          <component :is="col.component"
                     :item="getItem(col, item)"
                     :value="value"
                     :col-config="col"
                     :table-data="data"
                     v-bind="col.componentSettings"
                     @refresh="$emit('refresh', $event)"
          ></component>
        </template>
        <template v-else>
          {{ item[col.value] }}
        </template>
      </slot>
    </template>

  </v-data-table>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, PropType, ref, UnwrapRef } from '@vue/composition-api'
import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import { TableSchema } from '~/@types/config/TableSchema'
import UserRoles from '~/enums/UserRoles'
import { get as _get } from 'lodash'
import roleBasedConfig from '~/config/roleBasedConfig'
import CellComponents from './CellsTemplates'
import { PaginationDto } from '~/@types/pagination/PaginationDto'

import { DataOptions } from 'vuetify'

export default defineComponent({
  name: 'PaginatedTable',
  components: {
    ...CellComponents
  },
  props: {
    paginatedData: {
      type: Object as PropType<PaginatedResult>,
      required: true
    },
    columns: {
      type: Object as PropType<Record<string, TableSchema> | UnwrapRef<Record<string, TableSchema>>>,
      required: true
    },
    tableKey: {
      type: String,
      required: true
    },
    condition: [String, Number],
    options: Object,
    loading: Boolean,
    itemClass: [Object, Function]
  },
  emits: {
    'update:pagination': (paginationDto: PaginationDto) => true
  },
  setup (props, { root, emit }) {
    const { $auth } = root
    const data = computed(() => props.paginatedData.data)
    const paginationDto = {
      page: props.paginatedData.page,
      sortBy: props.paginatedData.sortBy,
      sortDesc: props.paginatedData.sortDesc
    }

    const headers: ComputedRef<any[]> = computed(() => {
      const roleName = UserRoles.getIdName($auth.user.role)
      const colPath = `${roleName}.tables.${props.tableKey}.columns`
      const colDefaultPath = `defaults.tables.${props.tableKey}.columns`
      const toReturn: any[] = []

      let columns: string[] | [string, [number | string]][] = _get(roleBasedConfig, colPath)

      // Fallback to the defaults
      if (!columns) {
        columns = _get(roleBasedConfig, colDefaultPath)
      }

      if (!columns) {
        console.warn('No columns found for', props.tableKey)

        return []
      }

      columns.forEach((column: any) => {
        let colName
        let colCondition

        if (column instanceof Array) {
          colName = column[0]

          if (column[1] instanceof Array) {
            colCondition = props.condition ? column[1].includes(props.condition) : true
          } else {
            colCondition = props.condition === column[1]
          }
        } else {
          colName = column
        }

        if (typeof colCondition === 'boolean' && !colCondition) {
          return
        }

        const colSettings = props.columns[colName]

        toReturn.push({
          ...colSettings,
          text: root.$t(colSettings.text)
        })
      })

      return toReturn
    })

    const tableOptions = computed(() => {
      return {
        ...props.options,
        sortBy: props.paginatedData.sortBy,
        sortDesc: props.paginatedData.sortDesc
      }
    })

    function getItem (col: any, item: any) {
      if (col.componentSettings && col.componentSettings.item) {
        return item[col.componentSettings.item]
      }

      return item
    }

    function onOptionsChange (options: DataOptions) {
      let mustEmit = false

      // console.log(paginationDto.sortDesc)

      if (paginationDto.page != options.page) {
        paginationDto.page = options.page
        mustEmit = true
      }

      if (paginationDto.sortBy.join() != options.sortBy.join()) {
        paginationDto.sortBy = options.sortBy
        mustEmit = true
      }

      if (paginationDto.sortDesc.join() != options.sortDesc.join()) {
        paginationDto.sortDesc = options.sortDesc
        mustEmit = true
      }

      if (mustEmit) {
        emit('update:pagination', paginationDto)
      }
    }

    return {
      data,
      headers,
      tableOptions,
      getItem,
      onOptionsChange
    }
  }
})
</script>

<style scoped>

</style>
