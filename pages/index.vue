<template>
  <div>
    <page-header
      :title="title"
      :subtitle="subtitle"
      :icon="icon"
      show-user-role
    ></page-header>

    <component :is="userPage"/>
  </div>
</template>

<script>

import Admin from '@/components/hompage/Admin'
import Cliente from '@/components/hompage/Cliente'
import Agente from '@/components/hompage/Agente'
import ServClienti from '@/components/hompage/ServClienti'

import PageHeader from '@/components/blocks/PageHeader'

export default {
  components: { PageHeader, Admin, Cliente, Agente, ServClienti },
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
        case this.$enums.UserRoles.AGENTE:
          pageToReturn = 'Agente'

          break
        case this.$enums.UserRoles.SERV_CLIENTI:
          pageToReturn = 'ServClienti'

          break
      }

      return pageToReturn
    }
  }
}
</script>
