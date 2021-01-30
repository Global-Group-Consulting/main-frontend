<template>
  <v-toolbar class="mb-10"
             flat
             rounded
             outlined
             dense
             v-if="$vuetify.breakpoint.smAndUp"
  >
    <v-toolbar-items class="flex-fill">
      <slot name="left-block">
        <tooltip-btn v-for="(action, i) of leftActionsList" :key="`l-${i}`"
                     :tooltip="$t(`actions.${action.tooltip}`)"
                     v-bind="prepareOptions(action.options)"
                     :icon-name="action.icon"
                     @click="action.click"
                     :disabled="action.disabled"
                     v-if="('if' in action ? action.if : true)"
        >
          {{ $t(`actions.${action.text}`) }}
        </tooltip-btn>
      </slot>

      <v-spacer></v-spacer>

      <slot name="center-block">
        <tooltip-btn v-for="(action, i) of centerActionsList" :key="`c-${i}`"
                     :tooltip="$t(`actions.${action.tooltip}`)"
                     v-bind="prepareOptions(action.options)"
                     :icon-name="action.icon"
                     @click="action.click"
                     :disabled="action.disabled"
                     v-if="('if' in action ? action.if : true)"
        >
          {{ $t(`actions.${action.text}`) }}
        </tooltip-btn>
      </slot>

      <v-spacer></v-spacer>

      <slot name="right-block">
        <tooltip-btn v-for="(action, i) of rightActionsList" :key="`r-${i}`"
                     :tooltip="$t(`actions.${action.tooltip}`)"
                     v-bind="prepareOptions(action.options)"
                     :icon-name="action.icon"
                     @click="action.click"
                     :disabled="action.disabled"
                     v-if="('if' in action ? action.if : true)"
        >
          {{ $t(`actions.${action.text}`) }}
        </tooltip-btn>
      </slot>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts">
import {computed, defineComponent} from "@vue/composition-api"
import {ActionItem, ActionItemOptions} from "~/@types/ActionItem";

export default defineComponent({
  name: "PageToolbar",
  props: {
    actionsList: {
      type: Array as () => ActionItem[],
      default: () => [],
    }
  },
  setup(props) {
    const leftActionsList = computed<ActionItem[]>(() => props.actionsList.filter((action: ActionItem) => action.position === "left"))
    const centerActionsList = computed<ActionItem[]>(() => props.actionsList.filter((action: ActionItem) => action.position === "center" || !action.position))
    const rightActionsList = computed<ActionItem[]>(() => props.actionsList.filter((action: ActionItem) => action.position === "right"))

    function prepareOptions(newSettings: ActionItemOptions) {
      const defaults = {text: true}

      return newSettings ? Object.assign({}, defaults, newSettings) : defaults
    }

    return {
      prepareOptions,
      leftActionsList,
      centerActionsList,
      rightActionsList
    }
  }
})
</script>

<style scoped>

</style>
