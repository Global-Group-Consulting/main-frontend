<template>
  <data-table :items="tableData"
              schema="agentBriteSchema"
              table-key="agentBrite"
  >

  </data-table>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import DataTable from "~/components/table/DataTable.vue";
import {AgentBrite} from "~/@types/AgentBrite";

@Component({
  components: {DataTable}
})
export default class AgentBriteListTable extends Vue {
  @Prop({type: String})
  userId!: string

  private tableData: AgentBrite[] = []

  async mounted() {
    try {
      const result: AgentBrite[] = await this.$apiCalls.agentBriteApi.index(this.userId)

      this.tableData = result
    } catch (er) {
      this.$alerts.error(er);
    }

  }
}
</script>
