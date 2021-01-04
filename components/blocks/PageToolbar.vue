<template>
  <v-toolbar class="mb-10"
             flat
             rounded
             outlined
             dense
  >
    <v-toolbar-items class="flex-fill">
      <slot name="left-block"></slot>

      <v-spacer></v-spacer>

      <slot name="center-block"></slot>

      <v-spacer></v-spacer>

      <slot name="right-block"></slot>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: "PageToolbar"
}
</script>

<style scoped>

</style>
