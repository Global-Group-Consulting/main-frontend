<template>
  <default-panel :title="$t(`pages.signResult.${resultType}-title`)">
    <p v-html="$t(`pages.signResult.${resultType}-message`)" class="text-h6"></p>
  </default-panel>
</template>

<script>
import DefaultPanel from "@/components/public/DefaultPanel";

export default {
  name: "result",
  components: {DefaultPanel},
  auth: false,
  layout: "public",
  computed: {
    resultType() {
      return this.$route.params.result
    }
  }

}
</script>

<style scoped>

</style>
