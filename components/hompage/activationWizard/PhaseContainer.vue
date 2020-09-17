<template>
  <div>
    <v-card elevation="0"
            :loading="globalLoading">
      <v-card-title v-html="$t(`activationWizard.phase${currStep.id}.card-title`)"/>

      <component :is="`Phase${currStep.id}`"
                 :curr-step="currStep"
                 @next="onNextClick"
                 @back="$emit('back')"
                 @confirmAll="$emit('confirmAll')"
                 @change="onChangeEvent"
      />
    </v-card>

    <portal-target :name="`actionButtons${currStep.id}`"></portal-target>
  </div>
</template>

<script>
  import Phase1 from './Phase1'
  import Phase2 from './Phase2'
  import Phase3 from './Phase3'
  import Phase4 from './Phase4'
  import Phase5 from './Phase5'

  import { mapState } from 'vuex'

  export default {
    name:       'PhaseContainer',
    components: {
      Phase1, Phase2, Phase3, Phase4, Phase5
    },
    data () {
      return {
        changesTimer: {
          key:   null,
          timer: null
        }
      }
    },
    props:      {
      currStep: {}
    },
    computed:   {
      ...mapState({
        'loading': 'loading/state'
      })
    },
    methods:    {
      onChangeEvent (changedData) {
        const changedKeys = Object.keys(changedData)
        const changedKey  = changedKeys[0]

        const existingKey   = this.changesTimer.key
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
