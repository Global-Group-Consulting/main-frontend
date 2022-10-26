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
                $t('menus.' + entry.value)
              }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { User } from '~/@types/UserFormData'
import { CrudMenuItem } from '~/@types/Tables/CrudMenuItem'
import { UsersTableActions } from '~/functions/usersTableActions'
import UserRoles from '~/enums/UserRoles'

@Component({
  components: {}
})
export default class CellUserActions extends Vue {
  @Prop({ type: Object, required: true })
  public item!: User

  @Prop({ type: Array })
  public tableData!: any

  public actions!: UsersTableActions

  get menuOptions (): CrudMenuItem[] {
    return [
      {
        value: this.$t('menus.edit') as string,
        action: async () => this.actions.openEdit(this.item.id || this.item._id),
        alwaysVisible: true,
        icon: 'mdi-square-edit-outline'
      },
      {
        value: this.$t('menus.profile') as string,
        action: async () => this.actions.openProfile(this.item.id || this.item._id),
        if: [UserRoles.AGENTE, UserRoles.CLIENTE].includes(+this.item.role),
        alwaysVisible: true,
        icon: 'mdi-account-search'
      },
      /*{
        value: "sendCommunication",
        action: async () => this.actions.sendCommunication(),
        if: this.item.id !== this.$auth.user.id &&
          this.item.account_status === AccountStatuses.ACTIVE,
      },*/
      {
        value: 'delete',
        action: async () => this.actions.delete(this.item),
        if: (this.item.id || this.item._id) !== this.$auth.user.id && this.$store.getters['user/canDeleteUser']
        //divider: true,
      }
    ]
  }

  get alwaysVisibleOptions (): CrudMenuItem[] {
    return this.menuOptions.filter(el => el.alwaysVisible && (el.if ?? true))
  }

  get alwaysGroupedOptions (): CrudMenuItem[] {
    return this.menuOptions.filter(el => !el.alwaysVisible && (el.if ?? true))
  }

  mounted () {
    this.actions = new UsersTableActions(this)
  }
}
</script>

<style scoped>

</style>
