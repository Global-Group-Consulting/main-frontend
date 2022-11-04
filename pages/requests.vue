<template>
  <v-layout>
    <v-flex>
      <page-header
          page-name="requests"
      ></page-header>

      <page-toolbar :actions-list="actionsList" filters-schema="requests" always-visible
      ></page-toolbar>

      <RequestsListTable :user-id="$auth.user._id" ref="requestsListTable"></RequestsListTable>
    </v-flex>

    <request-dialog
        v-if="$store.getters['dialog/dialogId'] === 'RequestDialog'"
    ></request-dialog>

    <request-dialog-gold
        v-if="$store.getters['dialog/dialogId'] === 'RequestDialogGold'"
    ></request-dialog-gold>

    <communication-new-dialog
        v-if="$store.getters['dialog/dialogId'] === 'CommunicationNewDialog'"
    ></communication-new-dialog>

  </v-layout>
</template>

<script lang="ts">

import { computed, defineComponent, onMounted, Ref, ref, watch } from '@vue/composition-api'
import { useRequestActions } from '~/composables/requestActions'
import RequestTypes from '~/enums/RequestTypes'
import RequestsListTable from '~/components/table/RequestsListTable.vue'
import RequestStatus from '~/enums/RequestStatus'
import RequestDialog from '~/components/dialogs/RequestDialog.vue'
import RequestDialogGold from '~/components/dialogs/RequestGoldDialog.vue'
import { RequestsTableActions } from '~/functions/requestsTableActions'
import { Watch } from 'vue-property-decorator'

export default defineComponent({
  name: 'RequestsPage',
  components: { RequestsListTable, RequestDialog, RequestDialogGold },
  setup (props, ctx) {
    const { $route, $router, $store, $nuxt } = ctx.root
    const requestsListTable: Ref = ref(null)
    const requestActions = useRequestActions(ctx)
    const tableActions: RequestsTableActions = new RequestsTableActions(ctx.root)

    //azioni = reload dati

    function onNewRequestAdded (newStatus: number) {
      if (requestsListTable.value) {
        requestsListTable.value?.refreshTabData(newStatus ?? RequestStatus.LAVORAZIONE)
        requestsListTable.value?.setActiveTab(newStatus ?? RequestStatus.LAVORAZIONE)
      }
    }

    function onRequestDeleted (oldStatus: number) {
      if (requestsListTable.value) {
        requestsListTable.value?.refreshTabData(oldStatus)
      }
    }

    function onRequestStatusChanged ({ oldStatus, newStatus }: { oldStatus: number, newStatus: number }) {
      if (requestsListTable.value) {
        // must refresh data for old tab and new tab
        requestsListTable.value?.refreshTabData(oldStatus)

        if (newStatus && newStatus > -1) {
          requestsListTable.value?.refreshTabData(newStatus)
          requestsListTable.value?.setActiveTab(newStatus)
        }
      }
    }

    function onCommunicationAdded () {
      if (requestsListTable.value) {
        requestsListTable.value?.refreshTabData(RequestStatus.NUOVA)
        requestsListTable.value?.refreshTabData(RequestStatus.LAVORAZIONE)

        requestsListTable.value?.setActiveTab(RequestStatus.LAVORAZIONE)
      }
    }

    // Handle hash change
    function onHashChange () {
      const hash = window.location.hash.replace('#', '')

      if (!hash) {
        return
      }

      // new must contain the type of required request as "new_type_of_request"
      if (hash.startsWith('new')) {
        const newType = hash.slice(hash.indexOf('_') + 1)

        switch (newType) {
          case 'add_deposit':
            requestActions.newDepositRequest()
            break
          case 'collect_deposit':
          case 'collect_interests':
          case 'collect_commissions':
            let type = -1

            if (newType === 'collect_deposit') {
              type = RequestTypes.RISC_CAPITALE
            } else if (newType === 'collect_interests') {
              if (!$store.getters['user/canAddRequestClassic'] && $store.getters['user/canAddRequestGold']) {
                type = RequestTypes.RISC_INTERESSI_BRITE
              } else {
                type = RequestTypes.RISC_INTERESSI
              }
            } else if (newType === 'collect_commissions') {
              type = RequestTypes.RISC_PROVVIGIONI
            }

            if ([RequestTypes.RISC_INTERESSI_GOLD, RequestTypes.RISC_INTERESSI_BRITE].includes(type)) {
              requestActions.newWithdrawalRequestGold(type)
            } else {
              requestActions.newWithdrawalRequest(type)
            }

            break
          case 'collect_gold':
            requestActions.newWithdrawalRequestGold()
            break
        }
      } else {
        console.log('hash', hash)

        // open the request details by passing the id of the request
        tableActions.openDetailsDialogFromId(hash)
      }
    }

    const routeHash = computed(() => $route.hash)

    watch(() => routeHash.value, onHashChange, {immediate: true})

    // when closing the dialog remove the hash from the url
    watch(() => $store.getters['dialog/dialogState'], (value: boolean) => {
      if (!value) {
        window.location.hash = ""
      }
    })

    onMounted(() => {
      // add event listeners
      $nuxt.$on('requests:statusChanged', onRequestStatusChanged)
      $nuxt.$on('requests:deleted', onRequestDeleted)
      $nuxt.$on('requests:newAdded', onNewRequestAdded)

      window.addEventListener('hashchange', () => {
        console.log("[hash change!!!]", window.location.hash)
        onHashChange()
      })
    })

    return {
      actionsList: requestActions.actionsList,
      requestsListTable,
      onNewRequestAdded,
      onRequestDeleted,
      onRequestStatusChanged,
      onCommunicationAdded
    }
  }
})

</script>
