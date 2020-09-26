<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <v-card color="blue" dark>
        <v-data-table
          light
          :headers="tableHeader"
          :items="tableItems"
          :items-per-page="25"
          @click:row="openConversation">

          <template v-slot:item.sender="{item}">
            {{ item.sender.firstName }} {{ item.sender.lastName }}
          </template>

          <template v-slot:item.user="{item}">
            {{ item.user.firstName }} {{ item.user.lastName }}
          </template>

          <template v-slot:item.creation_timestamp="{item}">
            {{ item.creation_timestamp|dateFormatter(true) }}
          </template>

          <template v-slot:item.last_message_timestamp="{item}">
            {{ item.last_message_timestamp|dateFormatter(true) }}
          </template>

          <template v-slot:item.messages="{item}">
            {{ item.messages.length }}
          </template>
        </v-data-table>
      </v-card>

    </v-flex>

    <comunication-details></comunication-details>
  </v-layout>
</template>

<script>
import fakeComunications from 'assets/fakeComunications'
import pageBasic from '@/functions/pageBasic'

import comunicationsSchema from '@/config/tables/comunicationsSchema'

import { reactive } from '@vue/composition-api'
import ComunicationDetails from '@/components/dialogs/ComunicationDetails'

export default {
  name: 'index',
  components: { ComunicationDetails },
  setup (props, { root }) {
    function openConversation (conversation) {
      root.$store.dispatch('dialog/updateStatus', {
        title: conversation.subject,
        fullscreen: true,
        data: conversation
      })
    }

    return {
      ...pageBasic(root, 'comunications'),
      tableItems: fakeComunications,
      tableHeader: comunicationsSchema(),
      openConversation
    }
  }
}
</script>

<style scoped>

</style>
