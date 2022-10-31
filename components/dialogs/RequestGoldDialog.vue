<template>
  <div>
    <portal to="dialog-pre-content"></portal>

    <portal to="dialog-content">
      <div class="d-flex justify-center" style="margin-bottom: -100px; margin-top: -16px">
        <v-img src="global_club/bg_wide.jpg" max-width="600px" eager transition="fade"></v-img>
      </div>

      <v-row justify="center">
        <v-col lg="6" md="8" sm="12">
          <v-form :disabled="!!readonly" @submit.prevent="">

            <!-- <v-tabs height="58px"
                                grow
                                slider-color="#ffcf5f"
                                :show-arrows="false"
                                class="global-club-tabs"
                                v-model="currentTab"
                        >
                          <v-tab :key="'brite'" v-html="$t('dialogs.requests.tab-brite')"></v-tab>
                          <v-tab :key="'gold'" v-html="$t('dialogs.requests.tab-gold')"></v-tab>
                        </v-tabs>-->
            <div>
              <v-card flat class="py-10" light>
                <v-card-text v-if="currentStep === 0">
                  <dynamic-fieldset
                      ref="dialogForm"
                      :schema="formSchema"
                      v-model="formData"
                      immediate-update
                      fill-row
                  />
                </v-card-text>

                <v-card-text v-else>
                  <WithdrawalCards @input="withdrawalCards.onWithdrawalCardsInput"
                                   @error="withdrawalCards.cardsHasErrors = $event"
                                   :available-amount="formData.requestAmount"></WithdrawalCards>
                </v-card-text>
              </v-card>
            </div>

            <v-card dark>
              <v-card-text class="d-flex justify-end">
                <div>
                  <v-btn outlined dark color="grey" @click="withdrawalCards.onBack">
                    {{ $t('dialogs.requests.btn-' + (currentStep === 0 ? 'cancel' : 'back')) }}
                  </v-btn>
                  <v-btn depressed dark color="primary" @click="onFormSubmit">
                    {{ $t('dialogs.requests.btn-send-club') }}
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-form>
        </v-col>
      </v-row>
    </portal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { briteSchema, goldSchema } from '~/config/forms/requestGoldSchema'
import DynamicFieldset from '~/components/DynamicFieldset.vue'
import { DynamicForm } from '~/@types/DynamicForm'
import RequestTypes from '~/enums/RequestTypes'
import WalletTypes from '~/enums/WalletTypes'
import CurrencyType from '~/enums/CurrencyType'
import { moneyFormatter } from '~/plugins/filters'
import withdrawalsCards from '~/functions/withdrawalsCards'

interface FormData {
  id?: string
  amount: number
  availableAmount: number
  iban: string
  clubCardNumber: string
  userId: string
  type: number
  typeClub: 'gold' | 'brite'
  wallet: number
  currency: number
  notes: string
  status?: any
  requestIban?: string
  requestAmount?: number,
  cards?: { amount: number, id: string }[]
}

@Component({
  components: {
    DynamicFieldset: DynamicFieldset as any
  }
})
export default class RequestDialogGold extends Vue {
  readonly: boolean = false
  currentTab: number = 0
  currentStep: number = 0
  formData: FormData = {
    wallet: this.$enums.WalletTypes.DEPOSIT,
    type: this.incomingData.type || this.$enums.RequestTypes.RISC_INTERESSI_BRITE,
    typeClub: this.currentTab === 0 ? 'brite' : 'gold',
    availableAmount: this.incomingData.availableAmount || 0,
    currency: this.incomingData.currency || this.$enums.CurrencyType['EURO'],
    clubCardNumber: this.$auth.user.clubCardNumber,
    requestIban: this.$auth.user.contractIban,
    amount: 0,
    iban: '',
    userId: '',
    notes: '',
    cards: []
  }

  $refs!: {
    dialogForm: HTMLElement
  }

  get dialogData () {
    return this.$store.getters['dialog/dialogData']
  }

  get incomingData () {
    return this.dialogData.data
  }

  get formSchema () {
    return this.currentTab === 0 ? briteSchema(this as any) : goldSchema(this as any)
  }

