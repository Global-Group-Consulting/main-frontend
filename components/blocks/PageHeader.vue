<template>
  <v-sheet color="primary" class="mx-n3 mt-n3" tile
           style="margin-bottom: -100px">
    <v-row>
      <v-col cols="12">
        <v-row justify="center" align="start" style="height:287px;padding-bottom: 100px"
               class="flex-column mx-3">
          <div class="d-flex">
            <v-icon x-large color="white" class="mr-3" style="font-size: 3.75rem; opacity: .5;">{{ icon }}
            </v-icon>

            <h1 class=" display-3 white--text">
              {{ title }} ({{ $t('enums.UserRoles.' + $enums.UserRoles.get($auth.user.role).id) }})
            </h1>
          </div>
          <h3 v-html="subtitle" v-if="subtitle" class="display-1 font-weight-light white--text"
              style="opacity: .5;"></h3>
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>

</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: '',
    subtitle: '',
    icon: ''
  }
}
</script>

<style>
</style>
