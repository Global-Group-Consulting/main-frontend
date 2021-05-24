<template>
  <v-menu
    ref="menu"
    v-model="menuOpen"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="valueToReturn"
    transition="scale-transition"
    offset-y
    :max-width="$vuetify.breakpoint.xsOnly ? '320px' : '800px'"
  >

    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="valueToReturn.join(' - ')"
        label="Picker in menu"
        prepend-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="Object.assign({}, attrs, $attrs)"
        v-on="on"
      >
        <template v-slot:prepend>
          <slot name="prepend"></slot>
        </template>

        <template v-slot:label>
          <slot name="label"></slot>
        </template>
      </v-text-field>
    </template>

    <div class="white pa-3">
      <v-row justify="space-around" align="center">
        <v-col sm="6" cols="12">
          <h2>Inizio:</h2>
          <v-time-picker
            v-model="start"
            :min="min || null"
            :max="end || max"
            format="24hr"
            full-width
          ></v-time-picker>
        </v-col>
        <v-col sm="6" cols="12">
          <h2>Fine:</h2>
          <v-time-picker
            v-model="end"
            :min="start || min"
            :max="max || null"
            format="24hr"
            full-width
          ></v-time-picker>
        </v-col>
      </v-row>

      <div class="d-flex">
        <v-spacer></v-spacer>
        <v-btn text
               @click="menuOpen = false">Annulla
        </v-btn>

        <v-btn text color="primary"
               @click="onSave">Salva
        </v-btn>
      </div>
    </div>
  </v-menu>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";

@Component
export default class TimePickerRange extends Vue {
  @Prop({type: Array})
  value!: string[];

  @Prop({type: String})
  min!: string;

  @Prop({type: String})
  max!: string;

  menuOpen: boolean = false;
  start: any = null;
  end: any = null;

  $refs!: {
    menu: any
  }

  get valueToReturn(): string[] {
    return [this.start, this.end]
  }

  set valueToReturn(value: string[]) {
    if (!value) {
      return
    }

    this.start = value[0];
    this.end = value[1];
  }

  onSave() {
    this.$refs.menu.save([this.start, this.end])

    this.$emit("change", this.valueToReturn)
  }

  @Watch("value", {immediate: true})
  onValueChange() {
    this.valueToReturn = this.value
  }

}
</script>

<style scoped>

</style>
