<template>
  <v-layout>
    <v-flex>
      <page-header page-name="calculator"></page-header>

      <page-toolbar :actions-list="actionsList"></page-toolbar>

      <v-form @submit.prevent="onCalcUpdate">
        <v-card class="mb-10" flat>
          <v-card-text>
            <dynamic-fieldset :schema="formSchema" v-model="formData"></dynamic-fieldset>
          </v-card-text>
          <v-card-actions class="pa-3 flex-wrap">
            <v-btn type="submit" color="primary"
                   rounded
                   class="mb-2 mb-sm-0"
                   :block="$vuetify.breakpoint.xsOnly">Applica
            </v-btn>
            <!--            <v-btn type="button" class="ml-0 mb-2 mb-sm-0 ml-sm-3"
                               rounded @click="onAddMovement"
                               outlined
                               :block="$vuetify.breakpoint.xsOnly"
                               color="grey">Aggiungi movimento
                        </v-btn>-->

            <v-spacer></v-spacer>

            <v-btn type="button" rounded @click="onNewQuotation" outlined color="grey"
                   :block="$vuetify.breakpoint.xsOnly">Nuovo preventivo
            </v-btn>
          </v-card-actions>
        </v-card>
        <!--
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
                        <data-table id="quotationMovementsTable"
                                    tableKey="calculatorMovements"
                                    schema="calculatorMovementsSchema"
                                    :items="movementsList"
                                    :items-per-page="25">
                          <template v-slot:item.date="{item}">
                            <date-picker
                              :hide-details="true"
                              :value="item.date" dense
                              @change="item.date = $event"
                              prepend-icon=""
                              :min="$moment(formData.initialDate).toISOString()"
                              :max="$moment(formData.finalDate).toISOString()"
                            >
                            </date-picker>
                          </template>
                          <template v-slot:item.type="{item}">
                            <v-select v-model="item.type"
                                      dense hide-details
                                      :items="movementsSelectItems"></v-select>
                          </template>
                          <template v-slot:item.amount="{item}">
                            <money-input v-model="item.amount"
                                         dense hide-details
                            ></money-input>
                          </template>
                          <template v-slot:item.actions="{item}">
                            <v-btn icon @click="onRemoveMovement(item)" small>
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </template>
                        </data-table>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-card-text>


                </v-card>-->
      </v-form>

      <data-table
        id="quotationTable"
        tableKey="calculator"
        schema="calculatorSchema"
        :items="tableData"
        :items-per-page="25">
        <template v-slot:item.date="{item, value}">
          {{ $moment(value).format("MMMM YYYY") }}
        </template>
        <template v-slot:item.depositAdded="{item, value}">
          <calculator-movement-dialog :cell-data="item" field="depositAdded"
                                      :value="value"
                                      v-if="item.interestRecapitalized || value"
                                      color="green--text"
                                      @saved="onCalcUpdate"
                                      @input="onEditSave(item, $event, 'depositAdded')"></calculator-movement-dialog>
          <span v-else></span>
        </template>
        <template v-slot:item.depositCurrent="{item, value}">
          <strong>{{ value | moneyFormatter(false, true) }}</strong>
        </template>
        <template v-slot:item.depositCollected="{item, value}">
          <calculator-movement-dialog :cell-data="item" field="depositCollected"
                                      v-if="item.interestRecapitalized"
                                      :value="value"
                                      color="red--text"
                                      :max-value="item.depositCurrent"
                                      @saved="onCalcUpdate"
                                      @input="onEditSave(item, $event, 'depositCollected')"></calculator-movement-dialog>
          <span v-else></span>
        </template>
        <template v-slot:item.interestAmount="{item, value}">
          {{ value | moneyFormatter(false, true) }}
        </template>
        <template v-slot:item.interestRecapitalized="{item, value}">
          <span class="lime--text text--darken-2">{{ value | moneyFormatter(false, true) }}</span>
        </template>
        <template v-slot:item.interestCollected="{item, value}">
          <calculator-movement-dialog :cell-data="item" field="interestCollected"
                                      v-if="item.interestRecapitalized"
                                      :value="value"
                                      color="red--text"
                                      :max-value="item.interestAmount"
                                      @saved="onCalcUpdate"
                                      @input="onEditSave(item, $event, 'interestCollected')"></calculator-movement-dialog>
          <span v-else></span>
        </template>
        <template v-slot:item.brite="{item, value}">
          <span class="yellow--text text--darken-3">{{ value | moneyFormatter(true, true) }}</span>
        </template>
        <template v-slot:item.britePartial="{item, value, header}">

          <span :class="{
            'yellow--text text--darken-3': ![5, 11].includes($moment(item.date).month()),
            'font-weight-bold yellow darken-3 rounded px-1 py-1': [5, 11].includes($moment(item.date).month())}">
            {{ value | moneyFormatter(true, true) }}
          </span>
        </template>
      </data-table>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "@vue/composition-api";
