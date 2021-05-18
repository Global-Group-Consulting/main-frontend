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
        }" v-html="pageTitle"></h1>
    </div>
    <h3
      v-if="pageSubtitle"
      class="display-1 font-weight-light text-grey blue-grey--text text--lighten-2"
    >
      <slot name="subtitle">
        <div v-html="pageSubtitle"></div>
      </slot>
    </h3>
  </v-sheet>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator"
// import pages from "~/config/pages";

@Component
export default class PageHeader extends Vue {
  @Prop({type: String, required: true})
  public pageName!: string

  @Prop({type: String})
  public title!: string

  @Prop({type: [Boolean, String]})
  public subTitle!: string | any

  get userRole() {
    return this.$enums.UserRoles.get(this.$auth.user.role)?.id
  }

  get titlePath() {
    return `pages.${this.pageName}.title`
  }

  get subtitlePath() {
    return `pages.${this.pageName}.subtitle`
  }

  get pageTitle() {
    return this.title ? this.title : this.$t(this.titlePath)
  }

  get pageSubtitle() {
    if (typeof this.subTitle === "boolean" && !this.subTitle) {
      return ""
    }

    return this.subTitle ? this.subTitle : this.$te(this.subtitlePath) ? this.$t(this.subtitlePath) : ""
  }

  /*get icon() {
    return pages[this.pageName] && pages[this.pageName].icon ? pages[this.pageName].icon : ''
  }*/
}
</script>
