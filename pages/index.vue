<template>
  <div>
    <page-header page-name="dashboard"></page-header>

    <component :is="userPage"/>

    <mobile-menu-actions></mobile-menu-actions>
  </div>
</template>

<script lang="ts">
import Admin from "@/components/hompage/Admin.vue";
import Cliente from "@/components/hompage/Cliente.vue";
import Agente from "@/components/hompage/Agente.vue";
import ServClienti from "@/components/hompage/ServClienti.vue";

import PageHeader from "@/components/blocks/PageHeader.vue";
import MobileMenuActions from "@/components/MobileMenuActions.vue";
import pageBasic from "@/functions/pageBasic";
import {Vue, Component} from "vue-property-decorator";

@Component({
  components: {PageHeader, Admin, Cliente, Agente, ServClienti, MobileMenuActions},
})
export default class Index extends Vue {
  get userPage() {
    const userRole = this.$auth.user.role;
    let pageToReturn = "";

    switch (+userRole) {
      case this.$enums.UserRoles.ADMIN:
        pageToReturn = "Admin";

        break;
      case this.$enums.UserRoles.CLIENTE:
        pageToReturn = "Cliente";

        break;
      case this.$enums.UserRoles.AGENTE:
        pageToReturn = "Agente";

        break;
      case this.$enums.UserRoles.SERV_CLIENTI:
        pageToReturn = "ServClienti";

        break;
    }

    return pageToReturn;
  }
}
</script>
