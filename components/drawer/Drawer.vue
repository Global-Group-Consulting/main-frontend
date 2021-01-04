<template>
  <v-navigation-drawer
    class="drawer"
    app
    dark
    permanent
    mini-variant
    mini-variant-width="80"
    expand-on-hover
  >

    <div class="d-flex flex-column" style="height: 100%">

      <v-list class="pt-0">
        <v-list-item style="opacity: 1">
          <v-list-item-action>
            <v-img src="/logo_white.png" height="40px" width="80px" position="center" contain></v-img>
          </v-list-item-action>

          <v-list-item-content style="overflow: hidden; white-space: nowrap; line-height: 1">
            <strong>
              Global Group<br>Consulting
            </strong>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list expand class="flex-grow-1">
        <div v-for="item in drawerItems" :key="item.id">
          <drawer-item v-if="item.type !== 'group'" :data="item"/>

          <drawer-group v-else :data="item"/>
        </div>
      </v-list>

      <v-list class="">
        <v-list-item>
          <v-list-item-action>
            v {{ $store.state.appVersion }}
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script>
import drawerItems from "@/config/drawerEntries";
import DrawerItem from "@/components/drawer/DrawerItem";
import DrawerGroup from "~/components/drawer/DrawerGroup";
import {mapGetters} from "vuex";

export default {
  name: "Drawer",
  components: {DrawerGroup, DrawerItem},
  data() {
    return {};
  },
  props: {
    value: {
      type: Boolean,
    }

  },
  computed: {
    drawerItems,
    ...mapGetters({
      userMustActivate: "user/mustActivate"
    }),
    user() {
      return this.$auth.user || {};
    },
    drawerBgSrc() {
      const root = "/drawerBackgrounds/";
      const ruoloBgSrc = this.$enums.UserRoles.get(this.user.role)?.bgSrc;

      return root + ruoloBgSrc;
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer::v-deep {
  border-top-right-radius: 20px;

  &.v-navigation-drawer--is-mouseover {
    border-top-right-radius: 0px;
  }

  .v-list-item {
    justify-content: start !important;
    opacity: .5;
    padding: 0;

    .v-list-item__action {
      width: 80px;
      justify-content: center;
      margin-right: 0 !important;
    }

    &.v-list-item--active {
      opacity: 1;

      &:before {
        opacity: 0;
      }

      &:after {
        background-color: white;
        width: 5px;
        opacity: 1;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
      }
    }
  }
}
</style>
