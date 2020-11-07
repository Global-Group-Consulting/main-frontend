<template>
  <div class="d-flex " style="width: 100%; gap: 15px">
    <v-card class="flex-fill flex-row d-flex align-start">
      <v-icon x-large class="ml-3 mt-3" color="blue">mdi-cloud-upload</v-icon>

      <div style="width: 100%">
        <v-card-title class="pb-0">€ 95.836,21</v-card-title>
        <v-card-text>
          Deposito
        </v-card-text>

        <v-card-text class="text-right pt-0">
          <v-btn link tile text small>Versa</v-btn>
        </v-card-text>
      </div>
    </v-card>

    <v-card class="flex-fill flex-row d-flex align-start">
      <v-icon x-large class="ml-3 mt-3" color="green">mdi-chart-timeline-variant</v-icon>

      <div style="width: 100%">
        <v-card-title class="pb-0">€ 3.833,45</v-card-title>
        <v-card-text>Rendite</v-card-text>
        <v-card-text class="text-right pt-0">
          <v-btn link tile text small>Movimenti</v-btn>
        </v-card-text>
      </div>
    </v-card>

    <v-card class="flex-fill flex-row d-flex align-start">
      <v-icon x-large class="ml-3 mt-3" color="red">mdi-cloud-download</v-icon>

      <div style="width: 100%">
        <v-card-title class="pb-0">€ 0,00</v-card-title>
        <v-card-text>Deposito Prelevato</v-card-text>
        <v-card-text class="text-right pt-0">
          <v-btn link tile text small>Preleva</v-btn>
        </v-card-text>
      </div>
    </v-card>

    <v-card class="flex-fill flex-row d-flex align-start">
      <v-icon x-large class="ml-3 mt-3" color="orange">mdi-chart-sankey-variant</v-icon>

      <div style="width: 100%">
        <v-card-title class="pb-0">€ 0,00</v-card-title>
        <v-card-text>Rendite Prelevate</v-card-text>
        <v-card-text class="text-right pt-0">
          <v-btn link tile text small>Riscuoti</v-btn>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'DashboardBlocks'
}
</script>

<style scoped>

</style>
