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
          <v-card color="success" dark>
            <v-card-title>Entrate</v-card-title>

            <v-data-table
              light
              :headers="movementsSchema.headers"
              :items="requestsList.in"
              :items-per-page="10"
            >
              <template v-slot:item.requestAmount="{ item }">
                <span :class="getAmountClass(getAmountSign(item.type))">
                  {{ getAmountSign(item.type) }}
                  € {{ $options.filters.moneyFormatter(item.requestAmount) }}
                </span>
              </template>

              <template v-slot:item.requestDate="{ item }">
                {{ $options.filters.dateFormatter(item.requestDate, true) }}
              </template>

              <template v-slot:item.data_update="{ item }">
                {{ $options.filters.dateFormatter(item.data_update, true) }}
              </template>

              <template v-slot:item.type="{ item }">
                {{ getTipoRichiesta(item.type) }}
              </template>
            </v-data-table>
          </v-card>

        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card color="error" dark>
            <v-card-title>Uscite</v-card-title>

            <v-data-table
              light
              :headers="movementsSchema.headers"
              :items="requestsList.out"
              :items-per-page="10"
            >
              <template v-slot:item.requestAmount="{ item }">
                <span :class="getAmountClass(getAmountSign(item.type))">
                  {{ getAmountSign(item.type) }}
                  € {{ $options.filters.moneyFormatter(item.requestAmount) }}
                </span>
              </template>

              <template v-slot:item.requestDate="{ item }">
                {{ $options.filters.dateFormatter(item.requestDate, true) }}
              </template>

              <template v-slot:item.data_update="{ item }">
                {{ $options.filters.dateFormatter(item.data_update, true) }}
              </template>

              <template v-slot:item.type="{ item }">
                {{ getTipoRichiesta(item.type) }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
import fakeMovements from '~/assets/fakeMovements'
import PageHeader from '@/components/blocks/PageHeader'

import movementsSchema from '@/config/tables/movementsSchema'

export default {
  component: {
    PageHeader
  },
  data () {
    return {
      title: 'Lista movimenti',
      subtitle: '',
      icon: 'mdi-fire',
      requestsList: {
        in: [],
        out: []
      }
    }
  },
  computed: {
    movementsSchema
  },
  methods: {
    getTipoRichiesta (_id) {
      const id = this.$enums.RequestTypes.get(_id).id

      return this.$t('enums.RequestTypes.' + id)
    },
    getAmountSign (type) {
      return [this.$enums.RequestTypes['VERSAMENTO'],
        this.$enums.RequestTypes['INTERESSI']].includes(type) ? '+' : '-'
    },
    getAmountClass (sign) {
      const minus = 'red--text'
      const plus = 'green--text'

      return sign === '-' ? minus : plus
    }
  },
  created () {
    const positiveTypes = [this.$enums.RequestTypes['VERSAMENTO'],
      this.$enums.RequestTypes['INTERESSI']]

    for (const movement of fakeMovements) {
      if (this.$auth.user.role === this.$enums.UserRoles['CLIENTE']
        && movement.type === this.$enums.RequestTypes['INTERESSI']) {
        continue
      }

      if (positiveTypes.includes(movement.type)) {
        this.requestsList.in.push(movement)
      } else {
        this.requestsList.out.push(movement)
      }
    }

  }
}
</script>

<style scoped>

</style>
