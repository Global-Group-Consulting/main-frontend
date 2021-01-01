<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center"
               justify="center"
        >
          <v-col cols="12"
                 sm="8"
                 md="6"
                 lg="5"
                 xl="4"
          >
            <nuxt ref="viewEl"></nuxt>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'public',
  data() {
    return {
      title: 'Global Group Consulting'
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/colors';

.v-application {

  .v-card {
    .card-header {
      height: 80px;
      background-color: map-get($grey, "lighten-4");
      display: flex;
      align-items: center;
      justify-content: center;

      .v-card__title {
        font-weight: 400 !important;
      }
    }

    .v-card__actions {
      background-color: map-get($grey, "lighten-4")
    }
  }
}
</style>
