<template>
  <v-navigation-drawer
    class="drawer"
    :temporary="!permanentDrawer"
    :absolute="!permanentDrawer"
    :right="!permanentDrawer"
    :dark="permanentDrawer"
    :permanent="permanentDrawer"
    :mini-variant="permanentDrawer"
    :expand-on-hover="permanentDrawer"
    mini-variant-width="80"
    app
    v-model="drawerOpen"
    touchless

  >

    <div class="d-flex flex-column" style="height: 100%">

      <v-list class="pt-0">
        <v-list-item style="opacity: 1" v-if="permanentDrawer">
          <v-list-item-action>
            <v-img :src="`/logo_${permanentDrawer ? 'white' : 'dark'}.png`"
                   height="40px" width="80px" position="center" contain></v-img>
          </v-list-item-action>

          <v-list-item-content style="overflow: hidden; white-space: nowrap; line-height: 1">
            <strong>
              Global Group<br>Consulting
            </strong>
          </v-list-item-content>
        </v-list-item>

        <v-list-item two-line v-else>
          <v-list-item-action>
            <v-icon large>mdi-account-circle</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ $auth.user.email }}</v-list-item-title>
            <v-list-item-subtitle>
              {{
                $t("enums.UserRoles." + $enums.UserRoles.get($auth.user.role).id)
              }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
      </v-list>

      <v-list expand class="flex-grow-1">
        <div v-for="item in drawerItems" :key="item.id">
          <drawer-item v-if="item.type !== 'group'" :data="item"/>

          <drawer-group v-else :data="item"/>
        </div>
      </v-list>

      <v-list v-if="!permanentDrawer">
        <v-divider></v-divider>
        <v-list-item @click="account.vieMyProfile">
          <v-list-item-action>
            <v-icon class="mr-3">mdi-badge-account-horizontal-outline</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ $t("menus.myProfile") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="account.logout">
          <v-list-item-action>
            <v-icon class="mr-3">mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t("menus.logout") }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>

      <v-list class="" dense>
        <v-list-item @click="onVersionChangelogClick" dense>
          <v-list-item-action>
            <small>
              v {{ $store.state.appVersion }}
            </small>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>
              Mostra dettagli
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item dense href="https://globalgroup.consulting/" target="_blank">
          <v-list-item-action>
            <small>
              © {{ $moment().format("YYYY") }}
            </small>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>
              GlobalGroup.Consulting
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>

    <changelog-dialog
      v-if="$store.getters['dialog/dialogId'] === 'ChangelogDialog'"
    ></changelog-dialog>

  </v-navigation-drawer>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import drawerItems from "~/config/drawerEntries";
import DrawerItem from "~/components/drawer/DrawerItem.vue";
import DrawerGroup from "~/components/drawer/DrawerGroup.vue";
import ChangelogDialog from "~/components/dialogs/ChangelogDialog.vue";
import accountMenuActions from "~/functions/accountMenuActions";
import {SetupContext} from "@vue/composition-api";

export default {
  name: "Drawer",
  components: {ChangelogDialog, DrawerGroup, DrawerItem},
  props: {
    value: {
      type: Boolean,
    }
  },
  setup(props, {root}) {
    return {
      account: accountMenuActions(root)
    }
  },
  data() {
    return {
      drawerOpen: false
    }
  },
  computed: {
    drawerItems,
    ...mapGetters({
      userMustActivate: "user/mustActivate"
    }),
    ...mapState(["mobileDrawerOpen"]),
    user() {
      return this.$auth.user || {};
    },
    drawerBgSrc() {
      const root = "/drawerBackgrounds/";
      const ruoloBgSrc = this.$enums.UserRoles.get(this.user.role)?.bgSrc;

      return root + ruoloBgSrc;
    },
    permanentDrawer() {
      return !!this.$vuetify.breakpoint.smAndUp
    }
  },
  methods: {
    onVersionChangelogClick() {
      this.$store.dispatch("dialog/updateStatus", {
        title: this.$t("dialogs.changelog.title"),
        showCloseBtn: true,
        noActions: true,
        id: "ChangelogDialog"
      });
    }
  },
  watch: {
    drawerOpen(val) {
      if (!val) {
        this.$store.dispatch("toggleMobileDrawer", false)
      }
    },
    mobileDrawerOpen(val) {
      this.drawerOpen = val
    },
    permanentDrawer(value) {
      this.$store.dispatch("toggleMobileDrawer", value)
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer::v-deep {

  &.theme--dark {
    border-top-right-radius: 20px;

    &.v-navigation-drawer--is-mouseover {
      border-top-right-radius: 0px;
    }

    .v-list-item {
      opacity: .5;

      .v-list-item__action {
        width: 80px;
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

  &.theme--light {
    .v-list-item--active {
      color: #071d2a !important;
      caret-color: #071d2a !important;
    }
  }

  .v-list-item {
    justify-content: start !important;
    padding: 0;

    .v-list-item__action {
      width: 60px;
      justify-content: center;
      margin-right: 0 !important;
    }
  }
}
</style>
