<template>
  <v-app>
    <drawer v-model="drawerModel"></drawer>

    <v-app-bar clipped-left app>
      <v-app-bar-nav-icon @click.stop="toggleDrawer" />

      <v-toolbar-title v-text="title" />

      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-on="on" v-bind="attrs">
            <v-icon class="mr-2">mdi-account-circle</v-icon>

            <small class="caption" style="text-transform: none">
              {{ $auth.user.firstName }} {{ $auth.user.lastName }}
            </small>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="vieMyProfile">
            <v-list-item-title>{{ $t("menus.myProfile") }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="logout">{{ $t("menus.logout") }}</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <!--<v-alert v-if="mockingUser"
               type="error"
               tile
               elevation="3"
               class="mb-0">
        Attenzione! Si sta visualizzando l'account dell'utente Mario Rossi, pertanto tutte le azioni eseguite si
        ripercuoteranno sull'utente stesso.
      </v-alert>-->

      <v-container fluid class="mb-16 pb-8">
        <nuxt ref="viewEl"></nuxt>
      </v-container>
    </v-main>

    <dynamic-dialog></dynamic-dialog>
  </v-app>
</template>

<script>
  import Drawer from "@/components/drawer/Drawer";
  import DynamicDialog from "@/components/DynamicDialog";

  export default {
    components: { DynamicDialog, Drawer },
    data() {
      return {
        title: "Global Group Consulting",
        drawerModel: false,
      };
    },
    methods: {
      toggleDrawer() {
        this.drawerModel = !this.drawerModel;
      },
      async logout() {
        try {
          const result = await this.$alerts.ask({
            title: this.$t("alerts.logout-title"),
            text: this.$t("alerts.logout-title"),
          });

          await this.$auth.logout("local");
        } catch (er) {
          console.log(er);
        }
      },

      async vieMyProfile() {
        this.$router.push("/users/" + this.$auth.user.id);
      },
    },
  };
</script>

<style lang="scss">

</style>
