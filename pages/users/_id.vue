<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <v-toolbar v-if="formData.contractNumber" class="mb-5">
        <v-toolbar-items class="flex-fill">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon
                     to="/users"
                     v-on="on">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('pages.usersId.btn-go-back') }}</span>
          </v-tooltip>

          <v-spacer></v-spacer>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn text v-if="!formData.accountVerifiedAt"
                     v-on="formData.accountVerifiedAt ? on : null"
              >
                <v-icon>mdi-at</v-icon>
                {{ $t('pages.usersId.btn-send-activation-email') }}
              </v-btn>
            </template>
            <span>Ultima email inviata il {{ formData.accountCreatedAt|dateFormatter(true) }}</span>
          </v-tooltip>

          <v-btn text v-if="formData.accountVerifiedAt">
            <v-icon>mdi-lock-reset</v-icon>
            {{ $t('pages.usersId.btn-reset-password') }}
          </v-btn>
          <v-btn text @click="onSendEmail">
            <v-icon>mdi-email-plus</v-icon>
            {{ $t('pages.usersId.btn-send-email') }}
          </v-btn>

          <v-spacer></v-spacer>
        </v-toolbar-items>
      </v-toolbar>

      <v-form>
        <v-card>
          <v-tabs v-model="currentTab"
                  :background-color="(this.$enums.UserRoles.get(formData.role) || {}).color"
                  center-active
                  dark
                  show-arrows
          >
            <v-tab v-for="(section, index) in usersIdTabs"
                   :key="index"
                   :title="'pages.usersId.tabs.' + section.title">
              {{ $t('pages.usersId.tabs.' + section.title) }}
            </v-tab>
          </v-tabs>

          <div>
            <v-tabs-items v-model="currentTab">
              <v-tab-item v-for="(tab, index) in usersIdTabs"
                          :key="index">
                <v-card elevation="0">
                  <v-card-title>{{ $t('pages.usersId.tabs.' + tab.cardTitle) }}</v-card-title>
                  <v-card-text>
                    <dynamic-fieldset
                      :schema="getSchema(tab)"
                      v-model="formData"
                      :ref="'dynamicForm_' + index"
                      @status="saveStatus(tab.schema, $event)"
                    />
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>

            <v-card-actions>
              <v-btn @click="goBack"
                     v-if="currentTab > 0">
                {{ $t('pages.usersId.btn-previous') }}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn :color="currentTab < usersIdTabs.length - 1 ? 'primary' : 'success'"
                     @click="currentTab < usersIdTabs.length - 1 ? goNext() : onSaveClick()">
                {{ $t(`pages.usersId.btn-${currentTab < usersIdTabs.length - 1 ? 'next' : 'save'}`) }}
              </v-btn>
            </v-card-actions>
          </div>


        </v-card>
        <!-- Floating action button -->
        <!--<v-fab-transition v-if="!userIsNew">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-btn slot="activator"
                     v-model="fab"
                     v-on="on"
                     color="accent"
                     fixed
                     bottom
                     right
                     fab
                     type="button"
                     :loading="saving"
                     :hidden="fetchingData"
                     @click="onSaveClick"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <span>Salva modifiche</span>
          </v-tooltip>
        </v-fab-transition>-->
      </v-form>
    </v-flex>

    <user-message></user-message>
  </v-layout>
</template>

<script>
import fakeUsers from '@/assets/fakeUsers'

import PageHeader from '@/components/blocks/PageHeader'
import usersIdTabs from '@/config/usersIdTabs'
import DynamicFieldset from '@/components/DynamicFieldset'
import UserMessage from '@/components/dialogs/UserMessage'

export default {
  name: '_id',
  components: { UserMessage, DynamicFieldset, PageHeader },
  data () {
    return {
      formData: {},
      currentTab: 0,
    }
  },
  computed: {
    usersIdTabs,
    icon () {
      if (this.formData.contractNumber) {
        return 'mdi-account'
      }

      return 'mdi-account-plus'
    },
    title () {
      if (this.formData.contractNumber) {
        return this.$t('pages.usersId.title')
      }

      const userRole = this.formData.role

      if (!userRole) {
        return this.$t('pages.usersId.title-new-user')
      }

      return this.$t('pages.usersId.title-new-with-role', {
        role: this.$enums.UserRoles.get(this.formData.role || '').text
      })
    },
    subtitle () {
      if (this.formData.contractNumber) {
        return ''
      }

      const userRole = this.formData.contractNumber

      if (!userRole) {
        return this.$t('pages.usersId.subtitle-new-user')
      }

      return this.$t('pages.usersId.subtitle-new-user-with-role', {
        role: this.$enums.UserRoles.get(this.formData.role).text
      })
    },
    personaGiuridica () {
      return this.formData.personType === this.$enums.PersonTypes.GIURIDICA
    },
    showReferenceAgent () {
      return [this.$enums.UserRoles.CLIENTE, this.$enums.UserRoles.AGENTE].includes(this.formData.role)
    },
    isNewUser () {
      return !this.formData.contractNumber
    }
  },
  methods: {
    getSchema (tab) {
      const schema = this[tab.schema]

      if (!schema) {
        return tab.schema
      }

      return schema
    },
    saveStatus () {},
    goNext () {
      this.currentTab += 1
    },
    goBack () {
      this.currentTab -= 1
    },
    onSaveClick () {},
    onSendEmail () {
      this.$store.dispatch('dialog/updateStatus', {
        title: this.$t("dialogs.userMessage.title")
      })
    }
  },
  created () {
    const userId = this.$route.params.id

    if (userId === 'new') {
      return
    }

    const usersList = fakeUsers.reduce((acc, group) => {
      acc.push(...group.data)

      return acc
    }, [])

    this.formData = usersList.find(user => user._id === userId)
  }
}
</script>

<style scoped>

</style>
