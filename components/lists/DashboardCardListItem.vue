<template>
  <div class="d-flex flex-grow-1">
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
      <v-list-item-subtitle>
        <span v-html="item.subtitle"></span>

        <v-tooltip bottom v-if="item.tooltip">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
                small
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span>{{ item.tooltip }}</span>
        </v-tooltip>
      </v-list-item-subtitle>


    </v-list-item-content>

  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'DashboardCardListItem',
  props: {
    item: Object as any
  },
  setup (props) {

    return {}
  }
})
</script>

<style scoped>

</style>
