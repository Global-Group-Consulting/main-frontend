<template>
  <div>
    <v-alert type="info">Per firmare il contratto, le verrà inviata una email contenente un codice che poi dovrà
      inserire nella casella sottostante. Una volta fatto questo, il contratto sarà firmato.
    </v-alert>

    <v-row justify="center">
      <v-col :sm="8"
             :lg="layoutSettings.inputColumns.lg">
        <v-btn color="accent" @click="sendEmail"
               class="text-center"
               :loading="$gLoading.state && $gLoading.dispatcher==='sendOtpEmailBtn'">
          <div>{{ $t('activationWizard.send-otp-email') }}</div>
          <small>{{ connectedUser.email }}</small>
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col :sm="layoutSettings.inputColumns.sm"
             :lg="layoutSettings.inputColumns.lg">
        <v-text-field
          v-model="otpCode"
          label="Codice di verifica"
          hint="Inserire il codice di verifica ricevuto per email."
        ></v-text-field>
      </v-col>
    </v-row>


    <portal :to="`actionButtons${currStep.id}`">
      <div class="d-flex">
        <v-btn color="secondary" @click="$emit('back')"
               :disabled="$gLoading.state">
          {{ $t('activationWizard.backward') }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn color="primary" @click="onNextClick"
               :disabled="!otpEmailSent"
               :loading="$gLoading.dispatcher === 'confirmAllBtn'">
          {{ $t('activationWizard.confirm-all') }}
        </v-btn>
      </div>
    </portal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name:     'Phase3',
  data () {
    return {
      otpCode:      null,
      otpEmailSent: false
    }
  },
  props:    {
    currStep: {}
  },
  computed: {
    ...mapGetters(['connectedUser'])
  },
  methods:  {
    onNextClick () {
      this.$emit('next', { otpCode: this.otpCode })
      this.$emit('confirmAll')
    },
    async sendEmail () {
      try {
        await this.$apiCalls.activationPhases.sendSigningOTPEmail()

        this.otpEmailSent = true

        this.$notifier.toastSuccess(this.$t('toasts.otp-email-send-success'))
      } catch (e) {
        this.$notifier.error(e)
      }
    }
  }
}
</script>

<style scoped>

</style>
