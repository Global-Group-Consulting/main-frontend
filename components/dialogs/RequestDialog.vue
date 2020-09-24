<template>
  <v-layout>
    <portal to="dialog-content">
      <v-form :disabled="readonly">
        <dynamic-fieldset :schema="requestSchema"
                          v-model="formData"
                          fill-row/>
      </v-form>
    </portal>

    <portal to="dialog-actions-left"
            v-if="canEdit">
      <v-btn color="red">{{ $t('dialogs.requestDialog.btn-reject') }}</v-btn>
      <v-btn color="success">{{ $t('dialogs.requestDialog.btn-accept') }}</v-btn>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="blue darken-1"
             text
             @click="close">
        {{ $t('dialogs.requestDialog.btn-cancel') }}
      </v-btn>
      <v-btn color="blue darken-1"
             text
             @click="close"
             v-if="isNew">
        {{ $t('dialogs.requestDialog.btn-send') }}
      </v-btn>
    </portal>
  </v-layout>
</template>

<script>
import DynamicFieldset from '@/components/DynamicFieldset'
import requestSchema from '@/config/forms/requestSchema'

import { mapGetters, mapState } from 'vuex'

export default {
  name: 'RequestDialog',
  components: { DynamicFieldset },
  data () {
    return {
      opened: false,
      formData: {
        walletType: 1
      }
    }
  },
  props: {
    value: false,
    requestData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    requestSchema,
    ...mapGetters({
      dialogData: 'dialog/dialogData',
      userWallets: 'user/availableWallets'
    }),
    requestTypes () {
      return this.$enums.RequestTypes.list
        .reduce((acc, item) => {
          acc.push({
            value: item.text,
            text: this.$t(`enums.RequestTypes.${item.text}`)
          })

          return acc
        }, [])
    },
    availableAmount () {
      if (this.formData.availableAmount
        && [this.$enums.UserRoles.ADMIN, this.$enums.UserRoles.SERV_CLIENTI].includes(this.$auth.user.role)) {
        return this.formData.availableAmount
      }

      const wallet = this.userWallets.find(_wallet => _wallet.type === (this.formData.walletType || 1))

      console.log(wallet)

      return wallet?.amount ?? 0
    },
    isNew () {
      return Object.keys(this.formData).length === 0
    },
    readonly () {
      return this.formData.requestState
      // return this.$enums.RequestStatus.NUOVA !== this.requestData.requestState
    },
    canEdit () {
      const allowedRoles = [this.$enums.UserRoles.ADMIN, this.$enums.UserRoles.SERV_CLIENTI]
      const allowedState = [this.$enums.RequestStatus.NUOVA]

      return allowedRoles.includes(this.$auth.user.role)
        && allowedState.includes(this.formData.requestState)
    }
  },
  methods: {
    close () {
      this.$store.dispatch('dialog/updateStatus', false)
    }
  },
  watch: {
    'formData.requestType': {
      immediate: true,
      handler () {
        this.formData.walletType = this.$enums.WalletTypes.DEPOSIT
        this.formData.currencyType = this.$enums.CurrencyType.EURO
      }
    },
    'formData.walletType': {
      immediate: true,
      handler (walletType) {
        this.formData.availableAmount = this.availableAmount
      }
    },
    'dialogData.data': {
      deep: true,
      immediate: true,
      handler (value) {
        Object.keys(value || {}).forEach(key => {
          if (key.indexOf('_') < 0) {
            this.$set(this.formData, key, value[key])
          }
        })

        this.$set(this.formData, 'requestType', value?.requestType || this.$enums.RequestTypes['VERSAMENTO'])
        this.$set(this.formData, 'walletType', value?.walletType || this.$enums.WalletTypes['DEPOSIT'])
        this.$set(this.formData, 'availableAmount', value?.availableAmount || this.availableAmount)
        this.$set(this.formData, 'currencyType', value?.currencyType || this.$enums.CurrencyType['EURO'])
      }
    },
  }

}
</script>
