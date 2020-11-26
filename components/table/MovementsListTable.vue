<template>
  <data-table
    :items="movements.list.value"
    table-key="movements"
    schema="movementsSchema"
    :items-per-page="25"
    :item-class="movements.getItemClass"
    :options="{
      sortBy: ['created_at'],
      sortDesc: [true]
    }"
  >
    <template v-slot:item.amountChange="{ item }">
      <div v-html="movements.formatAmountChange(item)"></div>
    </template>

    <template v-slot:item.movementType="{ item }">
      <div v-html="movements.formatMovementType(item)"></div>
    </template>

    <template v-slot:item.deposit="{ item }">
      <span class="text-no-wrap">
        € {{ $options.filters.moneyFormatter(item.deposit) }}
      </span>
    </template>

    <template v-slot:item.interestAmount="{ item }">
      <span class="text-no-wrap">
        € {{ $options.filters.moneyFormatter(item.interestAmount) }}
      </span>
    </template>
  </data-table>
</template>

<script>
export default {
  props: {
    movements: {
      required: true,
      type: Object
    }
  }
};
</script>
