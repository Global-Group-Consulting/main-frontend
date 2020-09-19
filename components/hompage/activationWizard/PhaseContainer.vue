<template>
  <div>
    <v-card elevation="0">
      <v-card-title class="d-md-none px-0"
                    v-html="$t(`pages.activationWizard.phase-${currentStep.id}`)"/>

      <v-form>
        <dynamic-fieldset :schema="activationWizardForms[currentStep.id]"
                          :fill-row="currentStep.id === 'contract-sign'"
                          v-model="formData"/>
      </v-form>
    </v-card>

    <portal-target :name="`actionButtons${currentStep.id}`"/>
  </div>
</template>

<script>
import activationWizardForms from '@/config/forms/activationWizard'

import { mapState } from 'vuex'
import DynamicFieldset from '@/components/DynamicFieldset'

export default {
  name: 'PhaseContainer',
  components: {
    DynamicFieldset
  },
  data () {
    return {
      changesTimer: {
        key: null,
        timer: null
      },
      formData: {
        ...this.$auth.user
      }
    }
  },
  props: {
    currentStep: {}
  },
  computed: {
    activationWizardForms,
    personaGiuridica () {
      return this.formData.personType === this.$enums.PersonTypes.GIURIDICA
    },
    showReferenceAgent () {
      return [this.$enums.UserRoles.CLIENTE, this.$enums.UserRoles.AGENTE].includes(this.formData.role)
    },
    isNewUser () {
      return !context.formData.contractNumber
    }
  },
  methods: {
    onChangeEvent (changedData) {
      const changedKeys = Object.keys(changedData)
      const changedKey = changedKeys[0]

      const existingKey = this.changesTimer.key
      const existingTimer = this.changesTimer.key === changedKey ? this.changesTimer.timer : null

      //TODO:: i must filter the changed data so that i update only the needed data

      // if the change affects only one key
      if (changedKeys.length === 1) {
        this.changesTimer.key = changedKey

        // if exists a timer for the same key, clear timeout and create a new timer
        if (existingTimer) {
          clearTimeout(this.changesTimer.timer)
        }

        this.changesTimer.timer = setTimeout(() => {
          this.triggerChangeEvent(changedData)
        }, 300)
      } else {
        this.triggerChangeEvent(changedData)
      }
    },
    onNextClick (payload) {
      this.$emit('next', payload)
    },
    triggerChangeEvent (changedData) {
      const cleanedData = Object.keys(changedData).reduce((acc, key) => {
        acc[key] = changedData[key].new

        return acc
      }, {})

      this.$emit('change', cleanedData)

    }
  }
}
</script>

<style scoped>

</style>