  get wallet () {
    return this.$store.getters['user/availableWallets'].find((_wallet: any) => _wallet.type === (this.formData.wallet || 1))
  };

  get availableAmount () {
    // if the request is not new, return the stored available amount
    if (this.formData.status !== this.$enums.RequestStatus.NUOVA && this.formData.id) {
      return this.formData.availableAmount
    }
    // Tutte le richieste di questo dialog hanno come importo disponibile le rendite.
    // Per il prelievo del deposito occorre usare un altro canale

    /*switch (this.formData.value.type) {
      case $enums.RequestTypes.RISC_INTERESSI_GOLD:
        toReturn = wallet.value?.deposit ?? 0;
        break;
      case $enums.RequestTypes.RISC_INTERESSI_BRITE:
        toReturn = wallet.value?.interestAmount ?? 0;
        break;
    }*/

    return this.wallet?.interestAmount ?? 0
  }

  get formElement (): DynamicForm {
    return this.$refs.dialogForm as any
  }

  get withdrawalCards () {
    return withdrawalsCards.call(this, 'requestAmount')
  }

  onClose () {
    this.formElement.reset()
    this.$store.dispatch('dialog/updateStatus', false)
  }

  onWithdrawalCardsInput (value: any[]) {
    this.formData.cards = value
  }

  async onFormSubmit () {
    try {
      if (this.currentStep === 0 && !(await this.formElement.validate(false))) {
        return
      }

      // Check if can proceed with the request
      if (!this.withdrawalCards.checkBeforeSubmit()) {
        return
      }

      const data: Partial<FormData> = {
        amount: this.formData.requestAmount || 0,
        iban: this.formData.requestIban || '',
        clubCardNumber: this.formData.clubCardNumber,
        userId: this.$auth.user.id,
        type: this.formData.type,
        typeClub: this.formData.typeClub,
        wallet: this.formData.wallet,
        currency: this.formData.currency,
        notes: this.formData.notes,
        cards: this.formData.cards
      }

      await this.$alerts.askBeforeAction({
        key: 'send-request-' + data.typeClub,
        preConfirm: async () => {
          const result = await this.$apiCalls.requests.createRequest(data)
          this.$nuxt.$emit('requests:newAdded', result.status)
        },
        data: {
          type: this.$t('enums.RequestTypes.' + this.$enums.RequestTypes.get(data.type).id),
          amount: this.formatAmountForAlert(data)
        }
      })

      this.$emit('newRequestAdded')

      this.onClose()
    } catch (er) {
      console.log(er)
    }
  }

  formatAmountForAlert (data: Partial<FormData>): string {
    let toReturn = '€ ' + moneyFormatter(data.amount)

    if (data && data.typeClub === 'brite') {
      toReturn += ` (Br' ${moneyFormatter((data.amount || 0) * 2, true)})`
    }

    return toReturn
  }

  @Watch('availableAmount', { immediate: true })
  onAvailableAmountChange (value: number) {
    this.formData.availableAmount = value
  }

  @Watch('currentTab', { immediate: true })
  onCurrentTabChange (value: number) {
    this.formData.typeClub = (value === 0) ? 'brite' : 'gold'
    this.formData.currency = (value === 0) ? this.$enums.CurrencyType.BRITE : this.$enums.CurrencyType.GOLD
    this.formData.type = (value === 0) ? this.$enums.RequestTypes.RISC_INTERESSI_BRITE : this.$enums.RequestTypes.RISC_INTERESSI_GOLD
    this.formData.cards = []
    this.currentStep = 0
  }

  async beforeMount () {
    /*
    If the request has a status different from new, don't try to fetch the user's wallet
    because it will use the availableAmount stored in the request
    */
    if (this.formData.status !== this.$enums.RequestStatus.NUOVA && this.formData.id) {
      return
    }

    const data: any = {}

    if (this.$store.getters['user/userIsAdmin']) {
      data.userId = this.formData.userId
    }

    await this.$store.dispatch('user/updateWallets', { apiCalls: this.$apiCalls, data })
  }
};
</script>


<style scoped lang="scss">
.global-club-tabs::v-deep {
  .v-slide-group__prev {
    display: none !important;
  }
}
</style>
