<template>
  <div class="default-panel">

    <div class="d-flex justify-content-center mb-10 ">
      <v-img src="/logo_dark.png" position="center" height="100px" contain></v-img>
    </div>

    <v-card class="elevation-12 rounded-lg default-panel-card"
            :loading="loading"
            :disabled="!!loading"
    >
      <div class="text-center text-h5">{{ title }}</div>

      <v-card-text>
        <p class="subtitle-1" v-if="message">{{ message }}</p>

        <slot></slot>
      </v-card-text>

      <!--      <v-divider></v-divider>-->

      <v-card-actions class="justify-center" v-if="this.$slots.actions">
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'DefaultPanel',
  data() {
    return {
      loading: false
    }
  },
  props: {
    title: '',
    message: '',
    loadingModel: false
  },
  watch: {
    loadingModel(value) {
      this.loading = value ? 'accent' : false
    }
  }
}
</script>

<style scoped lang="scss">
@import '~vuetify/src/styles/styles.sass';

.default-panel::v-deep {
  .default-panel-card{
    padding: 50px 70px;
  }
}

@media #{map-get($display-breakpoints, 'sm-and-down')}{
  .default-panel::v-deep {
    //margin-top: -25vh;

    .default-panel-card{
      padding: 30px 0px;
    }
  }
}


</style>
