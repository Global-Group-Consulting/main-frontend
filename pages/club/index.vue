<template>
  <v-layout>
    <v-flex>
      <page-header page-name="club"></page-header>

      <data-table schema="clubSchema"
                  table-key="club"
                  :items="tableData">
        <template v-slot:item.clubPack="{ item, value }">
          <v-chip :color="$enums.ClubPacks.get(value).color" small>
            {{ $t(`enums.ClubPacks.` + value) }}
          </v-chip>
        </template>

        <template v-slot:item.britesTotal="{ item, value }">
          {{ (value || 0) | moneyFormatter(true) }}
        </template>

        <template v-slot:item.britesUsed="{ item, value }">
          {{ (value || 0) | moneyFormatter(true) }}
        </template>

        <template v-slot:item.britesAvailable="{ item, value }">
          {{ (value || 0) | moneyFormatter(true) }}
        </template>

        <template v-slot:item.actions="{ item, value }">
          <menu-list :menu-options="crudMenuOptions" :item="item"></menu-list>
        </template>
      </data-table>
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


@Component({
  components: {MenuList, DataTable, PageHeader},
  meta: {
    permissions: [ClubPermissions.CLUB_READ]
  }
})
export default class Club extends Vue {
  public tableData: User[] = []

  public crudMenuOptions: MenuListItem[] = [{
    value: "show-brite-account",
    action: (item: User) => this.$router.push("club/" + item.id)
  }, {
    value: "show-user-account",
    action: (item: User) => this.$router.push("users/" + item.id)
  }]

  async beforeMount() {
    try {
      this.tableData = await this.$apiCalls.fetchClubUsers()
    } catch (e) {
      this.$alerts.error(e)
    }
  }
}
</script>

<style scoped>

</style>
