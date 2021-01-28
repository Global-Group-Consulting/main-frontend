<template>
  <div>
    <page-header
      :title="title"
      :subtitle="subtitle"
      :icon="icon"
      show-user-role
    ></page-header>

    <component :is="userPage"/>

    <mobile-menu-actions :actions-list="actionsList"></mobile-menu-actions>
  </div>
</template>

<script>
import Admin from "@/components/hompage/Admin";
import Cliente from "@/components/hompage/Cliente";
import Agente from "@/components/hompage/Agente";
import ServClienti from "@/components/hompage/ServClienti";

import PageHeader from "@/components/blocks/PageHeader";
import MobileMenuActions from "@/components/MobileMenuActions";
import pageBasic from "@/functions/pageBasic";

export default {
  components: {PageHeader, Admin, Cliente, Agente, ServClienti, MobileMenuActions},

  setup(props, {root}) {
    const actionsList = [
      {
        title: "Zao asdajhdgjashgdjasgdjh",
      },
      {
        title: "Zao",
      }
    ]

    return {
      ...pageBasic(root, "dashboard"),
      actionsList
    };
  },
  data() {
    return {};
  },
  computed: {
    userPage() {
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
};
</script>
