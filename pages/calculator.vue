<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <!--      <page-toolbar :actions-list="actionsList"></page-toolbar>-->

      <v-form @submit.prevent="onCalcUpdate">
        <v-tabs v-model="currentTab">
          <v-tab>Impostazioni preventivo</v-tab>
          <v-tab>Elenco movimenti</v-tab>
        </v-tabs>

        <v-card class="mb-10" flat>
          <v-card-text>
            <v-tabs-items :value="currentTab">
              <v-tab-item>
                <dynamic-fieldset :schema="formSchema" v-model="formData"></dynamic-fieldset>

              </v-tab-item>

              <v-tab-item>
                <v-simple-table class="table-no-hover">
                  <colgroup>
                    <col style="width: 33%">
                    <col style="width: 33%">
                    <col style="width: 33%">
                    <col style="width: 1%">
                  </colgroup>
                  <thead>
                  <tr>
                    <th>Data</th>
                    <th>Tipo movimento</th>
                    <th>Valore</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>

                  <tr v-for="movement of movementsList">
                    <td>
                      <date-picker
                        :value="movement.date" dense hide-details
                        @change="movement.date = $event"
                        prepend-icon=""
                        :min="$moment(formData.initialDate).toISOString()"
                        :max="$moment(formData.finalDate).toISOString()"
                      ></date-picker>
                    </td>
                    <td>
                      <v-select v-model="movement.type"
                                dense hide-details
                                :items="movementsSelectItems"></v-select>
                    </td>
                    <td>
                      <money-input v-model="movement.amount"
                                   dense hide-details
                      ></money-input>
                    </td>
                    <td>
                      <v-btn icon @click="onRemoveMovement(movement)" small>
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </td>
                  </tr>

                  <tr v-if="!movementsList.length">
                    <td colspan="99" class="text-center">Nessun movimento disponibile...</td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>

          <v-card-actions class="pa-3">
            <v-btn type="submit" color="primary" rounded>Applica</v-btn>
            <v-btn type="button" class="ml-3" rounded @click="onAddMovement" outlined
                   color="grey">Aggiungi movimento
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn type="button" rounded @click="onNewQuotation" outlined color="grey">Nuovo preventivo</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>

      <data-table
        tableKey="calculator"
        schema="calculatorSchema"
        :items="tableData"
        :items-per-page="25">
        <template v-slot:item.date="{item, value}">{{ $moment(value).format("MMMM YYYY") }}</template>
        <template v-slot:item.depositAdded="{item, value}"><span class="green--text">{{ value | moneyFormatter }}</span>
        </template>
        <template v-slot:item.depositCurrent="{item, value}">
          <strong>
            {{ value | moneyFormatter }}
          </strong>
        </template>
        <template v-slot:item.depositCollected="{item, value}"><span class="red--text">{{
            value | moneyFormatter
          }}</span></template>
        <template v-slot:item.interestAmount="{item, value}">{{ value | moneyFormatter }}</template>
        <template v-slot:item.interestRecapitalized="{item, value}"><span
          class="lime--text text--darken-2">{{ value | moneyFormatter }}</span></template>
        <template v-slot:item.interestCollected="{item, value}"><span class="red--text">{{
            value | moneyFormatter
          }}</span></template>
        <template v-slot:item.brite="{item, value}"><span class="yellow--text text--darken-2">{{
            value | moneyFormatter(true)
          }}</span></template>
      </data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import {computed, reactive, ref} from "@vue/composition-api";

import PageHeader from "@/components/blocks/PageHeader";
import PageToolbar from "@/components/blocks/PageToolbar";

import pageBasic from "~/functions/pageBasic";
import calculatorFormSchema from "~/config/forms/calculatorSchema";

export default {
  name: 'calculator',
  components: {PageHeader, PageToolbar},
  setup(props, {root}) {
    const {$moment, $enums, $i18n} = root

    const currentTab = ref(0)

    const formDataDefault = {
      initialDeposit: 3000,
      interestPercentage: 4,
      initialDate: root.$moment(),
      finalDate: root.$moment().add(2, "years")
    }

    const formData = ref({
      ...formDataDefault
    })
    const tableData = ref([])
    const movementsList = ref([])
    const actionsList = [
      {
        text: "new-quotation",
        tooltip: "new-quotation-tooltip"
      }
    ]
    const formSchema = computed(calculatorFormSchema)

    const movementsSelectItems = computed(() => {
      return $enums.MovementTypes.list.reduce(
        (acc, curr) => {
          if (!acc) {
            acc = []
          }

          if ([2, 4, 5].includes(curr.value)) {
            acc.push({
              value: curr.value,
              text: $i18n.t("enums.MovementTypes." + curr.text)
            })
          }

          return acc;
        }, [])
    })

    function onCalcUpdate() {
      const months = $moment(formData.value.finalDate).diff($moment(formData.value.initialDate), "months", true)
      /**
       * @type {{
           date: string
           depositAdded: number
           depositCurrent: number
           depositCollected: number
           interestAmount: number
           interestRecapitalized: number
           interestCollected: number
       * }[]}
       */
      const newData = []

      for (let i = 0; i < months; i++) {
        const entry = {
          date: $moment(formData.value.initialDate).add(i, "months"),
          depositAdded: "",
          depositCurrent: "",
          depositCollected: "",
          interestAmount: "",
          interestRecapitalized: "",
          interestCollected: "",
          brite: ""
        }
        const currMonth = entry.date.month()

        if (i === 0) {
          entry.depositAdded = formData.value.initialDeposit
        } else {
          const lastMonth = newData[i - 1]

          entry.interestRecapitalized = (+lastMonth.interestAmount) - (+lastMonth.interestCollected)
          entry.depositCurrent = ((+lastMonth.depositAdded) + (+lastMonth.depositCurrent) + (+entry.interestRecapitalized)) - (+lastMonth.depositCollected)
          entry.interestAmount = +entry.depositCurrent * (+formData.value.interestPercentage) / 100
          entry.brite = entry.interestAmount

          for (const movement of movementsList.value) {
            if (!movement.date || !$moment(movement.date).isSame(entry.date, "month")) {
              continue
            }

            if (movement.type === $enums.MovementTypes.DEPOSIT_ADDED) {
              entry.depositAdded = movement.amount
            }
            if (movement.type === $enums.MovementTypes.DEPOSIT_COLLECTED) {
              entry.depositCollected = movement.amount
            }
            if (movement.type === $enums.MovementTypes.INTEREST_COLLECTED) {
              entry.interestCollected = movement.amount
            }
          }
        }

        newData.push(entry)
      }

      tableData.value = newData
    }

    function onNewQuotation() {
      formData.value = {...formDataDefault}
      tableData.value = []
      movementsList.value = []
      currentTab.value = 0
    }

    function onAddMovement() {
      currentTab.value = 1

      movementsList.value.push({
        id: new Date().getTime(),
        date: "",
        type: "",
        amount: 0
      })
    }

    function onRemoveMovement(movement) {
      const index = movementsList.value.findIndex(el => el.id === movement.id)

      movementsList.value.splice(index, 1)
    }

    return {
      ...pageBasic(root, "calculator"),
      currentTab,
      tableData,
      movementsList,
      actionsList,
      formSchema,
      formData,
      movementsSelectItems,
      onCalcUpdate,
      onNewQuotation,
      onAddMovement,
      onRemoveMovement
    }
  }
}
</script>

<style lang="scss">
.table-no-hover {
  tbody > tr {
    &:hover {
      background: none !important;
    }
  }
}
</style>
