<template>
  <div :value="'recent'"
       v-if="$vuetify.breakpoint.xsOnly"
       id="bottom-drawer"
  >
    <div v-for="btn of btnsConfig" :key="btn.id"
         class="btn-wrapper"
         :class="{'btn-wrapper-large': btn.actions}"
    >
      <v-menu v-if="btn.actions"
              offset-y
              top
              min-width="93%"
              fixed
              class="menu-center"
      >
        <template v-slot:activator="{on}">
          <v-btn fab
                 large
                 dark
                 v-on="on"
          >
          </v-btn>
        </template>

        <v-card>
          <portal-target name="mobileMenuActions"></portal-target>
        </v-card>
      </v-menu>

      <v-btn large
             tile
             depressed
             nuxt
             :to="btn.link"
             :ripple="false"
             v-if="!btn.component && !btn.actions"
             @click="btn.click ? btn.click() : null"
      >
        <v-icon large>{{ btn.icon }}</v-icon>
        <small>{{ btn.text ? $t("drawer." + btn.text) : '' }}</small>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import AccountMenu from "@/components/elements/AccountMenu.vue";

import {Vue, Component} from "vue-property-decorator"
import * as Bowser from "bowser";

@Component({
  components: {AccountMenu},
})
export default class BottomDrawer extends Vue {

  get btnsConfig() {
    const adminRoles = [this.$enums.UserRoles.ADMIN, this.$enums.UserRoles.SERV_CLIENTI]
    const userRole = this.$auth.user.role

    const items = [
      {
        id: "home",
        text: "bottom-home",
        icon: "mdi-home",
        link: "/"
      },
      {
        id: "movements",
        text: "bottom-movements",
        icon: "mdi-swap-horizontal-bold",
        link: "/movements",
        if: !adminRoles.includes(userRole)
      },
      {
        id: "users",
        text: "bottom-users",
        icon: "mdi-account-group-outline",
        link: "/users",
        if: adminRoles.includes(userRole)
      },
      {
        id: "actions",
        text: "",
        icon: "",
        actions: true
      }, {
        id: "requests",
        text: "bottom-requests",
        icon: "mdi-list-status",
        link: "/requests",
        hideInMobile: true
      }, {
        id: "other",
        text: "bottom-other",
        icon: "mdi-dots-horizontal",
        click: () => this.$store.dispatch('toggleMobileDrawer', true),
        // component: "fullDrawer"
      }
    ]

    return items.filter((_item) => !("if" in _item) || (_item.if))
  }

}
</script>

<style lang="scss" scoped>


#bottom-drawer::v-deep {
  //position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: white;
  height: calc(60px + env(safe-area-inset-bottom, 0));
  min-height: 60px;
  z-index: 4;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  padding-bottom: env(safe-area-inset-bottom, 32px);

  .btn-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
    overflow: hidden;

    &:first-child {
      border-top-left-radius: 14px;
    }

    &:last-child {
      border-top-right-radius: 14px;
    }

    .v-btn {
      height: 100%;

      &:not(.v-btn--active) {
        color: #6b6f72;
      }

      &.v-btn--active {
        color: #0088FF;

        &:before {
          opacity: 0
        }
      }
    }

    .v-btn--depressed.v-btn--tile {
      background-color: transparent;
    }

    .v-btn__content {
      display: flex;
      flex-direction: column;
    }

    &.btn-wrapper-large {
      background-color: transparent;
      position: relative;
      width: 70px;
      min-width: 70px;
      overflow: visible;

      .v-btn {
        background-image: linear-gradient(-20deg, #071D2A, #054477);
        color: #ffffff;
        width: 60px;
        height: 60px;
        transform: translateY(-5px);

        &:after {
          content: "";
          background-image: url("/logo_white.png");
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          z-index: 3;
          background-position: center;
          box-shadow: none;
          background-size: 36px;
        }
      }
    }

    small {
      font-size: 8px;
    }
  }

  .menu-center {
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
}
</style>
