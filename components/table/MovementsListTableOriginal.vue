<template>
<!--  <data-table
    :items="movements.list.value"
    table-key="movements"
    schema="movementsSchema"
    :items-per-page="25"
    :item-class="movements.getItemClass"
    :options="{
      sortBy: ['created_at'],
      sortDesc: [true]
    }"
  >
    <template v-slot:item.amountChange="{ item }">
      <div v-html="movements.formatAmountChange(item)"></div>
    </template>

    <template v-slot:item.movementType="{ item }">
      <div v-html="movements.formatMovementType(item)"></div>
    </template>

    <template v-slot:item.deposit="{ item }">
      <span class="text-no-wrap">
        € {{ $options.filters.moneyFormatter(item.deposit) }}
      </span>
    </template>

    <template v-slot:item.interestAmount="{ item }">
      <span class="text-no-wrap">
        € {{ $options.filters.moneyFormatter(item.interestAmount) }}
      </span>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-menu offset-y v-if="getCrudActions(item).length > 0">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <template v-for="entry in getCrudActions(item)">
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
    </template>
  </data-table>-->
</template>

<script lang="ts">
import {computed, defineComponent} from "@vue/composition-api";

import permissionsFn from "../../functions/permissions";
import {Movement} from "~/@types/Movement";
import jsFileDownload from "js-file-download";

interface CrudAction {
  value: string
  if?: boolean
  divider?: string

  action(): void
}

export default defineComponent({
  props: {
    movements: {
      required: false,
      type: Object
    }
  },
  setup(props, {root, emit}) {
    const {$enums, $auth, $alerts, $apiCalls} = root
    const permissions = permissionsFn({$auth});

    async function downloadReceipt(movementId: string) {
      try {
        const result = await $apiCalls.downloadRequestReceipt(movementId)

        jsFileDownload(result.data, result.headers["x-file-name"]);
        return true
      } catch (er) {
        $alerts.error(er)
        return false
      }
    }

    function getCrudActions(item: Movement): CrudAction[] {
      return [
        {
          value: "downloadReceipt",
          action: () => downloadReceipt(item.id),
          if: permissions.userType === "user" && item.movementType === $enums.MovementTypes.DEPOSIT_ADDED
        }
      ].filter(el => "if" in el ? el.if : true)
    }


    return {
      getCrudActions
    }
  }
});
</script>
