<template>
  <v-layout>
    <v-flex>
      <page-header page-name="acl"></page-header>

      <page-toolbar :actions-list="actionsList"></page-toolbar>

      <dynamic-tabs :tabs-list="tabsList" @tabChange="onTabChange">
        <template v-for="tab of tabsList"
                  v-slot:[`tabContent_${tab.id}`]="{item}">
          <data-table
            :items="tab.data"
            :table-key="`acl${$options.filters.upperFirst(tab.id)}`"
            :items-per-page="50"
            :schema="`acl${$options.filters.upperFirst(tab.id)}Schema`"
          >
            <template v-slot:item.description="{item, value}">
              <acl-edit-dialog :cell-data="item" v-model="item.description" field="description"
                               text-input @input="onEditSave('description', $event, tab, item)"></acl-edit-dialog>
            </template>

            <template v-slot:item.roles="{item, value}">
              <acl-edit-dialog :cell-data="item" v-model="item.roles" field="roles"
                               :select-data="rolesListSelect"
                               @input="onEditSave('roles', $event, tab, item)"></acl-edit-dialog>
            </template>

            <template v-slot:item.permissions="{item, value}">
              <acl-edit-dialog :cell-data="item" v-model="item.permissions" field="permissions"
                               :select-data="permissionsListSelect"
                               @input="onEditSave('permissions', $event, tab, item)"></acl-edit-dialog>
            </template>

            <template v-slot:item.directPermissions="{item, value}">
              <acl-edit-dialog :cell-data="item" v-model="item.directPermissions" field="directPermissions"
                               :select-data="permissionsListSelect"
                               @input="onEditSave('directPermissions', $event, tab, item)"></acl-edit-dialog>
            </template>

            <template v-slot:item.actions="{item}">
              <v-btn icon @click="onDelete(item, tab.id)" color="red"
                     v-if="!['admin', 'agent', 'client', 'clients_service', 'super_admin'].includes(item.code)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </data-table>
        </template>
      </dynamic-tabs>

      <acl-add-dialog v-if="$store.getters['dialog/dialogId'] === 'AclAddDialog'"
                      @aclAdded="onAclAdded"></acl-add-dialog>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator'

import pageBasicFn from "~/functions/pageBasic";

import PageHeader from "~/components/blocks/PageHeader.vue";
import PageToolbar from "~/components/blocks/PageToolbar.vue";
import DataTable from "~/components/table/DataTable.vue";
import DynamicTabs from "~/components/DynamicTabs.vue";
import AclAddDialog from "~/components/dialogs/AclAddDialog.vue";
import AclEditDialog from "~/components/dialogs/EditDialogs/AclEditDialog.vue";

import {User} from "~/@types/UserFormData";
import {AclRole} from "~/@types/Acl/Roles";
import {ActionItem} from "~/@types/ActionItem";
import {AclPermission} from "~/@types/Acl/Permissions";
import {DynamicTab} from "~/@types/components/DynamicTab";

import arraySort from "array-sort";
import {AclPermissions} from "~/functions/acl/enums/acl.permissions";


@Component({
  components: {AclEditDialog, AclAddDialog, DataTable, DynamicTabs, PageToolbar, PageHeader},
  meta: {
    permissions: [AclPermissions.ACL_ACL_READ]
  }
})
export default class Acl extends Vue {

  public rolesList: AclRole[] = []
  public permissionsList: AclPermission[] = []
  public usersListRaw: { data: User[], id: number }[] = []
  public currentTab: number = 0

  get usersList(): User[] {
    return this.usersListRaw.reduce<User[]>((acc, curr) => {
      acc.push(...curr.data)

      return acc
    }, [])
  }

  get actionsList(): ActionItem[] {
    return [
      {
        text: "add-role",
        if: this.currentTab === 1,
        click: this.addRole,
      },
      {
        text: "add-permission",
        if: this.currentTab === 2,
        click: this.addPermission,
      }]
  }

