<template>
  <v-row justify="center" class="dynamic-dialog">
    <v-dialog
      :value="dialogState"
      :persistent="true"
      :fullscreen="dialogData.fullscreen"
      :transition="dialogData.fullscreen ? 'dialog-bottom-transition' : ''"
      :content-class="dialogData.theme ? 'theme-' + dialogData.theme : ''"
      :dark="darkMode"
      :retain-focus="false"
      scrollable
      :max-width="dialogData.large ? '900px' : '600px'"
    >
      <v-card>
        <div class="d-flex dynamic-dialog-title">
          <v-card-title class="flex-fill">
            <span class="headline" v-html="dialogData.title"></span>
          </v-card-title>

          <v-card-title v-if="dialogData.fullscreen || m, dialogData.showCloseBtn">
            <v-btn icon @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
        </div>

        <v-divider></v-divider>

        <div class="dynamic-dialog-content flex-fill">

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
        </div>

        <v-divider></v-divider>

        <v-card-actions v-if="!dialogData.noActions"
                        class="dynamic-dialog-actions">
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
import {mapGetters} from "vuex";

import {onUnmounted} from "@vue/composition-api";

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
    }),
    darkMode() {
      return this.dialogData.theme === 'global-club'
    }
  },
  methods: {
    close() {
      try {
        this.$store.dispatch("dialog/updateStatus", false);
      } catch (er) {
      }
    }
  }
};
</script>

<style lang="scss">
.v-dialog--fullscreen {
  .v-card {
    border-radius: 0 !important;
  }
}

.dynamic-dialog-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .v-card__text {
    overflow: auto;
  }
}


.theme-global-club {
  .dynamic-dialog-content {
    background-color: #000;
  }
}

.theme-communications {
  .dynamic-dialog-content {
    .v-card__text {
      background-color: #f7f7f7;
    }
  }
}
</style>
