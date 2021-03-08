<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn color="primary" icon v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <template v-for="entry in menuOptions">
        <v-divider v-if="entry.divider && entry.if"
                   :key="'divider_' + entry.value"
        ></v-divider>

        <v-list-item
          :key="entry.value"
          :entry="entry"
          v-if="'if' in entry ? entry.if : true"
          @click="'action' in entry ? entry.action(item) : null"
        >
          <v-list-item-title>{{
              $t("menus." + entry.value)
            }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {MenuListItem} from "~/@types/components/MenuListItem";

@Component
export default class MenuList extends Vue {
  @Prop({type: Object, required: true})
  public item!: any;

  @Prop({type: Array, required: true})
  public menuOptions!: MenuListItem[];

}
</script>

<style scoped>

</style>
