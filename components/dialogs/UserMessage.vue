<template>
  <div>

    <portal to="dialog-content">
      <dynamic-fieldset :schema="userMessageSchema"
                        v-model="formData"
                        fill-row></dynamic-fieldset>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color=""
             text
             @click="close">
        {{ $t('dialogs.userMessage.btn-cancel') }}
      </v-btn>
      <v-btn color="success"
             @click="close">
        {{ $t('dialogs.userMessage.btn-send') }}
        <v-icon class="ml-2">mdi-send</v-icon>
      </v-btn>
    </portal>
  </div>
</template>

<script>
import userMessageSchema from '@/config/forms/userMessageSchema'

import DynamicFieldset from '@/components/DynamicFieldset'

export default {
  name: 'UserMessage',
  components: { DynamicFieldset },
  data () {
    return {
      formData: {}
    }
  },
  computed: {
    userMessageSchema
  },
  methods: {
    close () {
      this.$store.dispatch('dialog/updateStatus', false)
    }
  }
}
</script>

<style scoped>

</style>
