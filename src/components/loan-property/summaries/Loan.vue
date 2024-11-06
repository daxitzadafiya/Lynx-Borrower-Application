<template>
  <div class="loan-details-section">
    <NewSummaryControl
      header="Loan"
      :icon="icon"
      @edit="onEditClicked"
      @cancel="onCancelClicked"
      @save="onSaveClicked"
    >
      <template v-slot:displayContent>
        <v-row class="summary-content-container">
          <v-col sm="12" cols="12" class="summaryItem">
            <div class="summaryValue">
              The property is being {{ LoanPurposeType
              }}{{
                LoanPurposeType === "Purchase" ||
                LoanPurposeType === "Refinance"
                  ? "d"
                  : ""
              }}
              for ${{ LoanPurposeType === "Refinance" ? getFormattedValue(currentLoan.LoanAmount) : getFormattedValue(PurchasePrice) }}
              <span v-if="LoanPurposeType !== 'Refinance'">
                , with a ${{ getFormattedValue(downPaymentAmount) }} ({{
                  downPaymentPercentage
                }}%) Down Payment, and a Loan Amount of ${{
                  currentLoan ? getFormattedValue(currentLoan.LoanAmount) : ""
                }}
              </span>
            </div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:editContent>
        <v-form fast-fail>
          <v-row class="form-container">
            <Input
              :attach="true"
              defaultComponent="v-select"
              hide-details
              inputTitle="Loan Purpose"
              :value="LoanPurposeType"
              @change="e => setLoanPurposeType(e)"
              :items="purposes"
              item-text="text"
              item-value="value"
            />
            <Input
              v-if="LoanPurposeType === 'Purchase'"
              inputTitle="Estimated Purchase Price"
              hide-details
              :value="getFormattedValue(PurchasePrice)"
              @input="e => setPurchasePrice(+e.replace(/,/g, ''))"
              @keypress="e => isOnlyNum(e, true)"
              prefix="$"
            />
            <Input
              outlined
              dense
              inputTitle="Loan Amount"
              hide-details
              :value="
                currentLoan ? getFormattedValue(currentLoan.LoanAmount) : ''
              "
              @input="e => setLoanAmount(+e.replace(/,/g, ''))"
              @keypress="e => isOnlyNum(e, true)"
              prefix="$"
            />
            <v-col
              sm="12"
              cols="12"
              class="itemContainer"
              v-if="LoanPurposeType === 'Purchase'"
            >
              <DownpaymentSliders ref="downpaymentSliders"></DownpaymentSliders>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </NewSummaryControl>
  </div>
</template>

<script>
import DownpaymentSliders from "./DownpaymentSliders";
import { mapGetters, mapActions } from "vuex";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import NewSummaryControl from "@/components/controls/NewSummaryControl";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      purposes: [
        { text: "Purchase", value: "Purchase" },
        { text: "Refinance", value: "Refinance" },
        { text: "New Home Construction", value: "Construction" }
      ],
      icon: require("@/assets/images/loan-property/summary/loan-details.svg"),
      loanPurposeTypeBeforeEdit: null
    };
  },
  methods: {
    ...mapActions([
      "setLoanPurposeType",
      "setPurchasePrice",
      "setLoanAmount",
      "setProperty",
      "setCurrentLoan",
      "saveLoanPatches"
    ]),
    setEstimatedValue(e) {
      let prop = "EstimatedPurchasePrice";
      prop =
        this.LoanPurposeType === "Refinance"
          ? "PropertyEstimatedValueAmount"
          : prop;
      if (prop === "PropertyEstimatedValueAmount") {
        const property = this.Property
          ? { ...this.Property, [prop]: e }
          : { [prop]: e };
        this.setProperty(property);
      } else {
        this.setCurrentLoan({ ...this.currentLoan, [prop]: e });
      }
    },
    onEditClicked() {
      this.generateOnCancelData();
    },
    generateOnCancelData() {
      this.loanPurposeTypeBeforeEdit = this.LoanPurposeType;
      this.estimatedPurchaseValueBeforeEdit = this.PurchasePrice;
      this.currentLoanAmountBeforeEdit = this.currentLoan.LoanAmount;
      this.$refs.downpaymentSliders.generateOnCancelData();
    },
    onCancelClicked() {
      this.setLoanPurposeType(this.loanPurposeTypeBeforeEdit);
      this.setPurchasePrice(this.estimatedPurchaseValueBeforeEdit);
      this.setLoanAmount(this.currentLoanAmountBeforeEdit);
      this.$refs.downpaymentSliders.onCancelClicked();
    },
    onSaveClicked() {
      this.saveLoanPatches();
    }
  },
  computed: {
    ...mapGetters({
      LoanPurposeType: "getLoanPurposeType",
      currentLoan: "getCurrentLoan",
      PurchasePrice: "getPurchasePrice",
      Property: "getProperty",
      downPaymentAmount: "getDownPaymentAmount",
      downPaymentPercentage: "getDownPaymentPercentage"
    })
  },
  components: {
    DownpaymentSliders,
    NewSummaryControl
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";
</style>
