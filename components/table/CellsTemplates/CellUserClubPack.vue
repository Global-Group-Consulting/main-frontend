<template>
  <div v-if="!chipVersion">
    <v-tooltip bottom v-if="item.gold">
      <template v-slot:activator="{on}">
                <span v-on="on">
                  <v-icon v-if="value === $enums.ClubPacks.UNSUBSCRIBED">mdi-diamond-outline</v-icon>
                  <v-icon v-else :color="$enums.ClubPacks.get(value).iconColor">mdi-diamond-stone</v-icon>
                </span>
      </template>

      {{ $t("enums.ClubPacks." + $enums.ClubPacks.getIdName(value)) }}
    </v-tooltip>

    <span v-else></span>
  </div>

  <v-chip v-else
          :color="$enums.ClubPacks.get(value).color"
          small>
    {{ $t(`enums.ClubPacks.` + value) }}
  </v-chip>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {User} from "~/@types/UserFormData";

@Component({})
export default class CellUserClubPack extends Vue {
  @Prop({type: Object, required: true})
  public item!: User

  @Prop({type: Boolean, default: false})
  public chipVersion!: boolean

  get value() {
    return this.item.clubPack;
  }

}
</script>

<style scoped>

</style>
