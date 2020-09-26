<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on"
             v-bind="$attrs"
             @click="$emit('click')"
      >
        <v-icon v-if="iconName">{{ iconName }}</v-icon>
        <span class="d-none d-md-inline-block">
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
    iconName: String
  }
}
</script>

<style scoped>

</style>
