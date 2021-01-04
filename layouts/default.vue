<template>
  <v-app>
    <drawer v-model="drawerModel"></drawer>



    <v-main>
      <main-navbar @toggleDrawer="toggleDrawer"></main-navbar>
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
import MainNavbar from "@/components/blocks/MainNavbar";

export default {
  components: {MainNavbar, DynamicDialog, Drawer},

  data() {
    return {
      drawerModel: false
    };
  },
  methods: {
    toggleDrawer() {
      this.drawerModel = !this.drawerModel;
    }
  }
};
</script>

<style lang="scss"></style>
