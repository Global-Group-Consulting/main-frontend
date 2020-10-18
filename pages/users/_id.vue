<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <v-toolbar v-if="!userIsNew" class="mb-5">
        <v-toolbar-items class="flex-fill">
          <tooltip-btn :tooltip="$t('pages.usersId.btn-go-back-tooltip')"
                       icon
                       icon-name="mdi-arrow-left"
                       @click="$router.back()"
          >
          </tooltip-btn>

          <v-spacer></v-spacer>

          <tooltip-btn :tooltip="$t('pages.usersId.btn-send-activation-email-tooltip')"
                       icon-name="mdi-at"
                       text
                       v-if="!formData.accountVerifiedAt">
            {{ $t('pages.usersId.btn-send-activation-email') }}
          </tooltip-btn>

          <tooltip-btn :tooltip="$t('pages.usersId.btn-reset-password-tooltip')"
                       icon-name="mdi-lock-reset"
                       v-if="formData.accountVerifiedAt"
                       text>
            {{ $t('pages.usersId.btn-reset-password') }}
          </tooltip-btn>

          <tooltip-btn :tooltip="$t('pages.usersId.btn-send-email-tooltip')"
                       icon-name="mdi-email-plus"
                       text
                       @click="onSendEmail">
            {{ $t('pages.usersId.btn-send-email') }}
          </tooltip-btn>

          <v-spacer></v-spacer>
        </v-toolbar-items>
      </v-toolbar>

      <v-form>
        <v-card>
          <v-tabs v-model="currentTab"
                  :background-color="(this.$enums.UserRoles.get(userRole)).color"
                  center-active
                  dark
                  show-arrows
          >
            <v-tab v-for="(section, index) in formTabs"
                   :key="index"
                   :title="'pages.usersId.tabs.' + section.title">
              {{ $t('pages.usersId.tabs.' + section.title) }}
            </v-tab>
          </v-tabs>

          <div>
            <v-tabs-items v-model="currentTab">
              <v-tab-item v-for="(tab, index) in formTabs"
                          :key="index">
                <v-card elevation="0">
                  <v-card-title>{{ $t('pages.usersId.tabs.' + tab.cardTitle) }}</v-card-title>
                  <v-card-text>
                    <dynamic-fieldset
                      :schema="getFormSchema(tab)"
                      v-model="formData"
                      :ref="'dynamicForm_' + index"
                      @status="saveStatus(tab.schema, $event)"
                      :edit-mode="editMode"
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
              <v-btn :color="currentTab < formTabs.length - 1 ? 'primary' : 'success'"
                     @click="currentTab < formTabs.length - 1 ? goNext() : onSaveClick()">
                {{ $t(`pages.usersId.btn-${currentTab < formTabs.length - 1 ? 'next' : 'save'}`) }}
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
import PageHeader from '@/components/blocks/PageHeader'
import DynamicFieldset from '@/components/DynamicFieldset'
import UserMessage from '@/components/dialogs/UserMessage'

import { onMounted, reactive, ref, computed } from '@vue/composition-api'

import userDetails from '@/functions/userDetails'
import pageBasic from '@/functions/pageBasic'
import usersForm from '@/functions/usersForm'

export default {
  name: '_id',
  components: { UserMessage, DynamicFieldset, PageHeader },
  setup (props, { root }) {
    const { $apiCalls, $alerts, $route } = root
    const currentTab = ref(0)
    const editMode = ref(true)
    const userForm = usersForm(root)

    onMounted(async () => {
      try {
        userForm.formData.value = await $apiCalls.fetchUserDetails($route.params.id)
      } catch (er) {
        $alerts.error(er)
      }
    })

    const getFormSchema = function (tab) {
      const schema = userForm.formTabs[tab.schema]

      if (!schema) {
        return tab.schema
      }

      return schema
    }

    return {
      currentTab,
      editMode,
      getFormSchema,
      ...userForm,
      ...userDetails(root),
      ...pageBasic(root, 'users')
    }
  },
  computed: {
    /*icon () {
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
    },*/
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
    saveStatus () {},
    goNext () {
      this.currentTab += 1
    },
    goBack () {
      this.currentTab -= 1
    },
    onSendEmail () {
      this.$store.dispatch('dialog/updateStatus', {
        title: this.$t('dialogs.userMessage.title')
      })
    }
  },
}
</script>

<style scoped>

</style>
