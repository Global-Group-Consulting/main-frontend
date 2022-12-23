<template>
  <v-banner v-if="unreadNews.length > 0"
            color="orange"
            dark
            rounded
  >
    <v-carousel v-model="activeNews"
                :height="$vuetify.breakpoint.smAndDown ? 400 : 300"
                :hide-delimiters="unreadNews.length === 1"
                :show-arrows="unreadNews.length > 1"
                hide-delimiter-background
                hide-delimiters
                :show-arrows-on-hover="$vuetify.breakpoint.mdAndUp">
      <v-carousel-item
          eager
          v-for="(news) in unreadNews"
          :key="news._id"
      >
        <v-sheet class=" d-flex flex-column"
                 height="100%"
                 color="transparent"
        >
          <div class="text-right">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="setAsRead(news)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>

              Segna come letta
            </v-tooltip>
          </div>

          <v-row no-gutters class="overflow-auto">
            <v-col cols="12" md="4" v-if="news.coverImg">
              <a :href="news.coverImg" target="_blank" class="d-flex" style="height: 100%">
                <img :src="news.coverImg" alt=""
                     class="pr-md-3"
                     style="width: 100%; object-fit: cover; object-position: center"
                     :style="$vuetify.breakpoint.smAndDown ? 'aspect-ratio:6/2': 'height: 100%'">
              </a>
            </v-col>

            <v-col cols="12" :md="news.coverImg ? 8 : 12" class="mb-5 mb-md-0">
              <div>
                <strong class="text-h4">{{ news.title }}</strong>

                <div v-html="news.content"></div>
              </div>
            </v-col>
          </v-row>

        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-banner>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from '@vue/composition-api'
import { INews } from '~/@types/News'

export default defineComponent({
  name: 'NewsBox',
  setup (props, { root }) {
    const { $apiCalls, $alerts, $i18n } = root
    const unreadNews: Ref<INews[]> = ref([])
    const activeNews = ref(0)

    async function setAsRead (news: INews) {
      try {
        await $alerts.askBeforeAction({
          key: 'news.set-read',
          settings: {
            html: $i18n.t('alerts.news.set-read-text', { title: news.title })
          },
          preConfirm: async () => {
            const indexToUpdate = unreadNews.value.findIndex(el => el._id === news._id)

            await $apiCalls.news.setAsRead(news._id)

            unreadNews.value.splice(indexToUpdate, 1)
          }
        })
      } catch (er) {
        $alerts.error(er)
      }
    }

    onMounted(async () => {
      try {
        unreadNews.value = await $apiCalls.news.getUnread()
      } catch (er) {
        $alerts.error(er)
      }
    })

    return {
      unreadNews,
      activeNews,
      setAsRead
    }
  }
})
</script>

<style scoped lang="scss">
::v-deep .ce-block__content {
  max-width: 100%;
}
</style>
