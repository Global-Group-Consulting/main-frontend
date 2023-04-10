<template>
  <v-menu offset-y max-width="350" min-width="350"
          :close-on-content-click="false"
          v-model="menu"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-on="on" v-bind="attrs"
             @click="onMenuOpen"
             icon>

        <v-badge v-if="fetchErrors.counters"
                 bordered
                 dot
                 color="error"
        >
          <tooltip-btn icon icon-name="mdi-bell-off"
                       tooltip="Errore nel caricare le notifiche"
                       color="text--lighten-3 red"
                       no-btn-tag class="test--text"></tooltip-btn>
        </v-badge>

        <v-icon v-else-if="!unreadCounter">mdi-bell</v-icon>

        <v-badge :content="unreadCounter" v-else
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

    <v-card>
      <v-card-title>
        Notifiche
        <v-spacer></v-spacer>
        <v-btn small text color="primary" @click="setAllAsRead"
               v-if="unreadCounter && !fetchErrors.unread" :disabled="loading">
          <v-icon small>mdi-check-all</v-icon>
          Segna tutte come lette
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text v-if="fetchErrors.unread">
        <v-alert type="error" outlined class="mb-0" border="left">
          Oops, si è verificato un errore durante il recupero delle notifiche. Riprova più tardi.
          <v-btn color="primary" text class="mt-3" outlined @click="fetchUnread">
            <v-icon>mdi-reload</v-icon>
            Ricarica
          </v-btn>
        </v-alert>
      </v-card-text>

      <v-skeleton-loader v-else
                         type="list-item-two-line@4"
                         :loading="loading">
        <v-list>
          <v-list-item v-if="unreadMessages.length === 0">
            <v-list-item-title class="font-italic grey--text text-center">
              {{ $t('menus.noNotifications') }}...
            </v-list-item-title>
          </v-list-item>

          <v-list-item v-for="notification of unreadMessages"
                       :key="notification._id"
                       @click="onNotificationClick(notification)"
          >
            <!-- Item action -->
            <v-list-item-action class="me-2">
              <v-btn icon @click.stop="setAsRead(notification)"
                     small :color="!notification.read_at ? 'primary' : 'default'">
                <v-icon small v-if="!notification.read_at">mdi-circle-outline</v-icon>
                <v-icon small v-else>mdi-check-circle-outline</v-icon>
              </v-btn>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title class="d-flex align-end">
              <span class="flex-fill text-truncate"
                    :class="{'primary--text': !notification.read_at}">{{ getTitle(notification) }}</span>
                <small class="ml-3">{{ notification.created_at | dateHourFormatter(true) }}</small>
              </v-list-item-title>
              <v-list-item-subtitle>{{ getSubtitle(notification) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-skeleton-loader>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent, nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  Ref,
  ref
} from '@vue/composition-api'
import { PaginatedResult } from '~/@types/pagination/PaginatedResult'
import { Notification } from '~/@types/Notifications'

export default defineComponent({
  name: 'NotificationsMenu',
  setup (props, { root }) {
    const { $apiCalls, $alerts, $router } = root
    const menu = ref(false)
    const loading = ref(false)
    const fetchErrors = ref({
      unread: false,
      counters: false
    })
    const notifications: Ref<PaginatedResult<Notification> | undefined> = ref()
    const counter: Ref<{ read: number, unread: number }> = ref({
      read: 0,
      unread: 0
    })
    let fetchTimer: any = null

    const unreadCounter = computed(() => {
      return counter.value.unread
    })

    const unreadMessages: ComputedRef<Notification[]> = computed(() => {
      return notifications.value?.data ?? []
    })

    function getTitle (notification: Notification) {
      return notification.data.title
    }

    function getSubtitle (notification: Notification) {
      return notification.data.content?.substring(0, 60).replace(/(<([^>]+)>)/gi, '')
    }

    async function fetchUnread () {
      loading.value = true
      fetchErrors.value.unread = false

      try {
        notifications.value = await $apiCalls.notificationsApi.fetchUnread()
      } catch (e) {
        fetchErrors.value.unread = true
      }

      loading.value = false
    }

    async function fetchCounters () {
      fetchErrors.value.counters = false

      try {
        counter.value = await $apiCalls.notificationsApi.fetchUnreadCounters()
      } catch (e) {
        fetchErrors.value.counters = true
      }
    }

    async function startPolling () {
      if (fetchTimer) {
        return
      }

      fetchTimer = setInterval(async () => {
        const oldCounter = counter.value.unread

        await fetchCounters()

        if (menu.value) {
          await fetchUnread()
        }

        if (oldCounter !== counter.value.unread && !menu.value) {
          $alerts.toast('Nuova notifica disponibile!', {
            icon: 'mdi-information',
            position: 'bottom-right',
            type: 'info',
            duration: 5000,
            action: {
              text: 'Mostra',
              onClick: (e, toast) => {
                onMenuOpen()
                menu.value = true

                toast.goAway(0)
              }
            }
          })

          const newCounter = counter.value.unread

          // temporarily set unread counter to 0 to force the badge to update and animate
          counter.value.unread = 0

          nextTick(() => {
            counter.value.unread = newCounter
          })
        }

        startPolling().then(() => {})
      }, 30000) // pull every 30 seconds
    }

    async function setAsRead (notification: Notification) {
      if (!notification.read_at) {
        await $apiCalls.notificationsApi.setAsRead(notification.id)

        // manually reduce unread counter
        counter.value.unread--
        counter.value.read++

        // manually set notification as read
        notification.read_at = new Date().toISOString()
      } else {
        await $apiCalls.notificationsApi.setAsUnread(notification.id)

        // manually increase unread counter
        counter.value.unread++
        counter.value.read--

        // manually set notification as unread
        notification.read_at = null
      }
    }

    async function setAllAsRead () {
      await $alerts.ask({
        title: 'Segna tutte come lette',
        text: 'Sei sicuro di voler segnare tutte le notifiche come lette?',
        icon: 'warning',
        confirmButtonText: 'Sì, segna tutte come lette',
        cancelButtonText: 'Annulla'
      }).then(async () => {
        await $apiCalls.notificationsApi.setAllAsRead()

        // manually set all notifications as read
        notifications.value?.data.forEach(n => {
          n.read_at = new Date().toISOString()
        })

        // manually set counters
        counter.value.unread = 0
      }).catch(() => {})
    }

    async function onNotificationClick (notification: Notification) {
      await setAsRead(notification)

      menu.value = false

      // redirect to the action link
      if (notification.data.action) {
        const url = new URL(notification.data.action.link)

        if (url.hostname === window.location.host) {
          $router.push({
            path: url.pathname,
            hash: url.hash,
            // @ts-ignore
            query: Object.fromEntries(url.searchParams.entries())
          })
        } else {
          window.location.href = notification.data.action.link
        }
      }
    }

    async function onMenuOpen () {
      // fetch unread notifications only if menu is NOT opened and there are unread notifications
      if (unreadCounter.value === 0 || menu.value) {
        return
      }

      await fetchUnread()
    }

    onMounted(async () => {
      await fetchCounters()
      await startPolling()
    })

    onBeforeUnmount(() => {
      if (fetchTimer) {
        clearInterval(fetchTimer)
      }
    })

    return {
      menu,
      notifications,
      unreadCounter,
      unreadMessages,
      fetchErrors,
      loading,
      fetchUnread,
      getTitle,
      getSubtitle,
      setAsRead,
      setAllAsRead,
      onNotificationClick,
      onMenuOpen
    }
  }
})
</script>

<style scoped>

</style>
