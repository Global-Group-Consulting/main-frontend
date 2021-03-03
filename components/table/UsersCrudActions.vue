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
            }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
import {computed} from "@vue/composition-api";
import Permissions from "../../functions/permissions";
import AccountStatuses from "@/enums/AccountStatuses";

export default {
  name: "UsersCrudActions",
  props: {
    item: Object,
  },
  setup(props, {root, emit}) {
    const {$alerts, $apiCalls, $auth, $router, $enums} = root;
    const permissions = Permissions(root);

    const onEditClick = function () {
      const {id} = props.item;

      $router.push("/users/" + id);
    };

    const onProfileClick = function () {
      const {id} = props.item;

      $router.push("/users/profile/" + id);
    }

    const onDeleteClick = async () => {
      const {firstName, lastName, id} = props.item;

      $alerts.askBeforeAction({
        key: "delete-user",
        data: {firstName, lastName},
        settings: {
          confirmButtonColor: "red",
        },
        preConfirm: async function () {
          await $apiCalls.userDelete(id);

          emit("userDeleted", props.item);
        },
      });
    };

    const onSendCommunicationClick = function () {
    };

    const onShowRequestsClick = function () {
    };

    const onApproveUserClick = async function () {
      try {
        await $alerts.askBeforeAction({
          key: "approve-user",
          preConfirm: async () => {
            const result = await $apiCalls.userApprove(
              props.item.id
            );
            props.item.account_status = result.account_status;
          },
          data: props.item
        });
      } catch (er) {
        $alerts.error(er);
      }
    };

    const menuOptions = [
      {
        value: "edit",
        action: onEditClick,
      },
      {
        value: "profile",
        action: onProfileClick,
        if: computed(() => [$enums.UserRoles.AGENTE, $enums.UserRoles.CLIENTE].includes(+props.item.role))
      },
      {
        value: "sendCommunication",
        action: onSendCommunicationClick,
        if: computed(() => props.item.id !== $auth.user.id &&
          props.item.account_status === $enums.AccountStatuses.ACTIVE),
      },
      {
        value: "showRequests",
        action: onShowRequestsClick,
        if: computed(
          () =>
            props.item.id !== $auth.user.id &&
            [$enums.UserRoles.CLIENTE, $enums.UserRoles.AGENTE].includes(props.item.role) &&
            props.item.account_status === $enums.AccountStatuses.ACTIVE
        ),
      },
      {
        value: "enterAs",
        if: computed(() => false),
      },
      {
        value: "approveUser",
        action: onApproveUserClick,
        if: computed(
          () => (
            (props.item.account_status === $enums.AccountStatuses.DRAFT &&
              permissions.superAdmin)
          )),
        divider: true,
      },
      {
        value: "delete",
        action: onDeleteClick,
        if: computed(
          () => props.item.id !== $auth.user.id && permissions.deleteUser
        ),
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
