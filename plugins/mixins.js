import Vue from 'vue'


Vue.mixin({
  methods: {
    gLoadingUpdate(status = true) {
      this.$nuxt.$loading[status ? "start" : "finish"]()
    }
  },
  computed: {
    gLoading() {
      return this.$nuxt.$loading.show
    }
  }
})

Vue.mixin({
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("dialog/updateStatus")

    next()
  }
})

