<template>
  <v-layout column>
    <NewsBox></NewsBox>

    <admin-cards></admin-cards>

    <v-card class="mb-5">
      <v-card-title class="p-relative">
        <v-icon>mdi-fire</v-icon>
        {{ this.$t('tables.pending-requests-table') }}

        <div class="v-alert__border v-alert__border--bottom warning"></div>
      </v-card-title>

      <v-card-text>
        <requests-list-table
            :tabs="['nuova']"
            tableSchema="requestsDashboard"
            redirectToPage
            flat
        >
        </requests-list-table>
      </v-card-text>

    </v-card>
  </v-layout>
</template>

<script lang="ts">
import ChartLines from '@/components/charts/ChartLines.vue'
import RequestsListTable from '@/components/table/RequestsListTable.vue'

import adminDashboardChart from '@/config/charts/adminDashboard'
import DataTable from '~/components/table/DataTable.vue'
import { Component, Vue } from 'vue-property-decorator'
import { SignRequestLog } from '~/@types/SignRequest'
import { WebhooksCall } from '~/@types/SignRequest/Webhooks'
import { User } from '~/@types/UserFormData'
import SigningLogsPopup from '~/components/elements/SigningLogsPopup.vue'
import DashboardBlocks from '~/components/DashboardBlocks.vue'
import DashboardCard from '~/components/dashboard/DashboardCard.vue'
import { BlockData } from '~/config/blocks/dashboardBlocks'
import { moneyFormatter } from '~/plugins/filters/moneyFormatter'
import AccountStatuses from '~/enums/AccountStatuses'
import { MenuListItem } from '~/@types/components/MenuListItem'
import MenuList from '~/components/elements/MenuList.vue'
import TextIcon from '~/components/elements/TextIcon.vue'
import AdminCards from '~/components/elements/cards/AdminCards.vue'

@Component({
  components: {
    AdminCards,
    TextIcon, DashboardCard, DashboardBlocks, SigningLogsPopup, DataTable, ChartLines, RequestsListTable
  }
})
export default class Admin extends Vue {

  public dashboardChart = adminDashboardChart
  public dashboardData = {
    validatedUsers: [],
    pendingRequests: [],
    pendingSignatures: [],
    systemTotals: {
      deposit: 0,
      interests: 0,
      withdrewDeposit: 0,
      withdrewInterests: 0
    },
    commissionTotals: {
      total: 0,
      withdrew: 0,
      reinvested: 0
    },
    newUsers: {
      thisMonth: 0,
      last3Months: 0,
      last6Months: 0,
      last12Months: 0
    },
    usersStatus: {
      draft: 0,
      active: 0,
      pendingAccess: 0,
      pendingSignature: 0,
      suspended: 0
    },
    agentsNewUsers: [],
    agentsTotalEarnings: []
  }

  public loading = true

  get pendingUsers () {
    // return pendingUsers.map((group) => group.data[0]);
    return []
  }

  get chartsAdminDataset () {
    return this.dashboardChart.datasets.map(set => {
      set.label = this.$t(set.label) as string

      return set
    })
  }

  openRequest (request: any) {
    this.$router.push('/requests#' + request.id)
  }

  getSignDocSent (item: User): SignRequestLog {
    return item.signinLogs?.find(hook => hook.event === 'sent') || {} as SignRequestLog
  }

  getSignDocViewed (item: User): SignRequestLog {
    return item.signinLogs?.find(hook => hook.event === 'signer_viewed') || {} as SignRequestLog
  }

  getSignDocSigned (item: User): SignRequestLog {
    return item.signinLogs?.find(hook => hook.event === 'signer_signed') || {} as SignRequestLog
  }

  onSignContractClick (item: User) {
    this.$alerts.info({
      title: '',
      html: this.$t('alerts.sign-contract-unavailable', { name: item.firstName + ' ' + item.lastName }) as string
    })
  }

  async mounted () {
    try {
      const result = await this.$apiCalls.dashboardFetch()

      this.dashboardData.pendingRequests = result.pendingRequests || []

      this.loading = false
    } catch (er) {
      this.$alerts.error(er)
    }
  }

}

</script>

<style scoped></style>
