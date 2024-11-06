<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">{{ title }}?</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input :isRequired="true" :inputTitle="LoanPurposeType === 'Refinance' ? 'Estimated Property Value' : 'Estimated Purchase Price'" :value="getCorrectValue()" @input="(e) => setEstimatedValue(+e.replace(/,/g, ''))" @keypress="(e) => isOnlyNum(e, true)"></Input>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextButtonDisabled"></NavigationButtons>
    </div>
  </div>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  methods: {
    ...mapActions(["setProperty", "setCurrentLoan"]),
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
    getCorrectValue() {
      if (this.currentLoan) {
        return this.LoanPurposeType === "Refinance" && this.Property
          ? this.getFormattedValue(this.Property.PropertyEstimatedValueAmount)
          : this.getFormattedValue(this.currentLoan.EstimatedPurchasePrice);
      }
      return "";
    }
  },
  computed: {
    ...mapGetters({
      Property: "getProperty",
      currentLoan: "getCurrentLoan",
      LoanPurposeType: "getLoanPurposeType"
    }),
    title() {
      let result =
        "What is the Estimated Purchase Price of the Property you are Buying";
      if (this.LoanPurposeType === "Refinance") {
        result =
          "What is the Estimated value of the property you are Refinancing";
      }
      return result;
    },
    isNextButtonDisabled() {
      return this.LoanPurposeType === "Refinance" && this.Property
        ? this.Property.PropertyEstimatedValueAmount == null ||
            this.Property.PropertyEstimatedValueAmount === 0
        : this.currentLoan.EstimatedPurchasePrice == null ||
            this.currentLoan.EstimatedPurchasePrice === 0;
    }
  },
};
</script>