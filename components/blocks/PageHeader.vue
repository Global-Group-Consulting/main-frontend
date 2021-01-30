<template>
  <v-sheet
    class="pb-10"
    color="transparent"
    tile
  >
    <div class="d-flex">
      <!--      <v-icon
              class="mr-3"
              style="opacity: 0.5"
              v-if="icon"
              :x-large="$vuetify.breakpoint.mdAndUp"
            >{{ icon }}
            </v-icon>-->

      <h1 :class="{
        'display-3': $vuetify.breakpoint.mdAndUp,
        'display-2': $vuetify.breakpoint.smOnly,
        'display-1': $vuetify.breakpoint.xsOnly
        }">{{ title }}</h1>
    </div>
    <h3
      v-if="subtitle"
      class="display-1 font-weight-light"
      style="opacity: 0.5"
    >
      <slot name="subtitle">
        <div v-html="subtitle"></div>
      </slot>
    </h3>
  </v-sheet>
</template>

<script>
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
  name: "PageHeader",
  props: {
    title: "",
    subtitle: "",
    icon: "",
    showUserRole: Boolean
  },
  computed: {
    userRole() {
      return this.$enums.UserRoles.get(this.$auth.user.role)?.id;
    }
  }
});
</script>

<style></style>
