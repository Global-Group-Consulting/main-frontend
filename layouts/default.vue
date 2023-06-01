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
import Drawer from "~/components/drawer/Drawer";
import DynamicDialog from "@/components/DynamicDialog.vue";
import MainNavbar from "@/components/blocks/MainNavbar.vue";
import BottomDrawer from "@/components/drawer/BottomDrawer.vue";
import { useAnalytics } from '~/composables/analytics'

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
  },
  mounted () {
    useAnalytics(this.$store.getters['user/current'], this.$router, this.$apiCalls)
  }
};
</script>

<style lang="scss">


</style>
