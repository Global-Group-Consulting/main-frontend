<template>
  <v-layout>
    <v-flex>
      <page-header page-name="club.brite" sub-title="true">
        <template v-slot:subtitle>
          <v-row>
            <v-col lg="6" cols="12">
              <v-skeleton-loader
                class="bg-transparent"
                v-if="showSkeleton"
                type="card-heading@2"
              ></v-skeleton-loader>

              <div v-else>
                <span v-html="pageSubTitle"></span>

                <tooltip-btn icon-name="mdi-archive-arrow-up" color="primary"
                             disabled
                             icon
                             :tooltip="$t('pages.club.brite.changeActivePack')"></tooltip-btn>
              </div>
            </v-col>
            <v-col lg="6" cols="12">
              <v-skeleton-loader
                type="card-heading, list-item-two-line"
                v-if="showSkeleton"
              ></v-skeleton-loader>

              <div v-else>
                <div>{{ $t("pages.club.brite.totalUsableBrite") }}: <strong>
                  Br' {{ totalReport.totalAmount|moneyFormatter(true) }}</strong></div>
                <ul class="pl-4" style="list-style: none; font-size: 20px; line-height: 1;">
                  <li v-for="(entry, i) of totalReport.expirations" :key="i"
                      v-html="$t('pages.club.brite.totalExpiresAt', {
                              amount: $options.filters.moneyFormatter(entry.amount, true),
                              expiresAt: $options.filters.dateFormatter(entry.expiresAt)
                              })">
                  </li>
                </ul>
              </div>
            </v-col>
          </v-row>
        </template>
      </page-header>

      <dynamic-tabs :tabs-list="tabsList" color="transparent"
                    card-text-class="px-0 py-0"
                    v-model="currentTab">
        <template v-slot="{item}">
          <v-row>
            <v-col v-for="card of getCardsList(item)" :key="card.title"
                   md="4" cols="12" sm="6">
              <card-block :data="card" :extra-data="item">
                <template v-slot:subtitle>
                  <div v-if="card.id === 'briteTotal'"
                       v-html="$t('pages.club.brite.tabs.usableFrom', {date: $moment(item.dates.to).add(1, 'day').format('Do MMMM YYYY')})"></div>

                  <div v-if="card.id === 'briteAvailable'"
                       v-html="$t('pages.club.brite.tabs.expiresAt', {date: $moment(item.dates.to).add(1, 'day').add(1, 'year').format('Do MMMM YYYY')})"></div>
                </template>
              </card-block>
            </v-col>
          </v-row>
        </template>
      </dynamic-tabs>

      <data-table schema="clubBriteSchema"
                  table-key="brite"
                  :items="tableData">
        <template v-slot:item.amountChange="{item, value}">
          <span :class="getMovementColor(item)">
            Br' {{ value | moneyFormatter(true) }}</span>
        </template>

        <template v-slot:item.deposit="{item, value}">
          <strong>Br' {{ value | moneyFormatter(true) }}</strong>
        </template>

        <template v-slot:item.depositOld="{item, value}">
          Br' {{ value | moneyFormatter(true) }}
        </template>

        <template v-slot:item.semesterId="{item, value}">
          {{ value ? formatTabSemester(+value.split("_")[0], +value.split("_")[1]) : "" }}
        </template>

        <template v-slot:item.movementType="{item, value}">
          <v-chip :color="$enums.ClubMovementTypes.get(value).color" small>
            {{ $t(`enums.ClubMovementTypes.` + value) }}
          </v-chip>
        </template>

        <template v-slot:item.notes="{item, value}">
          <v-tooltip bottom v-if="value">
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" color="primary">
                <v-icon>mdi-note-text-outline</v-icon>
              </v-btn>
            </template>
            {{ value }}
          </v-tooltip>
        </template>
      </data-table>

      <brite-add-dialog v-if="$store.getters['dialog/dialogId'] === 'BriteAddDialog'"
                        @briteAdded="onBriteAdded"/>

      <brite-use-dialog v-if="$store.getters['dialog/dialogId'] === 'BriteUseDialog'"/>

      <brite-remove-dialog v-if="$store.getters['dialog/dialogId'] === 'BriteRemoveDialog'"
                           @briteRemoved="onBriteRemoved"/>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import PageHeader from "../../components/blocks/PageHeader.vue";
import DataTable from "~/components/table/DataTable.vue";
import DynamicTabs from "~/components/DynamicTabs.vue";
import {DynamicTab} from "~/@types/components/DynamicTab";
import CardBlock from "~/components/elements/CardBlock.vue";
import {CardBlockI} from "~/@types/components/CardBlock";
import {Moment} from "moment";
import BriteAddDialog from "~/components/dialogs/BriteAddDialog.vue";
import {User} from "~/@types/UserFormData";
import {ClubMovement} from "~/@types/club/ClubMovement";
import {ClubPermissions} from "~/functions/acl/enums/club.permissions";
import BriteUseDialog from "~/components/dialogs/BriteUseDialog.vue";
import BriteRemoveDialog from "~/components/dialogs/BriteRemoveDialog.vue";
import {sortBy} from "lodash";

