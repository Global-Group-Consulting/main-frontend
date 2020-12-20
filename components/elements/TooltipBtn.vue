<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" v-bind="$attrs" @click="$emit('click')">
        <v-icon v-if="iconName" :class="`mr-${breakpoint}-2`">{{
          iconName
        }}</v-icon>
        <span :class="`d-none d-${breakpoint}-inline-block`">
          <slot></slot>
        </span>
      </v-btn>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "TooltipBtn",
  props: {
    tooltip: String,
    iconName: String,
    breakpoint: {
      type: String,
      default: "sm"
    }
  }
};
</script>

<style scoped></style>
