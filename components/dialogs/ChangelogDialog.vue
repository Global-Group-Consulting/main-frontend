<template>
  <portal to="dialog-content">
    <div v-html="changelogPage" class="changelog-html"></div>
  </portal>
</template>

<script>
import changelogPage from "@/static/changelog.js"

export default {
  name: 'ChangelogDialog',
  data() {
    return {
      changelogPage
    }
  },
  methods: {
    close() {
      this.$store.dispatch('dialog/updateStatus', false)
    }
  }
}
</script>

<style scoped lang="scss">
.changelog-html::v-deep {

  h2{
    color: #0088FF;

    small{
      color: #666666;
      font-weight: normal;
    }

    & + h3{
      margin-top: 8px;
    }
  }


  h2:not(:first-of-type) {
    margin-top: 36px;
  }

  h3{
    margin-top: 16px;
  }
}
</style>
