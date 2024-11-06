<template lang="pug">
    v-card.review-details(light flat)
        v-card-title.table-header-back.review-details__title
            span.review-details__title-text.table-header-text Loan Details
        v-card-text.text-block
            v-row.text-block__row.font-16
                v-col.text-block__col(sm="7") Proposed Monthly Payment
                v-col.text-block__col.right-aligned(sm="5") 
                    span $
                    span {{ getFormattedValue(proposedMonthlyPayment) || 0 }}
            v-row.text-block__row.primary-text.pad-bot-2
                v-col.text-block__col(sm="4") Loan Program    
                v-col.text-block__col.center-aligned.no-padding(sm="4" cols="12") {{ loanProgramYears }}
                v-col.text-block__col.right-aligned(sm="4" cols="6") {{ (loanProgramRate / 100 || 0).toLocaleString("en-US", { style: "percent", minimumFractionDigits: 3, maximumFractionDigits: 3 }) }} Rate - {{ apr*100 }} APR
            v-row.text-block__row.data-row(v-for="(item, index) in bindedDetails" :key="index" :class="index%2 === 0 ? 'table-row-colored' : 'table-row-odd-colored'")
                v-col.text-block__col(sm="8" cols="6") {{ item.title }}
                v-spacer
                v-col.text-block__col.right-aligned(sm="3" cols="6") 
                    span(v-if="!item.isEmpty") $
                    span {{ getFormattedValue(item.value) || 0 }}
</template>

<script>
import { mapGetters } from "vuex";
import currencyFormat from "@/mixins/currencyFormat";

export default {
  mixins: [currencyFormat],
  data() {
    return {
      details: [
        {
          title: "Homeowners Association Fees",
          value: 0,
          prop: "associationFees"
        },
        { title: "Mortgage Insurance", value: 0, prop: "mortgageInsurance" },
        { title: "Flood Insurance", value: 0, prop: "foodInsurance" },
        {
          title: "Homeowners Insurance",
          value: 0,
          prop: "homeOwnersInsurance"
        },
        { title: "Taxes", value: 0, prop: "taxes" },
        {
          title: "Principle and Interest",
          value: 0,
          prop: "principleAndInterest"
        }
      ]
    };
  },
  methods: {
    getExpensesSum(type) {
      let result = 0;
      if (this.housingExpenses.length) {
        result = this.housingExpenses.reduce((acc, cur) => {
          if (
            cur.HousingExpenseTimingType === "Proposed" &&
            cur.HousingExpenseType === type &&
            !isNaN(cur.HousingExpensePaymentAmount)
          ) {
            acc += +cur.HousingExpensePaymentAmount;
          }
          return acc;
        }, 0);
      }
      return result;
    }
  },
  computed: {
    ...mapGetters({
      housingExpenses: "getHousingExpenses",
      mortgageLoanInformation: "getMortgageLoanInformation",
      apr: "getApr"
    }),
    titleClass() {
      let result = "light-gray primary--text";
      if (this.$vuetify.breakpoint.name === "xs") {
        result = "primary white--text";
      }
      return result;
    },
    proposedMonthlyPayment() {
      let result = 0;
      if (this.housingExpenses.length) {
        result = this.housingExpenses.reduce((acc, cur) => {
          if (
            cur.HousingExpenseTimingType === "Proposed" &&
            !isNaN(cur.HousingExpensePaymentAmount)
          ) {
            acc += +cur.HousingExpensePaymentAmount;
          }
          return acc;
        }, 0);
      }
      return result;
    },
    loanProgramYears() {
      const {
        LoanAmortizationPeriodCount = 0,
        AmortizationType = ""
      } = this.mortgageLoanInformation;
      const years = LoanAmortizationPeriodCount
        ? LoanAmortizationPeriodCount / 12
        : 0;
      return `${years} Years ${AmortizationType}`;
    },
    loanProgramRate() {
      const { NoteRatePercent = 0 } = this.mortgageLoanInformation;
      return NoteRatePercent;
    },
    associationFees() {
      return this.getExpensesSum("HomeownersAssociationDuesAndCondominiumFees");
    },
    mortgageInsurance() {
      return this.getExpensesSum("MIPremium");
    },
    foodInsurance() {
      return this.getExpensesSum("SupplementalPropertyInsurance");
    },
    homeOwnersInsurance() {
      return this.getExpensesSum("HomeownersInsurance");
    },
    taxes() {
      return this.getExpensesSum("RealEstateTax");
    },
    principleAndInterest() {
      return this.getExpensesSum("FirstMortgagePrincipalAndInterest");
    },
    bindedDetails() {
      return this.details.map(item => {
        item.value = this[item.prop];
        return item;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/review-details.scss";

@media (min-width: 768px) {
  .no-padding {
    padding: 12px 0;
  }
}

@media (max-width: 760px) {
  .data-row {
    &:last-child {
      height: 50px;
    }
  }
}
</style>
