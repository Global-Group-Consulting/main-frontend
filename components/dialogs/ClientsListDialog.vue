<template>
  <portal to="dialog-content">
    <v-tabs v-model="tab">
      <v-tab v-for="(tab, i) of tabsList" :key="i">
        {{ tab.title }}
        <v-btn icon class="ms-2" small v-if="i > 0" @click.stop.prevent="closeTab(tab)">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-tabs-items :value="tab">
      <v-tab-item v-for="(tab, i) of tabsList" :key="i">
        <v-skeleton-loader type="table-thead, table-tbody, table-tfoot"
                           :loading="!tab.data">
          <PaginatedTable :paginated-data="tab.data"
                          :columns="usersSchema"
                          :condition="tab.refRole"
                          table-key="clients"
                          :options="tab.tableOptions"
                          :loading="tab.loading"
                          @update:pagination="onPaginationChanged">

            <template v-slot:item.actions="{item}">
              <a :href="'/users/profile/' + (item.id || item._id)" target="_blank" class="text-no-wrap">
                <v-icon small color="primary">mdi-open-in-new</v-icon>
                {{ $t('dialogs.clientsList.btn-open-user') }}
              </a>
            </template>

            <template v-slot:item.clientsCount="{item}">
              <v-tooltip bottom v-if="item.role === $enums.UserRoles.AGENTE">
                <template v-slot:activator="{ on }">
                  <v-btn text
                         @click="showClientsList(item)"
                         :disabled="!+item.clients"
                         v-on="on"
                         small
                         color="primary">
                    <v-icon small class="mr-2" v-if="+item.clients === 1">mdi-account</v-icon>
                    <v-icon small class="mr-2" v-else>mdi-account-multiple</v-icon>
                    {{ +item.clients || 0 }}
                  </v-btn>
                </template>
                Mostra lista clienti
              </v-tooltip>
            </template>

            <template v-slot:item.referenceAgent="{item}">
              <!-- Case item.referenceAgent is same as userId and is the same as auth.user.id - Tu -->
              <div v-if="item.referenceAgent === $auth.user.id && item.referenceAgent === tab.id">
                <v-btn text disabled small>Tu</v-btn>
              </div>

              <!-- Case item.referenceAgent is same as userId but is different from auth.user.id - Utente attuale -->
              <div v-else-if="item.referenceAgent !== $auth.user.id && item.referenceAgent === tab.id">
                <v-btn text disabled small>Utente attuale</v-btn>
              </div>

              <!-- Case item.referenceAgent is different fron userId and from auth.user.id -  -->
              <v-btn text
                     v-else-if="item.referenceAgentData && item.referenceAgent !== $auth.user.id && item.referenceAgent !== tab.id"
                     small
                     target="_blank"
                     class="text-capitalize"
                     color="primary"
                     :href="'/users/' + item.referenceAgent">
                <v-icon small class="mr-2">mdi-open-in-new</v-icon>
                {{ item.referenceAgentData.firstName }} {{ item.referenceAgentData.lastName }}
              </v-btn>
            </template>
          </PaginatedTable>
        </v-skeleton-loader>
      </v-tab-item>
    </v-tabs-items>
  </portal>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, Ref, ref } from '@vue/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import DataTable from '~/components/table/DataTable.vue'
import { User, UserDataSchema } from '~/@types/UserFormData'
import { PaginationDto } from '~/@types/pagination/PaginationDto'
import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import usersSchema from '~/config/tables/usersSchema'
import { PaginatedTab } from '~/@types/pagination/PaginatedTab'

export default defineComponent({
  name: 'ClientsListDialog',
  components: { DataTable },
  setup (props, { root }) {
    const { $apiCalls, $alerts } = root
    const { useGetters: dialogUseGetters } = createNamespacedHelpers('dialog')
    const { dialogData } = dialogUseGetters(['dialogData'])

    const agent: ComputedRef<User> = computed(() => root.$store.getters['dialog/dialogData'].data.agent)
    const tab: Ref<number> = ref(0)
    const tabsList: Ref<PaginatedTab[]> = ref([{
      id: agent.value.id || agent.value._id,
      title: `${agent.value.firstName} ${agent.value.lastName}`,
      data: null,
      referenceAgent: agent.value.referenceAgent,
      paginationDto: { sortBy: ['role', 'firstName', 'lastName'] }
    }])

    const selectedTab = computed(() => {
      return tabsList.value[tab.value]
    })

    /*
    Occorre creare delle tab per ogni cliente che si clicca,
    come il percorso corrente in un file explorer.
    Di base creare un tab per l'agente che si sta visualizzando e poi,
    man mano che si va avanti con la gerarchia e l'indentazione, aggiungere nuove tab

    Se si clicca su una tab precedente, cancellare le altre dopo ed eliminare i dati.
     */
    async function showClientsList (agent: UserDataSchema) {
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
        if (existingRefAgentIndex >= 0) {
          tabsList.value = tabsList.value.slice(0, existingRefAgentIndex + 1)
        }

        // Add a new tab with the selected agent clients
        tabsList.value.push({
          id: agent.id || agent._id,
          title: `> ${agent.firstName} ${agent.lastName}`,
          data: null,
          closable: true,
          paginationDto: { sortBy: ['role', 'firstName', 'lastName'] }
        })

        // Auto select the last added tab
        tab.value = tabsList.value.length - 1

        await fetchData(tabsList.value[tab.value - 1].paginationDto || {})
      } catch (e) {
        $alerts.error(e)
      }
    }

    function closeTab (selectedTab: any) {
      const tabIndex = tabsList.value.findIndex(_entry => _entry.id === selectedTab.id)

      if (tab.value === tabIndex) {
        // this can't be a negative number because the 0 tab can't be closed so it's always at least 1
        tab.value = tabIndex - 1
      }

      setTimeout(() => {
        tabsList.value.splice(tabIndex, 1)
      }, 350)
    }

    async function fetchData (paginationSettings: PaginationDto) {
      const currentTab = selectedTab.value

      try {
        paginationSettings.filters = {
          'referenceAgent': selectedTab.value.id
        }

        currentTab.data = await $apiCalls.userApi.filter(paginationSettings)

        // tabsList.value[0].tableData = usersList
      } catch (e) {
        $alerts.error(e)
      }
    }

    function onPaginationChanged (paginationSettings: PaginationDto) {
      fetchData(paginationSettings)
    }

    onMounted(() => {
      fetchData({
        ...(tabsList.value[tab.value].paginationDto || {})
      })
    })

    return {
      showClientsList,
      closeTab,
      tab,
      tabsList,
      usersSchema,
      onPaginationChanged
    }
  }
})
</script>

<style scoped>

</style>
