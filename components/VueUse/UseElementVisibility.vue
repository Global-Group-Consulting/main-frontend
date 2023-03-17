<template>
  <div ref="el">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'UseElementVisibility',
  props: {
    delay: {
      type: Number,
      default: 0
    }
  },
  setup (props, { emit }) {
    const el: Ref<HTMLElement | undefined> = ref()
    const isVisible = ref(false)
    let delayTimer: any = null

    onMounted(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible.value = entry.isIntersecting

          if (props.delay) {
            if (delayTimer) {
              clearTimeout(delayTimer)
            }

            delayTimer = setTimeout(() => {
              emit('visibility-changed', entry.isIntersecting)
            }, props.delay)
          } else {
            emit('visibility-changed', entry.isIntersecting)
          }
        })
      }, {
        threshold: 0.8
      })

      if (el.value) {
        observer.observe(el.value)
      }
    })

    return {
      el,
      isVisible
    }
  }
})
</script>

<style scoped>

</style>
