<template>
  <v-layout column>
    <v-row>

      <v-col cols="4">
        <v-card
          class="mx-auto text-center"
          max-width="400"
        >
          <v-card-text>
            <chart label="Patrimonio Aziendale"/>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card
          class="mx-auto text-center"
          max-width="400"
        >
          <v-card-text>
            <chart label="Utenti attivi"></chart>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card
          class="mx-auto text-center"
          max-width="400"
        >
          <v-card-text>
            <chart label="Uscite patrimoniali" color="red"/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


    <v-card>
      <v-card-text>
        <p class="text-h4 text--primary">
          Utenti in attesa di approvazione
        </p>

        <v-simple-table height="300px">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Calories</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in fakeTableData" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
      <v-card-text>
        <p class="text-h4 text--primary">
          Richieste da evadere
        </p>

        <v-simple-table height="300px">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Calories</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in fakeTableData" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import Chart from '@/components/charts/Chart'

export default {
  name: 'Admin',
  components: { Chart },
  data () {
    return {
      fakeTableData: [
        {
          name: 'Mario Rossi',
          email: 'mario.rossi@email.com'
        },
        {
          name: 'Mario Rossi',
          email: 'mario.rossi@email.com'
        }, {
          name: 'Mario Rossi',
          email: 'mario.rossi@email.com'
        },
        {
          name: 'Mario Rossi',
          email: 'mario.rossi@email.com'
        }, {
          name: 'Mario Rossi',
          email: 'mario.rossi@email.com'
        }, {
          name: 'Mario Rossi',
          email: 'mario.rossi@email.com'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
