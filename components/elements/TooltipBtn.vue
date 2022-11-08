<template>
  <v-tooltip bottom :disabled="!tooltip" :loading="loading">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" v-bind="$attrs"
             @click="$emit('click', $event)"
             :depressed="loading"
             :disabled="loading"
             :loading="loading"
             :text="text"
             :icon="icon">

        <v-icon v-if="iconName" :class="{[`mr-${breakpoint}-2`]: !icon}">
          {{ iconName }}
        </v-icon>
        <span :class="{[`d-none d-${breakpoint}-inline-block text-trim`]: !icon}">
          <slot></slot>
        </span>
      </v-btn>
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
    breakpoint: {
      type: String,
      default: 'sm'
    }
  }
}
</script>

<style scoped></style>
