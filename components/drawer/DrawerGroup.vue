<template>
  <div class="">
    <!--    <v-divider></v-divider>-->

    <!--    <v-list-group :value="true" color="white">-->
    <!--      <template v-slot:activator v-if="false">
            <v-list-item-content>
              <v-list-item-title>{{ data.text }}</v-list-item-title>
            </v-list-item-content>
          </template>-->

    <!--      <v-divider></v-divider>-->
    <v-list-item class="mt-3">
      <v-list-item-action class="my-0" >
      </v-list-item-action>

      <v-list-item-content class="py-0">
        <v-list-item-title class="text-uppercase">{{ data.text }}</v-list-item-title>
        <v-divider></v-divider>
      </v-list-item-content>
    </v-list-item>

    <div v-for="(child, index) in data.childs" :key="index">
      <drawer-item :data="child"/>
    </div>
    <!--    </v-list-group>-->
  </div>
</template>

<script>
import DrawerItem from "~/components/drawer/DrawerItem";

export default {
  name: "DrawerGroup",
  components: {DrawerItem},
  props: {
    data: {}
  }
};
</script>

<style scoped></style>
