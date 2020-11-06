<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn color="primary" icon v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <template v-for="entry in menuOptions">
        <v-divider
          v-if="entry.divider && entry.if.value"
          :key="'divider_' + entry.value"
        ></v-divider>
        <v-list-item
          :key="entry.value"
          :entry="entry"
          v-if="entry.if ? entry.if.value : true"
          @click="entry.action"
        >
          <v-list-item-title>{{
            $t("menus." + entry.value)
          }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
  import { computed } from "@vue/composition-api";
  export default {
    name: "UsersCrudActions",
    props: {
      item: Object,
    },
    setup(props, { root, emit }) {
      const { $alerts, $apiCalls, $auth, $router, $enums } = root;

      const onEditClick = function () {
        const { id } = props.item;

        $router.push("/users/" + id);
      };

      const onDeleteClick = async () => {
        const { firstName, lastName, id } = props.item;

        $alerts.askBeforeAction({
          key: "delete-user",
          data: { firstName, lastName },
          settings: {
            confirmButtonColor: "red",
          },
          preConfirm: async function () {
            await $apiCalls.userDelete(id);

            emit("userDeleted", props.item);
          },
        });
      };

      const onSendCommunicationClick = function () {};

      const onShowRequestsClick = function () {};

      const menuOptions = [
        {
          value: "edit",
          action: onEditClick,
        },
        {
          value: "sendCommunication",
          action: onSendCommunicationClick,
          if: computed(() => props.item.id !== $auth.user.id),
        },
        {
          value: "showRequests",
          action: onShowRequestsClick,
          if: computed(
            () =>
              props.item.id !== $auth.user.id &&
              [$enums.UserRoles.CLIENTE, $enums.UserRoles.AGENTE].includes(
                props.item.role
              )
          ),
        },
        {
          value: "enterAs",
          if: computed(() => false),
        },
        {
          value: "delete",
          action: onDeleteClick,
          if: computed(() => props.item.id !== $auth.user.id),
          divider: true,
        },
      ];

      return {
        menuOptions,
      };
    },
    methods: {},
  };
</script>

<style scoped>

</style>