import {ActionItem} from "~/@types/ActionItem";
import {Movement, QuotationEntry} from "~/@types/Calculator";
import {Moment} from "moment"
import {kebabCase} from "lodash"

import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import ExcelJS from "exceljs"
import JsDownload from "js-file-download"

import pageBasic from "~/functions/pageBasic";
import calculatorFormSchema from "~/config/forms/calculatorSchema";
import {Options} from "@nuxt/typescript-build";
import {AclPermissions} from "~/functions/acl/enums/acl.permissions";
import PageHeader from "~/components/blocks/PageHeader.vue";
import PageToolbar from "~/components/blocks/PageToolbar.vue";
import DatePicker from "~/components/forms/inputs/DatePicker.vue";
import {Vue, Component} from "vue-property-decorator"
import DataTable from "~/components/table/DataTable.vue";
import CalculatorMovementDialog from "~/components/dialogs/EditDialogs/CalculatorMovementDialog.vue";
import {CalculatorPermissions} from "~/functions/acl/enums/calculator.permissions";

@Component({
  components: {CalculatorMovementDialog, DataTable, DatePicker, PageToolbar, PageHeader},
  meta: {
    permissions: [CalculatorPermissions.CALCULATOR_READ]
  }
})
export default class Calculator extends Vue {
  public formDataDefault = {
    initialDeposit: 3000,
    interestPercentage: 4,
    initialDate: this.$moment(),
    finalDate: this.$moment().add(2, "years")
  }

  public currentTab = 0
  public formData = {
    ...this.formDataDefault
  }
  public tableData: QuotationEntry[] = []
  public movementsList: Movement[] = []

  get actionsList() {
    return [
      {
        text: "download-pdf",
        tooltip: "download-pdf-tooltip",
        position: "right",
        icon: "mdi-file-pdf",
        disabled: this.tableData.length === 0,
        click: this.downloadPDF
      }, {
        text: "download-xls",
        tooltip: "download-xls-tooltip",
        position: "right",
        icon: "mdi-file-excel",
        disabled: this.tableData.length === 0,
        click: this.downloadXLS
      }
    ]
  }

  get formSchema() {
    return calculatorFormSchema({formData: this.formData})
  }


  onCalcUpdate() {
    const months = this.$moment(this.formData.finalDate).diff(this.$moment(this.formData.initialDate), "months", true)
    const newData: QuotationEntry[] = []

    for (let i = 0; i < months; i++) {
      const rowData: QuotationEntry = this.tableData[i] || {}

      const
        entry: QuotationEntry = {
          date: this.$moment(this.formData.initialDate).add(i, "months"),
          depositAdded: rowData.depositAdded || 0,
          depositCurrent: 0,
          depositCollected: rowData.depositCollected || 0,
          interestAmount: 0,
          interestRecapitalized: 0,
          interestCollected: rowData.interestCollected || 0,
          brite: 0,
          britePartial: 0
        }

      if (i === 0) {
        entry.depositAdded = this.formData.initialDeposit
      } else {
        const lastMonth = newData[i - 1]

        entry.interestRecapitalized = (+lastMonth.interestAmount) - (+lastMonth.interestCollected)
        entry.depositCurrent = ((+lastMonth.depositAdded) + (+lastMonth.depositCurrent) + (+entry.interestRecapitalized)) - (+lastMonth.depositCollected)
        entry.interestAmount = +entry.depositCurrent * (+this.formData.interestPercentage) / 100
        entry.brite = Math.round(entry.interestAmount)
        entry.britePartial = lastMonth.britePartial + entry.brite
      }

      newData.push(entry)
    }

    this.tableData = newData
  }

  onNewQuotation() {
    this.formData = {...this.formDataDefault}
    this.tableData = []
    this.movementsList = []
    this.currentTab = 0
  }

  onEditSave(item: any, value: number, field: string) {
    item[field] = value
  }

  downloadPDF() {
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

  async downloadXLS() {
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
      columns: Object.keys(this.tableData[0]).reduce<any[]>((acc, curr: string) => {
        acc.push({
          name: this.$i18n.t("tables.calc-" + kebabCase(curr))
        })
        return acc
      }, []),
      rows: this.tableData.reduce<any[]>((acc, curr: QuotationEntry) => {
        const data = Object.values(curr).map((val: number | Moment) => {
          if (this.$moment.isMoment(val)) {
            return val.format("MMMM YYYY")
          }

          return val.toFixed(2)
        })

        acc.push(data)

        return acc
      }, []),
    });

    try {
      const buffer = await workbook.xlsx.writeBuffer();

      JsDownload(buffer, "ggc_preventivo_investimento.xlsx")
    } catch (er) {
      console.error(er)
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
