<template>
  <v-tooltip bottom :disabled="!tooltip" :loading="loading" :open-delay="delay">
    <template v-slot:activator="{ on, attrs }">
      <component :is="noBtnTag ? 'div' : 'v-btn'" v-on="on" v-bind="$attrs"
                 @click="$emit('click', $event)"
                 :class="classes"
                 :depressed="loading"
                 :disabled="loading"
                 :loading="loading"
                 :text="text"
                 :icon="icon"
                 :color="color">

        <v-icon v-if="iconName" :class="{[`mr-${breakpoint}-2`]: !icon}">
          {{ iconName }}
        </v-icon>
        <span :class="{[`d-none d-${breakpoint}-inline-block text-trim`]: !icon}">
          <slot></slot>
        </span>
      </component>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
import { computed } from '@vue/composition-api'
import VBtn from 'vuetify/lib/components/VBtn'

export default {
  name: 'TooltipBtn',
  components: { VBtn },
  props: {
    tooltip: String,
    iconName: String,
    icon: Boolean,
    text: Boolean,
    noBreakpoint: Boolean,
    loading: Boolean,
    noBtnTag: Boolean,
    delay: {
      type: Number,
      default: 300
    },
    breakpoint: {
      type: String,
      default: 'sm'
    },
    color: {
      type: String
    }
  },
  setup (props, { attrs }) {
    const classes = computed(() => {
      const classes = attrs.class ? attrs.class.split(' ') : []

      console.log(classes)
      if (props.noBtnTag && props.color) {
        classes.push(`${props.color}--text`)
      }

      return classes
    })

    return {
      classes
    }
  }
}
</script>

<style scoped></style>
