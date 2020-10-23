<template>
  <v-layout column>
    <v-card
      width="100%"
      class="text-center mb-5"
    >
      <v-card-text>
        <chart-lines
          :labels="adminDashboardChart.labels"
          :datasets="chartsAdminDataset"
        />
      </v-card-text>
    </v-card>


    <v-card class="mb-5">
      <v-card-text>
        <p class="text-h5 text--primary">
          <v-icon>mdi-account-clock</v-icon>
          {{ this.$t('tables.pending-users-table') }}
        </p>

        <v-data-table
          :headers="usersTableHeaders"
          :items="pendingUsers"
          :items-per-page="10"
          @click:row="goToUser($event._id)"
        >
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-card class="mb-5">
      <v-card-text>
        <p class="text-h5 text--primary">
          <v-icon>mdi-compare-vertical</v-icon>
          {{ this.$t('tables.pending-requests-table') }}
        </p>

        <v-data-table
          :headers="requestsTableHeaders"
          :items="pendingRequests"
          :items-per-page="10"
        >
          <template v-slot:item.requestType="{item}">
            {{ $t('enums.RequestTypes.' + $enums.RequestTypes.get(item.requestType).id) }}
          </template>

          <template v-slot:item.requestAmount="{item}">
            {{ item.requestAmount | moneyFormatter }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import Chart from '@/components/charts/Chart'
import ChartLines from '@/components/charts/ChartLines'

import { requests as pendingRequests } from '@/assets/fakeRichieste'
import pendingUsers from '@/assets/fakeUsers'

import adminDashboardChart from '@/config/charts/adminDashboard'
import usersTableSchema from '@/config/tables/usersSchema'
import requestsTableSchema from '@/config/tables/requestsSchema'
import users from '@/functions/users'

export default {
  name: 'Admin',
  components: { ChartLines, Chart },
  setup (props, { root }) {
    const usersTableHeaders = computed(() => {
      return usersTableSchema.headers.filter(col => {
        if (col.value !== 'actions') {
          return true
        }
      })
    })

    return {
      goToUser: users(root).goToUser,
      usersTableHeaders
    }
  },
  data () {
    return {
      pendingRequests,
      adminDashboardChart
    }
  },
  computed: {

    requestsTableHeaders () {
      return requestsTableSchema(this).headers.filter(col => {
        if (col.value !== 'actions') {
          return true
        }
      })
    },
    pendingUsers () {
      return pendingUsers.map(group => group.data[0])
    },
    chartsAdminDataset () {
      return adminDashboardChart.datasets.map(set => {
        set.label = this.$t(set.label)

        return set
      })
    }
  }
}
</script>

<style scoped>

</style>
