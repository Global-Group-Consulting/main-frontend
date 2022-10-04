<template>
  <div>
    <portal to="dialog-content">
      <v-layout>
        <v-radio-group row v-model="formData.commissionType"
                       style="width: 100%; text-align: center">
          <v-radio :value="$enums.CommissionType.MANUAL_ADD" label="Aggiungi provvigioni"/>
          <v-radio :value="$enums.CommissionType.MANUAL_TRANSFER" label="Trasferisci provvigioni dall'agente"
                   v-if="canTransferFromAgent"/>
          <v-radio :value="$enums.CommissionType.COMMISSIONS_CANCELLATION" label="Storna provvigioni"/>
        </v-radio-group>
      </v-layout>

      <dynamic-fieldset :schema="formSchema"
                        v-model="formData"
                        v-if="formData.commissionType"
                        ref="dialogForm"
                        fill-row/>

      <v-alert v-else type="info" outlined>
        E' necessario prima selezionare da dove aggiungere le provvigioni.
      </v-alert>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="blue darken-1"
             text
             @click="close"
             :disabled="gLoading">
        {{ $t(dialogData.texts.cancelBtn) }}
      </v-btn>

      <v-btn
          color="blue darken-1"
          text
          @click="onConfirm"
          :loading="gLoading"
          :disabled="!formData.commissionType"
      >
        {{ $t(dialogData.texts.confirmBtn) }}
      </v-btn>
    </portal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import CommissionsAddSchema from '~/config/forms/commissionsAddSchema'
import DynamicFieldset from '~/components/DynamicFieldset.vue'
import CommissionType from '~/enums/CommissionType'
import { moneyFormatter } from '~/plugins/filters/moneyFormatter'

@Component({
  components: { DynamicFieldset: DynamicFieldset as any }
})
export default class CommissionsAddDialog extends Vue {
  public formData = {
    amountChange: null,
    amountAvailable: null,
    notes: '',
    commissionType: this.canTransferFromAgent ? '' : this.$enums.CommissionType.MANUAL_ADD,
    referenceAgentData: this.refAgentData,
    referenceAgent: this.refAgentId
  }

  $refs!: {
    dialogForm: any
  }

  get dialogData () {
    return this.$store.getters['dialog/dialogData']
  }

  get formSchema () {
    return CommissionsAddSchema(this.formData)
  }

  get canTransferFromAgent () {
    // If the user is an agent and is the reference agent
    return this.$auth.user.role === this.$enums.UserRoles.AGENTE
        && this.dialogData.data.user?.referenceAgent === this.$auth.user.id
  }

  get refAgentData () {
    const agentData = this.dialogData.data.user?.referenceAgentData || ''

    if (!agentData) {
      return ''
    }

    return this.$options?.filters?.userFormatter(agentData)
  }

  get refAgentId () {
    return this.dialogData.data.user?.referenceAgent || ''
  }

  close () {
    try {
      this.$refs.dialogForm && this.$refs.dialogForm.reset()
      this.$store.dispatch('dialog/updateStatus', false)
    } catch (er) {
      console.error(er)
    }
  }

  async onConfirm () {
    const userId = this.$route.params.id
    const $apiCalls = this.$apiCalls
    const reqType = this.formData.commissionType

    try {
      if (!(await this.$refs.dialogForm.validate(false))) {
        return
      }

      await this.$alerts.askBeforeAction({
        key: 'commissions-' + (reqType === CommissionType.COMMISSIONS_CANCELLATION ? 'cancellation' : 'add'),
        preConfirm: async () => {
          let result

          if (reqType === CommissionType.COMMISSIONS_CANCELLATION) {
            result = await $apiCalls.commissionsCancellation(userId, this.formData)
          } else {
            result = await $apiCalls.commissionsAdd(userId, this.formData)
          }

          this.$emit('commissionsAdded', result)
          this.close()
        },
        settings: {},
        data: {
          amount: '€ ' + moneyFormatter(this.formData.amountChange)
        }
      })
    } catch (er) {
      this.$alerts.error(er)
    }
  }

  @Watch('formData.commissionType', { immediate: true })
  async onCommissionTypeChange (value: string) {
    await this.$store.dispatch('dialog/updateData', {
      title: this.$t('dialogs.commissionsAddDialog.title-' + value)
    })

    if (value === CommissionType.MANUAL_TRANSFER) {
      try {
        this.formData.amountAvailable = await this.$apiCalls.fetchCommissionsAvailable(this.dialogData.data.user.referenceAgent)
      } catch (e) {
        console.error(e)
      }
    } else if (value === CommissionType.COMMISSIONS_CANCELLATION) {
      this.formData.amountAvailable = await this.$apiCalls.fetchCommissionsAvailable(this.dialogData.data.user.id)
    }
  }
}
</script>

<style scoped>

</style>
