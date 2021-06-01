<template>
  <v-chip small
          :outlined="!item.initialMovement"
          :dark="item.initialMovement"
          :color="$enums.RequestStatus.get(item.status).color"
  >
    {{ $t("enums.RequestStatus." + $enums.RequestStatus.getIdName(item.status)) }}
  </v-chip>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {RequestFormData} from "~/@types/Requests";

@Component({})
export default class CellRequestStatus extends Vue {
  @Prop({type: Object, required: true})
  public item!: RequestFormData

}
</script>

<style scoped>

</style>
