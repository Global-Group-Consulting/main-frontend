<template>
  <div>
    <v-divider></v-divider>

    <v-list-group :value="true" color="white">
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>{{ data.text }}</v-list-item-title>
        </v-list-item-content>
      </template>

      <v-divider></v-divider>

      <div v-for="(child, index) in data.childs" :key="index">
        <drawer-item :data="child" />
      </div>
    </v-list-group>
  </div>
</template>

<script>
import DrawerItem from "~/components/drawer/DrawerItem";

export default {
  name: "DrawerGroup",
  components: { DrawerItem },
  props: {
    data: {}
  }
};
</script>

<style scoped></style>
