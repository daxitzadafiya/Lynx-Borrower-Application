<template>
  <div class="content-container">
    <div class="content-header-container">
      <div class="header-text">Please enter the Down Payment Percent or Amount for this loan.</div>
    </div>
    <v-form fast-fail="fast-fail">
      <v-row class="form-container">
        <Input class="disabledInput" :inputTitle="(currentLoan && currentLoan.SalesContract ? 'Purchase Price' : 'Estimated Purchase Price')" pattern="[0-9]*" inputmode="numeric" prefix="$" :value="getFormattedValue(PurchasePrice) || 0" disabled="disabled"></Input>
        <Input inputTitle="Down Payment %" suffix="%" ref="percentage" type="number" min="0" max="100" :value="downPaymentPercentage" @input="setPercentage" @keypress="(e) => checkMaxPercentage(e)"></Input>
        <Input inputTitle="Down Payment Amount" pattern="[0-9]*" inputmode="numeric" prefix="$" :value="getFormattedValue(downPaymentAmount) || 0" @input="(e) => setAmount(+e.replace(/,/g, ''))" @keypress="(e) => isOnlyNum(e, true)"></Input>
        <Input class="disabledInput" inputTitle="Loan Amount" pattern="[0-9]*" inputmode="numeric" prefix="$" disabled="disabled" :value="LoanAmount ? getFormattedValue(LoanAmount) : 0"></Input>
      </v-row>
    </v-form>
    <div class="navigation-container">
      <NavigationButtons :ConditionsMet="isNextDisabled"></NavigationButtons>
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
    ...mapActions(["setCurrentLoan", "setProperty", "setLoanAmount"]),
    setAmount(value) {
      let percentage = this.downPaymentPercentage || 0;
      let amount = value;
      let loanAmount = this.LoanAmount || 0;
      if (this.PurchasePrice) {
        amount = amount > this.PurchasePrice ? this.PurchasePrice : amount;
        percentage = +((amount / this.PurchasePrice) * 100).toFixed(2);
        loanAmount = this.PurchasePrice - value;
      }
      this.setCurrentLoan({
        ...this.currentLoan,
        DownPaymentPercentage: percentage,
        DownPaymentAmount: +value
      });
      this.setLoanAmount(loanAmount);
    },
    setFixedIncrementPercentage(value) {
      let fixedIncrementValues = [0, 3, 3.5, 5];
      if (value <= fixedIncrementValues[fixedIncrementValues.length - 1]) {
        let currentMaxIndex = 0;
        for (var i = 1; i < fixedIncrementValues.length; i++) {
          if (value <= fixedIncrementValues[i]) {
            currentMaxIndex = i;
            break;
          }
        }
        if (
          value <
          (fixedIncrementValues[currentMaxIndex - 1] +
            fixedIncrementValues[currentMaxIndex]) /
            2
        ) {
          this.setPercentage(fixedIncrementValues[currentMaxIndex - 1]);
        } else {
          this.setPercentage(fixedIncrementValues[currentMaxIndex]);
        }
      } else {
        if (value % 5 < 2.5) {
          this.setPercentage(parseInt(value / 5) * 5);
        } else {
          this.setPercentage(parseInt(value / 5) * 5 + 5);
        }
      }
    },
    setPercentage(value) {
      const correctValue = value > 100 ? 100 : +value;
      const amount = +((this.PurchasePrice * correctValue) / 100).toFixed(2);
      const loanAmount = this.PurchasePrice - amount;
      this.setCurrentLoan({
        ...this.currentLoan,
        DownPaymentPercentage: correctValue,
        DownPaymentAmount: amount
      });
      this.setLoanAmount(loanAmount);
    },
    setManualLoanAmount(value) {
      const LoanAmount =
        value > this.PurchasePrice ? this.PurchasePrice : value;
      const amount = +(this.PurchasePrice - LoanAmount).toFixed(2);
      const percentage = +((amount / this.PurchasePrice) * 100).toFixed(2);
      this.setCurrentLoan({
        ...this.currentLoan,
        DownPaymentAmount: amount,
        DownPaymentPercentage: percentage,
        LoanAmount
      });
    },
    clickedAmount(e) {
      const value = e.target.childNodes[0] ? e.target.childNodes[0].value : 0;
      if (value) {
        this.setAmount(value);
      }
    },
    clickedPercentage(e) {
      const value = e.target.childNodes[0] ? e.target.childNodes[0].value : 0;
      if (value) {
        this.setPercentage(value);
      }
    },
    setInitialDownpayments() {
      let percentage = this.downPaymentPercentage || 20;
      if (this.PurchasePrice && this.BaseLoanAmount && !this.LoanAmount) {
        const amount = +(this.PurchasePrice - this.BaseLoanAmount).toFixed(2);
        percentage = +((amount / this.PurchasePrice) * 100).toFixed(2);
        const LoanAmount = this.BaseLoanAmount - amount;
        this.setCurrentLoan({
          ...this.currentLoan,
          DownPaymentAmount: amount,
          DownPaymentPercentage: percentage,
          LoanAmount
        });
      } else if (this.PurchasePrice && this.LoanAmount) {
        this.setManualLoanAmount(this.LoanAmount);
      } else if (
        this.PurchasePrice &&
        !this.LoanAmount &&
        !this.BaseLoanAmount
      ) {
        this.setPercentage(percentage);
      }
    },
    checkMaxPercentage(e) {
      const { value } = e.target;
      if (value.length === 3 || value > 100) {
        e.preventDefault();
        return false;
      } else {
        return this.isOnlyNum(e);
      }
    }
  },
  computed: {
    ...mapGetters({
      currentLoan: "getCurrentLoan",
      downPaymentAmount: "getDownPaymentAmount",
      downPaymentPercentage: "getDownPaymentPercentage",
      Property: "getProperty",
      PurchasePrice: "getPurchasePrice",
      LoanAmount: "getLoanAmount",
      BaseLoanAmount: "getBaseLoanAmount"
    }),
    isNextDisabled() {
      return this.downPaymentAmount === 0;
    }
  },
  watch: {
    currentLoan: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.Id && oldVal.Id && newVal.Id !== oldVal.Id) {
          this.setInitialDownpayments();
        }
      }
    }
  },
  mounted() {
    this.setInitialDownpayments();
  }
};
</script>

<style lang="scss" scoped>

.disabledInput {
  :deep(fieldset) {
    background: rgba(151, 151, 151, 0.1);
    border: 1px solid rgba(151, 151, 151, 0.3);
    input {
      color: black;
    }
  }
}
.disabledInput {
  :deep(input) {
    color: black !important;
    text-align: center;
  }
}

</style>
