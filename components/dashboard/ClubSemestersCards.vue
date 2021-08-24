<template>
  <DynamicTabs :tabs-list="tabsList"
               color="transparent"
               card-text-class="px-0 py-0"
               v-model="currentTab">
    <template v-slot="{item}">
      <v-row>
        <v-col v-for="card of getCardsList(item)" :key="card.title"
               md="4" cols="12" sm="6">
          <CardBlock :data="card" :extra-data="item">
            <template v-slot:subtitle>
              <div v-if="card.id === 'total'"
                   v-html="$t('pages.club.brite.tabs.usableFrom', {date: $moment(item.dates.to).add(1, 'day').format('Do MMMM YYYY')})"></div>

              <div v-if="card.id === 'totalAvailable'"
                   v-html="$t('pages.club.brite.tabs.expiresAt', {date: $moment(item.dates.to).add(1, 'day').add(1, 'year').format('Do MMMM YYYY')})"></div>
            </template>
          </CardBlock>
        </v-col>
      </v-row>
    </template>
  </DynamicTabs>
</template>

<script lang="ts">
import {Moment} from "moment";
import {Component, Vue} from "vue-property-decorator";
import DynamicTabs from "~/components/DynamicTabs.vue";
import CardBlock from "~/components/elements/CardBlock.vue";
import {DynamicTab} from "~/@types/components/DynamicTab";
import {CardBlockI} from "~/@types/components/CardBlock";
import {ClubDashboardSemester} from "~/plugins/apiCalls/ClubApi";

@Component({
  components: {CardBlock, DynamicTabs}
})
export default class ClubSemestersCards extends Vue {
  currentTab: number = 2
  blocksData: Record<string, any> = {}
  statistics: Record<string, ClubDashboardSemester> = {
    expiresAt: "",
    usableFrom: "",
    types: {},
    total: 0,
    totalUsed: 0,
    totalAvailable: 0
  }

  get tabsList(): DynamicTab[] {
    const toReturn: DynamicTab[] = []
    const currentDate: Moment = this.$moment()
    const currentStartYear: number = currentDate.year()

    for (let i = -2; i < 2; i++) {
      let date

      if (i < 0) {
        date = this.$moment().subtract(Math.abs(i) * 6, "months")
      } else {
        date = this.$moment().add(i * 6, "months")
      }

      const startMonth: number = date.month() < 6 ? 0 : 6
      const startYear: number = date.year()
      const semester = startMonth < 6 ? 1 : 2

      const tabData: DynamicTab = {
        id: startYear + "_" + semester,
        title: this.formatTabSemester(-(currentStartYear - startYear), semester),
        dates: this.getSemesterDates(-(currentStartYear - startYear), semester),
      }

      if (tabData.dates) {
        tabData.useFrom = this.$moment(tabData.dates.to).add(1, "day")
        tabData.expiresAt = this.$moment(tabData.useFrom).add(1, "year")
      }

      toReturn.push(tabData)
    }

    return toReturn
  }

  getCardValue(card: CardBlockI, tab: DynamicTab) {
    const toReturn = ["Br'"]
    const semesterId = tab.id

    let value = 0;

    if (this.statistics[semesterId]) {
      value = this.statistics[semesterId][card.id.toString()]
    }

    toReturn.push(this.$options?.filters?.moneyFormatter(value, true))

    return toReturn.join(" ")
  }

  getCardsList(tab: DynamicTab): CardBlockI[] {
    const toReturn: CardBlockI[] = [{
      id: "total",
      title: this.$t("pages.club.brite.tabs.briteTotal"),
      value: (card: any, tab: any) => this.getCardValue(card, tab),
      icon: "mdi-diamond",
      color: "#4152b7"
    }, {
      id: "totalUsed",
      title: this.$t("pages.club.brite.tabs.briteUsed"),
      value: (card: any, tab: any) => this.getCardValue(card, tab),
      icon: "mdi-diamond-outline",
      color: "#f9a825",
    }, {
      id: "totalAvailable",
      title: this.$t("pages.club.brite.tabs.briteAvailable"),
      value: (card: any, tab: any) => this.getCardValue(card, tab),
      icon: "mdi-diamond-stone",
      color: "#7cb342"
    }]

    return toReturn
  }

  getSemesterDates(year: number, semester: number): { from: Moment, to: Moment } {
    const firstSemester = {
      start: {date: 1, month: 0},
      end: {date: 30, month: 5}
    }
    const secondSemester = {
      start: {date: 1, month: 6},
      end: {date: 31, month: 11}
    }
    let date: Moment = this.$moment()
    let toReturn = {from: this.$moment(), to: this.$moment()}

    if (year.toString().length === 4) {
      date.year(year)
    } else if (year < 0) {
      date.subtract(Math.abs(year), "year")
    } else if (year > 0) {
      date.add(year, "year")
    }

    toReturn.from = this.$moment(date.set((semester === 1 ? firstSemester : secondSemester).start))
    toReturn.to = this.$moment(date.set((semester === 1 ? firstSemester : secondSemester).end))

    return toReturn
  }

  formatTabSemester(year: number, semester: number): string {
    const dates = this.getSemesterDates(year, semester)

    return dates.from.format("Do MMM") + " - " + dates.to.format("D MMM") + " " + dates.to.year()
  }

  async fetchData() {
    try {
      this.statistics = await this.$apiCalls.club.dashboardStatistics()

    } catch (e) {
      this.$alerts.error(e)
    }
  }

  mounted() {
    this.fetchData()
  }
}
</script>
