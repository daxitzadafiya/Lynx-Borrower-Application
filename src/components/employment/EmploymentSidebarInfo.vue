<template lang="pug">
    .sidebar-info.text-black--text
        .sidebar-info__row
            .sidebar-info__col {{ firstName }} {{ lastName }}
            .sidebar-info__col ${{ getFormattedValue(mainIncome) || 0 }}
        .sidebar-info__row(v-if="coBorrower")
            .sidebar-info__col {{ coBorrower.FirstName }} {{ coBorrower.LastName }}
            .sidebar-info__col ${{ getFormattedValue(coIncome) || 0 }}
        .sidebar-info__row.sidebar-info_weight-500
            .sidebar-info__col Total:
            .sidebar-info__col ${{ getFormattedValue(total) || 0 }}
</template>

<script>
import { mapGetters } from "vuex";
import currencyFormat from "@/mixins/currencyFormat.js";

export default {
  mixins: [currencyFormat],
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      Borrowers: "getBorrowers",
      Borrower: "getBorrower",
      Employment: "getBorrowerEmployment"
    }),
    coBorrower() {
      return this.Borrowers.length && !this.Borrower.CoBorrower
        ? this.Borrowers.find(
            item =>
              item.CoBorrower && item.LinkedBorrowerId === this.Borrower.Id
          )
        : null;
    },
    firstName() {
      return this.Borrower.FirstName || "";
    },
    lastName() {
      return this.Borrower.LastName || "";
    },
    mainIncome() {
      if (this.Employment.length) {
        return this.Employment.filter(
          item => item.EmploymentStatusType === "Current"
        ).reduce((acc, cur) => {
          if (cur.Income && cur.Income.length) {
            acc += cur.Income.reduce(
              (a, c) =>
                (a += !isNaN(c.CurrentIncomeMonthlyTotalAmount)
                  ? +c.CurrentIncomeMonthlyTotalAmount
                  : 0),
              0
            );
          }
          return acc;
        }, 0);
      }
      return 0;
    },
    coIncome() {
      if (!this.coBorrower) return 0;
      if (this.coBorrower.Employment && this.coBorrower.Employment.length) {
        return this.coBorrower.Employment.filter(
          item => item.EmploymentStatusType === "Current"
        ).reduce((acc, cur) => {
          if (cur.Income && cur.Income.length) {
            acc += cur.Income.reduce(
              (a, c) =>
                (a += !isNaN(c.CurrentIncomeMonthlyTotalAmount)
                  ? +c.CurrentIncomeMonthlyTotalAmount
                  : 0),
              0
            );
          }
          return acc;
        }, 0);
      }
      return 0;
    },
    total() {
      return this.mainIncome + this.coIncome;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/sidebarAdditional.scss";

.sidebar-info {
  &__row {
    justify-content: space-between;
    margin-top: 5px;
  }
  &__col {
    margin-right: 10px;
  }
}
</style>
