<template>
  <div>
    <h3 class="primary&#45;&#45;text">Dati generali</h3>
    <dati-base :initial-data="phase1Data"
               :user-checking-data="true"
               @change="onDataChange"/>

    <h3 class="primary&#45;&#45;text">Dati relativi alla residenza</h3>
    <dati-indirizzo :initial-data="phase1Data"
                    :user-checking-data="true"
                    @change="onDataChange"/>

    <h3 class="primary&#45;&#45;text">Contatti</h3>
    <dati-contatti :initial-data="phase1Data"
                   :user-checking-data="true"
                   @change="onDataChange"/>

    <portal :to="`actionButtons${currStep.id}`">
      <v-btn color="primary" @click="$emit('next', dataModel)">
        {{$t('activationWizard.forward')}}
      </v-btn>
    </portal>
  </div>
</template>

<script>
  import DatiBase       from '~/components/anagrafica/DatiBase'
  import DatiIndirizzo  from '~/components/anagrafica/DatiIndirizzo'
  import DatiContatti   from '~/components/anagrafica/DatiContatti'
  import { mapGetters } from 'vuex'

  export default {
    name:       'Phase1',
    components: {
      DatiContatti, DatiIndirizzo, DatiBase
    },
    data () {
      return {
        phaseData: {}
      }
    },
    props:      {
      currStep: {}
    },
    computed:   {
      ...mapGetters(['connectedUser']),
      ...mapGetters('activationPhases', ['phase1Data']),
      dataModel: {
        get () {
          return this.phaseData
        },
        set (data) {
          this.mergeObject(this.phaseData, data, true)
        }
      },
    },
    methods:    {
      onDataChange (data) {
        const changedData = this.getObjDiff(data, this.dataModel)

        this.dataModel = data

        this.$emit('change', changedData)
      }
    },
  }
</script>

<style scoped>

</style>
