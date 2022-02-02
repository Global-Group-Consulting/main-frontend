<template>
  <v-banner v-if="unreadNews.length > 0"
            color="orange"
            dark
            rounded
  >
    <v-carousel v-model="activeNews"
                height="200"
                :hide-delimiters="unreadNews.length === 1"
                :show-arrows="unreadNews.length > 1"
                hide-delimiter-background
                show-arrows-on-hover>
      <v-carousel-item
        eager
        v-for="(news) in unreadNews"
        :key="news._id"
      >
        <v-sheet class="overflow-auto"
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

          <div class="d-flex">
            <a :href="news.coverImg" target="_blank">
              <img :src="news.coverImg" alt=""
                   class="mr-3"
                   style="width: 300px; max-height: 150px; object-fit: cover; object-position: center">
            </a>

            <div>
              <strong class="text-h4">{{ news.title }}</strong>

              <div v-html="news.content"></div>
            </div>
          </div>

        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-banner>
</template>

<script lang="ts">
  import { defineComponent, onMounted, Ref, ref } from '@vue/composition-api';
  import { INews } from '~/@types/News';

  export default defineComponent({
    name: "NewsBox",
    setup (props, { root }) {
      const { $apiCalls, $alerts, $i18n } = root;
      const unreadNews: Ref<INews[]> = ref([])
      const activeNews = ref(0);

      async function setAsRead (news: INews) {
        try {
          await $alerts.askBeforeAction({
            key: "news.set-read",
            settings: {
              html: $i18n.t("alerts.news.set-read-text", { title: news.title }),
            },
            preConfirm: async () => {
              const indexToUpdate = unreadNews.value.findIndex(el => el._id === news._id)

              await $apiCalls.news.setAsRead(news._id);

              unreadNews.value.splice(indexToUpdate, 1)
            },
          });
        } catch (er) {
          $alerts.error(er)
        }
      }

      onMounted(async () => {
        try {
          unreadNews.value = await $apiCalls.news.getUnread();
        } catch (er) {
          $alerts.error(er);
        }
      })

      return {
        unreadNews,
        activeNews,
        setAsRead
      }
    }
  });
</script>

<style scoped lang="scss">
  ::v-deep .ce-block__content {
    max-width: 100%;
  }
</style>
