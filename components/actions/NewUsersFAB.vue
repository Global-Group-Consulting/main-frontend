<template>
  <v-fab-transition>
    <v-speed-dial v-model="opened"
                  fab
                  fixed
                  bottom
                  right
                  v-if="canAddUsers"
    >
      <v-btn slot="activator"
             v-model="actionsList"
             color="blue lighten-2"
             fab
             dark
      >
        <v-icon v-if="!opened">mdi-plus</v-icon>
        <v-icon v-else>mdi-close</v-icon>
      </v-btn>

      <v-tooltip left
                 :value="true"
                 v-for="userBtn in actionsList"
                 :key="userBtn.type"
                 :nudge-left="20">
        <template v-slot:activator="{ on }">
          <v-btn
              fab
              dark
              small
              :to="`/users/new?type=${userBtn.type}`"
              :color="userBtn.color">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <span>{{ userBtn.text }}</span>
      </v-tooltip>
    </v-speed-dial>
  </v-fab-transition>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useNewUserActions } from '~/composables/newUserActions'

export default defineComponent({
  name: 'NewUsersFAB',
  setup (props, { root }) {
    const opened = ref(false)
    const { $store, $apiCalls, $router } = root
    const newUserActions = useNewUserActions($store, $apiCalls, $router)

    return {
      opened,
      actionsList: newUserActions.list,
      canAddUsers: newUserActions.canAddUsers
    }
  }
})
</script>

<style scoped>

</style>
