<template>
  <div>
    <p>{{ $t("dialogs.requests.withdrawal-cards-split", { minAmount: moneyFormatter(minAmount) }) }}</p>

    <v-row class="text-center justify-center">
      <!--      <v-col :cols="colsWidth" class="d-flex flex-column align-center"
                   v-for="card in cardsList" :key="card.validationId">
              <v-img :src="'/cards/' + card.img" class="flex-grow-0" max-width="300px"></v-img>
              <p class="flex-fill">
                <strong>{{ card.title }}
                  <v-btn icon color="primary" x-small
                         :href="card.href"
                         tabindex="-1"
                         target="_blank">
                    <v-icon>mdi-help-circle-outline</v-icon>
                  </v-btn>
                </strong><br>
                <span v-if="$vuetify.breakpoint.mdAndUp">{{ card.text }}</span>
              </p>

              <div class="px-3">
                <money-input v-model="card.amount"
                             :error-messages="toMuchValue || toLowValue"
                             v-if="card.stepper === undefined"></money-input>

                <v-slider v-else

                          hint="Im a hint"
                          :max="availableAmount"
                          min="0"
                ></v-slider>
              </div>
            </v-col>-->

      <v-col :cols="colsWidth"
             v-for="(card, i) in cardsList" :key="card.id + '_' + i"
             class="p-relative">
        <v-img :src="'/cards/' + card.img" class="flex-grow-0"
               :aspect-ratio="16/9"
               contain max-width="300"></v-img>
        <v-btn icon color="red" outlined absolute top style="right: 50%; transform: translateX(50%)"
               @click="removeCard(i)">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-select :items="availableCardsSelect" :value="card.id" hide-details
                  label="Tipologia carta"
                  @change="onSelectChange(i, $event)"
                  v-if="availableCardsSelect.length > 1"></v-select>

        <v-slider
          v-model="card.amount"
          :step="card.stepper"
          :min="0"
          :max="availableAmount"
          thumb-label="always"
          dense
          :error-messages="toMuchValue || toLowValue"
        >
          <template v-slot:prepend="">
            <v-btn small icon
                   @click="card.amount >= card.stepper ?  (card.amount -= card.stepper) : null">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </template>
          <template v-slot:append="">
            <v-btn small icon
                   @click="card.amount <= (availableAmount-card.stepper) ?  (card.amount += card.stepper) : null">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
        </v-slider>

      </v-col>

      <v-col :cols="colsWidth">
        <v-responsive class="mx-auto" :aspect-ratio="16/9" max-width="300">
          <v-sheet
            color="light"
            height="100%"
            outlined
            rounded
            width="100%"
            class="d-flex justify-center align-center"
            @click="addCard"
          >
            <v-btn icon color="success" outlined v-if="canAddMore">
              <v-icon>mdi-plus</v-icon>
            </v-btn>

            <span v-else>Numero massimo di carte raggiunto.</span>

          </v-sheet>
        </v-responsive>
      </v-col>
    </v-row>

    <p>
      {{
        $t("dialogs.requests.withdrawal-cards-remaining", {
          remainingAmount: remainingAmount >= 0 ? moneyFormatter(remainingAmount) : 0,
          remainingAmountBrite: remainingAmount >= 0 ? remainingAmount * 2 : 0,
          requestedAmount: moneyFormatter(availableAmount)
        })
      }}
    </p>
  </div>
</template>

