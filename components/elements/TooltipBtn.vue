<template>
  <v-tooltip bottom :disabled="!tooltip" :loading="loading" :open-delay="delay">
    <template v-slot:activator="{ on, attrs }">
      <component :is="noBtnTag ? 'div' : 'v-btn'" v-on="on" v-bind="$attrs"
                 @click="$emit('click', $event)"
                 :class="noBtnTag && color ?  color + '--text' : ''"
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
export default {
  name: 'TooltipBtn',
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
  }
}
</script>

<style scoped></style>
