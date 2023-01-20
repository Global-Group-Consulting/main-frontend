<template>
  <div>
    <portal to="dialog-content">
      <v-data-table
          :headers="headers"
          :items="categories"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-divider
                class="mx-4"
                inset
                vertical
            ></v-divider>

            <v-spacer></v-spacer>

            <v-btn
                color="primary"
                dark
                class="mb-2"
                @click="addRow"
            >
              Aggiungi
            </v-btn>

          </v-toolbar>
        </template>

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

        <template v-slot:no-data>
          <v-alert>Nessuna categoria disponibile. Premere su "Aggiungi" per crearne una.</v-alert>
        </template>

        <template v-for="category in ['name', 'color']" v-slot:[`item.${category}`]="props">
          <v-edit-dialog
              :return-value.sync="props.item[category]"
              large
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
          >
            {{ props.item[category] }}
            <template v-slot:input>
              <v-text-field v-if="category !== 'color'"
                            v-model="props.item[category]"
                            label="Edit"
                            single-line
                            counter
              ></v-text-field>

              <v-color-picker v-else
                              disabled
                              dot-size="25"
                              hide-canvas
                              hide-inputs
                              hide-mode-switch
                              hide-sliders
                              show-swatches
                              swatches-max-height="200"
                              v-model="props.item[category]"
              ></v-color-picker>
            </template>
          </v-edit-dialog>
        </template>
      </v-data-table>
    </portal>

    <portal to="dialog-actions-left">
      <v-btn color="success"
             text
             @click="addRow">
        Aggiungi
      </v-btn>
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
import { defineComponent, onMounted, Ref, ref } from '@vue/composition-api'
import { CalendarCategory } from '~/@types/Calendar/CalendarCategory'

export default defineComponent({
  name: 'CalendarCategoriesDialog',
  setup (props, { root }) {
    const { $apiCalls, $alerts } = root
    const categories: Ref<CalendarCategory[]> = ref([])
    const headers = [
      {
        text: 'Nome',
        value: 'name'
      },
      {
        text: 'Colore',
        value: 'color',
        sortable: false
      },
      { text: '', value: 'actions', sortable: false }
    ]

    function save () {
    }

    function cancel () {
    }

    function open () {
    }

    function close () {
    }

    function addRow () {
      categories.value.push({
        _id: '',
        name: '-',
        color: '-'
      })
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
      open,
      close,
      save,
      cancel,
      addRow
    }
  }
})
</script>

<style scoped>

</style>
