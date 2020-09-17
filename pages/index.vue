<template>
  <div>
    <page-header
      :title="title"
      :subtitle="subtitle"
      :icon="icon"
    ></page-header>

    <component :is="userPage"/>
  </div>
</template>

<script>

import Admin from '@/components/hompage/Admin'
import Cliente from '@/components/hompage/Cliente'
import PageHeader from '@/components/blocks/PageHeader'

export default {
  components: { PageHeader, Admin, Cliente },
  middleware: 'auth',
  data () {
    return {
      title: 'La mia Dashboard',
      subtitle: 'Possibile sottotitolo della dashboard',
      icon: 'mdi-home'
    }
  },
  computed: {
    userPage () {
      const userRole = this.$auth.user.role
      let pageToReturn = ''

      switch (+userRole) {
        case this.$enums.UserRoles.ADMIN:
          pageToReturn = 'Admin'

          break
        case this.$enums.UserRoles.CLIENTE:
          pageToReturn = 'Cliente'

          break
      }

      return pageToReturn
    }
  }
}
</script>
