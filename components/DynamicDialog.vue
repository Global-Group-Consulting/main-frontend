<template>
  <v-row justify="center">
    <v-dialog
      :value="dialogState"
      :persistent="true"
      :fullscreen="dialogData.fullscreen"
      :transition="dialogData.fullscreen ? 'dialog-bottom-transition' : ''"
      :retain-focus="false"
      scrollable
      max-width="600px"
    >
      <v-card>
        <div class="d-flex">
          <v-card-title class="flex-fill">
            <span class="headline" v-html="dialogData.title"></span>
          </v-card-title>

          <v-card-title v-if="dialogData.fullscreen">
            <v-btn icon @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
        </div>

        <v-divider></v-divider>

        <v-card-text>
          <portal-target
            name="dialog-content"
            :slot-props="dialogData"
          ></portal-target>
        </v-card-text>

        <v-card-actions v-if="!dialogData.noActions">
          <portal-target
            name="dialog-actions"
            style="width: 100%"
            class="d-flex align-center"
          >
            <portal-target name="dialog-actions-left"></portal-target>

            <v-spacer></v-spacer>
            <portal-target name="dialog-actions-right">
              <v-btn color="blue darken-1" text @click="close"> Annulla </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
                v-if="!dialogData.readonly"
              >
                Salva
              </v-btn>
            </portal-target>
          </portal-target>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "DynamicDialog",
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      dialogData: "dialog/dialogData",
      dialogState: "dialog/dialogState"
    })
  },
  methods: {
    close() {
      this.$store.dispatch("dialog/updateStatus", false);
    }
  }
};
</script>

<style scoped></style>
