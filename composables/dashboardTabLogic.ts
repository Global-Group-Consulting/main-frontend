import { computed, onMounted, Ref, ref, SetupContext, watch } from '@vue/composition-api'
import { DashboardCardListItem } from '~/components/lists/DashboardCardList.vue'

export const useDashboardTabLogic = function <T> ({ root, emit }: SetupContext,
  props: { mustReload?: boolean, loadingData?: boolean, filters?: any },
  sections: Ref<DashboardCardListItem[]>) {
  const hasError = ref(false)
  const loading = ref(true)
  const menu = ref(false)
  const data: Ref<T | null> = ref(null)
  
  let _fetchData: (filters: any) => any = async () => {throw new Error('Not implemented. Must be override by the component that uses this logic')}
  let _onDataChange: (newValue: any) => any = () => {throw new Error('Not implemented. Must be override by the component that uses this logic')}
  
  function setFetchFunction (fnCallback: (filters: any) => Promise<T>) {
    _fetchData = fnCallback
  }
  
  function setOnDataChange (fnCallback: (data: T) => void) {
    _onDataChange = fnCallback
  }
  
  async function fetchData () {
    hasError.value = false
    loading.value = true
    
    try {
      data.value = await _fetchData(props.filters)
    } catch (error) {
      hasError.value = true
      console.error(error)
    }
    
    // eventually reset the mustReload flag
    emit('update:mustReload', false)
    loading.value = false
  }
  
  onMounted(() => {
    fetchData()
  })
  
  watch(() => props.mustReload, (newVal) => {
    if (newVal) {
      fetchData()
    }
  })
  
  watch(() => props.loadingData, (newVal) => {
    loading.value = newVal ?? false
  })
  
  watch(() => loading.value, (newVal) => {
    emit('update:loadingData', newVal)
  })
  
  watch(() => data.value, (newVal) => {
    _onDataChange(newVal)
    /*sections.value.forEach(section => {
      // @ts-ignore
      section.title = '€ ' + moneyFormatter(newVal[section.id] || 0)
    })*/
  }, { deep: true })
  
  return {
    sections,
    hasError,
    loading,
    menu,
    setFetchFunction,
    setOnDataChange
  }
}
