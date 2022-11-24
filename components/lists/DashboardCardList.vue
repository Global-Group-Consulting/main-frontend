<template>
  <div>
    <v-alert v-if="hasError"
             border="left"
             outlined
             prominent
             type="error"
             class="mb-0"
    >
      Oops, non riesco a caricare i dati...
    </v-alert>

    <v-skeleton-loader v-if="loading"
                       :type="'list-item-avatar-two-line@' + ((items.length < 6 ? items.length : 5) || 3)"
    />

    <v-list v-else-if="!hasError" :max-height="(62 * 6 + 16) + 'px'" style="overflow: auto">
      <template v-for="item in items">
        <v-list-group v-if="item.details && item.details.length > 0" :key="item.id" >
          <template v-slot:activator>
            <DashboardCardListItem :item="item"/>
          </template>

          <div class="grey lighten-4" v-if="item.details && item.details.length > 0">
            <v-list-item
                v-for="child in item.details"
                :key="child.title"
            >
              <DashboardCardListItem :item="child"/>
            </v-list-item>
          </div>
        </v-list-group>

        <v-list-item v-else :key="item.id">
          <DashboardCardListItem :item="item"/>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import DashboardCardListItem from '~/components/lists/DashboardCardListItem.vue'

export interface DashboardCardListItem {
  id: string | number
  title: string
  subtitle: string
  icon?: string
  textIcon?: string
  color?: string
  tooltip?: string
  details?: Exclude<DashboardCardListItem, 'details'>[]
}

export default defineComponent({
  name: 'DashboardCardList',
  components: {
    DashboardCardListItem
  },
  props: {
    items: Array as PropType<DashboardCardListItem[]>,
    hasError: Boolean,
    loading: Boolean
  },
  setup (props) {

    return {}
  }
})
</script>

<style scoped>

</style>
