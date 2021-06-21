<template>
  <v-layout>
    <v-flex>
      <page-header page-name="club"></page-header>

      <dashboard-blocks :dashboard-data="usersDataBlocks"
                        class="mb-6"
                        readonly
                        page="club"
                        format-as-int
                        :loading="!$store.getters['clubUsers/initialized']"
      ></dashboard-blocks>

      <page-toolbar always-visible
                    :actions-list="[]"
                    filters-schema="club"/>

      <dynamic-tabs :tabs-list="tabsList"
                    :filters-fields-map="filtersFieldsMap"
                    filters-schema="clubSchema"
                    filters-table-key="clubFilter"
                    outlined>
        <template v-slot:tabContent_users="{item}">
          <v-skeleton-loader
            elevation="1"
            v-if="showSkeleton"
            type="table-thead, table-tbody, table-tfoot"
          ></v-skeleton-loader>

          <data-table v-show="!showSkeleton" schema="clubSchema"
                      table-key="club"
                      :items="item.data">

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
import DashboardBlocks from "~/components/DashboardBlocks.vue";

@Component({
  components: {DashboardBlocks, PageToolbar, DynamicTabs, MenuList, DataTable, PageHeader},
  meta: {
    permissions: [ClubPermissions.CLUB_READ]
  }
})
export default class Club extends Vue {
  get tableData(): User[] {
    return this.$store.getters["clubUsers/usersGroups"]
  }

  get tabsList(): DynamicTab[] {
    return [
      {
        id: "users",
        title: "Utenti",
        data: this.tableData,
      },
    ]
  }

  get usersDataBlocks() {
    const usersStatistics = this.$store.getters["clubUsers/usersStatistics"];

    return {
      blocks: usersStatistics
    }
  }

  get filtersFieldsMap() {
    return clubFiltersFieldsMap;
  }

  get showSkeleton() {
    return !this.$store.getters["clubUsers/initialized"]
  }

  async mounted() {
    await this.$store.dispatch("clubUsers/fetchData");
    /* try {
      this.tableData = await this.$apiCalls.fetchClubUsers();

      await this.$store.dispatch("filters/updateDataToFilter", this.tableData);
    } catch (e) {
      this.$alerts.error(e)
    }*/
  }
}
</script>

<style scoped>

</style>
