<template>
  <div v-if="actionsList && actionsList.length > 0" class="d-flex">
    <template v-for="action of actionsList"
              v-if="('if' in action ? action.if : true)">

      <tooltip-btn :tooltip="action.tooltip ? $t(`actions.${action.tooltip}`) : ''"
                   v-bind="prepareOptions(action.options)"
                   :icon-name="action.icon"
                   @click="onClick(action, $event)"
                   :disabled="action.disabled"
                   v-if="!action.menuOptions"
                   tile
                   height="100%"
      >
        <template v-if="action.text">{{ $t(`actions.${action.text}`) }}</template>
        <span v-else-if="action.html" v-html="action.html"></span>
      </tooltip-btn>

      <!-- Menu Dropdown -->
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
            height="100%"
            tile
            :disabled="action.disabled"
          >
            <v-icon class="mr-2" v-if="">{{ action.icon }}</v-icon>

            <template v-if="action.text">{{ $t(`actions.${action.text}`) }}</template>
            <template v-else-if="action.html" v-html="action.html"></template>


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
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {ActionItem, ActionItemOptions} from "~/@types/ActionItem";

@Component({})
export default class PageToolbarSingleSlot extends Vue {
  @Prop({type: Array})
  actionsList!: ActionItem[];

  prepareOptions(newSettings: ActionItemOptions, attrs?: any) {
    const defaults = {text: true}

    return newSettings ? Object.assign({}, defaults, attrs, newSettings) : defaults
  }

  onClick(item: ActionItem, $event: any) {
    if (item.click) {
      item.click($event, item)
    }
  }
}
</script>

<style scoped>

</style>
