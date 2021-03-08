<template>
  <v-menu :offset-y="offsetY">
    <template v-slot:activator="{ on, attrs }">
      <slot name="menu-activator" v-bind:on="on"></slot>
    </template>

    <v-list>
      <v-list-item>
        <v-list-item-subtitle>
          {{ $auth.user.email }}<br/>
          {{
            $t(
              "enums.UserRoles." + $enums.UserRoles.get($auth.user.role).id
            )
          }}
        </v-list-item-subtitle
        >
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item @click="vieMyProfile">
        <v-icon class="mr-3">mdi-badge-account-horizontal-outline</v-icon>
        <v-list-item-title>{{ $t("menus.myProfile") }}</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="logout">
        <v-icon class="mr-3">mdi-logout</v-icon>
        <v-list-item-title>
          {{ $t("menus.logout") }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import accountMenuActions from "~/functions/accountMenuActions";
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
  name: "AccountMenu",
  props: {
    offsetY: {
      type: Boolean,
      default: true
    }
  },
  setup(props, {root}) {
    const {$socket, $alerts, $i18n, $auth, $router} = root
    $alerts
    return {
      ...accountMenuActions({$socket, $alerts, $i18n, $auth, $router})
    }
  },
})
</script>

<style scoped>

</style>
