<template>
  <div class="" v-if="$acl.checkPermissions(data.permissions)">
    <div v-for="(child, index) in data.childs" :key="index">
      <drawer-item :data="child"/>
    </div>
  </div>
</template>

<script>
import DrawerItem from "~/components/drawer/DrawerItem";


export default {
  name: "DrawerGroup",
  components: {DrawerItem},
  props: {
    data: {}
  },
  setup() {
    return {
    }
  }
};
</script>

<style scoped></style>
