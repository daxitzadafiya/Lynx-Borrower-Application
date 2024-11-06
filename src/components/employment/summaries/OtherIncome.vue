<template lang="pug">
  SummaryControl(header="Income from Other Sources" :desktopIcon="desktopIcon" @edit="onEditClicked" @cancel="onCancelClicked" @save="onSaveClicked")
    template(v-slot:displayContent)
        v-row.summary-content-container
            v-col(sm="12" cols="12").summaryItem.position-relative
              v-data-table.content-table(
                :headers="headers"
                :items="OtherIncome"
                disable-sort
                disable-pagination
                hide-default-footer
                :mobile-breakpoint="0"
              )
                template(v-slot:item.IncomeType="{ item }")
                    span {{ item.IncomeType.replace(/([a-z])([A-Z])/g, '$1 $2') }}
                template(v-slot:item.CurrentIncomeMonthlyTotalAmount="{ item }")
                    span ${{ getFormattedValue(item.CurrentIncomeMonthlyTotalAmount) || 0 }}
                template(v-slot:item.StartDate="{ item }")
                    span {{ item.StartDate ? new Date(item.StartDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '') : '' }}
                template(v-slot:item.EndDate="{ item }")
                    span(v-if="item.Ongoing") Ongoing
                    span(v-else-if="item.Unsure") Unsure
                    span(v-else) {{ item.EndDate ? new Date(item.EndDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '') : '' }}
    template(v-slot:editContent)
          OtherIncomeDetails
</template>

<script>
import OtherIncomeDetails from "../NewOtherIncomeDetails";
import currencyFormat from "@/mixins/currencyFormat.js";
import SummaryControl from "@/components/controls/SummaryControl";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [currencyFormat],
  components: {
    OtherIncomeDetails,
    SummaryControl
  },
  data(){
    return{
      desktopIcon: require("@/assets/images/employment/incomeSource.svg"),
      dataBeforeEdit: [],
      headers:[{
        text: "Source",
        value: "IncomeType"
      },{
        text: "Monthly Income",
        value: "CurrentIncomeMonthlyTotalAmount"
      },{
        text: "Start Date",
        value: "StartDate"
      },{
        text: "Expected End Date",
        value: "EndDate"
      }]
    }
  },
  methods:{
    ...mapActions(["updateBorrower", "saveLoanPatches"]),
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.dataBeforeEdit = JSON.parse(JSON.stringify(this.OtherIncome))
    },
    onCancelClicked() {
      this.updateBorrower({ prop: "OtherIncome", value: this.dataBeforeEdit });
    },
    onSaveClicked() {
      this.saveLoanPatches();
    }
  },
  computed: {
    ...mapGetters({
      OtherIncome: "getOtherIncome"
    }),
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";

.content-table{
  width: 100%;
}
</style>
