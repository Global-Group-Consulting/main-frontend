<template>
  <v-autocomplete class="receivers-combobox" v-bind="$attrs" v-on="$listeners">
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        small
        @click="data.select"
        @click:close="remove(data)"
      >
        {{ data.item.text }}
      </v-chip>
    </template>

    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>

      <template v-else>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.text"></v-list-item-title>
          <v-list-item-subtitle v-html="data.item.role" v-if="showRole"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>

    <template v-slot:label>
      <slot name="label"></slot>
    </template>
    <template v-slot:prepend>
      <slot name="prepend"></slot>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  props: {
    showRole: true
  },
  methods: {
    remove(data) {
      const dataArray = data.parent.value;
      const item = data.item;

      const index = dataArray.indexOf(item.value);
      if (index >= 0) dataArray.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.receivers-combobox::v-deep {
  .v-select__selections {
    row-gap: 6px;
  }
}
</style>
