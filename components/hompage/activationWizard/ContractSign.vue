<template>
  <div>
    <p>{{ $t('pages.activationWizard.contract-sign-otp-alert') }}</p>

    <v-row>
      <v-col class="d-flex justify-center">
        <v-btn color="accent"
               class="text-center"
               @click="onSendOtp">
          <div>{{ $t('pages.activationWizard.btn-send-otp') }}</div>
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center"
           v-if="otpSent">
      <v-col style="max-width: 350px">
        <v-text-field
          :value="value"
          @change="update($event)"
          :label="$t('forms.otp-code')"
          :hint="$t('forms.otp-code-hint')"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ContractSign',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      otpSent: false
    }
  },
  methods: {
    onSendOtp () {
      this.otpSent = true
    },
    update (value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped>

</style>
