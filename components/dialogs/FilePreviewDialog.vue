<template>
  <div style="">
    <portal to="dialog-pre-content">
      <div style="height: 60vh; margin-bottom: -20px">
        <v-img
          v-if="isImage"
          :src="fileUrl"
          height="60vh"
          contain
        ></v-img>

        <iframe
          v-else
          :src="fileUrl"
          style="border: 0; width: 100%; height: 60vh"
        ></iframe>
      </div>
    </portal>

    <portal to="dialog-actions-left">
      <tooltip-btn iconName="mdi-download" :tooltip="$t('dialogs.filePreviewer.btn-download')"
                   text no-breakpoint breakpoint="_"
                   @click="downloadFile"/>

      <tooltip-btn iconName="mdi-open-in-new" :tooltip="$t('dialogs.filePreviewer.btn-open-in-new')"
                   text no-breakpoint breakpoint="_"
                   @click="openInNewWindow"/>
    </portal>

    <portal to="dialog-actions-right">
      <v-btn color="" text @click="close">
        {{ $t("dialogs.filePreviewer.btn-cancel") }}
      </v-btn>
    </portal>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import jsFileDownload from "js-file-download";

@Component
export default class FilePreviewDialog extends Vue {
  mimeType: string = ''
  fileData: any = null
  fileName: string = ""
  fileUrl: any = ""

  get dialogData() {
    return this.$store.getters["dialog/dialogData"]
  }

  get incomingData() {
    return this.dialogData.data || {}
  }

  get isImage() {
    try {
      return false //this.incomingData.mimeType.indexOf("image") > -1;
    } catch (er) {
      return false
    }
  }

  get fileId() {
    return this.incomingData.fileId;
  }

  async downloadFile() {
    try {
      if (this.fileData) {
        jsFileDownload(this.fileData, this.fileName, this.mimeType);
      }
    } catch (er) {
      this.$alerts.error(er);
    }
  }

  async openInNewWindow() {
    window.open(this.fileUrl, "_blank")
  }

  close() {
    this.$store.dispatch("dialog/updateStatus", false);
  }


  @Watch("fileId", {immediate: true})
  async loadFile(fileId: string) {
    try {
      const file = await this.$apiCalls.files.show(fileId);
      const result = await this.$apiCalls.files.download(fileId);

      this.fileName = file.clientName
      this.mimeType = `${file.type}/${file.subtype}`
      this.fileData = result.data
      this.fileUrl = URL.createObjectURL(new Blob([result.data], {type: this.mimeType}))

    } catch (er) {
      this.$alerts.error(er);
    }
  }
}
</script>
