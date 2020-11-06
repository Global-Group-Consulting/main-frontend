<template>
  <v-sheet
    color="primary"
    class="mx-n3 mt-n3"
    tile
    style="margin-bottom: -100px"
  >
    <v-row>
      <v-col cols="12">
        <v-row
          justify="center"
          align="start"
          style="height: 287px; padding-bottom: 100px"
          class="flex-column mx-3"
        >
          <div class="d-flex">
            <v-icon
              x-large
              color="white"
              class="mr-3"
              style="font-size: 3.75rem; opacity: 0.5"
              >{{ icon }}
            </v-icon>

            <h1 class="display-3 white--text">
              {{ title }}
              <!-- <small
                v-if="showUserRole"
                class="italic"
                >({{ $t("enums.UserRoles." + userRole) }})</small
              > -->
            </h1>
          </div>
          <h3
            v-if="subtitle"
            v-html="subtitle"
            class="display-1 font-weight-light white--text"
            style="opacity: 0.5"
          ></h3>
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
  export default {
    name: "PageHeader",
    props: {
      title: "",
      subtitle: "",
      icon: "",
      showUserRole: Boolean,
    },
    computed: {
      userRole() {
        return this.$enums.UserRoles.get(this.$auth.user.role)?.id;
      },
    },
  };
</script>

<style>
</style>
