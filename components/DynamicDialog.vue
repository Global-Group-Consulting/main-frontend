<template>
  <v-row justify="center">
    <v-dialog :value="dialogState"
              :persistent="!dialogData.readonly"
              scrollable max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline" v-html="dialogData.title"></span>
        </v-card-title>

        <v-card-text>
          <portal-target name="dialog-content"></portal-target>
        </v-card-text>

        <v-card-actions>
          <portal-target name="dialog-actions-left"></portal-target>

          <v-spacer></v-spacer>
          <portal-target name="dialog-actions-right">
            <v-btn color="blue darken-1"
                   text
                   @click="close">
              Annulla
            </v-btn>
            <v-btn color="blue darken-1"
                   text
                   @click="close"
                   v-if="!dialogData.readonly">
              Salva
            </v-btn>
          </portal-target>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DynamicDialog',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      dialogData: 'dialog/dialogData',
      dialogState: 'dialog/dialogState',
    }),
  },
  methods: {
    close () {
      this.$store.dispatch("dialog/updateStatus", false)
    }
  }
}
</script>

<style scoped>

</style>
