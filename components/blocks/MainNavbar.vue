<template>
  <div>
    <v-alert tile class="mb-0"
             v-if="$store.getters['settings/isReadonly']"
             :type="$store.getters['settings/maintenanceMode'] ? 'error' : 'warning'"
             :style="{'padding-left': $vuetify.breakpoint.smAndUp ? '96px' : ''}">
      <template v-if="$store.getters['settings/maintenanceMode']">
        Applicazione momentaneamente in modalità manutenzione, pertanto è possibile usare il sito solo per
        consultazione.
      </template>
      <template v-else-if="$store.getters['settings/outOfTimeFrame']">
        Applicazione in sola lettura. Sarà nuovamente possibile operare dalle ore
        {{ $store.getters['settings/timeFrame'].start }}.
      </template>
    </v-alert>

    <v-app-bar class="main-navbar"
               clipped-left
               height="56"
               max-height="56"
               :class="dynamicClasses"
    >
      <!--    <v-app-bar-nav-icon @click.stop="$emit('toggleDrawer')"/>-->

      <!--    <v-toolbar-title v-text="'Global Group Consulting'"/>-->

      <v-spacer></v-spacer>

      <div>
        <v-tooltip bottom v-if="$auth.user.role !== $enums.UserRoles.CLIENTE">
          <template v-slot:activator="{on}">
            <v-btn v-on="on" color="orange lighten-3"
                   icon
                   @click="openBugReport">
              <v-icon>mdi-bug</v-icon>
            </v-btn>
          </template>
          Segnala un problema
        </v-tooltip>

        <v-tooltip bottom v-if="$store.getters['user/canSeeCalendar']">
          <template v-slot:activator="{on}">
            <v-btn v-on="on" color="primary"
                   icon
                   href="/calendar">
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
          </template>
          Calendario
        </v-tooltip>

        <v-menu offset-y max-width="350"
                :disabled="!notifications.connected">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs"
                   icon
                   :disabled="!notifications.connected">

              <v-icon v-if="unreadMessages.length === 0">mdi-bell</v-icon>

              <v-badge :content="unreadMessages.length" v-else
                       bordered
                       offset-y="5"
                       color="orange"
              >
                <v-icon class="animate__animated animate__swing animate__repeat-3"
                        color="red">mdi-bell-ring
                </v-icon>

              </v-badge>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-if="unreadMessages.length === 0">
              <v-list-item-title class="font-italic grey--text">{{ $t('menus.noNotifications') }}...</v-list-item-title>
            </v-list-item>

            <v-list-item v-for="message of unreadMessages"
                         :key="message.id"
                         v-else
                         @click="onNotificationClick(message)"
                         @mouseover="message.hover = true"
                         @mouseleave="message.hover = false"
            >
              <v-list-item-content>

                <v-list-item-title class="d-flex align-end">
                  <span class="flex-fill text-truncate">{{ $t('enums.NotificationTypes.' + message.type) }}</span>
                  <small class="ml-3">{{ message.created_at | dateHourFormatter(true) }}</small>
                </v-list-item-title>
                <v-list-item-subtitle>{{ getNotificationMessage(message) }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action v-if="message.hover">
                <v-btn icon @click.stop="signAsRead(message)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-menu>

        <account-menu v-if="$vuetify.breakpoint.smAndUp">
          <template v-slot:menu-activator="{on}">
            <v-btn text v-on="on">
              <v-icon class="mr-3">mdi-account-circle</v-icon>

              <small class="caption" style="text-transform: none">
                {{ $auth.user.firstName }} {{ $auth.user.lastName }}
              </small>
            </v-btn>
          </template>
        </account-menu>
      </div>

      <bug-send-dialog
          v-if="$store.getters['dialog/dialogId'] === 'BugSendDialog'"
          @communicationAdded="onBugReported"
      ></bug-send-dialog>

    </v-app-bar>
  </div>
</template>

<script>
import socketNotificationsFn from '~/functions/socket/notifications'
import socketAccountFn from '~/functions/socket/account'
import { computed, onMounted, ref } from '@vue/composition-api'
import CommunicationNewDialog from '~/components/dialogs/CommunicationNewDialog'
import AccountMenu from '~/components/elements/AccountMenu'
import BugSendDialog from '../dialogs/BugSendDialog'

export default {
  name: 'MainNavbar',
  components: { BugSendDialog, AccountMenu, CommunicationNewDialog },
  setup (props, { root }) {
    let scrollElement
    let scrollTop = ref(0)

    const dynamicClasses = computed(() => {
      return {
        'v-app-bar--hide-shadow': scrollTop.value == 0
      }
    })

    async function openBugReport () {
      root.$store.dispatch('dialog/updateStatus', {
        id: 'BugSendDialog',
        title: root.$t(`dialogs.communicationNewDialog.title-bug-report`),
        fullscreen: false,
        readonly: false,
        data: {
          type: root.$enums.MessageTypes.BUG_REPORT,
          receiver: root.$enums.UserRoles.ADMIN,
          subject: `Segnalazione BUG - ${root.$auth.user.firstName} ${root.$auth.user.lastName}`
        }
      })
    }

    async function onBugReported () {

    }

    function handleScroll () {
      scrollTop.value = scrollElement.scrollTop
    }

    onMounted(() => {
      scrollElement = document.querySelector('main')

      scrollElement.addEventListener('scroll', handleScroll)

      handleScroll()
    })

    return {
      openBugReport,
      onBugReported,
      dynamicClasses,
      // ...socketAccountFn(root),
      ...socketNotificationsFn(root)
    }
  }
}
</script>

<style scoped lang="scss">
.main-navbar::v-deep {
  z-index: 1;

  &.v-app-bar--is-scrolled {
    background-color: #fff !important;
  }
}
</style>
