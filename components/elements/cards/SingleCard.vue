<template>
  <v-card class="flex-fill" style="height: 100%">

    <v-card-title class="pb-0 text-no-wrap">
      <span class="text-trim">{{ value.title }}</span>

      <v-menu offset-y v-if="value.menu">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" text small v-bind="attrs" v-on="on" class="ml-auto">
            {{ $t("filters." + filter) }}
            <v-icon small>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(menuItem, index) in value.menu(value)" :key="index" @click="menuItem.action(menuItem)">
            <v-list-item-title>{{ menuItem.value }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-card-title>

    <v-card-text>
      <v-list :max-height="69.5*5" class="overflow-auto">
        <v-list-item v-for="(item, itemIndex) of value.items"
                     :key="'item_' + itemIndex">
          <!-- Icon -->
          <v-list-item-avatar v-if="item.icon">
            <v-icon class="grey lighten-3" :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-avatar v-if="item.textIcon">
            <text-icon class="grey lighten-3" :color="item.color">{{ item.textIcon }}</text-icon>
          </v-list-item-avatar>

          <!-- Content -->
          <v-list-item-content v-if="value.type !== 'inline'">
            <v-list-item-title class="font-weight-bold">{{ item.value }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.title }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-content v-else>
            <v-list-item-title>
              <strong> {{ item.value }}</strong>
              <span>{{ item.title }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-card-actions class="text-right pt-0 transparent">

    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {LargeCard} from "~/components/elements/cards/Cards";
import TextIcon from "~/components/elements/TextIcon.vue";

@Component({
  components: {TextIcon}
})
export default class SingleCard extends Vue {
  @Prop({type: Object, default: () => ({})})
  value!: LargeCard

  @Prop({type: String})
  filter!: string

}
</script>

<style scoped>

</style>
