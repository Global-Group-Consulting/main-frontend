<template>
  <portal to="dialog-content">
    <v-tabs v-model="tab">
      <v-tab v-for="(tab, i) of tabsList" :key="i">{{ tab.title }}</v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(tab, i) of tabsList" :key="i">
        <data-table
          :items="tab.tableData"
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

          <template v-slot:item.clientsCount="{item, value}">
            <v-tooltip bottom v-if="item.role === $enums.UserRoles.AGENTE">
              <template v-slot:activator="{ on }">
                <v-btn text
                       @click="showClientsList(item)"
                       :disabled="!+value"
                       v-on="on"
                       small
                       color="primary">
                  <v-icon small class="mr-2">mdi-dock-window</v-icon>
                  {{ +value || 0 }}
                </v-btn>
              </template>
              Mostra lista clienti
            </v-tooltip>
          </template>
        </data-table>
      </v-tab-item>
    </v-tabs-items>
  </portal>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "@vue/composition-api";
import {createNamespacedHelpers} from "vuex-composition-helpers";
import DataTable from "~/components/table/DataTable.vue";
import {UserDataSchema} from "~/@types/UserFormData";

interface TabInstance {
  id: string,
  title: string,
  tableData: UserDataSchema[],
  referenceAgent: string
}

export default defineComponent({
  name: "ClientsListDialog",
  components: {DataTable},
  setup(props, {root}) {
    const {$apiCalls, $alerts} = root
    const {useGetters: dialogUseGetters} = createNamespacedHelpers("dialog");
    const {dialogData} = dialogUseGetters(["dialogData"]);
    const usersList: UserDataSchema[] = dialogData.value.data.usersList;
    const agent: UserDataSchema = dialogData.value.data.agent;
    const tab: Ref<number> = ref(0)
    const tabsList: Ref<TabInstance[]> = ref([
      {
        id: agent.id,
        title: `${agent.firstName} ${agent.lastName}`,
        tableData: usersList,
        referenceAgent: agent.referenceAgent
      }
    ])


    /*
    Occorre creare delle tab per ogni cliente che si clicca,
    come il percorso corrente in un file explorer.
    Di base creare un tab per l'agente che si sta visualizzando e poi,
    man mano che si va avanti con la gerarchia e l'indentazione, aggiungere nuove tab

    Se si clicca su una tab precedente, cancellare le altre dopo ed eliminare i dati.
     */
    async function showClientsList(agent: UserDataSchema) {
      const existingTabIndex = tabsList.value.findIndex(_entry => _entry.id === agent.id)
      const existingRefAgentIndex = tabsList.value.findIndex(_entry => _entry.id === agent.referenceAgent)

      /*
      If the required agent already exists, avoid downloading again the data.
      Instead, auto select the relative existing tab
       */
      if (existingTabIndex > 0) {
        tab.value = existingTabIndex
        tabsList.value = tabsList.value.slice(0, existingTabIndex + 1)

        return
      }

      try {
        const usersList = await $apiCalls.getClientsList(agent.id)

        if (existingRefAgentIndex >= 0) {
          tabsList.value = tabsList.value.slice(0, existingRefAgentIndex + 1)
        }

        // Add a new tab with the selected agent clients
        tabsList.value.push({
          id: agent.id,
          title: `> ${agent.firstName} ${agent.lastName}`,
          tableData: usersList,
          referenceAgent: agent.referenceAgent
        })

        // Auto select the last added tab
        tab.value = tabsList.value.length - 1
      } catch (e) {
        $alerts.error(e)
      }
    }

    return {
      usersList,
      showClientsList,
      tab,
      tabsList
    }
  }
})
</script>

<style scoped>

</style>
