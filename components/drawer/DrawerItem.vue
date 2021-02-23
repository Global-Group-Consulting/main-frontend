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
      <v-list-item-title>{{ $t("drawer." + data.text) }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";

@Component
export default class DrawerItem extends Vue {
  @Prop({})
  public data!: any

  get showItem(): boolean {
    const aclPermission = this.$acl.checkPermissions(this.data.permissions)

    if ('if' in this.data) {
      return aclPermission && this.data.if
    }

    return aclPermission
  }
}
</script>

<style scoped></style>
