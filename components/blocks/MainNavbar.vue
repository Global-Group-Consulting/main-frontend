<template>
  <v-app-bar clipped-left app>
    <v-app-bar-nav-icon @click.stop="$emit('toggleDrawer')"/>

    <v-toolbar-title v-text="'Global Group Consulting'"/>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-menu offset-y max-width="350"
              :disabled="!notifications.connected">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text tile v-on="on" v-bind="attrs"
                 :disabled="!notifications.connected">

            <v-icon v-if="unreadMessages.length === 0">mdi-bell</v-icon>


            <v-badge :content="unreadMessages.length" v-else
                     bordered
                     offset-y="5"
                     color="orange"
            >
              <v-icon class="animate__animated animate__swing animate__repeat-3"
                      color="red">mdi-bell-ring
              </v-icon>

            </v-badge>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-if="unreadMessages.length === 0">
            <v-list-item-title class="font-italic grey--text">{{ $t("menus.noNotifications") }}...</v-list-item-title>
          </v-list-item>

          <v-list-item v-for="message of unreadMessages"
                       :key="message.id"
                       v-else
                       @click="onNotificationClick(message)"
                       @mouseover="message.hover = true"
                       @mouseleave="message.hover = false"
          >
            <v-list-item-content>

              <v-list-item-title class="d-flex align-end">
                <span class="flex-fill text-truncate">{{ $t("enums.NotificationTypes." + message.type) }}</span>
                <small class="ml-3">{{ message.created_at | dateHourFormatter(true) }}</small>
              </v-list-item-title>
              <v-list-item-subtitle>{{ getNotificationMessage(message) }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action v-if="message.hover">
              <v-btn icon @click.stop="signAsRead(message)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-on="on" v-bind="attrs">
            <v-icon class="mr-3">mdi-account-circle</v-icon>

            <small class="caption" style="text-transform: none">
              {{ $auth.user.firstName }} {{ $auth.user.lastName }}
            </small>
          </v-btn>
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
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import socketNotificationsFn from "@/functions/socket/notifications";
import {computed, onMounted, ref} from "@vue/composition-api";
import {moneyFormatter} from "@/plugins/filters";

export default {
  name: "MainNavbar",
  setup(props, {root}) {

    async function logout() {
      try {
        const result = await root.$alerts.ask({
          title: root.$t("alerts.logout-title"),
          text: root.$t("alerts.logout-text")
        });

        await root.$auth.logout("local");

        root.$socket.close()

      } catch (er) {
        console.log(er);
      }
    }

    async function vieMyProfile() {
      root.$router.push("/users/" + root.$auth.user.id);
    }

    return {
      logout,
      vieMyProfile,
      ...socketNotificationsFn(root)
    }
  },
}
</script>

<style scoped>

</style>
