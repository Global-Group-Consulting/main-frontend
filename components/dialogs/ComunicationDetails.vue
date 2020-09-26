<template>
  <div>
    <portal to="dialog-content">
      <div class="bg-light-gray comunication-details">
        <v-timeline align-top
                    :dense="$vuetify.breakpoint.smAndDown">
          <v-timeline-item
            v-for="(item, i) in messagesList"
            :key="i"
            :color="getItemColor(item)"
            fill-dot
            :left="setToLeft(item)"
            :right="setToRight(item)"
          >
            <span slot="opposite"
                  v-html="$t('dialogs.comunicationDialog.timeline-opposite', {
                  firstName: item.from.firstName,
                  lastName: item.from.lastName,
                  timestamp: $options.filters.dateFormatter(item.timestamp, true)
                })">
          </span>

            <v-card
              :color="getItemColor(item)"
              dark
            >
              <v-card-title class="headline">
                <div v-if="$vuetify.breakpoint.smAndDown">
                  {{ item.from.firstName }} {{ item.from.lastName }}
                </div>
              </v-card-title>

              <v-card-text class="white text--primary pt-4">
                <p class="text-right font-italic"
                   v-if="$vuetify.breakpoint.smAndDown">{{
                    $t('dialogs.comunicationDialog.timeline-opposite-dense', {
                      timestamp: $options.filters.dateFormatter(item.timestamp, true)
                    })
                  }}</p>

                <div v-html="item.body"></div>

                <div v-if="item.attachments && item.attachments.length > 0">

                  <v-list dense light>
                    <v-divider></v-divider>
                    <v-list-item v-for="attachment in item.attachments"
                                 :key="item.id"
                                 @click="">

                      <v-list-item-avatar>
                        <v-icon small>mdi-file</v-icon>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title>
                          {{ attachment.fileName }}
                        </v-list-item-title>
                      </v-list-item-content>

                    </v-list-item>
                    <v-divider></v-divider>

                  </v-list>
                </div>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </div>
    </portal>

    <portal to="dialog-actions">
      <v-textarea rows="2"
                  outlined dense
                  background-color="white"
                  :hide-details="true"
                  v-model="message">

      </v-textarea>

      <v-btn icon x-large
             class="ml-2">
        <label for="comunication-attachment">
          <v-icon>mdi-paperclip</v-icon>
          <input type="file" class="d-none" id="comunication-attachment">
        </label>
      </v-btn>

      <v-btn icon x-large
             class="ml-2" v-if="message">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </portal>
  </div>
</template>

<script>

import { useGetters } from 'vuex-composition-helpers'

import { watch, computed, ref } from '@vue/composition-api'

export default {
  name: 'ComunicationDetails',
  setup (props, { root }) {
    const message = ref('')
    const loggedUser = root.$auth.user
    const publicRoles = [root.$enums.UserRoles['CLIENTE'], root.$enums.UserRoles['AGENTE']]
    const colors = {
      [root.$enums.UserRoles['CLIENTE']]: 'red',
      [root.$enums.UserRoles['AGENTE']]: 'red',
      [root.$enums.UserRoles['AGENTE']]: 'green',
      [root.$enums.UserRoles['SERV_CLIENTI']]: 'green',
    }

    const { dialogSettings } = useGetters({
      dialogSettings: 'dialog/dialogData',
    })

    const dialogData = computed(() => dialogSettings.value.data || {})
    const messagesList = computed(() => dialogData.value.messages || [])

    watch(messagesList, () => {
      message.value = ''
    }, { deep: true, immediate: true })

    function _getUserType (role) {
      if (publicRoles.includes(role || loggedUser.role)) {
        return 'public'
      } else {
        return 'admin'
      }
    }

    function getItemColor (message) {
      return colors[message.from.role]
    }

    function setToLeft (message) {
      return !setToRight(message)
    }

    function setToRight (message) {
      const userType = _getUserType()
      const messageType = _getUserType(message.from.role)

      if (loggedUser._id === message.from._id
        || userType === messageType) {
        return true
      }
    }

    return {
      dialogSettings,
      dialogData,
      messagesList,
      message,
      setToLeft,
      setToRight,
      getItemColor
    }
  },
  data () {
    return {
      attachments: []
    }
  }
}
</script>

<style scoped lang="scss">
.comunication-details::v-deep {
  margin-bottom: -20px;

  .v-timeline-item__opposite {
    align-self: flex-start;
    margin-top: 7px;
  }
}
</style>
