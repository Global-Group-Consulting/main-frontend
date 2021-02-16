<template>
  <div>
    <v-toolbar class="mb-10"
               flat
               rounded
               outlined
               dense
               v-if="$vuetify.breakpoint.smAndUp || alwaysVisible"
    >
      <v-toolbar-items class="flex-fill">
        <slot name="left-block">
          <tooltip-btn v-for="(action, i) of leftActionsList" :key="`l-${i}`"
                       :tooltip="$t(`actions.${action.tooltip}`)"
                       v-bind="prepareOptions(action.options)"
                       :icon-name="action.icon"
                       @click="onClick(action, $event)"
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
                       @click="onClick(action, $event)"
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
                       @click="onClick(action, $event)"
                       :disabled="action.disabled"
                       v-if="('if' in action ? action.if : true)"
          >
            {{ $t(`actions.${action.text}`) }}
          </tooltip-btn>
        </slot>
      </v-toolbar-items>

    </v-toolbar>

    <mobile-menu-actions :actions-list="actionsList"></mobile-menu-actions>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "@vue/composition-api"
import {ActionItem, ActionItemOptions} from "~/@types/ActionItem";

export default defineComponent({
  name: "PageToolbar",
  props: {
    alwaysVisible: {
      type: Boolean,
      default: false
    },
    actionsList: {
      type: Array as () => ActionItem[],
      default: () => [],
    }
  },
  setup(props, {root}) {
    const {$vuetify} = root
    const leftActionsList = computed<ActionItem[]>(() => props.actionsList
      .filter((action: ActionItem) => {
          return action.position === "left" && !action.onlyInMobile
        }
      ))
    const centerActionsList = computed<ActionItem[]>(() => props.actionsList
      .filter((action: ActionItem) => {
          return (action.position === "center" || !action.position) && !action.onlyInMobile
        }
      ))
    const rightActionsList = computed<ActionItem[]>(() => props.actionsList
      .filter((action: ActionItem) => {
        return action.position === "right" && !action.onlyInMobile
      }))

    function prepareOptions(newSettings: ActionItemOptions) {
      const defaults = {text: true}

      return newSettings ? Object.assign({}, defaults, newSettings) : defaults
    }

    function onClick(item: ActionItem, $event: any) {
      if (item.click) {
        item.click($event, item)
      }
    }

    return {
      prepareOptions,
      leftActionsList,
      centerActionsList,
      rightActionsList,
      onClick
    }
  }
})
</script>

<style scoped>

</style>
