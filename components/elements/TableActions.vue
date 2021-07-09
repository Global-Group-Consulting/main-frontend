<template>
  <div class="text-no-wrap">
    <v-tooltip bottom v-for="(menu, i) of alwaysVisibleOptions" :key="i"
               v-if="alwaysVisibleOptions.length > 0">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click.stop="menu.action" :color="menu.color">
          <v-icon style="position: absolute" size="20">{{ menu.icon }}</v-icon>
        </v-btn>
      </template>

      <span>{{ menu.value }}</span>
    </v-tooltip>

    <v-menu offset-y v-if="alwaysGroupedOptions.length > 0">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <template v-for="entry in alwaysGroupedOptions">
          <v-divider v-if="entry.divider && entry.if" :key="'divider_' + entry.value"></v-divider>

          <v-list-item
            :key="entry.value"
            :entry="entry"
            @click="entry.action($event)"
          >
            <v-list-item-title>{{ entry.value }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </div>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {CrudMenuItem} from "~/@types/Tables/CrudMenuItem";

@Component
export default class TableActions extends Vue {
  @Prop({type: Array, required: true})
  menuOptions!: CrudMenuItem[]

  get alwaysVisibleOptions(): CrudMenuItem[] {
    return this.menuOptions.filter(el => el.alwaysVisible && (el.if ?? true))
  }

  get alwaysGroupedOptions(): CrudMenuItem[] {
    return this.menuOptions.filter((el: CrudMenuItem) => !el.alwaysVisible && (el.if ?? true))
  }
}
</script>