interface BlockData {
  briteTotal: number
  briteUsed: number
  briteAvailable: number,
  usableFrom: string,
  expiresAt: string
}

interface TotalReport {
  totalAmount: number,
  expirations: { amount: number, expiresAt: Moment, usableFrom: Moment }[]
}


@Component({
  components: {BriteRemoveDialog, BriteUseDialog, BriteAddDialog, CardBlock, DynamicTabs, DataTable, PageHeader},
  meta: {
    permissions: [ClubPermissions.BRITES_ALL_READ, ClubPermissions.BRITES_SELF_READ]
  }
})
export default class Brite extends Vue {
  public tableData: Brite[] = []
  public currentTab: number = this.$moment().month() > 5 ? 3 : 2
  public currentUser: Partial<User> = {}
  public blocksData: Record<string, any> = {}
  public showSkeleton: boolean = true

  get currentSemester(): string {
    return this.$moment().year() + "_" + (this.$moment().month() < 6 ? 1 : 2)
  }

  get userId(): string {
    return this.$route.params.id
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

  get pageSubTitle(): string {
    const toReturn = []

    if (!this.currentUser) {
      return ""
    }

    toReturn.push(this.currentUser.firstName + " " + this.currentUser.lastName + (this.currentUser.clubCardNumber ? ` (${this.currentUser.clubCardNumber})` : ''))
    toReturn.push(this.$t("pages.club.brite.activePack", {pack: this.$t("enums.ClubPacks." + this.currentUser.clubPack)}))

    return toReturn.join("<br>")
  }

  get packsList() {
    return this.$enums.ClubPacks.list.map(el => {
      el.text = this.$t("enums.ClubPacks." + el.value) as string

      return el
    })
  }

  /**
   * Getter that returns a report of all available data, that will be used
   * for the report in the top right of the screen.
   */
  get totalReport(): TotalReport {
    const toReturn: TotalReport = {
      totalAmount: 0,
      expirations: []
    }
    //const currentSemester = this.$moment().month() < 6 ? 1 : 2

    for (const entry of Object.entries<BlockData>(this.blocksData)) {
      const usableFrom = this.$moment(entry[1].usableFrom);
      const expiresAt = this.$moment(entry[1].expiresAt);
      const amount = +entry[1].briteAvailable

      // If the brites are usable in the future, avoid showing them
      if (usableFrom.isAfter(this.$moment()) || !amount) {
        continue
      }

      toReturn.totalAmount += +entry[1].briteAvailable
      toReturn.expirations.push({
        amount,
        usableFrom,
        expiresAt
      })
    }

    toReturn.expirations = sortBy(toReturn.expirations, "expiresAt", function (o: any) {
      return o.expiresAt.toDate()
    })

    return toReturn
  }

  getCardsList(tab: DynamicTab): CardBlockI[] {
    const canAdd = this.$acl.checkPermissions([ClubPermissions.BRITES_ALL_ADD])
      && tab.id !== this.tabsList[this.tabsList.length - 1].id
    const canRemove = this.$acl.checkPermissions([ClubPermissions.BRITES_ALL_ADD])
      && this.$moment().isAfter(tab.useFrom) && this.$moment().isBefore(tab.expiresAt)
    const permissionToUse = this.$acl.checkPermissions([ClubPermissions.BRITES_SELF_USE])
      && this.$moment().isAfter(tab.useFrom) && this.$moment().isBefore(tab.expiresAt)
    const canUse = true //permissionToUse && this.$moment().isAfter(tab.useFrom) && this.$moment().isBefore(tab.expiresAt)

    const toReturn: CardBlockI[] = [{
      id: "briteTotal",
      title: this.$t("pages.club.brite.tabs.briteTotal"),
      value: (card: any, tab: any) => this.getCardValue(card, tab),
      icon: "mdi-diamond",
      actionText: canAdd ? this.$t("pages.club.brite.tabs.addBrite") : null,
      action: this.onAddBrite,
      color: "#4152b7"
    }, {
      id: "briteUsed",
      title: this.$t("pages.club.brite.tabs.briteUsed"),
      value: (card: any, tab: any) => this.getCardValue(card, tab),
      icon: "mdi-diamond-outline",
      // actionText: this.$t("pages.club.brite.tabs.movements"),
      color: "#f9a825",
      /*  actionText: canRemove ? this.$t("pages.club.brite.tabs.removeBrite") : null,
        action: this.onRemoveBrite,
        actionDisabled: (card: CardBlockI, tab: DynamicTab) => {
          return card.value === "Br' 0"
        },*/
    }, {
      id: "briteAvailable",
      title: this.$t("pages.club.brite.tabs.briteAvailable"),
      value: (card: any, tab: any) => this.getCardValue(card, tab),
      icon: "mdi-diamond-stone",
      actionText: canRemove ? this.$t("pages.club.brite.tabs.removeBrite") : (permissionToUse ? this.$t("pages.club.brite.tabs.use") : ''),
      action: canRemove ? this.onRemoveBrite : this.onUseBrite,
      actionDisabled: (card: CardBlockI, tab: DynamicTab) => {
        return !canUse || card.value === "Br' 0"
      },
      color: "#7cb342"
    }]
    /*
        if (canUse) {
          toReturn.push({
            id: "britePrevSemesters",
            title: this.$t("pages.club.brite.tabs.britePrevSemesters"),
            value: (card: any, tab: any) => this.getCardValue(card, tab),
            icon: "mdi-cards-diamond",
            actionText: this.$t("pages.club.brite.tabs.britePrevSemesters"),
            action: this.onUseBrite,
            color: "#9e42b3"
          })
        }*/

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

  getMovementColor(movement: ClubMovement) {
    const toReturn = []

    if ([this.$enums.ClubMovementTypes.DEPOSIT_COLLECTED, this.$enums.ClubMovementTypes.DEPOSIT_REMOVED].includes(movement.movementType)) {
      toReturn.push("red--text")
    } else {
      toReturn.push("green--text")
    }

    return toReturn.join(" ")
  }

  getCardValue(card: CardBlockI, tab: DynamicTab) {
    const toReturn = ["Br'"]

    if (!tab.dates || !tab.dates.from) {
      toReturn.push("0")
      return toReturn.join(" ")
    }

    const fromDate: Moment = this.$moment(tab.dates.from)
    const semesterName: string = fromDate.year() + "_" + (fromDate.month() < 6 ? 1 : 2)

    if (!this.blocksData[semesterName]) {
      toReturn.push("0")
      return toReturn.join(" ")
    }

    const value = this.blocksData[semesterName][card.id.toString()]

    toReturn.push(this.$options?.filters?.moneyFormatter(value, true))

    return toReturn.join(" ")
  }

  getSemesterReport(semesterId: string): TotalReport {
    const data = this.blocksData[semesterId];

    return {
      totalAmount: data.briteAvailable,
      expirations: []
    }
  }

  formatTabSemester(year: number, semester: number): string {
    const dates = this.getSemesterDates(year, semester)

    return dates.from.format("Do MMM") + " - " + dates.to.format("D MMM") + " " + dates.to.year()
  }

  /**
   * Open a modal that adds new brite to the user
   */
  onAddBrite(card: CardBlockI, tab: DynamicTab) {

    this.$store.dispatch("dialog/updateStatus", {
      id: "BriteAddDialog",
      title: this.$t("dialogs.briteAddDialog.title"),
      texts: {
        cancelBtn: "dialogs.briteAddDialog.btn-cancel",
        confirmBtn: "dialogs.briteAddDialog.btn-save"
      },
      data: tab
    });
  }

  onUseBrite(card: CardBlockI) {
    this.$store.dispatch("dialog/updateStatus", {
      id: "BriteUseDialog",
      title: this.$t(`dialogs.briteUseDialog.title`),
      fullscreen: false,
      readonly: false,
      large: false,
      data: {
        card,
        totalReport: this.totalReport
      }
    });
  }

  onRemoveBrite(card: CardBlockI, extraData: any) {
    this.$store.dispatch("dialog/updateStatus", {
      id: "BriteRemoveDialog",
      title: this.$t(`dialogs.briteRemoveDialog.title`),
      fullscreen: false,
      readonly: false,
      data: {
        card,
        extraData,
        totalReport: this.getSemesterReport(extraData.id)
      }
    });
  }


  onBriteAdded(newValue: any) {
    this.tableData.unshift(newValue)

    this.refreshBlocks()
  }

  onBriteRemoved(newValue: any) {
    this.tableData.unshift(newValue)

    this.refreshBlocks()
  }

  async refreshBlocks() {
    try {
      const blocks = await this.$apiCalls.clubFetchBlocks(this.userId)

      if (blocks) {
        this.blocksData = blocks
      }
    } catch (er) {
      this.$alerts.error(er)
    }
  }


  async beforeMount() {
    try {
      const movements = await this.$apiCalls.clubFetchBrites(this.userId)
      const user = await this.$apiCalls.fetchUserDetails(this.userId)
      const blocks = await this.$apiCalls.clubFetchBlocks(this.userId)

      if (movements) {
        this.tableData = movements
      }

      if (user) {
        this.currentUser = user
      }

      if (blocks) {
        this.blocksData = blocks
      }

      setTimeout(() => {
        this.showSkeleton = false
      }, 100)
    } catch (e) {
      this.$alerts.error(e)
    }
  }
}
</script>

<style scoped lang="scss">

::v-deep .v-skeleton-loader__card-heading,
::v-deep .v-skeleton-loader__list-item-two-line {
  &.v-skeleton-loader__bone {
    background: transparent !important;
  }

  .v-skeleton-loader__heading {
    margin-bottom: 0;
  }
}
</style>
