<template>
  <div>
    <activation-wizard v-if="userMustActivate"
                       class="mb-5"
    />

    <v-row dense>
      <v-col cols="12" sm="6">
        <grafico :disabled="userMustActivate"
                 :values="[1500, 3400, 5200, 2500, 1500, 1800]"
                 :label-value="12700"
                 label="Capitale attuale"></grafico>
      </v-col>
      <v-col cols="12" sm="6">
        <grafico :disabled="userMustActivate"
                 :values="[150, 220, 340, 290, 520, 800]"
                 :label-value="800"
                 :height="300"
                 label="Interesse maturato"></grafico>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Grafico from '@/components/charts/Grafico'
import ActivationWizard from '@/components/hompage/activationWizard/ActivationWizard'

export default {
  name: 'Cliente',
  components: [Grafico, ActivationWizard],
  computed: {
    ...mapGetters({
      userMustActivate: 'user/mustActivate'
    })
  }
}
</script>

<style scoped>

</style>
