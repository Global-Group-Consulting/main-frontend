<template>
  <div>
    <v-alert border="left"
             align="left"
             type="warning">
      <p class="mb-0">
        Gentile utente,
        per completare l'attiv\azione del suo account, e necesario che esegua i seguenti passi.
      </p>
    </v-alert>

    <v-stepper v-model="currentPhase">
      <v-stepper-header class="primary-light">
        <div v-for="step in steps"
             :key="step.id">
          <v-stepper-step :step="step.id"
                          :complete="currentPhase > step.id"
                          :color="currentPhase > step.id ? 'success' : 'accent'"
                          edit-icon="mdi-check">
            {{ $t(`activationWizard.phase${step.id}.step-title`) }}
          </v-stepper-step>
          <v-divider></v-divider>
        </div>
      </v-stepper-header>

      <v-stepper-content v-for="step in this.$siteConfig.activationWizard.steps"
                         :key="step.id"
                         :step="step.id">
        <phase-container
          :curr-step="step"
          @back="onBackClick"
          @next="onNextClick"
          @confirmAll="onConfirmAll"
          @change="onChangeEvent"/>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
// import DatiBase from '~/components/forms/DatiBase'
// import DatiIndirizzo from '~/components/forms/DatiIndirizzo'
// import DatiContatti from '~/components/forms/DatiContatti'

import StepperContent from './PhaseContainer'
import PhaseContainer from './PhaseContainer'

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
    StepperContent,
    // DatiContatti, DatiIndirizzo, DatiBase
  },
  data () {
    return {
      fetchingData: false,
      steps: [
        {
          id: '1',
          editable: true
        }, {
          id: '2',
          editable: true
        }, {
          id: '3',
          editable: true
        }
        /* {
         id:       '4',
         editable: false
         }, {
         id:       '5',
         editable: false
         }*/
      ]
    }
  },
  computed: {

    currentPhase: {
      get () {
        let phase = this['activationPhases-current']
        let phase2Valid = this['activationPhases-phase2Valid']

        // TODO:: Riattivare per la produzione!!!
        /*if (phase === 3 && !phase2Valid) {
         phase = 2
         this.$store.dispatch('activationPhases/setCurrentPhase', phase)
         }*/

        return phase
      },
      set (value) {
        this.$store.dispatch('activationPhases/setCurrentPhase', value)
      }
    }
  },
  methods: {
    onNextClick (phaseData) {
      this.$store.dispatch('activationPhases/storePhaseData', {
        phase: this.currentPhase,
        data: phaseData
      })

      this.currentPhase < 3 && this.currentPhase++
    },

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
    onBackClick () {
      this.currentPhase--
    },
    onChangeEvent (changedData) {
      console.log(changedData)
    }
  }

}
</script>

<style scoped>

</style>
