<template>
  <v-icon v-bind="$attrs" class="text-icon">
    <slot name="default"></slot>
  </v-icon>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({})
export default class TextIcon extends Vue {

}
</script>

<style scoped>
  .text-icon{
    font-size: 16px;
    font-style: normal;
    font-weight: bold;
  }
</style>
