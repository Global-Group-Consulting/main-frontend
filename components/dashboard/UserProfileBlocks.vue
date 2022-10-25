<template>
  <dashboard-blocks :dashboard-data="blocksData"
                    class="mb-6"
                    readonly
                    page="users"
                    format-as-int
                    :loading="loading"
  ></dashboard-blocks>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from '@vue/composition-api'
import { GetStatisticsDto } from '~/plugins/apiCalls/UserApi'
import AccountStatuses from '~/enums/AccountStatuses'

export default defineComponent({
  name: 'UserProfileBlocks',
  setup (props, { root }) {
    const { $store, $apiCalls, $alerts } = root
    const loading = ref(true)

    const statisticsData: Ref<GetStatisticsDto[]> = ref([])

    const blocksData = computed(() => {
      // TODO:: Dati devono essere recuperati da API direttamente qui

      // const usersStatistics = $store.getters['users/usersStatistics']
      // const agentUsersStatistics = $store.getters['users/agentUsersStatistics']

      return {
        blocks: {
          draft: statisticsData.value.find(x => x._id === AccountStatuses.DRAFT)?.count || 0,
          pendingSignature: statisticsData.value.find(x => x._id === AccountStatuses.VALIDATED)?.count || 0,
          pendingFirstAccess: statisticsData.value.find(x => x._id === AccountStatuses.APPROVED)?.count || 0,
          active: statisticsData.value.find(x => x._id === AccountStatuses.ACTIVE)?.count || 0
        }
      }
    })

    onMounted(async () => {
      // const authUserIsAgent = $store.getters['user/userIsAgente']
      loading.value = true

      try {
        statisticsData.value = await root.$apiCalls.userApi.getStatistics('accountStatuses')
      } catch (e) {
        $alerts.error(e)
      }

      loading.value = false
    })

    return {
      blocksData,
      loading
    }
  }
})
</script>

<style scoped>

</style>
