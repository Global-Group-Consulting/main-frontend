<template>
  <div class="d-flex">
    <v-autocomplete :items="items"
                    :value="value"
                    :search-input.sync="search"
                    :loading="loading"
                    cache-items
                    :no-data-text="noDataText"
                    @change="onChange"
                    @click:clear="onClickClear"
                    v-bind="$attrs"
    >
      <template v-slot:label>
        <slot name="label"></slot>
      </template>

      <template v-slot:prepend>
        <slot name="prepend"></slot>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref, watch } from '@vue/composition-api'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'AsyncAutocomplete',
  props: {
    value: String,
    asyncFn: {
      type: Function as PropType<(search: string) => Promise<any[]>>,
      required: true
    }
  },
  setup (props, { emit, root }) {
    const items: Ref<any[]> = ref([])
    const search = ref('')
    const loading = ref(false)
    const justChanged = ref(false)

    function onChange (value: string) {
      console.log('onChange', value)
      items.value = []
      justChanged.value = true

      emit('change', value)
    }

    function onClickClear () {
      items.value = []

      emit('change', '')
    }

    const noDataText = computed(() => {
      let toReturn

      if (!search.value) {
        toReturn = 'Inizia a scrivere per cercare'
      } else if (search.value.length < 3) {
        toReturn = 'Inserisci almeno 3 caratteri'
      } else if (loading.value) {
        toReturn = 'Sto cercando..'
      } else if (items.value.length === 0) {
        toReturn = 'Nessun risultato trovato'
      }

      return toReturn
    })

    watch(search, debounce(async (value: string) => {
      console.log('watch debounce', value)

      if (justChanged.value) {
        justChanged.value = false
        return
      }

      if (!value || value.length < 3) {
        items.value = []

        return
      }

      loading.value = true

      try {
        items.value = await props.asyncFn.call(root.$apiCalls.selectOptions, value)
      } catch (e) {
        console.error(e)
      }

      loading.value = false
    }, 300))

    return {
      items,
      search,
      loading,
      noDataText,
      onChange,
      onClickClear
    }
  }
})

</script>