  get tabsList(): DynamicTab[] {
    return [
      {
        id: "users",
        title: "Utenti",
        data: this.usersList,
        updateMethod: "aclUpdateUsers"
      }, {
        id: "roles",
        title: "Ruoli",
        data: this.rolesList,
        updateMethod: "aclUpdateRoles"
      }, {
        id: "permissions",
        title: "Permessi",
        data: this.permissionsList,
        updateMethod: "aclUpdatePermissions"
      }
    ]
  }

  get rolesListSorted(): AclRole[] {
    return arraySort(this.rolesList, "code")
  }

  get permissionsListSorted(): AclPermission[] {
    return arraySort(this.permissionsList, "code")
  }

  get rolesListSelect(): any[] {
    return this.rolesListSorted.reduce<any[]>((acc, curr) => {
      acc.push({
        value: curr.code,
        text: curr.code,
        subText: curr.description
      })

      return acc
    }, [])
  }

  get permissionsListSelect(): any[] {
    return this.permissionsListSorted.reduce<any[]>((acc, curr) => {
      acc.push({
        value: curr.code,
        text: curr.code,
        subText: curr.description
      })

      return acc
    }, [])
  }

  async beforeMount() {
    try {
      this.usersListRaw = await this.$apiCalls.fetchAllUsers()
      this.rolesList = await this.$apiCalls.aclReadRoles()
      this.permissionsList = await this.$apiCalls.aclReadPermissions()
    } catch (er) {
      this.$alerts.error(er)
    }
  }

  async onEditSave(field: string, newValue: string | string[], tab: DynamicTab, item: any) {
    if (!tab.updateMethod) {
      return
    }

    try {
      await this.$apiCalls[tab.updateMethod]({
        id: item.id,
        [field]: newValue
      })

      this.$alerts.toastSuccess("acl-update-success")
    } catch (e) {
      this.$alerts.error(e)
    }
  }

  onTabChange(newValue: number) {
    this.currentTab = newValue
  }

  onAclAdded(newData: any, type: "roles" | "permissions") {
    if (type === "roles") {
      this.rolesList.unshift(newData)
    } else if (type === "permissions") {
      this.permissionsList.unshift(newData)
    }
  }

  async onDelete(item: AclRole | AclPermission, type: string) {
    const apiCalls = this.$apiCalls

    try {
      await this.$alerts.askBeforeAction({
        key: "acl-delete",
        preConfirm: async () => {
          if (type === "roles") {
            return apiCalls.aclDeleteRoles(item.id)
          }

          return apiCalls.aclDeletePermissions(item.id)
        },
        data: {
          element: item.code
        },
        settings: {}
      })

      const dataList = type === "roles" ? "rolesList" : "permissionsList"
      const index = this[dataList].findIndex(_el => item.id === _el.id)

      this[dataList].splice(index, 1)
    } catch (e) {
      this.$alerts.error(e)
    }
  }

  addRole() {
    this.$store.dispatch("dialog/updateStatus", {
      id: "AclAddDialog",
      title: this.$t("dialogs.addAclDialog.titleRoles"),
      texts: {
        cancelBtn: "dialogs.addAclDialog.btn-cancel",
        confirmBtn: "dialogs.addAclDialog.btn-save"
      },
      data: {
        permissionsListSelect: this.permissionsListSelect,
        submitAction: "aclCreateRoles",
        type: "roles"
      }
    });
  }

  addPermission() {
    this.$store.dispatch("dialog/updateStatus", {
      id: "AclAddDialog",
      title: this.$t("dialogs.addAclDialog.titlePermissions"),
      texts: {
        cancelBtn: "dialogs.addAclDialog.btn-cancel",
        confirmBtn: "dialogs.addAclDialog.btn-save"
      },
      data: {
        submitAction: "aclCreatePermissions",
        type: "permissions"
      }
    });
  }
}
</script>

<style scoped>

</style>
