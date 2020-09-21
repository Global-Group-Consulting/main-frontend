<template>
  <v-app>
    <drawer v-model="drawerModel"></drawer>

    <v-app-bar clipped-left app>
      <v-app-bar-nav-icon @click.stop="toggleDrawer"/>

      <v-toolbar-title v-text="title"/>

      <v-spacer></v-spacer>

      <v-btn @click="logout" text>
        <v-icon class="mr-2">mdi-account-circle</v-icon>

        <small class="caption" style="text-transform: none">
          {{ $auth.user.firstName }} {{ $auth.user.lastName }}
        </small>
      </v-btn>

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
import Drawer from '@/components/drawer/Drawer'
import DynamicDialog from '@/components/DynamicDialog'

export default {
  components: { DynamicDialog, Drawer },
  data () {
    return {
      title: 'Global Group Consulting',
      drawerModel: false
    }
  },
  methods: {
    toggleDrawer () {
      this.drawerModel = !this.drawerModel
    },
    async logout () {
      await this.$auth.logout()
    }
  }
}
</script>

<style lang="scss">

</style>
