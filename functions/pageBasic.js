import pages from '@/config/pages'

import { ref } from '@vue/composition-api'

export default function ({ $i18n }, pageName) {
  const title = ref($i18n.t(`pages.${pageName}.title`))
  const subtitle = ref($i18n.t(`pages.${pageName}.subtitle`))
  const icon = ref(pages[pageName].icon)

  return {
    title,
    subtitle,
    icon
  }
}
