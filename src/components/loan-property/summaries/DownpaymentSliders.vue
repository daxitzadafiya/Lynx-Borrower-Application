<template lang="pug">
  v-row.text-block__row.mb-0.mx-0
    v-col(sm="4" md="4" cols="12").pb-0.pr-2.mt-0.mt-md-1.px-0
      .body-2.pb-1.font-weight-medium.labelColor Down Payment Amount $:
      .sliderContainer
        v-text-field.amount-data.light-gray.font-weight-bold.mb-4.pt-3(
            solo
            flat
            dense
            hide-details
            pattern="[0-9]*"
            inputmode="numeric"
            background="transparent"
            :value="'$'+(getFormattedValue(downPaymentAmount) || 0)"
            @input="(e) => setAmount(+e.replace(/[$,]/g, ''))"
            @keypress="(e) => isOnlyNum(e, true)"
        )
        v-row.text-block__row.text-block_justified-row.px-3
            v-slider.text-block__slider.py-3(
                :track-color="$vuetify.theme.themes.dark['nautical']"
                :value="downPaymentAmount"
                @end="setAmount"
                @click="clickedAmount"
                min="0"
                :max="PurchasePrice"
                hide-details
            )
    v-col(sm="4" md="4" cols="12").pb-0.pr-2.mt-0.mt-md-1.px-0
      .body-2.pb-1.font-weight-medium.labelColor Down Payment %:
      .sliderContainer
        v-text-field.amount-data.light-gray.font-weight-bold.mb-4.pt-3(
          ref="percentage"
          solo
          flat
          dense
          hide-details
          backgroundColor="light-gray"
          :value="downPaymentPercentage + '%'"
          @input="(e)=>setPercentage(e.replace(/%/g, ''))"
          @keypress="(e) => checkMaxPercentage(e)"
        )
        v-row.text-block__row.text-block_justified-row.px-3
              v-slider.text-block__slider.py-3(
                  :track-color="$vuetify.theme.themes.dark['nautical']"
                  :value="downPaymentPercentage"
                  @end="setPercentage"
                  @click="clickedPercentage"
                  min="0"
                  max="100"
                  hide-details
              )
</template>

<script>
import Button from "@/components/buttons/Button";
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
      if (value > 100) {
        e.preventDefault();
        return false;
      } else {
        return this.isOnlyNum(e, true);
      }
    },
    checkMaxLoanAmount(e) {
      const { value } = e.target;
      if (value.replace(/,/g, "") >= this.PurchasePrice) {
        e.preventDefault();
        return false;
      } else {
        return this.isOnlyNum(e, true);
      }
    },
    generateOnCancelData(){
      this.downPaymentAmountBeforeEdit = this.downPaymentAmount;
      this.downPaymentPercentageBeforeEdit = this.downPaymentPercentage;
    },
    onCancelClicked(){
      this.setAmount(this.downPaymentAmountBeforeEdit);
      this.setPercentage(this.downPaymentPercentageBeforeEdit);
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
    })
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
  components: {
    Button
  },
  mounted() {
    this.setInitialDownpayments();
  },
  data() {
    return {
      downPaymentAmountBeforeEdit: null,
      downPaymentPercentageBeforeEdit: null
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/general.scss";

.loan-data {
  @include main-data;
}

.text-block {
  &_justified-row {
    justify-content: center;
  }
  &__col {
    padding-left: 0;
    margin-right: 20px;
  }
  &__slider {
    .v-slider__track-container {
      height: 3px !important;
    }
  }
  .amount-data {
    justify-content: center;
    margin: 5px auto;
    height: 25px;
    width: calc(100% - 16px);
  }
}

::v-deep(.amount-data.v-text-field__details) {
  display: none;
}
::v-deep(.amount-data.v-input__control) {
  min-height: 28px;
  font-size: 15px;
  input {
    text-align: center;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
}

.underlined {
  font-size: 13px;
  text-decoration: underline;
}

@media (max-width: 760px) {
  .text-block {
    &_justified-row {
      justify-content: flex-start;
    }
    &__row {
      &:nth-child(2) {
        margin-bottom: 20px;
      }
    }
    &__col {
      margin-right: 0;
    }
    .amount-data {
      margin-bottom: 0;
    }
  }
}

::v-deep(.v-slider__thumb) {
  width: 20px;
  height: 20px;
  margin-left: -5px;
  &.primary {
    background-color: white !important;
    border: 3px solid $slider-color-2 !important;
    color: $slider-color-2 !important;
  }
  &::before{
    display: none;
  }
}
::v-deep(.v-slider__track-fill) {
  border-radius: 3px;
  &.primary {
    background-color: $slider-color-2 !important;
    border-color: $slider-color-2 !important;
  }
}

::v-deep(.v-slider__track-background) {
  border-radius: 3px;
  &.primary {
    &.lighten-3 {
      background-color: white !important;
      border-color: $slider-color-2 !important;
    }
  }
}
::v-deep(.v-slider__track-container) {
   height: 6px;
   border-radius: 3px;
}
::v-deep(.v-slider__track) {
   height: 6px;
   border-radius: 3px;
}
.sliderContainer {
  background: $slider-bg-color;
  ::v-deep(.v-input__slot) {
    background: rgba(0, 0, 0, 0) !important;
    input{
      text-align: center;
      color: $primary-text-color;
    }
  }
}
</style>
