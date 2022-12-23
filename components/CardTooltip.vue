<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <a class="text-decoration-underline-dotted" v-on="on" v-bind="attrs" v-html="title"/>
    </template>

    <v-card color="white"
            elevation="1">
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'CardTooltip',
  props: {
    title: String
  },
  setup (props) {

    return {}
  }
})
</script>

<style scoped>

</style>
