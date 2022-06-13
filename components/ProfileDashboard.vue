<template>
  <v-row class="mb-5">
    <v-col v-if="showUserBlocks">
      <DashboardUserDeposit :user="user" :user-id="user._id"></DashboardUserDeposit>
    </v-col>

    <v-col v-if="showAgentBlocks">
      <DashboardUserCommissions :user="user" :user-id="user._id"
                                @reloadCommissions="$emit('reloadCommissions')"></DashboardUserCommissions>
    </v-col>

    <v-col>
      <DashboardUserBrites :user="user" :user-id="user._id"></DashboardUserBrites>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, watch } from '@vue/composition-api'
import DashboardUserDeposit from '~/components/cards/DashboardUserDeposit.vue'
import DashboardUserBrites from '~/components/cards/DashboardUserBrites.vue'
import DashboardUserCommissions from '~/components/cards/DashboardUserCommissions.vue'
import { AclUserRoles } from '~/enums/AclUserRoles'
import { User } from '~/@types/UserFormData'

export default defineComponent({
  name: 'ProfileDashboard',
  components: { DashboardUserCommissions, DashboardUserBrites, DashboardUserDeposit },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    }
  },
  setup (props, { root }) {
    const showUserBlocks = computed(() => {
      return root.$acl.checkRoles([AclUserRoles.AGENT, AclUserRoles.CLIENT], props.user)
    })

    const showAgentBlocks = computed(() => {
      return root.$acl.checkRoles([AclUserRoles.AGENT], props.user)
    })

    return {
      showUserBlocks,
      showAgentBlocks
    }
  }
})
</script>

<style scoped>

</style>
