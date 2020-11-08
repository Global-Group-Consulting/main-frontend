<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
    dark
    :src="drawerBgSrc"
  >
    <div class="d-flex flex-column" style="height: 100%">
      <v-list expand nav class="flex-grow-1">
        <div v-for="item in drawerItems" :key="item.id">
          <drawer-item v-if="item.type !== 'group'" :data="item" />

          <drawer-group v-else :data="item" />
        </div>
      </v-list>

      <v-list class="">
        <v-list-item
          >{{ $t("drawer.version") }} beta {{ $store.state.appVersion }}</v-list-item
        >
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script>
  import drawerItems from "@/config/drawerEntries";
  import DrawerItem from "@/components/drawer/DrawerItem";
  import DrawerGroup from "~/components/drawer/DrawerGroup";
  import { mapGetters } from "vuex";

  export default {
    name: "Drawer",
    components: { DrawerGroup, DrawerItem },
    data() {
      return {};
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      drawerItems,
      ...mapGetters({
        userMustActivate: "user/mustActivate",
      }),
      user() {
        return this.$auth.user || {};
      },
      drawerBgSrc() {
        const root = "/drawerBackgrounds/";
        const ruoloBgSrc = this.$enums.UserRoles.get(this.user.role)?.bgSrc;

        return root + ruoloBgSrc;
      },
    },
  };
</script>

<style lang="scss">
.v-navigation-drawer__image {
  opacity: .7;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(0deg, rgba(0, 0, 0, .9) 0%, rgba(0, 0, 0, 0) 100%);
  }
}
</style>
