<template>
  <div>

    <v-row>
      <v-col :cols="layoutSettings.inputColumns.default"
             :sm="layoutSettings.inputColumns.sm"
             :lg="layoutSettings.inputColumns.lg">
        <v-file-input :label="`${chosenDocument} - ${$t('identity.doc-front')}`"
                      v-model="usersFiles.docFront"></v-file-input>
      </v-col>

      <v-col :cols="layoutSettings.inputColumns.default"
             :sm="layoutSettings.inputColumns.sm"
             :lg="layoutSettings.inputColumns.lg">
        <v-file-input :label="`${chosenDocument} - ${$t('identity.doc-back')}`"
                      v-model="usersFiles.docBack"></v-file-input>
      </v-col>

      <v-col :cols="layoutSettings.inputColumns.default"
             :sm="layoutSettings.inputColumns.sm"
             :lg="layoutSettings.inputColumns.lg">
        <v-file-input :label="$t('attachmentsTypes.contabile')"
                      v-model="usersFiles.docPayment"></v-file-input>
      </v-col>
    </v-row>


    <portal :to="`actionButtons${currStep.id}`">
      <div class="d-flex">
        <v-btn color="secondary" @click="$emit('back')">
          {{$t('activationWizard.backward')}}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn color="primary" @click="onNextClick">
          {{$t('activationWizard.forward')}}
        </v-btn>
      </div>
    </portal>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    name:     'Phase2',
    data () {
      return {
        usersFiles: {
          docFront:   null,
          docBack:    null,
          docPayment: null
        }
      }
    },
    props:    {
      currStep: {}
    },
    computed: {
      ...mapGetters(['connectedUserAttachments', 'connectedUser']),
      ...mapGetters('activationPhases', ['phase1Data']),
      chosenDocument () {
        const docType = this.phase1Data.documentoTipo

        if (!docType) {
          return ''
        }

        return this.$t(`attachmentsTypes.${this.$enums.DocumentTypes.get(docType).id}`)
      }
    },
    methods:  {
      onNextClick () {
        this.$emit('next', this.usersFiles)
      }
    }
  }
</script>

<style scoped>

</style>
