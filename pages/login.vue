<template>
  <default-panel :title="$t('pages.login.access-private-area')">

    <v-form>
      <dynamic-fieldset
        :schema="loginSchema"
        v-model="formData"
        fill-row
        @status="saveStatus($event)"
      />
    </v-form>


    <div class="text-center mt-4">
      <v-btn :disabled="!formValid"
             color="accent"
             type="submit"
             @click="onFormSubmit"
             v-if="!recover"
      >
        {{ $t('pages.login.log-in') }}
      </v-btn>

      <div v-else class="d-flex">
        <v-btn to="/accountLogin"
               text
        >
          {{ $t('pages.login.back-to-login') }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn :disabled="!formValid"
               color="primary"
               type="submit"
        >
          {{ $t('pages.login.recover-password') }}
        </v-btn>
      </div>
    </div>

    <template v-slot:actions>
      <v-btn text
             to="/accountRecover"
             small>
        {{ $t('pages.login.forgot-password') }}
      </v-btn>
    </template>
  </default-panel>
</template>

<script>
import DefaultPanel from '~/components/public/DefaultPanel'
import DynamicFieldset from '~/components/DynamicFieldset'

import loginSchema from '~/config/forms/loginSchema'

export default {
  name: 'login',
  components: { DynamicFieldset, DefaultPanel },
  layout: 'public',
  data () {
    return {
      formData: {
        email: 'mario.rossi@gmail.com',
        password: 'mario.rossi',
        role: 4
      },
      formValid: true,
      recover: false
    }
  },
  computed: {
    loginSchema
  },
  methods: {
    saveStatus (state) {
      this.formValid = !state.invalid
    },
    async onFormSubmit () {
      // first must be validate

      try {
        this.$auth.reset()

        await this.$auth.loginWith('local', { data: this.formData })
      } catch (e) {
        this.$alerts.error(e)
      }
    }
  },

}
</script>

<style scoped>

</style>
