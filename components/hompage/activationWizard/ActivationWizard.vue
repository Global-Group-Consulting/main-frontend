<template>
  <div>
    <v-alert border="left"
             align="left"
             type="warning">
      <p class="mb-0">
        {{ $t('pages.activationWizard.user-info') }}
      </p>
    </v-alert>

    <v-stepper v-model="currentStepIndex">
      <v-stepper-header class="primary-light">
        <div v-for="step in steps"
             :key="step.id">
          <v-stepper-step :step="step.stepText"
                          :complete="currentStepIndex > step.id"
                          :color="currentStepIndex > step.id ? 'success' : 'accent'"
                          edit-icon="mdi-check">
            {{ $t(`pages.activationWizard.phase-${step.id}`) }}
          </v-stepper-step>
          <v-divider></v-divider>
        </div>
      </v-stepper-header>

      <v-stepper-content v-for="step in steps"
                         :key="step.id"
                         :step="step.stepText">
        <phase-container
          :current-step="step"
          @back="onBackClick"
          @next="onNextClick"
          @confirmAll="onConfirmAll"/>
      </v-stepper-content>

      <v-divider/>

      <v-card-text class="bg-light-gray">
        <div class="d-flex">
          <v-btn color="secondary"
                 v-if="currentStepIndex > 1"
                 @click="onBackClick">
            <v-icon>mdi-chevron-left</v-icon>
            {{ $t('pages.activationWizard.btn-back') }}
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn color="primary"
                 @click="onNextClick">
            <template v-if="currentStepIndex === steps.length">
              {{ $t('pages.activationWizard.btn-sign-confirm') }}
              <v-icon>mdi-check</v-icon>
            </template>

            <template v-else>
              {{ $t('pages.activationWizard.btn-next') }}
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-btn>
        </div>
      </v-card-text>
    </v-stepper>
  </div>
</template>

<script>
import PhaseContainer from './PhaseContainer'
import activationWizardSteps from '@/config/activationWizardSteps'
/*

 Occorre cambiare le variabili attuali con le nuove presenti in "activationPhases"
 e poi occorre salvare i dati delle varie fasi, probabilmente all'interno della fase stessa.

 Avrebbe senso perchè così, quando gli admin controllano i dati dell'utente, possono vedere le differenze e poi se confermano,
 faccio un merge dei nuovi dati on quelli vecchi, in modo da modificare quelli originali sono una volta, quanto gli admin
 danno l'ok.
 */

export default {
  name: 'ActivationWizard',
  components: {
    PhaseContainer,
  },
  data () {
    return {
      fetchingData: false,
      steps: activationWizardSteps,
      currentStepIndex: 1
    }
  },
  computed: {},
  methods: {
    async onConfirmAll () {
      /* try {
         const storeData = {
           ...this['activationPhases-phase1Data'],
           ...this['activationPhases-phase2Data'],
           ...this['activationPhases-phase3Data']
         }
         const formData = this.$utilities.formDataFromObject(storeData)

         const resp = await this.$apiCalls.activationPhases.signAndConfirm(formData)
       } catch (e) {
         this.$notifier.error(e)
       }*/
    },
    onNextClick () {
      if (this.currentStepIndex < 3) {
        return this.currentStepIndex++
      }

      this.onConfirmAll()
    },
    onBackClick () {
      this.currentStepIndex--
    }
  }

}
</script>

<style scoped>

</style>
