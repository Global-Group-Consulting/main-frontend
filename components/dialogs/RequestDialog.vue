<template>
  <div>
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
  </div>
</template>

<script>
import DynamicFieldset from '@/components/DynamicFieldset'
import requestSchema from '@/config/forms/requestSchema'

import { mapGetters } from 'vuex'

export default {
  name: 'RequestDialog',
  components: { DynamicFieldset },
  data () {
    return {
      opened: false,
      formData: {}
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
    ...mapGetters({
      dialogData: 'dialog/dialogData'
    }),
    requestSchema,
    isNew () {
      return Object.keys(this.formData).length === 0
    },
    readonly () {
      return !!this.requestData.requestState
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
    'dialogData.data': {
      deep: true,
      immediate: true,
      handler (value) {
        this.formData = {
          ...value,
          availableAmount: 65000
        }
      }
    }
  }

}
</script>
