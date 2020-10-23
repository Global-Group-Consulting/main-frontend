<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <v-toolbar class="mb-5" v-if="!canEdit">
        <v-toolbar-items class="flex-fill d-flex justify-center">
          <v-btn text @click="onNewRequest">Nuova richiesta</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-row>
        <v-col cols="12">
          <v-card color="warning" dark>
            <v-card-title>Nuove</v-card-title>
            <v-data-table
              light
              :headers="getTableHeaders(true)"
              :items="requestsGroups.nuova"
              :items-per-page="10"
              @click:row="onRowClick"
            >
              <template v-slot:item.actions="{ item }"
                        v-if="canEdit">
                <crud-actions :item="item"></crud-actions>
              </template>

              <template v-slot:item.requestAmount="{ item }">
                <span :class="getAmountClass(getAmountSign(item.requestType))">
                  {{ getAmountSign(item.requestType) }}
                  € {{ $options.filters.moneyFormatter(item.requestAmount) }}
                </span>
              </template>

              <template v-slot:item.requestDate="{ item }">
                {{ $options.filters.dateFormatter(item.requestDate, true) }}
              </template>

              <template v-slot:item.data_update="{ item }">
                {{ $options.filters.dateFormatter(item.data_update, true) }}
              </template>

              <template v-slot:item.requestType="{ item }">
                {{ getTipoRichiesta(item.requestType) }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card color="success" dark>
            <v-card-title>Accettate</v-card-title>
            <v-data-table
              light
              :headers="getTableHeaders()"
              :items="requestsGroups.accettata"
              :items-per-page="10"
              @click:row="onRowClick"
            >
              <template v-slot:item.requestAmount="{ item }">
                <span :class="getAmountClass(getAmountSign(item.requestType))">
                  {{ getAmountSign(item.requestType) }}
                  € {{ $options.filters.moneyFormatter(item.requestAmount) }}
                </span>
              </template>

              <template v-slot:item.requestDate="{ item }">
                {{ $options.filters.dateFormatter(item.requestDate, true) }}
              </template>

              <template v-slot:item.data_update="{ item }">
                {{ $options.filters.dateFormatter(item.data_update, true) }}
              </template>

              <template v-slot:item.requestType="{ item }">
                {{ getTipoRichiesta(item.requestType) }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card color="error" dark>
            <v-card-title>Rifiutate</v-card-title>
            <v-data-table
              light
              :headers="getTableHeaders()"
              :items="requestsGroups.rifiutata"
              :items-per-page="10"
              @click:row="onRowClick"
            >
              <template v-slot:item.requestAmount="{ item }">
                <span :class="getAmountClass(getAmountSign(item.requestType))">
                  {{ getAmountSign(item.requestType) }}
                  € {{ $options.filters.moneyFormatter(item.requestAmount) }}
                </span>
              </template>

              <template v-slot:item.requestDate="{ item }">
                {{ $options.filters.dateFormatter(item.requestDate, true) }}
              </template>

              <template v-slot:item.data_update="{ item }">
                {{ $options.filters.dateFormatter(item.data_update, true) }}
              </template>

              <template v-slot:item.requestType="{ item }">
                {{ getTipoRichiesta(item.requestType) }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>

    </v-flex>

    <request-dialog></request-dialog>
  </v-layout>
</template>

<script>
import { requests } from '~/assets/fakeRichieste'

import requestsSchema from '@/config/tables/requestsSchema'

import PageHeader from '@/components/blocks/PageHeader'
import CrudActions from '@/components/table/RequestsCrudAction'
import RequestDialog from '@/components/dialogs/RequestDialog'

export default {
  components: {
    RequestDialog,
    CrudActions,
    PageHeader
  },
  data () {
    return {
      title: 'Richieste di riscossione',
      subtitle: '',
      icon: 'mdi-fire',
      requestsList: [],
      requestsGroups: {},
      requestDialogData: {}
    }
  },
  computed: {
    canEdit () {
      const allowedRoles = [this.$enums.UserRoles.ADMIN, this.$enums.UserRoles.SERV_CLIENTI]

      return allowedRoles.includes(this.$auth.user.role)
    }
  },
  methods: {
    getAmountSign (requestType) {
      return [this.$enums.RequestTypes['VERSAMENTO'],
        this.$enums.RequestTypes['INTERESSI']].includes(requestType) ? '+' : '-'
    },
    getAmountClass (sign) {
      const minus = 'red--text'
      const plus = 'green--text'

      return sign === '-' ? minus : plus
    },
    getTableHeaders (includeCrud) {
      return requestsSchema(this).headers
    },
    onRowClick (row) {
      const userId = row.user_id

      this.$store.dispatch('dialog/updateStatus', {
        title: '',
        readonly: true,
        data: row
      })
    },
    getTipoRichiesta (_id) {
      const id = this.$enums.RequestTypes.get(_id).id

      return this.$t('enums.RequestTypes.' + id)
    },
    onNewRequest () {
      this.$store.dispatch('dialog/updateStatus', {
        title: '',
        readonly: false,
        data: {}
      })
    }
  },
  watch: {
    requestsList: function (list) {
      const groups = {
        nuova: [],
        accettata: [],
        rifiutata: []
      }

      list.forEach(richiesta => {
        const stato = this.$enums.RequestStatus.get(richiesta.requestState)
        let groupName = stato.id

        groups[groupName].push(richiesta)
      })

      this.requestsGroups = groups
    }
  },
  created () {
    this.requestsList = requests
  }
}
</script>
