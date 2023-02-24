<template>
  <div class="d-flex">
    <v-autocomplete ref="autocompleteDiv"
                    :items="selectOptions"
                    :value="value"
                    :search-input.sync="search"
                    :loading="loading"
                    cache-items
                    :no-data-text="noDataText"
                    @change="onChange"
                    @click:clear="onClickClear"
                    v-bind="$attrs"
                    :small-chips="multiple"
                    :chips="multiple"
                    :deletable-chips="multiple"
                    :multiple="multiple"
    >
      <template v-slot:label>
        <slot name="label"></slot>
      </template>

      <template v-slot:prepend-item>
        <slot name="prepend-item"></slot>
      </template>

      <template v-slot:prepend>
        <slot name="prepend"></slot>
      </template>

      <template v-slot:append-item v-if="showUseUnknownUser">
        <v-list-item link dense @click="onUserUnknownUserClick">
          <v-list-item-icon class="me-3">
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Aggiungi <strong>"{{ ucWords(search) }}"</strong></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref, watch } from '@vue/composition-api'
import { debounce } from 'lodash'
import { ucWords } from '~/plugins/utilities'

export default defineComponent({
  name: 'AsyncAutocomplete',
  props: {
    value: [String, Array],
    asyncFn: {
      type: Function as PropType<(search: string) => Promise<any[]>>,
      required: true
    },
    items: Array,
    multiple: Boolean,
    componentProps: Object as PropType<{ allowNewItems: Boolean }>
  },
  setup (props, { emit, root }) {
    const autocompleteDiv = ref()
    const selectOptions: Ref<any[]> = ref([])
    const search = ref('')
    const loading = ref(false)
    const justChanged = ref(false)

    const allowNewItems = computed(() => props.componentProps && props.componentProps.allowNewItems)

    const showUseUnknownUser = computed(() => {
      // show only if the component is configured to allow new items
      if (!allowNewItems.value) {
        return false
      }

      const isCached = autocompleteDiv.value?.cachedItems.find((el: any) => el.value === search.value)

      return !loading.value && search.value && !selectOptions.value.length && !isCached
    })

    const noDataText = computed(() => {
      let toReturn

      if (!search.value) {
        toReturn = 'Inizia a scrivere per cercare'
      } else if (search.value.length < 3) {
        toReturn = 'Inserisci almeno 3 caratteri'
      } else if (loading.value) {
        toReturn = 'Sto cercando..'
      } else if (selectOptions.value.length === 0) {
        toReturn = 'Nessun risultato trovato'
      }

      return toReturn
    })

    function onChange (value: string) {
      // console.log('onChange', value)
      selectOptions.value = []
      justChanged.value = true

      emit('input', value)
      emit('change', value)
    }

    function onClickClear () {
      selectOptions.value = []

      emit('input', '')
      emit('change', '')
    }

    function onUserUnknownUserClick () {
      const value = ucWords(search.value)
      const newUser = {
        value,
        text: value
      }

      selectOptions.value.push(newUser)
      justChanged.value = true

      emit('input', value)
      emit('change', value)
    }

    watch(search, debounce(async (value: string) => {
      // console.log('watch debounce', value)

      if (justChanged.value) {
        justChanged.value = false
        return
      }

      if (!value || value.length < 3) {
        selectOptions.value = []

        return
      }

      loading.value = true

      try {
        selectOptions.value = await props.asyncFn.call(root.$apiCalls.selectOptions, value)
      } catch (e) {
        console.error(e)
      }

      loading.value = false
    }, 300))

    watch(() => props.items, (value) => {
      if (!value || loading.value) {
        return
      }

      // console.log('watch items', value)

      selectOptions.value = value
    }, { immediate: true })

    return {
      autocompleteDiv,
      selectOptions,
      search,
      loading,
      noDataText,
      showUseUnknownUser,
      onChange,
      onClickClear,
      onUserUnknownUserClick,
      ucWords
    }
  }
})

</script>
