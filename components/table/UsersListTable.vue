<template>
  <div v-if="existsData">
    <dynamic-tabs :tabs-list="tabsList"
                  :loading="loading"
                  :filters-fields-map="usersFiltersFieldsMap"
                  filters-schema="usersSchema"
                  filters-table-key="usersFilter"
                  :outlined="true">

      <template v-for="tab of tabsList"
                v-slot:[`tabContent_${tab.id}`]="{item}">
        <data-table
          :items="tab.data"
          table-key="users"
          schema="usersSchema"
          :options="{
              sortBy: ['accountStatusOrdered', 'firstName', 'lastName'],
            }"
          :loading="loading"
          :condition="+$enums.UserRoles.get(tab.id).index"
        >
        </data-table>
      </template>

    </dynamic-tabs>

    <clients-list-dialog v-if="$store.getters['dialog/dialogId'] === 'ClientsListDialog'"/>
  </div>

  <div v-else>Nessun utente disponibile...</div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";

import {User} from "~/@types/UserFormData";
import {DynamicTab} from "~/@types/components/DynamicTab";

import DynamicTabs from "../DynamicTabs.vue";
import DataTable from "../table/DataTable.vue";
import SigningLogsPopup from "../elements/SigningLogsPopup.vue";
import UsersCrudActions from "~/components/table/UsersCrudActions.vue";
import ClientsListDialog from "~/components/dialogs/ClientsListDialog.vue";
import CellUserAccountStatus from "~/components/table/CellsTemplates/CellUserAccountStatus.vue";
import {usersFiltersFieldsMap} from "~/config/forms/filters/usersFiltersSchema";

@Component({
  components: {CellUserAccountStatus, ClientsListDialog, UsersCrudActions, SigningLogsPopup, DataTable, DynamicTabs}
})
export default class UsersListTable extends Vue {
  @Prop({type: String, required: true})
  public userId!: string;

  @Prop({type: Array, default: () => []})
  public filtersActive!: any[]

  loading: boolean = false;
  usersData: Record<string, User[]> = {
    [this.getRoleName(this.$enums.UserRoles.CLIENTE)]: [],
    [this.getRoleName(this.$enums.UserRoles.AGENTE)]: [],
    [this.getRoleName(this.$enums.UserRoles.SERV_CLIENTI)]: [],
    [this.getRoleName(this.$enums.UserRoles.ADMIN)]: []
  }

  get tabsList(): DynamicTab[] {
    return [{
      id: this.getRoleName(this.$enums.UserRoles.CLIENTE),
      title: "Clienti",
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.CLIENTE)]
    }, {
      id: this.getRoleName(this.$enums.UserRoles.AGENTE),
      title: "Agenti",
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.AGENTE)]
    }, {
      id: this.getRoleName(this.$enums.UserRoles.SERV_CLIENTI),
      title: "Servizio Clienti",
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.SERV_CLIENTI)]
    }, {
      id: this.getRoleName(this.$enums.UserRoles.ADMIN),
      title: "Admin",
      data: this.usersData[this.getRoleName(this.$enums.UserRoles.ADMIN)]
    }].filter(el => el.data && el.data.length > 0)
  }

  get usersFiltersFieldsMap() {
    return usersFiltersFieldsMap
  }

  get existsData() {
    const data = this.tabsList.reduce((acc, curr) => {
      if (curr.data) {
        acc.push(...curr.data)
      }

      return acc;
    }, [])

    return data.length > 0
  }

  getRoleName(role: number | string) {
    return this.$enums.UserRoles.getIdName(+role)
  }

  getInitials(str: any, item: any): string {
    switch (item.name) {
      case this.$enums.CommissionType.NEW_DEPOSIT:

        return item.percent + "%";
      case this.$enums.CommissionType.TOTAL_DEPOSIT:

        return "% / mese";
      case this.$enums.CommissionType.ANNUAL_DEPOSIT:

        return item.percent + "% / anno"
    }

    return ""
  }

  async showClientsList(user: User) {
    try {
      // Fetch the users list
      const usersList = await this.$apiCalls.getClientsList(user.id)

      await this.$store.dispatch("dialog/updateStatus", {
        title: this.$i18n.t("dialogs.clientsList.title"),
        id: "ClientsListDialog",
        fullscreen: false,
        large: true,
        readonly: true,
        texts: {
          cancelBtn: "dialogs.clientsList.btn-cancel"
        },
        data: {
          usersList,
          agent: user
        }
      });
    } catch (e) {
      this.$alerts.error(e)
    }
  }

  onUserDeleted(item: User, data: any[]) {
    const index = data.findIndex(_el => _el.id === item.id)

    this.$delete(data, index)
  }

  public async updateData() {
    this.loading = true

    try {
      let usersList: any[];
      let listToEmit: any[] = []

      if (this.$auth.user.id !== this.userId || this.$auth.user.role === this.$enums.UserRoles.AGENTE) {
        usersList = await this.$apiCalls.getClientsList(this.userId)

        listToEmit = usersList;

        for (const user of usersList) {
          if (user.id === this.userId) {
            continue
          }

          this.usersData[this.$enums.UserRoles.getIdName(+user.role)].push(user)
        }
      } else {
        usersList = await this.$apiCalls.fetchAllUsers()

        for (const group of usersList) {
          this.usersData[this.getRoleName(+group.id)].push(...group.data)
          listToEmit.push(...group.data)
        }
      }

      this.$emit("updatedUsersList", listToEmit.map(user => {

        user.accountStatusOrdered = this.$enums.AccountStatuses.get(user.account_status).order

        return user
      }))
    } catch (e) {
      console.error(e)
    }

    this.loading = false
  }

  @Watch("usersData", {deep: true})
  onUserDataChange(value: any) {
    this.$store.dispatch("filters/updateDataToFilter", Object.values(value).flat())
  }

  // @ts-ignore
  async mounted() {
    await this.updateData()
  }
}
</script>

<style scoped>

</style>
