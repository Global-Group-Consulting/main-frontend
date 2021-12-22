<template>
  <v-list-item :key="news._id" class="align-center">

    <v-list-item-avatar tile>
      <v-img :src="imagePath"></v-img>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>
        <v-tooltip bottom v-if="isNotRead">
          <template v-slot:activator="{ on, attrs }">
            <v-badge color="orange"
                     icon="mdi-alert"
                     left inline
            >
              <span v-bind="attrs"
                    v-on="on">
                {{ news.title }}
              </span>
            </v-badge>
          </template>

          Da leggere
        </v-tooltip>

        <template v-else>
          {{ news.title }}
        </template>
      </v-list-item-title>

      <v-list-item-subtitle class="d-flex">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs"
                 v-on="on">
              <v-icon color="grey lighten-1" small>mdi-clock</v-icon>
              <span>{{ dateHourFormatter(news.createdAt, null) }}</span>
            </div>
          </template>
          <span>Data creazione</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" class="ms-3"
                 v-on="on">
              <v-icon color="green lighten-1" small>mdi-clock-start</v-icon>
              <span v-if="news.startAt">{{ dateHourFormatter(news.startAt, null) }}</span>
              <span v-else>-</span>
            </div>
          </template>
          <span>Data inizio</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" class="ms-3"
                 v-on="on">
              <v-icon color="red lighten-1" small>mdi-clock-end</v-icon>
              <span v-if="news.endAt">{{ dateHourFormatter(news.endAt, null) }}</span>
              <span v-else>-</span>
            </div>
          </template>
          <span>Data fine</span>
        </v-tooltip>
      </v-list-item-subtitle>
      <v-list-item-subtitle v-text="text"></v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="$emit('open', news)">
            <v-icon color="primary">mdi-open-in-app</v-icon>
          </v-btn>
        </template>

        <span>Apri</span>
      </v-tooltip>
    </v-list-item-action>

    <v-list-item-action>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="$emit('delete', news)">
            <v-icon color="red lighten-1">mdi-delete</v-icon>
          </v-btn>
        </template>

        <span>Elimina</span>
      </v-tooltip>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
  import { PropType, defineComponent, computed } from '@vue/composition-api';
  import { INews } from '~/@types/News';
  import { dateHourFormatter } from '~/plugins/filters';

  export default defineComponent({
    name: "NewsListItem",
    props: {
      news: Object as PropType<INews>
    },
    setup (props, { root }) {
      const imagePath = computed(() => {
        if (!props.news || !props.news.newsImg) {
          return "img/news_placeholder.png"
        }

        return `${root.$nuxt.context.env.SERVER_URL}/api/files/${props.news.newsImg.id}/show`
      })
      const text = computed(() => {
        const maxLength = 80;

        const text = props.news?.text.replace(/<\/?[^>]+(>|$)/g, "");

        if (!text) {
          return ""
        }

        if (text.length > maxLength) {
          return text.slice(0, maxLength) + "..."
        }

        return text
      })
      const isNotRead = computed(() => {
        return props.news?.readings.length === 0
      })

      return {
        imagePath,
        text,
        isNotRead,
        dateHourFormatter
      }
    }
  });
</script>

<style scoped>

</style>
