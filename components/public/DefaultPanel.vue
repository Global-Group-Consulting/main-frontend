<template>
  <v-card class="elevation-12 rounded-lg"
          :loading="loading"
          :disabled="!!loading"
  >
    <v-sheet class="card-header">
      <v-card-title class="">{{ title }}</v-card-title>
    </v-sheet>

    <v-divider></v-divider>

    <v-card-text>
      <p class="subtitle-1" v-if="message">{{ message }}</p>

      <slot></slot>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="justify-center" v-if="this.$slots.actions">
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name:  'DefaultPanel',
    data () {
      return {
        loading: false
      }
    },
    props: {
      title:        '',
      message:      '',
      loadingModel: false
    },
    watch: {
      loadingModel (value) {
        this.loading = value ? 'accent' : false
      }
    }
  }
</script>

<style scoped></style>
