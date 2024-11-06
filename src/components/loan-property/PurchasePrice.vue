<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">{{ title }}</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input prefix="$" :isRequired="true" :inputTitle="correctLabel" :value="getFormattedValue(PurchasePrice)" @input="(e) => setPurchasePrice(+e.replace(/,/g, ''))" @keypress="(e) => isOnlyNum(e, true)"></Input>
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
    ...mapActions(["setPurchasePrice"])
  },
  computed: {
    ...mapGetters({
      PurchasePrice: "getPurchasePrice",
      currentLoan: "getCurrentLoan"
    }),
    correctLabel() {
      return this.currentLoan && this.currentLoan.SalesContract
        ? "Sales Contract Amount"
        : "Estimated Sales Price";
    },
    title() {
      if (this.currentLoan && this.currentLoan.SalesContract) {
        return "What is the Sales Contract Amount for this Purchase?";
      }
      return "What is the Estimated Sales Price of the Property you are Purchasing?";
    },
    isNextButtonDisabled() {
      return ( this.PurchasePrice == null || this.PurchasePrice.length === 0)  
    }
  },
};
</script>