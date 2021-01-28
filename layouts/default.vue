<template>
  <v-app>
    <drawer v-model="drawerModel"></drawer>

    <main-navbar @toggleDrawer="toggleDrawer"></main-navbar>

    <v-main>
      <v-container fluid>
        <nuxt ref="viewEl"></nuxt>
      </v-container>
    </v-main>

    <bottom-drawer></bottom-drawer>

    <dynamic-dialog></dynamic-dialog>
  </v-app>
</template>

<script>
import Drawer from "@/components/drawer/Drawer";
import DynamicDialog from "@/components/DynamicDialog";
import MainNavbar from "@/components/blocks/MainNavbar";
import BottomDrawer from "@/components/blocks/BottomDrawer";

export default {
  components: {BottomDrawer, MainNavbar, DynamicDialog, Drawer},

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

<style lang="scss">


</style>
