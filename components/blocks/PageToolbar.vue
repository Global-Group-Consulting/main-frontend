<template>
  <v-toolbar class="mb-10"
             flat
             rounded
             outlined
             dense
  >
    <v-toolbar-items class="flex-fill">
      <slot name="left-block"></slot>

      <v-spacer></v-spacer>

      <slot name="center-block">
        <tooltip-btn v-for="action of actionsList"
                     :tooltip="$t(`actions.${action.tooltip}`)"
                     v-bind="prepareOptions(action.options)"
                     :icon-name="action.icon"
                     @click="action.click || null"
                     v-if="'if' in action ? action.if : true"
        >
          {{ $t(`actions.${action.text}`) }}
        </tooltip-btn>
      </slot>

      <v-spacer></v-spacer>

      <slot name="right-block"></slot>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: "PageToolbar",
  props: {
    actionsList: {
      default: () => [],
      type: Array
    }
  },
  setup() {
    function prepareOptions(newSettings) {
      const defaults = {text: true}

      return newSettings ? Object.assign({}, defaults, newSettings) : defaults
    }

    return {prepareOptions}
  }
}
</script>

<style scoped>

</style>
