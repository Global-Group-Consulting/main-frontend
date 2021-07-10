<template>
  <div>
    <span v-html="movementType"></span>
    <span v-if="item.motivation">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn text rounded v-on="on" color="primary">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </template>

        {{ item.motivation }}
      </v-tooltip>
    </span>
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
