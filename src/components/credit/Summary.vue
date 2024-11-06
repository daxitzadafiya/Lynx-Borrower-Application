<template>
  <div class="credit-data">
    <NewSummaryControl
      class="mb-4"
      header="Borrower(s) Details"
      :icon="icon"
      :isReadOnly="true"
    >
      <template v-slot:displayContent>
        <v-row class="summary-content-container">
          <v-col class="summaryItem" sm="12" cols="12">
            <div class="summaryValue bold">
              {{ borrower.FirstName }} {{ borrower.LastName }}
            </div>
          </v-col>
          <v-col class="summaryItem" sm="4" cols="12">
            <div class="summaryTitle">Date of Birth:</div>
            <div class="summaryValue">{{ borrowerBirthDate }}</div>
          </v-col>
          <v-col class="summaryItem" sm="4" cols="12">
            <div class="summaryTitle">Social Security Number:</div>
            <div class="summaryValue">
              {{ maskSSN(borrower.TaxpayerIdentifierValue) }}
            </div>
          </v-col>
          <template v-if="coBorrower != null">
            <v-col class="summaryItem" sm="12" cols="12">
              <div class="summaryValue bold">
                {{ coBorrower.FirstName }} {{ coBorrower.LastName }}
              </div>
            </v-col>
            <v-col class="summaryItem" sm="4" cols="12">
              <div class="summaryTitle">Date of Birth:</div>
              <div class="summaryValue">{{ coBorrowerBirthDate }}</div>
            </v-col>
            <v-col class="summaryItem" sm="4" cols="12">
              <div class="summaryTitle">Social Security Number:</div>
              <div class="summaryValue">
                {{ maskSSN(coBorrower.TaxpayerIdentifierValue) }}
              </div>
            </v-col>
          </template>
        </v-row>
      </template>
    </NewSummaryControl>
    <DecisionScore></DecisionScore>
    <SummaryControl header="Liabilities" :mobileIcon="liabilitiesIcon">
      <template v-slot:displayContent>
        <v-row
          class="summary-content-container"
          v-if="liabilities == null || liabilities.length === 0"
        >
          <v-col class="summaryItem" sm="12" cols="12">
            <div class="summaryValue">No Liabilities.</div>
          </v-col>
        </v-row>
        <Table :editable="false"></Table>
      </template>
      <template v-slot:editContent>
        <div class="inner-content-container">
          <Table></Table>
        </div>
      </template>
    </SummaryControl>
    <SummaryControl
      header="Derogatory Items"
      :mobileIcon="liabilitiesIcon"
      :isReadOnly="true"
      v-if="derogatories != null && derogatories.length !== 0"
    >
      <template v-slot:displayContent>
        <div class="body-2 pb-3 infoText" style="max-width:unset">
          <span
            >If you would like to provide us any additional information about a
            liability, please click the pencil </span
          ><span>
            <inline-svg
              :src="editIcon"
              class="tableInfoIcon"
            ></inline-svg></span
          ><span>link.</span>
        </div>
        <DerogatoryTable></DerogatoryTable>
      </template>
    </SummaryControl>
    <SummaryControl header="Other Liabilities" :mobileIcon="liabilitiesIcon">
      <template v-slot:displayContent>
        <v-row
          class="summary-content-container"
          v-if="otherLiabilities == null || otherLiabilities.length === 0"
        >
          <v-col class="summaryItem" sm="12" cols="12">
            <div class="summaryValue">No Other Liabilities.</div>
          </v-col>
        </v-row>
        <OtherLiabilitiesTable v-else></OtherLiabilitiesTable>
      </template>
      <template v-slot:editContent>
        <OtherLiabilityDetailsData></OtherLiabilityDetailsData>
      </template>
    </SummaryControl>
    <div class="d-flex w-100 justify-end mt-5 pt-3">
      <Button
        value="Go to next section"
        width="auto"
        customClass="primary-button"
        @clicked="() => saveAndAdvance(true)"
      ></Button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import currencyFormat from "@/mixins/currencyFormat.js";
import DecisionScore from "@/components/credit/summaries/DecisionScore";
import Table from "@/components/credit/liabilities/NewTable";
import OtherLiabilitiesTable from "@/components/credit/summaries/OtherLiabilitiesTable";
import OtherLiabilityDetailsData from "@/components/credit/OtherLiabilityDetailsData";
import scrollToTop from "@/mixins/scrollToTop.js";
import loanPatch from "@/mixins/loanPatch.js";
import SummaryControl from "@/components/controls/SummaryControl";
import NewSummaryControl from "../controls/NewSummaryControl.vue";
import DerogatoryTable from "@/components/credit/derogatoryItems/NewTable";

export default {
  mixins: [scrollToTop, loanPatch, currencyFormat],
  components: {
    DecisionScore,
    Table,
    OtherLiabilityDetailsData,
    SummaryControl,
    NewSummaryControl,
    OtherLiabilitiesTable,
    DerogatoryTable
  },
  computed: {
    borrower() {
      if (!this.selectedBorrower.CoBorrower) return this.selectedBorrower;
      return this.borrowers.find(
        item =>
          item.LinkedBorrowerId === this.selectedBorrower.Id && !item.CoBorrower
      );
    },
    coBorrower() {
      if (this.selectedBorrower.CoBorrower) return this.selectedBorrower;
      return this.borrowers.find(
        item =>
          item.CoBorrower &&
          (this.selectedBorrower.Id === item.Id ||
            this.selectedBorrower.Id === item.LinkedBorrowerId)
      );
    },
    borrowerBirthDate() {
      return this.borrower && this.borrower.BorrowerBirthDate
        ? moment(this.borrower.BorrowerBirthDate).format("MMMM DD, YYYY")
        : null;
    },
    coBorrowerBirthDate() {
      return this.coBorrower && this.coBorrower.BorrowerBirthDate
        ? moment(this.coBorrower.BorrowerBirthDate).format("MMMM DD, YYYY")
        : this.maxDate;
    },
    otherLiabilities() {
      return this.borrower && this.borrower.OtherLiabilitiesAndExpenses
        ? this.borrower.OtherLiabilitiesAndExpenses
        : [];
    },
    liabilities() {
      return this.borrower && this.borrower.Liabilities
        ? this.borrower.Liabilities
        : [{}];
    },
    derogatories() {
      return this.borrower && this.borrower.PublicRecords
        ? this.borrower.PublicRecords
        : [];
    }
  },
  methods: {
    maskSSN(ssn) {
      if (!ssn) return "";
      return ssn.slice(0, -4) + "****";
    }
  },
  data() {
    return {
      icon: require("@/assets/images/credit/person.svg"),
      liabilitiesIcon: require("@/assets/images/credit/liabilities.svg"),
      editIcon: require("@/assets/images/edit.svg")
    };
  }
};
</script>
