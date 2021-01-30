<template>
  <portal to="mobileMenuActions">
    <v-list>

      <v-list-item v-for="(action, i) of filteredActionsList" :key="i"
                   two-line
                   :disabled="action.disabled"
                   v-bind="prepareOptions(action.options)"
                   @click="action.click"
                   dense
      >
        <v-list-item-avatar>
          <v-icon
            class="grey lighten-4"
          >
            {{ action.icon }}
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ $t(`actions.${action.text}`) }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t(`actions.${action.tooltip}`) }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </portal>
</template>

<script lang="ts">
import {defineComponent, computed} from "@vue/composition-api";
import {ActionItem, ActionItemOptions} from "~/@types/ActionItem";
import {PropsDefinition} from "vue/types/options";

export default defineComponent({
  name: "MobileMenuActions",
  props: {
    actionsList: {
      type: Array as () => ActionItem[],
      required: true
    }
  },
  setup(props) {
    const filteredActionsList = computed<ActionItem[]>(() => props.actionsList.filter((item: ActionItem) => item.if ?? true))

    function prepareOptions(newSettings: ActionItemOptions) {
      const defaults = {text: true}

      return newSettings ? Object.assign({}, defaults, newSettings) : defaults
    }

    return {
      prepareOptions,
      filteredActionsList
    }
  }
})
</script>

<style scoped>

</style>
