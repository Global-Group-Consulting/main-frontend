<template>
  <v-card>
    <v-card-text class="d-flex">
      <v-skeleton-loader
        :loading="loading"
        width="100%"
        :height="skeletonHeight"
        type="image"
        style="width: 100%"
      >
        <a href="#" @click.prevent="downloadFile" target="_blank" class="d-flex">
          <v-img
            :src="coverFileUrl"
            :width="width"
            contain
            class=""
          ></v-img>
        </a>
      </v-skeleton-loader>

    </v-card-text>
  </v-card>
</template>


<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {IMagazine} from "~/@types/Magazine";

@Component
export default class MagazineCard extends Vue {
  @Prop({type: String, default: "100%"})
  width!: string
  @Prop({type: String})
  skeletonHeight!: string
  coverFileUrl: string = ""
  loading = true

  get currentMagazine(): IMagazine {
    return this.$store.getters["magazine/currentMagazine"];
  }

  downloadFile() {
    this.$fileUtils.download(this.currentMagazine.fileId, this.currentMagazine.title + ".pdf")
  }

  @Watch("currentMagazine", {deep: true})
  async onCurrentMagazineChange(value: IMagazine) {
    const file = value.coverFile;

    if(!file){
      return
    }

    const result = await this.$apiCalls.files.download(file._id);

    //const fileName = file.clientName
    const mimeType = `${file.type}/${file.subtype}`
    //const fileData = result.data

    this.coverFileUrl = URL.createObjectURL(new Blob([result.data], {type: mimeType}))

    this.loading = false
  }

  mounted() {
    this.$store.dispatch("magazine/fetchCurrent");
  }
}
</script>
