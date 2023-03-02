<template>
  <v-card class="h-100" :loading="downloading">
    <template v-slot:progress>
      <v-progress-linear
          indeterminate
      ></v-progress-linear>
    </template>

    <v-card-text class="d-flex">
      <v-skeleton-loader
          :loading="!coverFileUrl"
          width="100%"
          :height="skeletonHeight"
          type="image"
          style="width: 100%"
          v-if="!error"
      >
        <a href="#" @click.prevent="downloadFile" target="_blank" class="d-flex">
          <v-img
              :src="coverFileUrl"
              :width="width"
              contain
              class=""
              @error="onImgError"
          ></v-img>
        </a>
      </v-skeleton-loader>

      <v-alert v-else type="error"
               outlined tile class="mb-0">
        Ci dispiace ma sembra ci sia stato un errore!
      </v-alert>

    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import { IMagazine } from '~/@types/Magazine'
import { useFileDownloader } from '~/composables/fileDownloader'

export default defineComponent({
  name: 'MagazineCard',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    skeletonHeight: {
      type: String
    }
  },
  setup (props, { root }) {
    const { $store, $fileUtils, $alerts, $apiCalls } = root
    const fileDownloader = useFileDownloader($alerts)
    const coverFileUrl = ref('')
    const loading = ref(true)
    const downloading = ref(false)
    const error = ref()
    const currentMagazine = computed((): IMagazine => {
      return $store.getters['magazine/currentMagazine']
    })

    async function downloadFile () {
      if (downloading.value) {
        return
      }

      downloading.value = true

      try {
        await fileDownloader.download(() => $apiCalls.files.download(currentMagazine.value.fileId),
            currentMagazine.value.title + '.pdf',
            fileDownloader.types.PDF)
      } catch (e) {
        $alerts.error(e)
      }

      downloading.value = false
    }

    function onImgError (e: ErrorEvent) {
      error.value = e
    }

    watch(() => currentMagazine.value, async (value) => {
      if (value && value.coverFileId) {
        coverFileUrl.value = fileDownloader.srcUrl(value.coverFileId)
      }
    }, { immediate: true })

    onMounted(() => {
      $store.dispatch('magazine/fetchCurrent')
    })

    return {
      coverFileUrl,
      loading,
      downloading,
      error,
      downloadFile,
      onImgError
    }
  }
})
</script>

<style scoped>

</style>
