<template>
  <v-dialog v-model="dialog"
            max-width="500px">
    >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          color="primary"
          dark
          outlined
          v-bind="attrs"
          v-on="on"
      >
        <v-icon class="me-2">mdi-shape-plus</v-icon>
        Aggiungi
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form
              ref="form"
              v-model="valid"
              lazy-validation
          >
            <v-text-field
                v-model="formData.name"
                label="Nome"
                required
                :rules="[v => !!v || 'Il nome è obbligatorio']"
            ></v-text-field>

            <v-select
                v-model="formData.visibility"
                label="Visibile a"
                :items="visibilityOptions"
                required

            >
            </v-select>

            <v-label>Colore</v-label>
            <v-color-picker dot-size="25"
                            hide-canvas
                            hide-inputs
                            hide-mode-switch
                            hide-sliders
                            show-swatches
                            swatches-max-height="100"
                            v-model="formData.color"
                            width="100%"
            ></v-color-picker>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="close"
        >
          Annulla
        </v-btn>
        <v-btn
            color="success"
            elevation="0"
            @click="save"
            :loading="loading"
        >
          Salva
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref, watch } from '@vue/composition-api'
import { CalendarCategory } from '~/@types/Calendar/CalendarCategory'

export enum CalendarCategoryVisibility {
  ALL = 'all',
  ME = 'author',
  ADMINS = 'admin',
  CUSTOMER_SERVICES = 'clients_service',
  AGENTS = 'agent'
}

export default defineComponent({
  name: 'CalendarCategoriesUpsertDialog',
  props: {
    category: {
      type: Object as PropType<CalendarCategory>,
      default: null
    }
  },
  emits: ['category:saved'],
  setup (props, { root, emit }) {
    const { $apiCalls, $alerts } = root
    const defaultFormData = {
      name: '',
      color: '#03A9F4FF',
      visibility: CalendarCategoryVisibility.ALL
    }
    const form = ref()
    const dialog = ref(false)
    const loading = ref(false)
    const valid = ref(false)
    const formData: Ref<Partial<CalendarCategory>> = ref({ ...defaultFormData })
    const formTitle = computed(() => props.category ? 'Modifica categoria' : 'Nuova categoria')

    const visibilityOptions = [
      { text: 'Tutti', value: CalendarCategoryVisibility.ALL },
      { text: 'Solo a me', value: CalendarCategoryVisibility.ME },
      { text: 'Admin', value: CalendarCategoryVisibility.ADMINS },
      { text: 'Servizio Clienti', value: CalendarCategoryVisibility.CUSTOMER_SERVICES },
      { text: 'Agenti', value: CalendarCategoryVisibility.AGENTS }
    ]

    function close () {
      dialog.value = false
    }

    async function save () {
      try {
        if (!form.value.validate()) {
          return
        }

        loading.value = true

        const result = await $apiCalls.calendarCategoriesApi.upsert(formData.value, props.category?._id ?? undefined)

        emit('category:saved', result)

      } catch (e) {
        $alerts.error(e)
      }

      loading.value = false

      close()
    }

    watch(() => dialog.value, (value) => {
      if (!value) {
        requestAnimationFrame(() => {
          form.value.reset()

          root.$nextTick(() => {
            formData.value = { ...defaultFormData }
            emit('closed')
          })
        })
      }
    })

    watch(() => props.category, (value) => {
      if (value) {
        formData.value = { ...value }
        dialog.value = true
      }
    })

    return {
      form,
      dialog,
      valid,
      loading,
      formData,
      formTitle,
      visibilityOptions,
      close,
      save
    }
  }
})
</script>

<style scoped lang="scss">
::v-deep {
  .v-color-picker {
    .v-color-picker__controls {
      //display: none;
    }
  }
}
</style>
