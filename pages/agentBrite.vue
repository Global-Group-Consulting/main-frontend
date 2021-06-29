<template>
  <v-layout>
    <v-flex>
    <agent-brite-table></agent-brite-table>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import AgentBriteTable from "~/components/table/AgentBriteListTable.vue";
@Component({
  components: {AgentBriteTable}
})
export default class AgentBrite extends Vue {

};
</script>

<style scoped></style>
