<template>
  <div class="mx-n4 mt-n4 border-bottom">
    <page-toolbar :actions-list="actionsList || _actionsList"
                  :filters-schema="filtersSchema"
                  hide-filters-button
                  always-visible
                  border-bottom
                  @expandedChanged="filtersExpanded = $event"
                  :use-store="false"
                  :styles="{ 'elevation':0, rounded: true, color: 'transparent'}">

      <template v-slot:filters>
        <dynamic-filters :schema="filtersSchema"
                         :expand="filtersExpanded"
                         :use-store="false"
                         :value="value"
                         :inputs-data="inputsData"
                         :filters-key="filtersKey"
                         ref="filtersComponent"
                         @input="$emit('input', $event)"
                         @applyFilters="$emit('applyFilters', $event)"
                         @resetFilters="$emit('resetFilters', $event)"
                         :loading="$store.getters['reports/dataLoading']"
        ></dynamic-filters>
      </template>
    </page-toolbar>

    <data-table :schema="tableSchema"
                :table-key="tableKey"
                :items="tableItems"
                :items-per-page="-1"
                ref="dataTable"
                :loading="$store.getters['reports/dataLoading']"></data-table>

  </div>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

import DataTable from "~/components/table/DataTable.vue";
import PageToolbar from "~/components/blocks/PageToolbar.vue";
import DynamicFilters from "~/components/filters/DynamicFilters.vue";
import {User} from "~/@types/UserFormData";
import {ReportsPermissions} from "~/functions/acl/enums/reports.permissions";
import ExcelJS, {CellSharedFormulaValue} from "exceljs";
import {kebabCase, snakeCase} from "lodash";
import {QuotationEntry} from "~/@types/Calculator";
import JsDownload from "js-file-download";

@Component({
  components: {PageToolbar, DynamicFilters, DataTable}
})
export default class BasicReport extends Vue {
  @Prop({type: Array})
  actionsList!: any[]

  @Prop({type: String, required: true})
  filtersSchema!: string

  @Prop({type: Object, required: true})
  value!: any

  @Prop({type: String, required: true})
  tableSchema!: string

  @Prop({type: String, required: true})
  tableKey!: string

  @Prop({type: Array, required: true})
  tableItems!: any[]

  @Prop({type: String})
  xlsName!: string

  @Prop({type: String})
  filtersKey!: string

  $refs!: {
    filtersComponent: DynamicFilters,
    dataTable: Vue & typeof DataTable
  }

  filtersExpanded = true

  usersList: User[] = []
  agentsList: User[] = []

  get inputsData() {
    return {
      usersList: this.usersList,
      agentsList: this.agentsList
    }
  }

  get _actionsList() {
    return [
      {
        text: "download-xls",
        tooltip: "download-xls-tooltip",
        position: "center",
        icon: "mdi-file-excel-outline",
        disabled: this.tableItems.length === 0,
        click: this.onDownloadXLS
      }
    ]
  }

  async onDownloadXLS() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(this.xlsName ? this.xlsName : 'Report');

    const cols = this.$refs.dataTable.$el.querySelectorAll("thead th")
    const rows = this.$refs.dataTable.$el.querySelectorAll("tbody tr")
    const tableColumns: Partial<ExcelJS.Column>[] = []
    const tableRows: any[] = []
    let totalSum = 0


    cols.forEach(col => {
      tableColumns.push({
        header: col.textContent as string,
        width: col.clientWidth * 0.16
      })
    })
    rows.forEach(row => {
      const tableRow: string[] = []

      Array.from(row.children).forEach((cell: any, i) => {
        let value = cell.textContent.replace(/\n/g, "").trim()

        if (i === 1) {
          value = +value.replace(/[ €]/g, "")
            .replace(/\./g, "")
            .replace(/[,]/g, ".")

          totalSum += value
        }

        tableRow.push(value)
      })

      tableRows.push(tableRow)
    })

    worksheet.columns = tableColumns as ExcelJS.Column[]
    worksheet.addRows(tableRows)

    // Header style
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FF4F81BD'}
    }
    worksheet.getRow(1).font = {
      color: {argb: "FFFFFFFF"},
      bold: true,
      size: 14
    }

    // alternate rows color
    worksheet.getRows(2, worksheet.rowCount - 1).forEach((row, i) => {
      if (i % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'FFDCE6F1'}
        }
      }

      row.getCell(2).numFmt = '"€" #,##0.00';

      for (let j = 1; j < row.cellCount; j++) {
        row.getCell(j).alignment = {wrapText: true};
      }
    })

    worksheet.addRow(["Totale"])
    worksheet.getRow(worksheet.rowCount).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FF4F81BD'}
    }
    worksheet.getRow(worksheet.rowCount).font = {
      color: {argb: "FFFFFFFF"},
      bold: true,
      size: 14
    }
    worksheet.getRow(worksheet.rowCount).getCell(2).numFmt = '"€" #,##0.00';
    worksheet.getCell(worksheet.rowCount, 2).value = {
      formula: "SUM(B2:B" + (rows.length + 1) + ")",
      result: totalSum
    } as ExcelJS.CellSharedFormulaValue

    try {
      const buffer = await workbook.xlsx.writeBuffer();

      const dates = this.$refs.filtersComponent.activeFilters.dates
        .map((date: string) => this.$moment(date).format("DD_MM_YY"))

      JsDownload(buffer, `report${(this.xlsName ? "_" + snakeCase(this.xlsName) : '')}(${dates.join("-")}).xlsx`)
    } catch (er) {
      console.error(er)
    }
  }

  async mounted() {
    try {
      this.usersList = await this.$apiCalls.filters.fetchUsers()
      this.agentsList = await this.$apiCalls.filters.fetchAgents()
    } catch (er) {
      this.$alerts.error(er)
    }
  }
}
</script>
