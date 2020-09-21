<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn
        color="primary"
        icon
        v-on="on"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="">
        <v-list-item-title>Accetta</v-list-item-title>
      </v-list-item>
      <v-list-item @click="">
        <v-list-item-title>Rifiuta</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: 'CrudActions',
    props: {
      item: {}
    }
  }
</script>

