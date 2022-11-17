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
      <v-list-item v-for="item in items" :key="item.id">
        <!-- Icon -->
        <v-list-item-avatar v-if="item.icon">
          <v-icon class="grey lighten-3" :color="item.color">{{ item.icon }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-avatar v-if="item.textIcon">
          <text-icon class="grey lighten-3" :color="item.color">{{ item.textIcon }}</text-icon>
        </v-list-item-avatar>

        <!-- Content -->
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold" v-html="item.title"></v-list-item-title>
          <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'

export interface DashboardCardListItem {
  id: string | number
  title: string
  subtitle: string
  icon?: string
  textIcon?: string
  color?: string
}

export default defineComponent({
  name: 'DashboardCardList',
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
