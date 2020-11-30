<template>
  <v-row justify="center">
    <v-dialog
      :value="dialogState"
      :persistent="true"
      :fullscreen="dialogData.fullscreen"
      :transition="dialogData.fullscreen ? 'dialog-bottom-transition' : ''"
      :retain-focus="false"
      scrollable
      :max-width="dialogData.large ? '900px' : '600px'"
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

        <portal-target
          name="dialog-pre-content"
          :slot-props="dialogData"
        ></portal-target>

        <v-card-text ref="dialogContent" :class="dialogData.contentClass">
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
              <v-btn color="blue darken-1" text @click="close">
                {{ $t(dialogData.texts.cancelBtn) }}
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
                v-if="!dialogData.readonly"
              >
                {{ $t(dialogData.texts.confirmBtn) }}
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

import { onUnmounted } from "@vue/composition-api";

export default {
  name: "DynamicDialog",
  setup() {
    onUnmounted(() => {
      console.log("asdsadasdas");
    });
  },
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
      try {
        this.$store.dispatch("dialog/updateStatus", false);
      } catch (er) {}
    }
  }
};
</script>

<style scoped></style>
