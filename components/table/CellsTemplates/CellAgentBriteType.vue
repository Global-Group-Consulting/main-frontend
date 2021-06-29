<template>
  <div>
    <span v-html="movementType"></span>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {AgentBrite} from "~/@types/AgentBrite";
import AgentBritesType from "~/enums/AgentBritesType";

@Component({})
export default class CellAgentBriteType extends Vue {
  @Prop({type: Object, required: true})
  public item!: AgentBrite

  @Prop({type: String, required: true})
  public value!: any

  get movementType() {
    const id = AgentBritesType.get(this.value).id;

    return this.$t("enums.AgentBritesType." + id);
  }

}
</script>

<style scoped>

</style>
