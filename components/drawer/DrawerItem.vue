<template>
  <v-list-item
    nuxt
    :to="data.link"
    :ripple="false"
    :color="'grey lighten-3'"
  >
    <v-list-item-action>
      <v-icon>{{ data.icon }}</v-icon>
    </v-list-item-action>

    <v-list-item-content>
      <v-list-item-title>{{ data.text }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "drawer-item",
  props: {
    data: {}
  },
  computed: {
    ...mapGetters({
      userMustActivate: "user/mustActivate"
    })
  }
};
</script>

<style scoped></style>
