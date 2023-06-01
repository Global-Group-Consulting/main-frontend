<template>
  <v-menu offset-y :close-on-content-click="closeOnContentClick">
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
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'CardTooltip',
  props: {
    title: String,
    closeOnContentClick: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const opened = ref(false)

    return {
      opened
    }
  }
})
</script>

<style scoped>

</style>
