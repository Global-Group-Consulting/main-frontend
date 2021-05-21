<template>
  <div>
    <v-tooltip bottom v-if="item.status === $enums.RequestStatus.ANNULLATA">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon style="position: absolute">mdi-information</v-icon>
        </v-btn>
      </template>

      <span>{{ $t("tables.request-cancelled") }}</span>
    </v-tooltip>

    <v-menu offset-y v-else-if="menuOptions.length > 0">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <template v-for="entry in menuOptions">
          <v-divider
            v-if="entry.divider"
            :key="'divider_' + entry.value"
          ></v-divider>
          <v-list-item :key="entry.value" :entry="entry" @click="entry.action">
            <v-list-item-title>{{
                $t("menus." + entry.value)
              }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import {computed} from "@vue/composition-api";
import Permissions from "../../functions/permissions";
import requestsCrudActionsFn from "../../functions/requestsCrudActions";

export default {
  name: "RequestsCrudActions",
  props: {
    item: {}
  },
  setup(props, {root, emit}) {
    const {$alerts, $apiCalls, $auth, $router, $enums} = root;
    const permissions = Permissions(root);
    const actions = requestsCrudActionsFn(props.item, root, emit);

    const menuOptions = computed(() => {
      return [
        {
          value: "delete",
          action: async (...atrs) => {
            if (await actions.delete(...atrs)) {
              emit("rowDeleted");
            }
          },
          if:
            props.item.userId === $auth.user.id &&
            props.item.status === $enums.RequestStatus.NUOVA
        },
        {
          value: "cancelRequest",
          action: async (...atrs) => {
            if (await actions.cancel(...atrs)) {
              emit("rowCanceled");
            }
          },
          if:
            props.item.userId === $auth.user.id &&
            props.item.status === $enums.RequestStatus.ACCETTATA &&
            props.item.canCancel
        },
        {
          value: "approve",
          action: async (...atrs) => {
            if (await actions.approve(props.item)) {
              emit("rowStatusChanged");
            }
          },
          if: permissions.userType === "admin" && props.item.status === $enums.RequestStatus.NUOVA
        },
        {
          value: "reject",
          action: async (...atrs) => {
            if (await actions.reject(...atrs)) {
              emit("rowStatusChanged");
            }
          },
          if: permissions.userType === "admin" && props.item.status === $enums.RequestStatus.NUOVA
        }, {
          value: "downloadReceipt",
          action: async () => await actions.downloadReceipt(props.item.id),
          if: (permissions.userType === "user" || permissions.superAdmin)
            && props.item.type === $enums.RequestTypes.VERSAMENTO
            && props.item.status === $enums.RequestStatus.ACCETTATA
        }
      ].filter(_entry => {
        return _entry.if;
      });
    });

    return {
      menuOptions
    };
  }
};
</script>
