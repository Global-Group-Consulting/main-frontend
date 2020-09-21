<template>
  <div>
    <page-header
      :title="pageTitle"
      :subtitle="pageSubtitle"
      :icon="pageIcon"
      show-user-role
    ></page-header>

    <component :is="userPage"/>
  </div>
</template>

<script>

import pageMeta from '@/mixins/pageMeta'

import Admin from '@/components/hompage/Admin'
import Cliente from '@/components/hompage/Cliente'
import Agente from '@/components/hompage/Agente'
import ServClienti from '@/components/hompage/ServClienti'

import PageHeader from '@/components/blocks/PageHeader'

export default {
  components: { PageHeader, Admin, Cliente, Agente, ServClienti },
  middleware: 'auth',
  mixins: [pageMeta],
  data () {
    return {

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
