<template>
  <div class="text-no-wrap">

    <v-tooltip bottom v-for="(menu, i) of alwaysVisibleOptions" :key="i"
               v-if="alwaysVisibleOptions.length > 0">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click.stop="menu.action">
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
            <v-list-item-title>{{
                $t("menus." + entry.value)
              }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";
import {CrudMenuItem} from "~/@types/Tables/CrudMenuItem";

@Component({
  components: {}
})
export default class CellUserClubActions extends Vue {
  @Prop({type: Object, required: true})
  public item!: User

  @Prop({type: Array})
  public tableData!: any

  get userIsAdmin() {
    return this.$store.getters["user/userIsAdmin"];
  }

  get menuOptions(): CrudMenuItem[] {
    return [
      {
        value: this.$t("menus.show-user-account") as string,
        action: async () => window.open(`users/${this.item.id}`, "_blank"),
        alwaysVisible: true,
        icon: "mdi-square-edit-outline",
        if: this.userIsAdmin
      },
      {
        value: this.$t("menus.show-brite-account") as string,
        action: async () => window.open(`club/${this.item.id}`, "_blank"),
        alwaysVisible: true,
        icon: "mdi-account-search"
      },
    ];
  }

  get alwaysVisibleOptions(): CrudMenuItem[] {
    return this.menuOptions.filter(el => el.alwaysVisible && (el.if ?? true))
  }

  get alwaysGroupedOptions(): CrudMenuItem[] {
    return this.menuOptions.filter(el => !el.alwaysVisible && (el.if ?? true))
  }

}
</script>

<style scoped>

</style>
