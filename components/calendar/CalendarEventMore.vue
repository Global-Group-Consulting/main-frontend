<template>
  <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
      max-width="400px"
  >
    <v-card
        color="grey lighten-4"
        min-width="350px"
        flat
    >
      <!--      <v-toolbar
                dense
                dark
            >
              <v-spacer></v-spacer>

              <v-btn icon @click="onEditClick">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="onDeleteClick">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn icon @click="selectedOpen = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>-->
      ciao

    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/composition-api'
import { CalendarEvent } from '~/@types/Calendar/CalendarEvent'

export default defineComponent({
  name: 'CalendarEventMore',
  props: {
    moreEvents: {
      type: Array as PropType<CalendarEvent[]>,
      required: true
    },
    selectedElement: {
      type: Object as PropType<HTMLElement>
    }
  },
  setup (props) {
    const selectedOpen = ref(false)

    return {
      selectedOpen
    }
  }
})
</script>

<style scoped>

</style>
