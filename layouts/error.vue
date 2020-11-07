<template>
  <v-card>
    <v-card-title>
      <v-icon class="mr-2">mdi-alert-circle</v-icon>
      {{ $t("errors.errorPage.title") }}
      -
      {{ error.statusCode }}
    </v-card-title>
    <v-divider></v-divider>

    <v-card-text class="text-center py-5">
      <h3>
        {{ $t("errors.errorPage.generic") }}
      </h3>

      <h2 v-if="error.statusCode === 404" class="py-4">
        {{ $t("errors.errorPage.404") }}
      </h2>

      <br />
      <NuxtLink to="/">Torna alla Home page </NuxtLink>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    layout: "public",
    props: {
      error: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        pageNotFound: "404 Not Found",
        otherError: "An error occurred",
      };
    },
    head() {
      const title =
        this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
      return {
        title,
      };
    },
  };
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
