<template>
  <v-form class="fast-fail form-outer-container">
    <v-row class="form-container deleteAbleItem" v-for="(liability, index) in otherLiabilities" :key="index">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="remove(index)">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input defaultComponent="v-combobox" attach="attach" :value="liability.ExpenseType ? liability.ExpenseType.replace(/([a-z])([A-Z])/g, '$1 $2') : ''" :items="items" @change="(e) => setLiability(e ? e.replace(/ /g, '') : '', 'ExpenseType', index)" inputTitle="Liability/Expense"></Input>
      <Input v-if="liability.ExpenseType === 'Other'" inputTitle="Other Description" :value="liability.ExpenseTypeOtherDescription" @input="(e) => setLiability(e, 'ExpenseTypeOtherDescription', index)"></Input>
      <Input prefix="$" inputTitle="Monthly Payment" :value="getFormattedValue(liability.ExpenseMonthlyPaymentAmount)" @input="(e) => setLiability(+e.replace(/,/g, ''), 'ExpenseMonthlyPaymentAmount', index)" @keypress="(e) => isOnlyNum(e, true)"></Input>
      <Input defaultComponent="v-combobox" attach="attach" :value="liability.ExpenseRemainingMonthsType" :items="expenseRemainingMonthsTypes" @change="(e) => { setLiability(e, 'ExpenseRemainingMonthsType', index); if(e !=='Other') { setLiability('', 'ExpenseRemainingMonthsOtherDescription', index) } }" inputTitle="How many more months are you required to make these payments?"></Input>
      <Input inputTitle="Other Explanation" :value="liability.ExpenseRemainingMonthsOtherDescription" @input="(e) => setLiability(e, 'ExpenseRemainingMonthsOtherDescription', index)" v-if="liability.ExpenseRemainingMonthsType === 'Other'"></Input>
      <Input v-if="liability.ExpenseType!=='Other' && liability.ReasonCode !== 'Ongoing'" inputmode="numeric" pattern="[0-9]*" inputTitle="Number of Months" :value="liability.ExpenseRemainingTermMonthsCount" @input="(e) => setLiability(+e, 'ExpenseRemainingTermMonthsCount', index)" @keypress="(e) => isOnlyNum(e)"></Input>
    </v-row>
    <v-row class="form-container deleteAbleItem" v-if="additional">
      <v-col class="itemContainer itemDeleteCrossContainer" cols="12" sm="12">
        <v-btn dense="dense" icon="icon" @click="additional=null">
          <v-icon small="small">mdi-close</v-icon>
        </v-btn>
      </v-col>
      <Input defaultComponent="v-combobox" attach="attach" :value="additional.ExpenseType" :items="items" @change="(e) => setLiability(e ? e.replace(/ /g, '') : '', 'ExpenseType', otherLiabilities.length)" inputTitle="Liability/Expense"></Input>
    </v-row>
    <v-row class="form-container addItemBtnContainer">
      <v-col class="itemContainer" cols="12" sm="12">
        <v-btn class="addItemBtn" dense="dense" plain="plain" elevation="0" @click="addLiability">
          <v-icon small="small">mdi-plus</v-icon><span class="addBtnText">Add Other Liabilty</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default{
    mixins: [onlyNum, currencyFormat],
  data() {
    return {
      items: ["Alimony", "Child Support", "Job Related Expenses", "Separate Maintenance Expense", "Other"],
      additional: null,
      expenseRemainingMonthsTypes: [
        "Less than 10 months",
        "Greater than 10 months",
        "Ongoing",
        "Other"
      ]
    };
  },
  methods: {
    ...mapActions(["updateBorrower"]),
    setLiability(value, prop, index) {
      let OtherLiabilitiesAndExpenses = [...this.otherLiabilities];
      if (OtherLiabilitiesAndExpenses.length === index) {
        OtherLiabilitiesAndExpenses.push({ [prop]: value });
      } else {
        OtherLiabilitiesAndExpenses = OtherLiabilitiesAndExpenses.map(
          (item, i) => {
            if (i === index) {
              item[prop] = value;
            }
            if (prop === "ExpenseType" && value !== "Other") {
              delete item.ExpenseTypeOtherDescription;
            }
            if (prop === "ReasonCode" && value !== "Other") {
              delete item.LiabilityDisputeReasonExplanation;
            }
            return item;
          }
        );
      }
      this.updateBorrower({
        prop: "OtherLiabilitiesAndExpenses",
        value: OtherLiabilitiesAndExpenses
      });
      this.additional = null;
    },
    addLiability() {
      this.additional = { ExpenseType: "" };
    },
    remove(index) {
      const OtherLiabilitiesAndExpenses = this.otherLiabilities.filter(
        (item, i) => index !== i
      );
      this.updateBorrower({
        prop: "OtherLiabilitiesAndExpenses",
        value: OtherLiabilitiesAndExpenses
      });
    }
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower"
    }),
    otherLiabilities() {
      return this.borrower && this.borrower.OtherLiabilitiesAndExpenses
        ? this.borrower.OtherLiabilitiesAndExpenses
        : [];
    }
  },
}
</script>