<script lang="ts">
  import {
    computed,
    ComputedRef,
    defineComponent,
    reactive,
    Ref,
    ref,
    SetupContext,
    watch
  } from '@vue/composition-api';
  import { moneyFormatter } from '~/plugins/filters/moneyFormatter';
  import { CardsList, WithdrawalCard } from '~/config/cardsList';

  export default defineComponent({
    name: "WithdrawalCards",
    props: {
      availableAmount: {
        default: 0,
        type: Number
      },
      value: Object,
    },
    setup (props: { availableAmount: number; }, { root, emit }: SetupContext) {
      const minAmount = ref(root.$store.getters["settings/globalSettings"].cardsRequestMinAmount);
      const availableCards = CardsList.filter(card => card.active);
      const cardsList: Ref<WithdrawalCard[]> = ref([])

      const cardsTypeCounter: ComputedRef<Record<string, number>> = computed(() => cardsList.value.reduce<Record<string, number>>((acc, curr) => {
          if (!acc[curr.id]) {
            acc[curr.id] = 0
          }

          acc[curr.id]++

          return acc
        }, {})
      );
      const availableCardsSelect = computed(() => availableCards.map(el => ({
            text: el.title,
            value: el.id,
            disabled: cardsTypeCounter.value[el.id] >= el.maxPerType
          })
        )
      )
      const colsWidth = computed(() => {
        const total = cardsList.value.length + 1;
        return total > 3 ? 4 : 12 / total
      })
      const usedAmount: ComputedRef<number> = computed(() => cardsList.value.reduce((acc, curr) => acc + curr.amount, 0))
      const remainingAmount: ComputedRef<number> = computed(() => props.availableAmount - usedAmount.value)

      /**
       * Indicate if the sum of all cards is higher than the available amount
       */
      const toMuchValue: ComputedRef<string> = computed(() => usedAmount.value > props.availableAmount
        ? root.$t("dialogs.requests.withdrawal-too-much", { maxAmount: moneyFormatter(props.availableAmount) }) as string : '')

      /**
       * Indicate if the sum of all cards is lower than the available amount
       */
      const toLowValue: ComputedRef<string> = computed(() => usedAmount.value !== props.availableAmount
        ? root.$t("dialogs.requests.withdrawal-too-low", { maxAmount: moneyFormatter(props.availableAmount) }) as string : '')

      /**
       * Check if can be added new cards, based on maxPerType of each card
       */
      const canAddMore: ComputedRef<boolean> = computed(() => {
        // Start by getting the difference between the available types and the used ones
        let remainingCardTypes = availableCards.length - Object.keys(cardsTypeCounter.value).length

        if (cardsList.value.length === 0) {
          return true
        }

        for (const availableCardsElement of availableCards) {
          // se il numero di carte per quel tipo è inferiore al massimo,
          // indica che ne posso aggiungere altre
          if (cardsTypeCounter.value[availableCardsElement.id] < availableCardsElement.maxPerType) {
            remainingCardTypes++
          }
        }

        return !!remainingCardTypes
      })

      function addCard () {
        if (!canAddMore.value) {
          return
        }

        // Get new first valid card that can be added based on its "disabled" prop.
        const newIndex = availableCardsSelect.value.findIndex(el => !el.disabled)

        cardsList.value.push({ ...availableCards[newIndex] })
      }

      function removeCard (index: number) {
        cardsList.value.splice(index, 1)
      }

      function onSelectChange (index: number, choice: string) {
        const newCard = availableCards.find(el => el.id === choice) as WithdrawalCard

        Object.assign(cardsList.value[index], newCard)
      }

      // On remainingAmount input, emit INPUT event
      watch(remainingAmount, (value) => {
        emit("input", cardsList.value.reduce<any>((acc, curr) => {
          if (curr.amount) {
            acc.push({
              amount: curr.amount,
              id: curr.id
            })
          }

          return acc
        }, []))
      })

      // On toMuchValue, emit ERROR event
      watch(toMuchValue, (value) => {
        emit("error", value)
      })

      return {
        colsWidth, minAmount, cardsList,
        availableCardsSelect,
        toMuchValue, toLowValue,
        remainingAmount, usedAmount,
        canAddMore, cardsTypeCounter,
        moneyFormatter, addCard, removeCard, onSelectChange,
      }
    }
  });
</script>


<style lang="scss" scoped>
  .v-input__slider::v-deep {
    .v-messages {
      margin-left: -34px;
      margin-right: -34px;
    }

    .v-input__append-outer {
      margin-top: 2px;
    }
  }
</style>
