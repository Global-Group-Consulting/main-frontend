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

      <v-col :cols="colsWidth" v-for="(card, i) in cardsList" :key="card.id + '_' + i" class="p-relative">
        <v-img :src="'/cards/' + card.img" class="flex-grow-0" :aspect-ratio="16/9" contain max-width="300"></v-img>
        <v-btn icon color="red" outlined absolute top style="right: 50%; transform: translateX(50%)"
               @click="removeCard(i)">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-select :items="availableCardsSelect" :value="card.id" hide-details
                  label="Tipologia carta"
                  @change="onSelectChange(i, $event)"
                  v-if="availableCardsSelect.length > 1"></v-select>

        <!--        <v-text-field type="number" step="50" :error-messages="toMuchValue || toLowValue"
                              prefix="€" :max="availableAmount" min="0" label="Importo"
                              v-model.number="card.amount">
                </v-text-field>-->
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
            <v-btn icon color="success" outlined>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
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
  import { computed, defineComponent, reactive, Ref, ref, SetupContext, watch } from '@vue/composition-api';
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

      const availableCardsSelect = availableCards.map(el => ({ text: el.title, value: el.id }))
      const colsWidth = computed(() => {
        const total = cardsList.value.length + 1;
        return total > 3 ? 4 : 12 / total
      })
      const usedAmount = computed(() => cardsList.value.reduce((acc, curr) => acc + curr.amount, 0))
      const remainingAmount = computed(() => props.availableAmount - usedAmount.value)
      const toMuchValue = computed(() => usedAmount.value > props.availableAmount
        ? root.$t("dialogs.requests.withdrawal-too-much", { maxAmount: moneyFormatter(props.availableAmount) }) : '')
      const toLowValue = computed(() => usedAmount.value !== props.availableAmount
        ? root.$t("dialogs.requests.withdrawal-too-low", { maxAmount: moneyFormatter(props.availableAmount) }) : '')

      function stepperRules (card: WithdrawalCard) {
        const multipleOf = (value: number) => {
          if (card.stepper) {
            const result = value % card.stepper === 0

            if (!result) {
              return "L'importo deve essere multiplo di " + card.stepper
            }
          }
        }
        const maxValue = () => !toMuchValue.value || toMuchValue.value;

        return [maxValue]
      }

      function addCard () {
        cardsList.value.push({ ...availableCards[0] })
      }

      function removeCard (index: number) {
        cardsList.value.splice(index, 1)
      }

      function onSelectChange (index: number, choise: string) {
        cardsList.value[index] = availableCards.find(el => el.id === choise) as WithdrawalCard
      }

      watch(remainingAmount, (value) => {
        emit("input", cardsList.value.reduce<any>((acc, curr) => {
          acc.push({
            amount: curr.amount,
            id: curr.id
          })

          return acc
        }, []))
      })

      watch(toMuchValue, (value) => {
        emit("error", value)
      })

      return {
        colsWidth,
        minAmount,
        cardsList,
        availableCardsSelect,
        toMuchValue, toLowValue,
        remainingAmount,
        usedAmount,
        moneyFormatter,
        addCard,
        removeCard,
        onSelectChange,
        stepperRules
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
