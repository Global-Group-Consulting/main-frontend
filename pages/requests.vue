<template>
  <v-layout>
    <v-flex>
      <page-header
          page-name="requests"
      ></page-header>

      <page-toolbar :actions-list="actionsList" filters-schema="requests" always-visible
      ></page-toolbar>

      <RequestsListTable :user-id="$auth.user._id"></RequestsListTable>
    </v-flex>

    <request-dialog
        @newRequestAdded="onNewRequestAdded"
        @requestDeleted="onRequestDeleted"
        @requestStatusChanged="onRequestStatusChanged"
        v-if="$store.getters['dialog/dialogId'] === 'RequestDialog'"
    ></request-dialog>

    <request-dialog-gold
        @newRequestAdded="onNewRequestAdded"
        @requestDeleted="onRequestDeleted"
        @requestStatusChanged="onRequestStatusChanged"
        v-if="$store.getters['dialog/dialogId'] === 'RequestDialogGold'"
    ></request-dialog-gold>

    <communication-new-dialog
        v-if="$store.getters['dialog/dialogId'] === 'CommunicationNewDialog'"
        @communicationAdded="onCommunicationAdded"
    ></communication-new-dialog>

  </v-layout>
</template>

<script lang="ts">

import { computed, ComputedRef, defineComponent, watch } from '@vue/composition-api'
import { useRequestActions } from '~/composables/requestActions'
import { contractNumberFormatter, userFormatter } from '~/plugins/filters'
import { Watch } from 'vue-property-decorator'
import RequestTypes from '~/enums/RequestTypes'
import RequestsListTable from '~/components/table/RequestsListTable.vue'

export default defineComponent({
  name: 'RequestsPage',
  components: { RequestsListTable },
  setup (props, ctx) {
    const { $route, $store, $t } = ctx.root
    const requestActions = useRequestActions(ctx)

    /**
     * Open a dialog with the request details
     * @param {string} requestId
     */
    function openRequestDetails (requestId: string) {
      let title = $t('dialogs.requests.title-details')

      // TODO:: sistemare il titolo del dialog come succedeva prima
      // if ($store.getters['user/userIsAdmin'] && row.user) {
      // title += ` <small><em>(${userFormatter(row.user)} - ${contractNumberFormatter(row.user.contractNumber)})</em></small>`
      // }

      $store.dispatch('dialog/updateStatus', {
        title,
        id: 'RequestDialog',
        readonly: true,
        data: {
          id: requestId
        }
      })
    }

    watch(() => $route.hash, () => {
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
        // open the request details by passing the id of the request
        openRequestDetails(hash)
      }
    })

    return {
      actionsList: requestActions.actionsList
    }
  }
})

</script>
