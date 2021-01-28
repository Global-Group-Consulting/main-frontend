<template>
  <portal to="mobileMenuActions">
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Verrà aggiunto presto</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
<!--      <v-list-item v-for="(action, i) of actionsList" :key="i">
        <v-list-item-action></v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ action.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>-->
    </v-list>
  </portal>
</template>

<script>
export default {
  name: "MobileMenuActions",
  props: {
    actionsList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
