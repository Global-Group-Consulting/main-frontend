import pages from '@/config/pages'

import { ref } from '@vue/composition-api'

export default function ({ $i18n }, pageName) {
  const titlePath = `pages.${pageName}.title`
  const subtitlePath = `pages.${pageName}.subtitle`

  const title = ref($i18n.t(titlePath))
  const subtitle = ref($i18n.te(subtitlePath) ? $i18n.t(subtitlePath) : "")
  const icon = ref(pages[pageName] && pages[pageName].icon ? pages[pageName].icon : null)

  return {
    title,
    subtitle,
    icon
  }
}
