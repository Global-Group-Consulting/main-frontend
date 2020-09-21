<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <v-row>
        <v-col cols="12">
          <v-card color="warning" dark>
<!--            <v-card-title>Nuove</v-card-title>-->
            <v-data-table
              light
              :headers="getTableHeaders(true)"
              :items="requestsList"
              :items-per-page="10"
            >
              <template v-slot:item.requestAmount="{ item }">
                {{ $options.filters.moneyFormatter(item.requestAmount) }}
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
  </v-layout>
</template>

<script>
import { requests } from '~/assets/fakeRichieste'
import PageHeader from '@/components/blocks/PageHeader'

export default {
  component: {
    PageHeader
  },
  data () {
    return {
      title: 'Lista movimenti',
      subtitle: '',
      icon: 'mdi-fire',
      requestsList: []
    }
  },
  methods: {
    getTableHeaders (includeCrud) {
      const columns = [
        { text: 'Importo', value: 'requestAmount' },
        { text: 'Tipo', value: 'requestType' },
        { text: 'Data richiesta', value: 'requestDate' },
        { text: 'Data lavorazione', value: 'data_update' },
      ]

      if (includeCrud && this.canEdit) {
        columns.push(
          { text: 'Utente', value: 'user_id' },
          {
            text: '',
            value: 'actions',
            sortable: false,
            align: 'center',
            width: '1%',
          })
      }

      return columns
    },
    getTipoRichiesta (id) {
      return this.$enums.RequestTypes.get(id).text
    },
  },
  created () {
    this.requestsList = requests
  }
}
</script>

<style scoped>

</style>
