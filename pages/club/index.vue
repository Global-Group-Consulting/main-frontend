<template>
  <v-layout>
    <v-flex>
      <page-header page-name="club"></page-header>

      <page-toolbar always-visible
                    :actions-list="[]"
                    filters-schema="club"/>

      <dynamic-tabs :tabs-list="tabsList"
                    :filters-fields-map="filtersFieldsMap"
                    filters-schema="clubSchema"
                    filters-table-key="clubFilter"
                    outlined>
        <template v-slot:tabContent_users="{item}">
          <data-table schema="clubSchema"
                      table-key="club"
                      :items="item.data">
            <template v-slot:item.actions="{ item, value }">
              <menu-list :menu-options="crudMenuOptions" :item="item"></menu-list>
            </template>
          </data-table>
        </template>
      </dynamic-tabs>

    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import PageHeader from "../../components/blocks/PageHeader.vue";
import DataTable from "~/components/table/DataTable.vue";
import {User} from "~/@types/UserFormData";
import MenuList from "~/components/elements/MenuList.vue";
import {MenuListItem} from "~/@types/components/MenuListItem";
import {ClubPermissions} from "~/functions/acl/enums/club.permissions";
import DynamicTabs from "~/components/DynamicTabs.vue";
import {DynamicTab} from "~/@types/components/DynamicTab";
import PageToolbar from "~/components/blocks/PageToolbar.vue";
import {clubFiltersFieldsMap} from "~/config/forms/filters/clubFiltersSchema";

@Component({
  components: {PageToolbar, DynamicTabs, MenuList, DataTable, PageHeader},
  meta: {
    permissions: [ClubPermissions.CLUB_READ]
  }
})
export default class Club extends Vue {
  public tableData: User[] = []

  get tabsList(): DynamicTab[] {
    return [
      {
        id: "users",
        title: "Utenti",
        data: this.tableData,
      },
    ]
  }

  get filtersFieldsMap() {
    return clubFiltersFieldsMap;
  }

  public crudMenuOptions: MenuListItem[] = [{
    value: "show-brite-account",
    action: (item: User) => window.open("club/" + item.id, "_blank")
  }, {
    value: "show-user-account",
    action: (item: User) => window.open("users/" + item.id, "_blank")
  }]

  async beforeMount() {
    try {
      this.tableData = await this.$apiCalls.fetchClubUsers();

      await this.$store.dispatch("filters/updateDataToFilter", this.tableData);
    } catch (e) {
      this.$alerts.error(e)
    }
  }
}
</script>

<style scoped>

</style>
