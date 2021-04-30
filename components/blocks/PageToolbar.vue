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
          <template v-for="(action, i) of centerActionsList"
                    v-if="('if' in action ? action.if : true)">
            <tooltip-btn :tooltip="action.tooltip ? $t(`actions.${action.tooltip}`) : ''"
                         v-bind="prepareOptions(action.options)"
                         :icon-name="action.icon"
                         @click="onClick(action, $event)"
                         :disabled="action.disabled"
                         v-if="!action.menuOptions"
            >
              {{ $t(`actions.${action.text}`) }}
            </tooltip-btn>

            <v-menu offset-y
                    transition="slide-y-transition"
                    v-if="action.menuOptions"
                    :close-on-content-click="true"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="prepareOptions(action.options, attrs)"
                  text
                  v-on="on"
                  :disabled="action.disabled"
                >
                  <v-icon class="mr-2" v-if="">{{ action.icon }}</v-icon>

                  {{ $t(`actions.${action.text}`) }}

                  <v-icon class="">mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-card>
                <v-list>
                  <v-list-item v-for="(menuItem, index) in action.menuOptions" @click="onClick(menuItem, $event)"
                               :key="'menu_' +  index">
                    <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </template>
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

    function prepareOptions(newSettings: ActionItemOptions, attrs: any) {
      const defaults = {text: true}

      return newSettings ? Object.assign({}, defaults, attrs, newSettings) : defaults
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
