<template>
  <div style="">
    <portal to="dialog-content">
      <div
        slot-scope="props"
        style="height: 60vh; margin-left: -24px; margin-right: -24px; margin-bottom: -20px"
      >
        <v-img
          v-if="isImage"
          :src="props.data.fileUrl"
          height="60vh"
          contain
        ></v-img>

        <iframe
          v-else
          :src="props.data.fileUrl"
          style="border: 0; width: 100%; height: 60vh"
        ></iframe>
      </div>
    </portal>

    <portal to="dialog-actions-left">
      <v-btn color="" text @click="downloadFile">
        <v-icon>mdi-download</v-icon>
        {{ $t("dialogs.filePreviewer.btn-download") }}
      </v-btn>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="" text @click="close">
        {{ $t("dialogs.filePreviewer.btn-cancel") }}
      </v-btn>
    </portal>
  </div>
</template>

<script>
  import DynamicFieldset from "@/components/DynamicFieldset";
  import jsFileDownload from "js-file-download";
  import { mapGetters } from "vuex";

  export default {
    name: "FilePreviewer",
    components: { DynamicFieldset },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({ dialogData: "dialog/dialogData" }),
      isImage() {
        try {
          return this.dialogData?.data?.mimeType.indexOf("image") > -1;
        } catch (er) {
          return false
        }
      },
    },
    methods: {
      close() {
        this.$store.dispatch("dialog/updateStatus", false);
      },
      async downloadFile() {
        jsFileDownload(
          this.dialogData.data.fileData,
          this.dialogData.title
          // this.dialogData.data.mimeType
        );
      },
    },
  };
</script>

<style scoped>

</style>
