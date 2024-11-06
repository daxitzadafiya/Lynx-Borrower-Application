<template lang="pug">
    .other-liabilitites-summary
        v-card-title.main__card-title
            h3.main__title.table-header-back.table-header-text Other Liabilities and Expense
        v-card-text.text-block.text-black--text
            v-row.pt-2.text-block__row.mb-7(v-for="(liability, index) in otherLiabilities" :key="index")
              v-card.my-1(width="100%").multpleItemsContainer
                v-row.pt-2
                  v-col.text-block__col(sm="4" md="3" cols="12")
                      v-combobox(
                          attach=true
                          :value="liability.ExpenseType ? liability.ExpenseType.replace(/([a-z])([A-Z])/g, '$1 $2') : ''"
                          :items="items"
                          @change="(e) => setLiability(e ? e.replace(/ /g, '') : '', 'ExpenseType', index)"
                          label="Liability/Expense"
                          )
                  v-col.text-block__col(sm="3" md="3" cols="12" v-if="liability.ExpenseType === 'Other'")
                      v-text-field(
                          label="Other Description" 
                          :value="liability.ExpenseTypeOtherDescription"
                          @input="(e) => setLiability(e, 'ExpenseTypeOtherDescription', index)"
                          )
                  v-col.text-block__col(:sm="liability.ExpenseType === 'Other'? 2 : 3" md="3" cols="10")
                      v-text-field(
                          prefix="$"
                          label="Monthly Payment" 
                          :value="getFormattedValue(liability.ExpenseMonthlyPaymentAmount)"
                          @input="(e) => setLiability(+e.replace(/,/g, ''), 'ExpenseMonthlyPaymentAmount', index)"
                          @keypress="(e) => isOnlyNum(e, true)"
                          )
                v-row
                  v-col.text-block__col(md="5" cols="10" :style="'max-width:400px;'" class="multilineLabel")
                      v-combobox(
                          attach=true
                          :value="liability.ExpenseRemainingMonthsType"
                          :items="expenseRemainingMonthsTypes"
                          @change="(e) => { setLiability(e, 'ExpenseRemainingMonthsType', index); if(e !=='Other') { setLiability('', 'ExpenseRemainingMonthsOtherDescription', index) } }"
                          label="How many more months are you required to make these payments?"
                          )
                  v-col.text-block__col(md="5" cols="10" v-if="liability.ExpenseRemainingMonthsType === 'Other'")
                      v-text-field(
                          label="Other Explanation" 
                          :value="liability.ExpenseRemainingMonthsOtherDescription"
                          @input="(e) => setLiability(e, 'ExpenseRemainingMonthsOtherDescription', index)"
                          )
                  v-col.text-block__col(:sm="liability.ExpenseType === 'Other'? 2 : 3" md="2" cols="10" v-if="liability.ReasonCode !== 'Ongoing'")
                      v-text-field(
                          v-if="liability.ExpenseRemainingMonthsType!=='Other'"
                          inputmode="numeric"
                          pattern="[0-9]*"
                          label="Number of Months" 
                          :value="liability.ExpenseRemainingTermMonthsCount"
                          @input="(e) => setLiability(+e, 'ExpenseRemainingTermMonthsCount', index)"
                          @keypress="(e) => isOnlyNum(e)"
                          )
                  .removeItem(@click="remove(index)")
                      v-icon close
            v-card.multpleItemsContainer(v-if="additional")
              v-row.mt-3.pt-2.text-block__row
                v-col.text-block__col(sm="4" md="3" cols="10")
                    v-combobox(
                        attach=true
                        :value="additional.ExpenseType"
                        :items="items"
                        @change="(e) => setLiability(e ? e.replace(/ /g, '') : '', 'ExpenseType', otherLiabilities.length)"
                        label="Liability/Expense"
                        )
                .removeItem(@click="additional=null")
                      v-icon close
            v-row.pt-4.text-block__row.last-row
                v-col.text-block__col(sm="4" cols="12")
                    v-row.add-new
                        Add(
                            customClass='small' 
                            @add="addLiability"
                            )
                        span.add-new__title Add New Liability
                v-col.text-block__col.totals-col(sm="4" cols="12" v-if="total")
                    v-row.totals
                        span.totals__title Total:
                        span.totals__value ${{ getFormattedValue(total)}}
</template>

<script>
import Add from "@/components/buttons/Add";
import onlyNum from "@/mixins/onlyNum.js";
import currencyFormat from "@/mixins/currencyFormat.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [onlyNum, currencyFormat],
  data() {
    return {
      items: ["Alimony", "Child Support", "Job Related Expenses", "Other"],
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
      const otherLiabilities = this.otherLiabilities.filter(
        (item, i) => index !== i
      );
      this.updateBorrower({
        prop: "OtherLiabilitiesAndExpenses",
        value: otherLiabilities
      });
    },
  },
  computed: {
    ...mapGetters({
      borrower: "getBorrower"
    }),
    otherLiabilities() {
      return this.borrower && this.borrower.OtherLiabilitiesAndExpenses
        ? this.borrower.OtherLiabilitiesAndExpenses
        : [];
    },
    total() {
      if (this.otherLiabilities.length) {
        return this.otherLiabilities.reduce(
          (acc, cur) => acc + cur.ExpenseMonthlyPaymentAmount,
          0
        );
      }
      return 0;
    }
  },
  components: {
    Add
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/summary.scss";

.text-block {
  @media (min-width: 1024px) {
    padding-left: 45px;
  }
}

.remove {
  max-width: 35px;
  &__icon {
    cursor: pointer;
  }
}

.last-row {
  margin-bottom: 20px;
}

.add-new {
  &__title {
    font-weight: 500;
    margin-left: 10px;
  }
}

.totals {
  font-weight: 500;
  font-size: 18px;
  &__title {
    margin-right: 10px;
  }
}

.bottom-bordered {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 10px;
}

@media (max-width: 760px) {
  .last-row {
    flex-direction: column-reverse;
  }
  .totals-col {
    margin-top: 10px;
  }
  .add-new {
    margin: 20px 0 10px;
  }
  .remove {
    padding-top: 0;
    padding-left: 35px;
  }
}

:deep(.multilineLabel){
  .v-label {
    height: unset;
    white-space: unset;
    margin-top: -15px;
  }
  @media only screen and (max-width: 390px) {
    padding-top: 20px;
    .v-label {
      margin-top: -36px;
    }
  }
  @media only screen and (max-width: 325px) {
    padding-top: 30px;
    .v-label {
      margin-top: -56px;
    }
  }
}
</style>
