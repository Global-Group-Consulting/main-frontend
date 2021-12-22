<template>
  <v-layout>
    <v-flex>
      <v-list three-line>
        <template v-for="(news, i) in allNews">
          <NewsListItem :news="news" @open="onOpen" @delete="onDelete"/>

          <v-divider inset v-if="i < allNews.length - 1"/>
        </template>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import { computed, defineComponent, onBeforeMount, Ref, ref } from "@vue/composition-api" ;
  import { INews } from '~/@types/News';

  export default defineComponent({
    name: "NewsTab",
    setup (props, { root, emit }) {
      const { $apiCalls } = root
      const allNews: Ref<INews[]> = ref([]);
      const unreadCounter: Ref<number> = computed(() => allNews.value.reduce((acc, news) => acc + (news.readings.length ? 0 : 1), 0));

      function onOpen (news: INews) {

      }

      function onDelete (news: INews) {

      }

      onBeforeMount(async () => {
        allNews.value = await $apiCalls.news.index();

        emit("input", unreadCounter.value);
      })

      return {
        allNews,
        onOpen, onDelete
      }
    }
  });
</script>

<style scoped>

</style>
