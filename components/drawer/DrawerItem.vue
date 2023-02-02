<template>
  <v-list-item
      nuxt
      :to="data.link"
      :ripple="false"
      :color="'grey lighten-3'"
      v-if="showItem"
  >
    <v-list-item-action>
      <v-icon>{{ data.icon }}</v-icon>
    </v-list-item-action>

    <v-list-item-content>
      <v-list-item-title>{{ $t('drawer.' + data.text) }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DrawerEntry } from '~/config/drawerEntries'
import { computed } from '@vue/composition-api'

@Component
export default class DrawerItem extends Vue {
  @Prop({})
  public data!: DrawerEntry

  get showItem (): boolean {
    const aclPermission = this.$acl.checkPermissions(this.data.permissions || [])
        && this.$acl.checkRoles(this.data.roles || [])

    // Avoid showing some menu entries in the mobile drawer because already visible in the bottom drawer
    if (this.$vuetify.breakpoint.xsOnly && this.data.hideInMobile) {
      return false
    }

    if ('if' in this.data) {
      return aclPermission && (this.data.if ?? true)
    }

    return aclPermission
  }
}
</script>

<style scoped></style>
