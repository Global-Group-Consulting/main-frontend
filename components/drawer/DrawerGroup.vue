<template>
  <div class="" v-if="mustShow">
    <div v-for="(child, index) in data.childs" :key="index">
      <drawer-item :data="child"/>
    </div>
  </div>
</template>

<script>
import DrawerItem from '~/components/drawer/DrawerItem'
import { computed } from '@vue/composition-api'

export default {
  name: 'DrawerGroup',
  components: { DrawerItem },
  props: {
    data: {}
  },
  setup (props, { root }) {
    const mustShow = computed(() => {
      return root.$acl.checkPermissions(props.data.permissions) && root.$acl.checkRoles(props.data.roles)
    })

    return {
      mustShow
    }
  }
}
</script>

<style scoped></style>
