<template>
  <div>
    <div class="text-no-wrap" v-for="(card, i) in computedValue" :key="i">
      {{ card.title }} -> € {{ card.amount|moneyFormatter }}
    </div>
  </div>
</template>


<script lang="ts">
  import { Component, Prop } from "vue-property-decorator";
  import BasicCell from "~/components/table/CellsTemplates/BasicCell.vue";
  import { CardsList, WithdrawalCard, WithdrawalCardStored } from '~/config/cardsList';

  @Component
  export default class CellReportCards extends BasicCell {
    @Prop({ type: Object, required: true })
    public item!: { movements: { cards: WithdrawalCardStored[], amountChange: number }[] }

    @Prop({ type: Number })
    public value!: number

    get computedValue (): Partial<WithdrawalCard>[] {
      let cards: Partial<WithdrawalCard>[] = []
      let movementsSum = 0;
      let cardsSum = 0;

      this.item?.movements.forEach(movement => {
        movementsSum += movement.amountChange

        if (movement.cards) {
          cards = movement.cards.map(rawCard => {
            const foundCard = CardsList.find(el => el.id === rawCard.id);
            const cardToUse = { ...(foundCard ?? {}) }

            cardToUse.amount = rawCard.amount
            cardsSum += rawCard.amount

            return cardToUse
          })
        }
      })

      if (movementsSum !== cardsSum) {
        cards.push({
          title: "Card non specificata",
          amount: movementsSum - cardsSum
        })
      }

      return cards
    }
  }
</script>
