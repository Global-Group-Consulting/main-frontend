<template>
  <div>
    <portal to="dialog-content">
      <!-- Navbar -->
      <v-toolbar flat dense class="mb-3">
        <v-spacer/>

        <CalendarCategoriesUpsertDialog
            :category="selectedCategory"
            @closed="onDialogClosed"
            @category:saved="onCategorySaved"/>

        <v-spacer/>
      </v-toolbar>

      <v-data-table v-if="categories && categories.length > 0"
                    :headers="headers"
                    :items="categories"
                    :locale="$i18n.locale"
      >
        <!-- actions for each table row -->
        <template v-slot:item.actions="{ item }">
          <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>

          <v-icon
              small
              @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>

        <template v-slot:item.color="{item}">
          <v-icon :color="item.color">mdi-checkbox-blank-circle</v-icon>
        </template>
      </v-data-table>

      <v-alert v-else class="text-center"
               color="warning"
               outlined>
        Nessuna categoria disponibile. Premere su "Aggiungi" per crearne una.
      </v-alert>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color=""
             text
             @click="close">
        Chiudi
      </v-btn>
    </portal>
  </div>
</template>

<script lang="ts">
import {
  ComponentInstance,
  ComponentInternalInstance,
  ComputedOptions,
  defineComponent,
  onMounted,
  Ref,
  ref,
  SetupContext, SetupFunction
} from '@vue/composition-api'
import { CalendarCategory } from '~/@types/Calendar/CalendarCategory'
import CalendarCategoriesUpsertDialog from '~/components/calendar/CalendarCategoriesUpsertDialog.vue'
import { ApiCalls } from '~/plugins/apiCalls'
import { Alerts } from '~/plugins/alerts'

export default defineComponent({
  name: 'CalendarCategoriesDialog',
  components: { CalendarCategoriesUpsertDialog },
  emits: ['category:saved'],
  setup (props, { root, emit }) {
    const { $apiCalls, $alerts, $store } = root as { $apiCalls: ApiCalls, $alerts: Alerts, $store: any }
    const selectedCategory = ref<CalendarCategory | null>(null)
    const categories: Ref<CalendarCategory[]> = ref([])
    const headers = [
      {
        text: 'Nome',
        value: 'name',
        width: '60%'
      },
      {
        text: 'Colore',
        value: 'color',
        align: 'center',
        sortable: false
      },
      { text: '', value: 'actions', sortable: false, align: 'right' }
    ]

    function close () {
      $store.dispatch('dialog/updateStatus', false)
    }

    function onCategorySaved () {
      fetchData()
      emit('category:saved')
    }

    function onDialogClosed () {
      selectedCategory.value = null
    }

    function addRow () {
      categories.value.push({
        _id: '',
        name: '-',
        color: '-'
      })
    }

    function editItem (item: CalendarCategory) {
      selectedCategory.value = item
    }

    async function deleteItem (item: CalendarCategory) {
      try {
        await $alerts.ask({
          title: 'Sei sicuro di voler eliminare questa categoria?',
          confirmButtonText: 'Si, elimina'
        })

        await $apiCalls.calendarCategoriesApi.delete(item._id)

        await fetchData()
      } catch (e) {
        $alerts.error(e)
      }
    }

    async function fetchData () {
      try {
        categories.value = await $apiCalls.calendarCategoriesApi.all()
      } catch (e) {
        $alerts.error(e)
      }
    }

    onMounted(() => {
      fetchData()
    })

    return {
      headers,
      categories,
      selectedCategory,
      close,
      addRow,
      onCategorySaved,
      onDialogClosed,
      editItem,
      deleteItem
    }
  }
})
</script>

<style scoped>

</style>
