<template>
  <portal to="mobileMenuActions">
    <v-list>

      <v-list-item v-for="(action, i) of filteredActionsList" :key="i"
                   :two-line="!!action.tooltip"
                   :disabled="action.disabled"
                   v-bind="prepareOptions(action.options)"
                   @click="onAction(action, $event)"
                   dense
      >
        <v-list-item-avatar>
          <v-icon class="grey lighten-4">
            {{ action.icon }}
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ $t(`actions.${action.text}`) }}</v-list-item-title>
          <v-list-item-subtitle v-if="action.tooltip">{{ $t(`actions.${action.tooltip}`) }}</v-list-item-subtitle>
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
      type: Array as () => ActionItem[]
    }
  },
  setup(props, {root}) {
    const { $auth, $router } = root;

    const defaultActions: ActionItem[] = [
      {
        text: "withdrawal",
        tooltip: "withdrawal-tooltip",
        icon: "mdi-cash-minus",
        click: () => $router.push("/requests?new=collect_interests")
      },
      {
        text: "withdrawalGold",
        tooltip: "withdrawalGold-tooltip",
        icon: "mdi-bank-minus",
        click: () => $router.push("/requests?new=collect_gold")
      },
      {
        text: "deposit",
        tooltip: "deposit-tooltip",
        icon: "mdi-cash-plus",
        click: () => $router.push("/requests?new=add_deposit")
      }
    ]
    const filteredActionsList = computed<ActionItem[]>(() => {
      let list = props.actionsList?.length > 0 ? props.actionsList : defaultActions

      return list.filter((item: ActionItem) => item.if ?? true)
    })

    function prepareOptions(newSettings: ActionItemOptions) {
      const defaults = {text: true}

      return newSettings ? Object.assign({}, defaults, newSettings) : defaults
    }

    function onAction(action: ActionItem, event) {
      if (action.click) {
        action.click(event, action)
      }
    }

    return {
      prepareOptions,
      onAction,
      filteredActionsList
    }
  }
})
</script>

<style scoped>

</style>
