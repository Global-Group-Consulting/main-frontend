<template>
  <v-layout>
    <v-flex>
      <v-list :two-line="permission.canDelete.value">
        <template v-for="(news, i) in allNews">
          <NewsListItem :news="news" @open="onOpen" @delete="onDelete"/>

          <v-divider inset v-if="i < allNews.length - 1"/>
        </template>
      </v-list>
    </v-flex>

    <NewsDialog v-if="$store.getters['dialog/dialogId'] === 'NewsDialog'"
                @dataStored="updateData"
                @setAsRead="updateReadStatus"></NewsDialog>

  </v-layout>
</template>

<script lang="ts">
  import { computed, defineComponent, onBeforeMount, Ref, ref } from "@vue/composition-api" ;
  import { INews, NewsStatus } from '~/@types/News';
  import RequestTypes from '~/enums/RequestTypes';
  import CurrencyType from '~/enums/CurrencyType';
  import { moneyFormatter } from '~/plugins/filters/moneyFormatter';
  import { NewsPermissions } from '~/functions/acl/enums/news.permissions';

  export default defineComponent({
    name: "NewsTab",
    setup (props, { root, emit }) {
      const { $apiCalls, $store, $alerts, $i18n, $acl } = root
      const allNews: Ref<INews[]> = ref([]);
      const unreadCounter: Ref<number> = computed(() => allNews.value.reduce((acc, news) => acc + (news.readings.length ? 0 : 1), 0));
      const permission = {
        canDelete: computed(() => {
          return $acl.checkPermissions([NewsPermissions.NEWS_ALL_CREATE])
        })
      }

      function onOpen (news: INews) {
        $store.dispatch("dialog/updateStatus", {
          id: "NewsDialog",
          title: news.title,
          showCloseBtn: true,
          readonly: true,
          texts: {
            cancelBtn: "Chiudi"
          },
          data: {
            news
          }
        });
      }

      async function onDelete (news: INews) {
        /*try {
          await $alerts.askBeforeAction({
            key: "news.delete-news",
            preConfirm: async () => {
              const indexToUpdate = allNews.value.findIndex(el => el._id === news._id)

              await $apiCalls.news.delete(news._id);

              allNews.value.splice(indexToUpdate, 1)
            },
            settings: {
              confirmButtonColor: "red",
              html: $i18n.t("alerts.news.delete-news-text", { title: news.title }),
            },
            data: {}
          });
        } catch (er) {
          $alerts.error(er)
        }*/
      }

      function updateData (newData: INews, isNew: boolean) {
        if (isNew) {
          allNews.value.unshift(newData)

          return
        }

        const indexToUpdate = allNews.value.findIndex(el => el._id === newData._id)

        allNews.value.splice(indexToUpdate, 1, newData);
      }

      function updateReadStatus (newData: NewsStatus) {
        const indexToUpdate = allNews.value.findIndex(el => el._id === newData.newsId)

        if (!allNews.value[indexToUpdate].readings) {
          allNews.value[indexToUpdate].readings = []
        }

        allNews.value[indexToUpdate].readings.push(newData)
        emit("input", unreadCounter.value);
      }

      onBeforeMount(async () => {
        allNews.value = await $apiCalls.news.index();

        emit("input", unreadCounter.value);
      })

      return {
        allNews,
        onOpen, onDelete, updateData, updateReadStatus,
        permission
      }
    }
  });
</script>

<style scoped>

</style>
