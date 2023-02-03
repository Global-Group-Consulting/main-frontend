import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'
import { computed, ComputedRef, nextTick, reactive, ref, Ref } from '@vue/composition-api'
import { ApiCalls } from '~/plugins/apiCalls'
import { Alerts } from '~/plugins/alerts'
import { Filter } from '~/@types/Filter'
import { PaginationDto } from '~/@types/pagination/PaginationDto'

export const useCalendar = function ($apiCalls: ApiCalls, $alerts: Alerts, $store: any) {
  const activeEvent = ref({
    selectedEvent: {} as CalendarEvent,
    selectedElement: null,
    left: false,
    bottom: false
  })
  
  const filteredPagination: Ref<PaginatedResult<CalendarEvent>> = ref({
    page: 1,
    sortBy: [],
    sortDesc: [],
    data: [],
    lastPage: 100,
    perPage: 3,
    total: 0,
    filters: {}
  })
  
  const activeFilters: ComputedRef<Filter> = computed(() => {
    return $store.getters['filters/activeFilters']
  })
  
  const filteredEvents: ComputedRef<CalendarEvent[]> = computed(() => {
    if (!filteredPagination.value) {
      return []
    }
    
    return filteredPagination.value?.data
  })
  
  function loadMoreFilteredEvents (filters?: any, paginationData?: PaginationDto) {
    if (filteredPagination.value?.page) {
      filteredPagination.value.page++
      filterData(true, filters, paginationData).then()
    }
  }
  
  function showEvent (data: any) {
    const { nativeEvent, event } = data
    
    nextTick(() => {
      activeEvent.value.selectedEvent = event
      activeEvent.value.selectedElement = nativeEvent.target
      activeEvent.value.left = data.left
    })
  }
  
  async function filterData (append?: boolean, filters: any = null, paginationData?: PaginationDto) {
    try {
      const result: PaginatedResult<CalendarEvent> = (await $apiCalls.calendarEventsApi.all(filters ?? activeFilters.value, {
        ...(paginationData ?? {}),
        page: append ? filteredPagination.value?.page : 1
      }))
      
      if (append) {
        filteredPagination.value = {
          ...result,
          data: [...filteredPagination.value?.data ?? [], ...result.data]
        }
      } else {
        filteredPagination.value = result
      }
      
    } catch (e) {
      $alerts.error(e)
    }
  }
  
  return {
    activeEvent,
    filteredPagination,
    filteredEvents,
    loadMoreFilteredEvents,
    filterData,
    showEvent
  }
}
