import pages from '@/config/pages'

function currentPage () {
  return this.$route.path.replace('/', '') || 'home'
}

export default {
  computed: {
    pageTitle () {
      return this.$t(`pages.${currentPage.call(this)}.title`)
    },
    pageSubtitle () {
      return this.$t(`pages.${currentPage.call(this)}.subtitle`)
    },
    pageIcon () {
      return pages[currentPage.call(this)].icon
    },
  }
}
