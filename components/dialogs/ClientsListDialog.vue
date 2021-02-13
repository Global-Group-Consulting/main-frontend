<template>
  <portal to="dialog-content">
    <data-table
      :items="usersList"
      table-key="clients"
      schema="usersSchema"
      light
    >
      <template v-slot:item.role="{ item, value}">
        <v-chip
          small
          dark
          :color="$enums.UserRoles.get(value).color"
        >
          {{
            $t(
              "enums.UserRoles." +
              $enums.UserRoles.getIdName(value)
            )
          }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{item}">
        <a :href="'/users/' + item.id" target="_blank" class="text-no-wrap">
          <v-icon small color="primary">mdi-open-in-new</v-icon>
          {{ $t("dialogs.clientsList.btn-open-user") }}
        </a>
      </template>
    </data-table>
  </portal>
</template>

<script lang="ts">
import {defineComponent} from "@vue/composition-api";
import {createNamespacedHelpers} from "vuex-composition-helpers";
import DataTable from "~/components/table/DataTable.vue";

export default defineComponent({
  name: "ClientsListDialog",
  components: {DataTable},
  setup(props, {root}) {
    const {useGetters: dialogUseGetters} = createNamespacedHelpers("dialog");
    const {dialogData} = dialogUseGetters(["dialogData"]);
    const usersList = dialogData.value.data.usersList;

    return {usersList}
  }
})
</script>

<style scoped>

</style>
