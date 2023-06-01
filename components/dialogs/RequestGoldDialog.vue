<template>
  <div>
    <portal to="dialog-pre-content"></portal>

    <portal to="dialog-content">
      <!-- Removed as requested in issue #c8ae12dfdc284f3e9b1f73706c20a4a4 -->
      <!-- <div class="d-flex justify-center" style="margin-bottom: -100px; margin-top: -16px">
        <v-img src="global_club/bg_wide.jpg" max-width="600px" eager transition="fade"></v-img>
      </div>-->

<!--      <v-tabs grow @change="onCurrencyTabChange">
        <v-tab>Gold</v-tab>
        <v-tab>Crypto</v-tab>
      </v-tabs>-->

      <v-form :disabled="!!readonly" @submit.prevent="">

        <!--            <div>
                      <v-card flat class="py-10" light>-->
        <!--        <v-card-text v-if="currentStep === 0">-->
        <dynamic-fieldset
            ref="dialogForm"
            :schema="formSchema"
            v-model="formData"
            immediate-update
            fill-row
        />
        <!--        </v-card-text>-->
        <!--
                        <v-card-text v-else>
                          <WithdrawalCards @input="withdrawalCards.onWithdrawalCardsInput"
                                           @error="withdrawalCards.cardsHasErrors = $event"
                                           :available-amount="formData.requestAmount"></WithdrawalCards>
                        </v-card-text>
                      </v-card>
                    </div>-->
      </v-form>
    </portal>

    <portal to="dialog-actions-right">
      <div>
        <v-btn text @click="withdrawalCards.onBack">
          {{ $t('dialogs.requests.btn-' + (currentStep === 0 ? 'cancel' : 'back')) }}
        </v-btn>
        <v-btn text dark color="primary" @click="onFormSubmit">
          {{ $t('dialogs.requests.btn-send-club') }}
        </v-btn>
      </div>
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
import CryptoCurrency from '~/enums/CryptoCurrency'
import { SelectOption } from '~/@types/components/SelectInput'

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
  cards?: { amount: number, id: string }[],
  cryptoAddress?: string
  cryptoCurrency?: string
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
    cards: [],
    cryptoAddress: '',
    cryptoCurrency: ''
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
    this.formElement?.reset()
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

      const cryptoRequest = this.formData.currency === CurrencyType.CRYPTO

      const data: Partial<FormData> = {
        amount: this.formData.requestAmount || 0,
        iban: this.formData.requestIban || '',
        clubCardNumber: this.formData.clubCardNumber,
        userId: this.$auth.user.id,
        type: this.formData.type,
        typeClub: this.formData.typeClub,
        wallet: this.formData.wallet,
        notes: this.formData.notes,
        cards: this.formData.cards,
        currency: this.formData.currency,
        cryptoAddress: cryptoRequest ? this.formData.cryptoAddress : '',
        cryptoCurrency: cryptoRequest ? this.formData.cryptoCurrency : ''
      }
      const cryptoList = CryptoCurrency.list

      await this.$alerts.askBeforeAction({
        key: 'send-request-' + (cryptoRequest ? 'crypto' : data.typeClub),
        preConfirm: async () => {
          const result = await this.$apiCalls.requests.createRequest(data)
          this.$nuxt.$emit('requests:newAdded', result.status)
        },
        data: {
          type: this.$t('enums.RequestTypes.' + this.$enums.RequestTypes.get(data.type).id),
          amount: cryptoRequest ? '€ ' + moneyFormatter(data.amount) : this.formatAmountForAlert(data),
          crypto: cryptoList.find((c: SelectOption) => c.value === data.cryptoCurrency)?.text
        }
      })

      this.$emit('newRequestAdded')

      this.onClose()
    } catch (er) {
      console.log(er)
    }
  }

  onCurrencyTabChange (activeTab: number) {
    switch (activeTab) {
      case 0:
        this.formData.currency = this.$enums.CurrencyType.BRITE
        break
      case 1:
        this.formData.currency = this.$enums.CurrencyType.CRYPTO
        break
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
