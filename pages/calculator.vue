<template>
  <v-layout>
    <v-flex>
      <page-header
        :title="title"
        :subtitle="subtitle"
        :icon="icon"
      ></page-header>

      <page-toolbar :actions-list="actionsList"></page-toolbar>

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
        id="quotationTable"
        tableKey="calculator"
        schema="calculatorSchema"
        :items="tableData"
        :items-per-page="25">
        <template v-slot:item.date="{item, value}">{{ $moment(value).format("MMMM YYYY") }}</template>
        <template v-slot:item.depositAdded="{item, value}"><span
          class="green--text">{{ value | moneyFormatter(false, true) }}</span>
        </template>
        <template v-slot:item.depositCurrent="{item, value}">
          <strong>{{ value | moneyFormatter(false, true) }}</strong>
        </template>
        <template v-slot:item.depositCollected="{item, value}"><span class="red--text">
          {{ value | moneyFormatter(false, true) }}</span></template>
        <template v-slot:item.interestAmount="{item, value}">{{ value | moneyFormatter(false, true) }}</template>
        <template v-slot:item.interestRecapitalized="{item, value}"><span
          class="lime--text text--darken-2">{{ value | moneyFormatter(false, true) }}</span></template>
        <template v-slot:item.interestCollected="{item, value}"><span class="red--text">{{
            value | moneyFormatter(false, true)
          }}</span></template>
        <template v-slot:item.brite="{item, value}"><span class="yellow--text text--darken-2">{{
            value | moneyFormatter(true, true)
          }}</span></template>
      </data-table>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref} from "@vue/composition-api";

import PageHeader from "@/components/blocks/PageHeader";
import PageToolbar from "@/components/blocks/PageToolbar";

import pageBasic from "~/functions/pageBasic";
import calculatorFormSchema from "~/config/forms/calculatorSchema";


import {ActionItem} from "~/@types/ActionItem";
import {Movement, QuotationEntry} from "~/@types/Calculator";

import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import ExcelJS from "exceljs"

import JsDownload from "js-file-download"
import {kebabCase} from "lodash"

export default defineComponent({
    name: 'calculator',
    components: {PageHeader, PageToolbar},
    setup(props, {root}) {
      const {$moment, $enums, $i18n} = root
      const currentTab = ref(0)
      const formDataDefault = {
        initialDeposit: 3000,
        interestPercentage: 4,
        initialDate: $moment(),
        finalDate: $moment().add(2, "years")
      }
      const formData = ref({
        ...formDataDefault
      })
      const tableData = ref<QuotationEntry[]>([])
      const movementsList = ref<Movement[]>([])
      const actionsList: ActionItem[] = [
        {
          text: "download-pdf",
          tooltip: "download-pdf-tooltip",
          position: "right",
          icon: "mdi-file-pdf",
          click: downloadPDF
        }, {
          text: "download-xls",
          tooltip: "download-xls-tooltip",
          position: "right",
          icon: "mdi-file-excel",
          click: downloadXLS
        }
      ]
      const formSchema = computed(calculatorFormSchema)

      const movementsSelectItems = computed(() => {
        return $enums.MovementTypes.list.reduce(
          (acc: any[], curr: { value: number, text: string }) => {
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
        const newData: QuotationEntry[] = []

        for (let i = 0; i < months; i++) {
          const entry: QuotationEntry = {
            date: $moment(formData.value.initialDate).add(i, "months"),
            depositAdded: 0,
            depositCurrent: 0,
            depositCollected: 0,
            interestAmount: 0,
            interestRecapitalized: 0,
            interestCollected: 0,
            brite: 0
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
          date: $moment(),
          type: -1,
          amount: 0
        })
      }

      function onRemoveMovement(movement: Movement) {
        const index = movementsList.value.findIndex(el => el.id === movement.id)

        movementsList.value.splice(index, 1)
      }

      function downloadPDF() {
        const doc = new JsPDF()

        autoTable(doc, {
          startY: 20,
          html: '#quotationTable table',
          headStyles: {
            valign: "bottom",
            halign: "right"
          },
          bodyStyles: {
            halign: "right",
            valign: "top"
          },
          columnStyles: {
            2: {
              fontStyle: "bold",
              valign: "top"
            }
          }
        })

        doc.text("GGC - Preventivo investimento", 14, 14)
        doc.save('ggc_preventivo_investimento.pdf')
      }

      async function downloadXLS() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Preventivo');

        worksheet.addTable({
          name: 'MyTable',
          ref: 'A1',
          headerRow: true,
          totalsRow: false,
          style: {
            // theme: 'TableStyleDark3',
            showRowStripes: true,
          },
          columns: Object.keys(tableData.value[0]).reduce((acc, curr: string) => {
            acc.push({
              name: $i18n.t("tables.calc-" + kebabCase(curr))
            })
            return acc
          }, []),
          rows: tableData.value.reduce((acc, curr: QuotationEntry) => {
            acc.push(Object.values(curr).map((val: number | $moment) => {
              if (val instanceof $moment) {
                return val.format("MMMM YYYY")
              }

              if (val instanceof Number) {
                return val.toFixed(2)
              }

              return val
            }))

            return acc
          }, []),
        });

        try {
          const buffer = await workbook.xlsx.writeBuffer();

          JsDownload(buffer, "test.xlsx")
        } catch (er) {
          console.error(er)
        }
      }

      return {
        ...pageBasic({$i18n}, "calculator"),
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
)
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
